import {
  addCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "@/api/allCategory";
import { DataTable } from "@/Components/data-table";
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/Components/ui/field";
import { Input } from "@/Components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Spinner } from "@/Components/ui/spinner";
import { categorySchema } from "@/schemas/category.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";
import { toast } from "sonner";

function Categories() {
  const [loadingId, setLoadingId] = useState();
  const [deletingId, setDeletingId] = useState();

  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
    },
  });
  const addForm = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
    },
  });
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  const queryClient = useQueryClient();
  const { mutate: categoryUpdate, isPending: isUpdating } = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category updated successfully");
    },
    onError: (error) => {
      toast.error(error.error);
    },
  });
  const { mutate: categoryAdd, isPending: isAdding } = useMutation({
    mutationFn: addCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category added successfully");
    },
    onError: (error) => {
      toast.error(error.error);
    },
  });
  const { mutate: categoryDelete, isPending: isDeleting } = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted successfully");
    },
    onError: (error) => {
      toast.error(error.error);
    },
  });
  const onSubmit = (data, id) => {
    console.log(id);
    setLoadingId(id);
    categoryUpdate({ data, id });
  };
  const submitCategory = (data) => {
    categoryAdd(data);
  };
  const columns = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: (info) => {
        const category = info.row.original;
        return (
          <div className="flex gap-2 w-[100px]">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  size="sm"
                  className=""
                  variant="outline"
                  onClick={() => form.setValue("name", category.name)}
                >
                  {isUpdating && loadingId === category._id ? (
                    <Spinner />
                  ) : (
                    <span className="flex gap-2">
                      <CiEdit />
                      Edit
                    </span>
                  )}
                </Button>
                {/* <Button
                  type="button"
                  disabled={isUpdating}
                  size="sm"
                  className=" min-w-[32px]  text-white rounded hover:bg-blue-600"
                  onClick={() => form.setValue("name", category.name)}
                >
                  {isUpdating && loadingId === category._id ? (
                    <Spinner />
                  ) : (
                    "Edit"
                  )}
                </Button> */}
              </PopoverTrigger>
              <PopoverContent>
                <form
                  onSubmit={form.handleSubmit((data) => {
                    onSubmit(data, category._id);
                  })}
                >
                  <FieldGroup>
                    <Controller
                      name="name"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="Categoryname">Name</FieldLabel>
                          <Input
                            {...field}
                            id="Categoryname"
                            aria-invalid={fieldState.invalid}
                            placeholder="Category name"
                            autoComplete="off"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <Button disabled={isUpdating}>Update</Button>
                  </FieldGroup>
                </form>
              </PopoverContent>
            </Popover>
            <AlertDialog>
              <AlertDialogTrigger>
                <Button
                  disabled={isDeleting && deletingId === category._id}
                  size="sm"
                  variant="outline"
                  className="group hover:bg-red-500 "
                >
                  {isDeleting && deletingId === category._id ? (
                    <span className="">
                      <Spinner />
                    </span>
                  ) : (
                    <RiDeleteBin5Line className="text-red-500 group-hover:text-white" />
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the category.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      categoryDelete(category._id);
                      setDeletingId(category._id);
                    }}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ];
  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="w-full p-6 ">
      {console.log(loadingId)}
      <div className="flex flex-wrap gap-6 ">
        <div className="lg:w-1/2 w-full">
          <DataTable columns={columns} data={data?.data?? []}  />
        </div>
        <Card className="min-w-[300px] h-fit">
          <form onSubmit={addForm.handleSubmit(submitCategory)}>
            <CardHeader>
              <CardTitle>New Category</CardTitle>
              <CardDescription>create a new category</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Controller
                  name="name"
                  control={addForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder="Category name"
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </CardContent>
            <CardFooter className="w-1/2">
              <Button disabled={isAdding} className="w-full">
                {isAdding ? <Spinner /> : "Add"}
              </Button>{" "}
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default Categories;
