import AdsCarousel from "@/Components/AdsCarousel";
import Loader from "@/Components/Loader";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { TbCategory2 } from "react-icons/tb";
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import { getCategories } from "../api/allCategory";

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
    error: categoryError,
    isLoading: categoryLoading,
    isError: categoryIsError,
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

  const sidebar = (
    <div className="flex h-screen flex-col justify-between border-e bg-white fixed top-0 left-0  w-[60%] shadow-md z-50">
      <div className="px-4 py-6 ">
        <div className="flex items-center gap-2 border-b-2  -mx-4 px-3 justify-between ">
          <div className=" text-3xl">
            <TbCategory2 />
          </div>
          <div className="grid h-10 place-content-center rounded-lg text-lg font-semibold text-black">
            Category
          </div>
          <div>
            <button onClick={handleToggle} className="text-3xl">
              <IoClose />
            </button>
          </div>
        </div>

        <ul className="space-y-1">{categories}</ul>
      </div>
    </div>
  );
  return (
    <div className="flex max-w-[1320px] mx-auto lg:mx-24 md:mx-4 sm:mx-4 ">
      {/* <div>
      <span>{count}</span>
      <button onClick={() => setCount("apple")}>set count</button>
      <button onClick={inc}>one up</button>
    </div> */}
      {categoryData && (
        <div className="sm:flex h-screen flex-col   bg-white   sticky top-20 hidden xl:w-[360px] w-[200px] ">
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

      {toggle ? sidebar : null}
      <div className="flex flex-col flex-1 ">
        <AdsCarousel />

        <Outlet />
      </div>
    </div>
  );
}

export default CategoryLayout;
