import ProductCardSkeleton from "@/Components/ProductCardSkeleton";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CiBookmarkPlus, CiGrid2H } from "react-icons/ci";
import { GoShareAndroid } from "react-icons/go";
import { TbCategory2 } from "react-icons/tb";
import { useNavigate, useParams } from "react-router-dom";
import { getCategoryWiseProducts } from "../api/products";
import { BsGrid } from "react-icons/bs";
function CategoryWiseProducts() {
  // const { data, error, isLoading, isError } = useQuery({
  //   queryKey: ["products"],
  //   queryFn: getProducts,
  //   retry: 2,
  // });
  // console.log(data?.data);
  const { slug } = useParams();

  const [toggle, setToggle] = useState(false);
  const navigate = useNavigate();
  const handleToggle = () => {
    setToggle(!toggle);
  };
  console.log(toggle);
  const [isGrid, setIsGrid] = useState(false);

  const {
    data: productsData,
    isLoading: productsLoading,
    isError: productsIsError,
  } = useQuery({
    queryKey: ["categorywiseProducts", slug],
    queryFn: () => getCategoryWiseProducts(slug),
    retry: 2,
  });

  if (productsIsError) {
    return <div>error....</div>;
  }

  const products = productsData?.data?.map((product, index) => (
        <div key={product._id} className="">
      <div className=" h-fit mx-0   flex">
        <div className="border-2 w-full border-transparent rounded-2xl hover:bg-slate-100 hover:border-2 hover:border-blue-300 p-2 flex gap-2">
          <div className="relative w-[8.125rem] shrink-0">
            <div className="">
              <img
                className="h-[7.625rem] object-cover w-[8rem] bg-inherit rounded-md"
                src={product.image.url}
                alt="Product Image"
              />
              <div className="mt-2 flex w-full justify-center gap-3 items-center">
                {product.images &&
                  product.images.length > 0 &&
                  product.images.map((img, idx) => (
                    <img
                      key={idx}
                      className="h-5 w-5 object-cover rounded-[2px]   "
                      src={img.url}
                      alt={`Additional Image ${idx + 1}`}
                    />
                  ))}
              </div>
            </div>
          </div>
          <div className="w-full">
            <div className="flex items-center justify-between">
              <h3 className=" text-[0.813rem] font-[600] mb-2 underline decoration-gray-400 underline-offset-4">
                {product.name}
              </h3>
              <GoShareAndroid />
            </div>

            <p className="text-gray-600 text-xs font-medium mb-4">
              {product.description.length > 200
                ? `${product.description.slice(0, 200)}...`
                : product.description}
            </p>
            <div className="flex items-center justify-between w-full">
              <div className="flex h-4 items-center gap-2">
                <span className="text-[0.813rem] font-[600]  whitespace-nowrap ">
                  रू {product.price}
                </span>
                <Separator className=" bg-black" orientation="vertical" />
                <span className="text-xs whitespace-nowrap "> {product.category.name}</span>
              </div>
              <div className="">
                <CiBookmarkPlus className="text-xl font-bold" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Separator className="w-full h-px bg-gray-300 mt-4" />{" "}
    </div>
  ));
  const productsGrid = productsData?.data?.map((product, index) => (
    <div key={product._id} className="">
      <div className=" h-fit mx-0   flex">
        <div className="border-2 w-full border-transparent rounded-2xl hover:bg-slate-100 hover:border-2 hover:border-blue-300 p-2 flex flex-col gap-2">
          <div className="shrink-0 flex justify-center">
            <img
              className=" object-cover w-full bg-inherit rounded-md"
              src={product.image.url}
              alt="Product Image"
            />
          </div>

          <div className="w-full">
            <div className="flex items-center justify-between">
              <h3 className=" text-[0.813rem] font-[600] mb-2 underline decoration-gray-400 underline-offset-4">
                {product.name}
              </h3>
              <GoShareAndroid />
            </div>

            <p className="text-gray-600 text-xs font-medium mb-4">
              {product.category.name}
            </p>
            <div className="flex items-center justify-between w-full">
              <div className="flex h-4 items-center gap-2">
                <span className="text-[0.813rem] font-[600] ">
                  रू {product.price}
                </span>
                <Separator className=" bg-black" orientation="vertical" />
              </div>
              <div className="">
                <CiBookmarkPlus className="text-xl font-bold" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ));
  return (
    <div className="flex w-full">
    <div className="flex flex-1 w-fit flex-col gap-5 border-x-2 p-4">
        <div className=" text-lg h-fit mx-0  border-b-2 flex justify-between p-4 text-l items-center gap-3 sticky top-[64px] z-10 bg-white">
        <TbCategory2
          className="text-2xl block sm:hidden"
          onClick={() => handleToggle()}
        />{" "}
        Category: {productsData?.categoryName}
        {isGrid ? (
          <CiGrid2H
            className="text-xl"
            onClick={() => setIsGrid((prev) => !prev)}
          />
        ) : (
          <BsGrid
            className="text-xl"
            onClick={() => setIsGrid((prev) => !prev)}
          />
        )}
      </div>
      {productsLoading ? (
        Array.from({ length: 5 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))
      ) : !isGrid ? (
        products
      ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3  gap-3">
          {productsGrid}
        </div>
      )}
    </div>
    <div className="w-[40%] hidden lg:block">

    </div>
    </div>
  );
}

export default CategoryWiseProducts;
