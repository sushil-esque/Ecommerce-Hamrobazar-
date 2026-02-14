import { addtoCart, deleteFromCart } from "@/api/cart";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import { Button } from "@/Components/ui/button";
import { Spinner } from "@/Components/ui/spinner";
import useAuthStore from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { getLocalCart, saveLocalCart } from "@/utils/cart";
import { formatPrice } from "@/utils/formatPrice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Separator } from "@/Components/ui/separator";

const EmptyCart = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center   my-4">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="relative bg-white p-8 rounded-full shadow-lg border border-slate-50">
          <svg
            className="w-24 h-24 text-primary opacity-80"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>
        </div>
      </div>
      <h3 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
        Your cart is feeling lonely
      </h3>
      <p className="text-slate-500 max-w-md mx-auto mb-10 text-lg leading-relaxed">
        It looks like you haven&apos;t added anything to your cart yet. Explore
        our latest collection and find something you love!
      </p>
      <Button
        size="lg"
        className="px-10 py-6 text-lg font-semibold rounded-2xl "
        onClick={() => navigate("/")}
      >
        Start Shopping
      </Button>
    </div>
  );
};

function Carts() {
  const navigate = useNavigate();
  const { cart } = useCartStore();
  const { user } = useAuthStore();
  const [updatingItem, setUpdatingItem] = useState({ id: null, action: null });

  const queryClient = useQueryClient();
  const { mutate: cartMutate, isPending: isUpdating } = useMutation({
    mutationFn: addtoCart,
    onSuccess: () => {
      toast.success("Quantity updated successfully");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (err) => {
      toast.error(err.error);
    },
    onSettled: () => {
      setUpdatingItem(null);
    },
  });
  const { mutate: cartItemDelete, isPending: isDeleting } = useMutation({
    mutationFn: deleteFromCart,
    onSuccess: () => {
      toast.success("Product deleted from cart successfully");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (err) => {
      toast.error(err.error);
    },
    onSettled: () => {
      setUpdatingItem(null);
    },
  });
  const handleQuantityChangeinDb = (product, amount) => {
    const items = [
      {
        product: product,
        quantity: amount,
      },
    ];
    cartMutate(items);
  };

  const localCart = getLocalCart();
  console.log(localCart, "local");

  const deleteFromLocalCart = (productId) => {
    useCartStore.setState((state) => {
      const updatedArray = state.cart.filter(
        (item) => item.productId !== productId,
      );
      console.log(user);

      saveLocalCart(updatedArray);

      return { cart: updatedArray };
    });
  };
  const deleteFromCartInDb = (productId) => {
    cartItemDelete(productId);
  };
  const changeQuantity = (productId, amount) => {
    console.log(productId);
    useCartStore.setState((state) => {
      const updatedArray = state.cart.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item,
      );
      saveLocalCart(updatedArray);
      return {
        cart: updatedArray,
      };
    });
  };

  function truncateString(str, num) {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + "...";
  }

  return (
    <>
      {console.log(cart)}
      <div className="max-w-[1320px] mx-auto lg:mx-24 md:mx-4 sm:mx-4 ">
        <Breadcrumb className="mb-5">
          <BreadcrumbList>
            <BreadcrumbItem>
              <NavLink to={"/"}>
                <BreadcrumbLink>Home</BreadcrumbLink>
              </NavLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>Cart</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {cart.length > 0 ? (
          <div className="flex gap-10 flex-col md:flex-row ">
            <div className=" flex flex-col gap-3 md:w-[50%]  w-full sm:w-full">
              <div className="flex flex-col gap-4 bg-white shadow-sm border border-slate-200 rounded-lg">
                <div className="flex justify-between "></div>
                {cart?.length > 0 ? (
                  cart.map((product) => (
                    <div
                      className="relative flex gap-2  w-full p-6 border-b "
                      key={product.productId}
                    >
                      <div>
                        <img
                          src={product.image}
                          alt="image"
                          className="w-[80px] h-[80px] object-contain rounded-md "
                        />
                      </div>
                      <div>
                        <p className="">{product.name}</p>
                        <p className="mt-3">रू {formatPrice(product.price)}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-auto ">
                        <div className="flex items-center h-8 ">
                          <Button
                            variant="outline"
                            className=" h-full rounded-r-none w-4"
                            disabled={
                              (isUpdating &&
                                updatingItem.id === product.productId) ||
                              product.quantity === 1
                            }
                            onClick={() => {
                              setUpdatingItem({
                                id: product.productId,
                                action: "dec",
                              });
                              user
                                ? handleQuantityChangeinDb(
                                    product.productId,
                                    -1,
                                  )
                                : changeQuantity(product.productId, -1);
                            }}
                          >
                            {isUpdating &&
                            updatingItem.id === product.productId &&
                            updatingItem.action === "dec" ? (
                              <span className="text-xl font-bold text-slate-400">
                                <Spinner />
                              </span>
                            ) : (
                              <span className="text-xl font-bold text-slate-400">
                                -
                              </span>
                            )}
                          </Button>
                          <span className="p-4 bg-accent h-full flex justify-center items-center">
                            {product.quantity}
                          </span>
                          <Button
                            variant="outline"
                            className="h-full rounded-l-none w-4 "
                            disabled={
                              isUpdating &&
                              updatingItem.id === product.productId
                            }
                            onClick={() => {
                              setUpdatingItem({
                                id: product.productId,
                                action: "inc",
                              });
                              user
                                ? handleQuantityChangeinDb(
                                    product.productId,
                                    +1,
                                  )
                                : changeQuantity(product.productId, +1);
                            }}
                          >
                            {isUpdating &&
                            updatingItem.id === product.productId &&
                            updatingItem.action === "inc" ? (
                              <span className="text-xl font-bold text-slate-400">
                                <Spinner />
                              </span>
                            ) : (
                              <span className="text-xl font-bold text-slate-400">
                                +
                              </span>
                            )}
                          </Button>
                        </div>

                        <button
                          className="ml-2 md:ml-auto text-xl cursor-pointer"
                          disabled={
                            isDeleting && updatingItem.id === product.productId
                          }
                          onClick={() => {
                            setUpdatingItem({ id: product.productId });
                            user
                              ? deleteFromCartInDb(product?.productId)
                              : deleteFromLocalCart(product?.productId);
                          }}
                        >
                          {isDeleting &&
                          updatingItem.id === product.productId ? (
                            <span className="text-xl font-bold text-slate-400">
                              <Spinner />
                            </span>
                          ) : (
                            <RiDeleteBin6Line className="" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div>Cart is empty</div>
                )}
              </div>
            </div>
            <div className="flex sticky top-24 h-fit md:w-[50%] bg-white shadow-md border border-slate-100 rounded-xl p-8 w-full  flex-col">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="flex flex-col gap-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((product) => (
                  <div
                    key={product.productId}
                    className="flex justify-between items-start gap-4 text-sm"
                  >
                    <div className="text-slate-600 flex-1 leading-snug">
                      {truncateString(product.name, 60)}
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-semibold text-slate-900">
                        रू {formatPrice(product.price * product.quantity)}
                      </div>
                      <div className="text-xs text-slate-400">
                        {product.quantity} × रू {formatPrice(product.price)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="mb-6" />

              <div className="flex mb-8 justify-between items-end pt-2">
                <span className="text-lg font-bold">Grand Total</span>
                <span className="text-2xl font-extrabold ">
                  रू{" "}
                  {formatPrice(
                    cart?.reduce((acc, p) => acc + p.price * p.quantity, 0),
                  )}
                </span>
              </div>

              <Button
                size="lg"
                className="w-full "
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        ) : (
          <EmptyCart />
        )}
      </div>
    </>
  );
}

export default Carts;
