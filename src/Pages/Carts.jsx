import { addtoCart, deleteFromCart } from "@/api/cart";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/Components/ui/button";
import { Spinner } from "@/Components/ui/spinner";
import useAuthStore from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { getLocalCart, saveLocalCart } from "@/utils/cart";
import { formatPrice } from "@/utils/formatPrice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import { toast } from "sonner";

function Carts() {
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
            <div className=" flex flex-col gap-3 lg:w-[50%] md:w-[500px] w-full sm:w-full">
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
                          disabled={isDeleting && updatingItem.id === product.productId}
                          onClick={() => {
                            setUpdatingItem({ id: product.productId });
                            user
                              ? deleteFromCartInDb(product?.productId)
                              : deleteFromLocalCart(product?.productId);
                          }}
                        >
                          {isDeleting && updatingItem.id === product.productId  ? (
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
            <div className=" flex sticky top-20 h-fit bg-white shadow-sm border border-slate-200 rounded-lg  p-6 w-full lg:w-[50%] md:w-[500px] sm:w-full flex-col">
              <div className="text-xl">Order Summary</div>

              <div className="flex flex-col gap-4 mt-3 ">
                {cart.map((product) => (
                  <div
                    key={product.productId}
                    className="border-b flex justify-between"
                  >
                    <div> {truncateString(product.name, 1000)} </div>
                    <div>
                      {product.quantity} items = रू{" "}
                      {formatPrice(product.price * product.quantity)}
                    </div>
                  </div>
                ))}
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
                    ),
                  )}
                </span>
              </div>
              <div>
                <Button>Check out</Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center h-80 items-center">
            Cart is empty
          </div>
        )}
      </div>
    </>
  );
}

export default Carts;
