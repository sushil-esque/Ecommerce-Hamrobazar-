import { checkout } from "@/api/order";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/Components/ui/breadcrumb";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
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
    FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { Spinner } from "@/Components/ui/spinner";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice } from "@/utils/formatPrice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { RiInformationFill } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import { toast } from "sonner";
import z from "zod";

function CheckOut() {
  const { cart } = useCartStore();
  const queryClient = useQueryClient();
  const { mutate: checkoutMutate, isPending } = useMutation({
    mutationFn: checkout,
    onSuccess: () => {
      toast.success("Order placed successfully");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (err) => {
      toast.error(err.error);
    },
  });
  const paymentMethod = [
    {
      id: "COD",
      title: "Cash on Delivery",
      description: "Pay in cash when your order is delivered to your doorstep.",
    },
    // {
    //   id: "Khalti",
    //   title: "Khalti",
    //   description: "For everyday use with basic features.",
    // },
  ];

  const checkoutSchema = z.object({
    shippingAddress: z.object({
      fullName: z.string().min(2, "Full name must be at least 2 characters"),
      phone: z.string().min(10, "Phone number must be at least 10 digits"),
      address: z.string().min(5, "Address must be at least 5 characters"),
      city: z.string().min(2, "City must be at least 2 characters"),
      province: z.string().min(2, "Province must be at least 2 characters"),
    }),
    paymentMethod: z.enum(["COD", "Khalti", "Esewa"], {
      errorMap: () => ({ message: "Please select a payment method" }),
    }),
  });
  const form = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingAddress: {
        fullName: "",
        phone: "",
        address: "",
        city: "",
        province: "",
      },
      paymentMethod: "",
    },
  });
  const onSubmit = (data) => {
    console.log(data);
    checkoutMutate(data);
  };
  return (
    <div className="max-w-[1320px] mx-auto lg:mx-24 md:mx-4 sm:mx-4  ">
           <Breadcrumb className="mb-5">
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <NavLink to={"/"}>
                        <BreadcrumbLink>Home</BreadcrumbLink>
                      </NavLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                     <BreadcrumbItem>
                      <NavLink to={"/cart"}>
                        <BreadcrumbLink>Cart</BreadcrumbLink>
                      </NavLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
        
                    <BreadcrumbItem>
                      <BreadcrumbPage>Check Out</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
      <div className="flex gap-8">
        <Card className="w-full sm:max-w-[50%]">
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
            {/* <CardDescription>
            Help us improve by reporting bugs you encounter.
          </CardDescription> */}
          </CardHeader>
          <CardContent>
            <form id="checkout" onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Controller
                  name="shippingAddress.fullName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                      <Input
                        {...field}
                        id="fullName"
                        aria-invalid={fieldState.invalid}
                        autoComplete="on"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="shippingAddress.phone"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                      <Input
                        {...field}
                        id="phone"
                        aria-invalid={fieldState.invalid}
                        autoComplete="on"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="shippingAddress.address"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="address">Address</FieldLabel>
                      <Input
                        {...field}
                        id="address"
                        aria-invalid={fieldState.invalid}
                        placeholder="eg: Chandesworu Marga, Banepa-5, Kavre"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="shippingAddress.city"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="city">City</FieldLabel>
                      <Input
                        id="city"
                        {...field}
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="shippingAddress.province"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="province">Province</FieldLabel>
                      <Input
                        id="province"
                        {...field}
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
        <div className="flex flex-col w-full lg:w-[50%] md:w-[500px] sm:w-full gap-8">
          <Card className="">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            {/* <div className="text-xl">Order Summary</div> */}
            <CardContent>
              <div className="flex flex-col gap-4 mt-3 ">
                {cart.map((product) => (
                  <div
                    key={product.productId}
                    className="border-b flex justify-between"
                  >
                    <div> {product.name} </div>
                    <div>
                      {product.quantity} items = रू{" "}
                      {formatPrice(product.price * product.quantity)}
                    </div>
                  </div>
                ))}
                <div className="border-b flex justify-between">
                  <div className="font-semibold">Delivery Charge </div>
                  <div className="font-semibold">रू {formatPrice(100)}</div>
                </div>
              </div>

              <div className="mt-3 font-bold">
                Grand Total ={" "}
                <span className="text-3xl font-normal">
                  {" "}
                  रू
                  {formatPrice(
                    cart?.reduce(
                      (acc, product) => acc + product.price * product.quantity,
                      0,
                    ) + 100,
                  )}
                </span>
              </div>
              <div></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Chosse Payment Options</CardTitle>
            </CardHeader>
            <CardContent>
              <Controller
                name="paymentMethod"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FieldSet data-invalid={fieldState.invalid}>
                    <FieldLegend variant="label">Payment Options</FieldLegend>
                    <FieldDescription className={"flex items-center  gap-2"}>
                      <RiInformationFill className="text-xl" /> Currently we
                      accept Cash on Delivery only
                    </FieldDescription>
                    <RadioGroup
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                      aria-invalid={fieldState.invalid}
                    >
                      {paymentMethod.map((payment) => (
                        <FieldLabel
                          key={payment.id}
                          htmlFor={`form-rhf-radiogroup-${payment.id}`}
                        >
                          <Field
                            orientation="horizontal"
                            data-invalid={fieldState.invalid}
                          >
                            <FieldContent>
                              <FieldTitle>{payment.title}</FieldTitle>
                              <FieldDescription>
                                {payment.description}
                              </FieldDescription>
                            </FieldContent>
                            <RadioGroupItem
                              value={payment.id}
                              id={`form-rhf-radiogroup-${payment.id}`}
                              aria-invalid={fieldState.invalid}
                            />
                          </Field>
                        </FieldLabel>
                      ))}
                    </RadioGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldSet>
                )}
              />
            </CardContent>
            <CardFooter>
              <Field orientation="horizontal">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                >
                  Reset
                </Button>
                <Button
                  className="min-w-[103px]"
                  type="submit"
                  form="checkout"
                  disabled={isPending}
                >
                  {isPending ? <Spinner /> : "Place Order"}
                </Button>
              </Field>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default CheckOut;
