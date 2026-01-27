import { getCategories } from "@/api/allCategory";
import { deleteImage, editProduct, getSingleProduct } from "@/api/products";
import Loader from "@/Components/Loader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/Components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/Components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Textarea } from "@/Components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { BiUndo } from "react-icons/bi";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { Spinner } from "@/Components/ui/spinner";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/Components/ui/input-group";
import { XIcon } from "lucide-react";

function EditProduct() {
  const { id } = useParams();
  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getSingleProduct(id),
    onError: (error) => {
      console.error("Error fetching product:", error);
      toast({
        title: "Error",
        description: "There was an error fetching the product.",
        variant: "destructive",
      });
    },
  });
  const [mainPreview, setMainPreview] = useState();
  const fileInputRef = useRef(null);
  const imagesChangeRef = useRef([]);

  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    retry: 2,
    onSuccess: (data) => {
      console.log("Fetched categories:", data);
    },
  });
  const createProductValidationSchema = z.object({
    name: z.string().min(1, { message: "Product name is required" }).trim(),

    price: z
      .number()
      .gt(0, { message: "Price must be a number greater than 0" }),

    stock: z
      .number()
      .int()
      .min(0, { message: "Stock must be an integer ≥ 0" })
      .optional(),

    description: z
      .string()
      .min(10, { message: "Description must be at least 10 characters" }),

    category: z.string().min(1, { message: "Category is required" }),
    specifications: z.array(
      z.object({
        name: z.string().min(1, { message: "Specification Name is required" }),
        value: z
          .string()
          .min(1, { message: "Specification value is required" }),
      }),
    ),
    tags: z
      .array(z.string().min(1, { message: "Tag cannot be empty" }).trim())
      .optional(),
  });
  const form = useForm({
    resolver: zodResolver(createProductValidationSchema),
    defaultValues: {
      name: "",
      price: 0,
      stock: 0,
      description: "",
      category: "",
      image: null,
      specifications: [{ name: "", value: "" }],
      tags: [],
    },
  });
  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "specifications",
  });
  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
    replace: replaceTags,
  } = useFieldArray({
    control: form.control,
    name: "tags",
  });
  const queryClient = useQueryClient();
  const { mutate: productMutate, isPending } = useMutation({
    mutationFn: editProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      toast.success("Product updated successfully");
    },
    onError: (error) => {
      console.error("Error updating product:", error);
      const errorsArray = error?.response?.data?.error || [];
      if (Array.isArray(errorsArray)) {
        errorsArray.forEach((err) => toast.error(err.msg));
      } else {
        toast.error(
          error?.message || "There was an error updating the product.",
        );
      }
    },
  });

  const { mutate: ImageDeletion, isPending: isDeleting } = useMutation({
    mutationFn: deleteImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      toast.success("Image deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting:", error);
      toast.error(error.error || "There was an error deleting the image.");
    },
  });
  const handleMainChange = (file) => {
    if (!file) {
      if (mainPreview) URL.revokeObjectURL(mainPreview.url);
      setMainPreview(null);
      form.setValue("image", null, { shouldValidate: true });
      return;
    }
    if (mainPreview) {
      try {
        URL.revokeObjectURL(mainPreview.url);
      } catch (e) {
        console.error("Error revoking main image URL:", e);
      }
    }
    const url = URL.createObjectURL(file);
    setMainPreview({ file, url });
    form.setValue("image", file, { shouldValidate: true });
  };

  const onSubmit = (data) => {
    const values = form.getValues("image");
    console.log(values);
    const formData = new FormData();

    // Add text fields
    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("stock", data.stock);
    formData.append("category", data.category);
    formData.append("description", data.description);
    formData.append("specifications", JSON.stringify(data.specifications));
    if (data.tags && data.tags.length > 0) {
      formData.append("tags", JSON.stringify(data.tags));
    }
    if (mainPreview?.file) formData.append("image", mainPreview.file);

    if (Array.isArray(images) && images.length > 0) {
      images.forEach((image) => {
        if (image?.file instanceof File) {
          formData.append("images", image.file);
        }
      });
    }
    productMutate({ id, data: formData });
  };

  const removeMainImage = () => handleMainChange(null);

  const [images, setImages] = useState([]);
  const changeImages = (file, index) => {
    console.log(index);
    const url = URL.createObjectURL(file);
    setImages((prev) =>
      prev.map((img, i) => {
        if (i === index && img.url && img.file) {
          URL.revokeObjectURL(img.url);
        }
        return i === index ? { ...img, url, file } : img;
      }),
    );
  };
  const undoChange = (index) => {
    setImages((prev) => {
      const originalImage = product.images[index];
      const currentImage = prev[index];

      // CASE 1: Image was newly added → remove it
      if (!originalImage) {
        if (currentImage?.url) {
          URL.revokeObjectURL(currentImage.url);
        }

        return prev.filter((_, i) => i !== index);
      }

      // CASE 2: Image existed → restore original
      if (currentImage?.url) {
        URL.revokeObjectURL(currentImage.url);
      }

      return prev.map((img, i) =>
        i === index ? { url: originalImage.url } : img,
      );
    });
  };

  const handleImagesUpload = (file) => {
    const url = URL.createObjectURL(file);
    setImages((prev) => [...prev, { url, file }]);
  };
  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        price: product.price,
        stock: product.stock,
        description: product.description,
        category: product.category?._id,
        image: product.image,
        images: product.images,
      });
      setImages(
        product.images.map((img) => ({
          url: img.url,
          public_id: img.public_id,
        })),
      );
      replace(product.specifications || []);
      replaceTags(product.tags || []);
    }
  }, [product, form, replace, replaceTags]);

  if (productLoading || isLoading || isDeleting) {
    return <Loader />;
  }
  return (
    <>
      {console.log(images)}
      {console.log(mainPreview)}
      <form
        className="w-full p-6 mt-[72px]"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FieldGroup className="w-full ">
          <div className="lg:flex flex-row gap-4 ">
            <div className="w-full h-fit  lg:w-[55%] ">
              <Card className=" mx-auto h-fit mb-4">
                <CardHeader>
                  <CardTitle>General</CardTitle>

                  <CardDescription>Card Description</CardDescription>
                </CardHeader>
                <CardContent className="w-full overflow-hidden flex flex-col gap-2">
                  <Controller
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          Name of the Product
                        </FieldLabel>

                        <Input
                          {...field}
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                          <FieldError>{fieldState.error.message}</FieldError>
                        )}
                      </Field>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-5">
                    <Controller
                      control={form.control}
                      name="stock"
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={field.name}>Stock</FieldLabel>

                          <Input
                            {...field}
                            type="number"
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.invalid && (
                            <FieldError>{fieldState.error.message}</FieldError>
                          )}
                        </Field>
                      )}
                    />
                    <Controller
                      control={form.control}
                      name="price"
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={field.name}>Price</FieldLabel>

                          <Input
                            {...field}
                            type="number"
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.invalid && (
                            <FieldError>{fieldState.error.message}</FieldError>
                          )}
                        </Field>
                      )}
                    />
                  </div>

                  <Controller
                    control={form.control}
                    name="description"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldContent>
                          <FieldLabel htmlFor={field.name}>
                            Description
                          </FieldLabel>
                          <FieldDescription>
                            Describe the product
                          </FieldDescription>
                        </FieldContent>
                        <Textarea
                          {...field}
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                          <FieldError>{fieldState.error.message}</FieldError>
                        )}
                      </Field>
                    )}
                  />
                </CardContent>
              </Card>
              <Card className=" mx-auto mb-4">
                <CardHeader>
                  <CardTitle>Product details</CardTitle>
                </CardHeader>
                <CardContent className="w-full overflow-hidden">
                  <Controller
                    control={form.control}
                    name="category"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Category</FieldLabel>

                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger onBlur={field.onBlur} id={field.name}>
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories?.data?.map((category) => (
                              <SelectItem
                                key={category._id}
                                value={category._id}
                              >
                                {category.name}
                              </SelectItem>
                            ))}{" "}
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && (
                          <FieldError>{fieldState.error.message}</FieldError>
                        )}
                      </Field>
                    )}
                  />
                  <FieldSet className="gap-4">
                    <FieldLegend variant="label">Specifications</FieldLegend>

                    <FieldGroup className="gap-4">
                      {fields.map((field, index) => (
                        <div key={field.id} className="flex gap-2">
                          <Controller
                            name={`specifications.${index}.name`}
                            control={form.control}
                            render={({
                              field: controllerField,
                              fieldState,
                            }) => (
                              <Field
                                orientation="horizontal"
                                data-invalid={fieldState.invalid}
                              >
                                <FieldContent>
                                  <InputGroup>
                                    <InputGroupInput
                                      {...controllerField}
                                      placeholder="name"
                                      aria-invalid={fieldState.invalid}
                                    />
                                    {fields.length > 1 && (
                                      <InputGroupAddon align="inline-end">
                                        <InputGroupButton
                                          type="button"
                                          variant="ghost"
                                          size="icon-xs"
                                          onClick={() => remove(index)}
                                          aria-label={`Remove email ${
                                            index + 1
                                          }`}
                                        >
                                          <XIcon />
                                        </InputGroupButton>
                                      </InputGroupAddon>
                                    )}
                                  </InputGroup>
                                  {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                  )}
                                </FieldContent>
                              </Field>
                            )}
                          />
                          <Controller
                            name={`specifications.${index}.value`}
                            control={form.control}
                            render={({
                              field: controllerField,
                              fieldState,
                            }) => (
                              <Field
                                orientation="horizontal"
                                data-invalid={fieldState.invalid}
                              >
                                <FieldContent>
                                  <InputGroup>
                                    <InputGroupInput
                                      {...controllerField}
                                      aria-invalid={fieldState.invalid}
                                      placeholder="value"
                                    />
                                    {fields.length > 1 && (
                                      <InputGroupAddon align="inline-end">
                                        <InputGroupButton
                                          type="button"
                                          variant="ghost"
                                          size="icon-xs"
                                          onClick={() => remove(index)}
                                          aria-label={`Remove email ${
                                            index + 1
                                          }`}
                                        >
                                          <XIcon />
                                        </InputGroupButton>
                                      </InputGroupAddon>
                                    )}
                                  </InputGroup>
                                  {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                  )}
                                </FieldContent>
                              </Field>
                            )}
                          />
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => append({ name: "", value: "" })}
                      >
                        Add another Specification
                      </Button>
                    </FieldGroup>
                    {form.formState.errors.specifications?.root && (
                      <FieldError
                        errors={[form.formState.errors.specifications.root]}
                      />
                    )}
                  </FieldSet>
                  <FieldSet className="gap-4">
                    <FieldLegend variant="label">Tags</FieldLegend>

                    <FieldGroup className="gap-4">
                      {tagFields.map((field, index) => (
                        <div key={field.id} className="flex gap-2">
                          <Controller
                            name={`tags.${index}`}
                            control={form.control}
                            render={({
                              field: controllerField,
                              fieldState,
                            }) => (
                              <Field
                                orientation="horizontal"
                                data-invalid={fieldState.invalid}
                              >
                                <FieldContent>
                                  <InputGroup>
                                    <InputGroupInput
                                      {...controllerField}
                                      placeholder="Enter tag"
                                      aria-invalid={fieldState.invalid}
                                    />
                                    <InputGroupAddon align="inline-end">
                                      <InputGroupButton
                                        type="button"
                                        variant="ghost"
                                        size="icon-xs"
                                        onClick={() => removeTag(index)}
                                        aria-label={`Remove tag ${index + 1}`}
                                      >
                                        <XIcon />
                                      </InputGroupButton>
                                    </InputGroupAddon>
                                  </InputGroup>
                                  {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                  )}
                                </FieldContent>
                              </Field>
                            )}
                          />
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendTag("")}
                      >
                        Add Tag
                      </Button>
                    </FieldGroup>
                    {form.formState.errors.tags?.root && (
                      <FieldError errors={[form.formState.errors.tags.root]} />
                    )}
                  </FieldSet>
                </CardContent>
              </Card>
            </div>

            <Card className=" mx-auto w-full lg:w-[45%]  mb-10">
              <CardHeader>
                <CardTitle>Media</CardTitle>

                <CardDescription></CardDescription>
              </CardHeader>
              <CardContent className="w-full flex gap-2 flex-col overflow-hidden">
                <div>
                  <p className="mb-2 text-sm">Main image</p>

                  {mainPreview ? (
                    <>
                      <div className="w-[200px] h-[200px] relative border rounded overflow-hidden bg-[#f8f8f8] p-6">
                        <img
                          src={mainPreview.url}
                          className="object-cover w-full h-full"
                        />
                        <button
                          type="button"
                          onClick={() => removeMainImage()}
                          className="absolute top-[2px] right-1 text-gray-600 text-lg rounded-full  "
                        >
                          {" "}
                          <BiUndo />
                        </button>
                        <span className="flex justify-center mt-[3px]">
                          <button
                            type="button"
                            onClick={() => {
                              fileInputRef.current?.click();
                            }}
                            className="text-blue-700 font-semibold text-xs"
                          >
                            Change
                          </button>
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="w-[200px] h-[200px] relative border rounded overflow-hidden bg-[#f8f8f8] p-6">
                      <img
                        src={product?.image?.url}
                        className="object-cover w-full h-full"
                      />
                      <button
                        type="button"
                        onClick={() => {}}
                        className="absolute top-[2px] right-1 text-gray-600 text-lg rounded-full  "
                      >
                        ×
                      </button>
                      <span className="flex justify-center mt-[3px]">
                        <button
                          type="button"
                          onClick={() => {
                            fileInputRef.current?.click();
                          }}
                          className="text-blue-700 font-semibold text-xs"
                        >
                          Change
                        </button>
                      </span>
                    </div>
                  )}

                  <Input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleMainChange(e.target.files?.[0])}
                    id="image"
                    ref={fileInputRef}
                  />
                </div>
                <div>
                  <p className="mb-2 text-sm">Additional Images</p>

                  <div className="flex">
                    <div className="flex gap-3 flex-wrap">
                      {images.map((img, index) => (
                        <div
                          key={index}
                          className="w-[140px] h-[150px] relative border rounded  bg-[#f8f8f8] p-6"
                        >
                          <img
                            src={img.url}
                            className="object-cover w-full h-full"
                          />
                          {img.file ? (
                            <button
                              type="button"
                              onClick={() => undoChange(index)}
                              className="absolute top-[2px] right-1 text-gray-600 text-lg rounded-full  "
                            >
                              <BiUndo />
                            </button>
                          ) : (
                            // <button
                            //   type="button"
                            //   onClick={() =>
                            //     ImageDeletion({
                            //       productId: id,
                            //       public_id: img.public_id,
                            //     })
                            //   }
                            //   className="absolute top-[2px] right-1 text-gray-600 text-lg rounded-full  "
                            // >
                            //   ×
                            // </button>
                            <AlertDialog>
                              <AlertDialogTrigger className="absolute top-[2px] right-1 text-gray-600 text-lg rounded-full  ">
                                ×
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you absolutely sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete the image from our
                                    servers.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      ImageDeletion({
                                        productId: id,
                                        public_id: img.public_id,
                                      })
                                    }
                                  >
                                    Continue
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}

                          <Input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) =>
                              changeImages(e.target.files[0], index)
                            }
                            id="images"
                            ref={(el) => (imagesChangeRef.current[index] = el)}
                          />
                        </div>
                      ))}
                      {images.length < 3 &&
                        Array.from({ length: 3 - images.length }).map(
                          (_, index) => (
                            <div className="" key={index}>
                              <div className="mt-2 h-[150px] w-[140px] flex justify-center rounded-lg border-2 border-dashed border-gray-500/60 px-6 py-10">
                                <div className="text-center">
                                  <svg
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    data-slot="icon"
                                    aria-hidden="true"
                                    className="mx-auto size-7 text-gray-600"
                                  >
                                    <path
                                      d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                                      clipRule="evenodd"
                                      fillRule="evenodd"
                                    />
                                  </svg>
                                  <div className="mt-4 flex text-sm/6 text-gray-400">
                                    <label className="relative cursor-pointer rounded-md bg-transparent font-semibold text-indigo-400 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-500 hover:text-indigo-300">
                                      <span>Upload a file</span>
                                      <input
                                        id="file-upload"
                                        type="file"
                                        name="file-upload"
                                        className="sr-only"
                                        onChange={(e) => {
                                          handleImagesUpload(e.target.files[0]);
                                        }}
                                      />
                                    </label>
                                  </div>
                                  <p className="text-xs/5 text-gray-400">
                                    PNG, JPG, GIF up to 10MB
                                  </p>
                                </div>
                              </div>
                            </div>
                          ),
                        )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* <div className="w-full">
                <FieldLabel htmlFor="images">Images (up to 3)</FieldLabel>
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFilesChange(e.target.files)}
                  id="images"
                />
                <div className="flex gap-2 mt-2">
                  {previews.map((p, i) => (
                    <div
                      key={i}
                      className="relative w-24 h-24 border rounded overflow-hidden"
                    >
                      <img
                        src={p.url}
                        alt={`preview-${i}`}
                        className="object-cover w-full h-full"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute -top-1 -right-1 bg-white text-sm rounded-full p-1 shadow"
                        aria-label={`Remove image ${i + 1}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div> */}
        </FieldGroup>
        <div className="flex items-center">
          <Button
            type="submit"
            className={"w-[100px] mb-4 mr-4"}
            disabled={isPending}
            onClick={form.handleSubmit(onSubmit)}
          >
            {isPending ? (
              <span className="flex gap-2">
                <Spinner /> Saving...
              </span>
            ) : (
              "Save changes"
            )}
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isPending}
            className={"w-[100px] mb-4 mr-4"}
            onClick={() => {
              form.reset({
                name: product.name,
                price: product.price,
                stock: product.stock,
                description: product.description,
                category: product.category?._id,
                image: product.image,
                images: product.images,
              });
              setImages(
                product.images.map((img) => ({
                  url: img.url,
                  public_id: img.public_id,
                })),
              );
              setMainPreview(null);
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </>
  );
}

export default EditProduct;
