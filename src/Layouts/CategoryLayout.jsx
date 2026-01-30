import AdsCarousel from "@/Components/AdsCarousel";
import Loader from "@/Components/Loader";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { TbCategory2 } from "react-icons/tb";
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import { getCategories } from "../api/allCategory";
import CategorySkeleton from "@/Components/CategorySkeleton";

function CategoryLayout() {
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
  const {
    data: categoryData,
    isLoading: categoryLoading,
    isError: categoryIsError,
    refetch: categoryRefetch,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    retry: 2,
  });

  console.log(categoryData);
  if (categoryLoading) {
    return <Loader />;
  }

  const categories = categoryData?.data?.map((category, index) => (
    <li key={index} className=" ">
      <NavLink
        to={"/category/" + category.slug}
        className="block whitespace-nowrap rounded-lg px-4 py-2  font-[400px]  hover:bg-gray-100 hover:text-gray-700"
      >
        {category.name}
      </NavLink>
      <Separator className="my-1" />
    </li>
  ));


  return (
    <div className="flex max-w-[1320px] mx-auto lg:mx-24 md:mx-4 sm:mx-4 ">
      {/* <div>
      <span>{count}</span>
      <button onClick={() => setCount("apple")}>set count</button>
      <button onClick={inc}>one up</button>
    </div> */}
        {categoryLoading ? (
        <CategorySkeleton />
      ) : categoryIsError ? (
        <div className="sm:flex h-fit flex-col bg-white sticky top-20 hidden xl:w-[360px] w-[200px] border-r items-center justify-center p-4">
          <p className="text-sm text-red-500 mb-2 text-center text-wrap">
            Failed to load categories
          </p>
          <button
            onClick={() => categoryRefetch()}
            className="text-sm underline hover:text-black transition-colors"
          >
            Retry
          </button>
        </div>
      ) :  (
        <div className="lg:flex h-screen flex-col   bg-white   sticky top-20 hidden xl:w-[360px] w-[200px] ">
          <div className="flex items-center gap-2 pl-8 ">
            <div className=" text-3xl">
              <TbCategory2 />
            </div>
            <div className="grid h-10 place-content-center rounded-lg text-lg font-semibold text-black">
              Category
            </div>
          </div>
          <Separator className="my-1 w-full" />

          <div className="px-4">
            <ul className="">{categories}</ul>
          </div>
        </div>
      )}
      <div className="flex flex-col flex-1 ">
        <AdsCarousel />

        <Outlet />
      </div>
    </div>
  );
}

export default CategoryLayout;
