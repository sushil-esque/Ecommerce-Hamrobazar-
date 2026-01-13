import { getUserCart } from "@/api/products";
import Loader from "@/Components/Loader";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

function Carts() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["carts"],
    queryFn: getUserCart,
  });
  const {
    data: productData,
    isLoading: productLoading,
    isError: productIsError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(""),
  });

  const [sortOrder, setSortOrder] = useState("asc");
  const navigate = useNavigate();

  if (isLoading || productLoading) {
    return <Loader />;
  }
  if (isError || productIsError) {
    return <div>Something went wrong</div>;
  }
  const cartItems = data.products?.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
  }));

  // const cartProducts = productData?.filter((product) =>
  //   cartItems.includes(product.id)
  // );
  let cartProducts = cartItems?.map((cartItem) => {
    const product = productData?.find(
      (product) => product.id === cartItem.productId
    );
    return { ...product, quantity: cartItem.quantity };
  });

  cartProducts = cartProducts.sort((a, b) => {
    return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
  });

  function truncateString(str, num) {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + "...";
  }
  return (
    <>
      <div className="lg:mx-24 md:mx-4 sm:mx-4 mb-24 mx-2 flex gap-10 flex-col md:flex-row ">
        <div className=" flex flex-col gap-3 lg:w-[50%] md:w-[500px] w-full sm:w-full">
          <div className="flex gap-1 items-center  border-b-2 p-3 cursor-pointer"  onClick={() => navigate("/")}>
            <FaLongArrowAltLeft className="text-2xl" />
            <div className="text-xl" >Continue Shopping</div>
          </div>
          <div>
            <div className="text-lg">Shopping Cart</div>
          </div>

          <div className="flex flex-col gap-4 ">
            <div className="flex justify-between">
              <div>You have {cartProducts?.length} items in your cart</div>
              <div
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="flex items-center justify-center"
              >
                <span className="text-gray-600 mr-1">Sort by: </span> price{" "}
                {sortOrder === "asc" ? (
                  <IoIosArrowDown className="text-lg" />
                ) : (
                  <IoIosArrowUp className="text-lg" />
                )}
              </div>
            </div>
            {cartProducts?.length > 0 ? (
              cartProducts.map((product) => (
                <div
                  className="relative flex my-3 bg-white shadow-sm border border-slate-200 rounded-lg w-full p-6  "
                  key={product.id}
                >
                  <div>
                    <img
                      src={product.image}
                      alt="image"
                      className="w-[100px] h-[100px] object-contain rounded-md "
                    />
                  </div>
                  <p className="w-[50%]">{product.title}</p>
                  <div className="ml-2 md:ml-auto">{product.quantity}</div>
                  <div className="ml-2 md:ml-auto">${product.price} -/</div>
                  <div className="ml-2 md:ml-auto text-xl">
                    <RiDeleteBin6Line />
                  </div>
                </div>
              ))
            ) : (
              <div>Cart is empty</div>
            )}
          </div>
        </div>
        <div className=" flex my-3 bg-white shadow-sm border border-slate-200 rounded-lg  p-6 w-full lg:w-[50%] md:w-[500px] sm:w-full flex-col">
          <div className="text-xl">Order Summary</div>
          {cartProducts.length > 0 ? (
            <div className="flex flex-col gap-4 mt-3 ">
              {cartProducts.map((product) => (
                <div
                  key={product.id}
                  className="border-b-2 flex justify-between"
                >
                  <div> {truncateString(product.title, 20)} </div>
                  <div>
                    {product.quantity} items = $
                    {product.price * product.quantity}
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
              $
              {cartProducts?.reduce(
                (acc, product) => acc + product.price * product.quantity,
                0
              )}
            </span>
          </div>
          <div>
            <button className="bg-black text-white px-3 py-2 rounded-md mt-3 hover:bg-white hover:text-black border border-black transition-colors duration-700 ease-in-out">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Carts;
