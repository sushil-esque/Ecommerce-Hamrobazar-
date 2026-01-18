import { Button } from "@/Components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import { getCart, saveCart } from "@/utils/cart";
import { formatPrice } from "@/utils/formatPrice";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { NavLink, useNavigate } from "react-router-dom";

function Carts() {
  const { cart } = useCartStore();

  const localCart = getCart();
  console.log(localCart, "local");

  // if (isLoading || productLoading) {
  //   return <Loader />;
  // }
  // if (isError || productIsError) {
  //   return <div>Something went wrong</div>;
  // }

  // const cartProducts = productData?.filter((product) =>
  //   cartItems.includes(product.id)
  // );

  const deleteFromCart = (productId) => {
    useCartStore.setState((state) => {
      const updatedArray = state.cart.filter(
        (item) => item.productId !== productId
      );

      saveCart(updatedArray);

      return { cart: updatedArray };
    });
  };
  const changeQuantity = (productId, amount) => {
    console.log(productId);
    useCartStore.setState((state) => {
      const updatedArray = state.cart.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      );
      saveCart(updatedArray);
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
                          onClick={() => changeQuantity(product.productId, -1)}
                        >
                          <span className="text-xl font-bold text-slate-400">
                            -
                          </span>
                        </Button>
                        <span className="p-4 bg-accent h-full flex justify-center items-center">
                          {product.quantity}
                        </span>
                        <Button
                          variant="outline"
                          className="h-full rounded-l-none w-4 "
                          onClick={() => changeQuantity(product.productId, +1)}
                        >
                          <span className="text-xl font-bold text-slate-400">
                            +
                          </span>
                        </Button>
                      </div>

                      <div className="ml-2 md:ml-auto text-xl">
                        <RiDeleteBin6Line
                        className="cursor-pointer"
                          onClick={() => deleteFromCart(product?.productId)}
                        />
                      </div>
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
            {localCart.length > 0 ? (
              <div className="flex flex-col gap-4 mt-3 ">
                {localCart.map((product) => (
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
            ) : (
              <div>Cart is empty</div>
            )}
            <div className="mt-3 font-bold">
              Grand Total ={" "}
              <span className="text-3xl font-normal">
                {" "}
                रू
                {formatPrice(
                  localCart?.reduce(
                    (acc, product) => acc + product.price * product.quantity,
                    0
                  )
                )}
              </span>
            </div>
            <div>
              <Button>Check out</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Carts;
