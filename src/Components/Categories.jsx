import { useCategories } from "@/hooks/useCategories";
import CategorySkeleton from "./CategorySkeleton";
import { TbCategory2 } from "react-icons/tb";
import { NavLink } from "react-router-dom";
import { Separator } from "./ui/separator";

function Categories() {
  const {
    data: categoryData,
    isLoading: categoryLoading,
    isError: categoryIsError,
    refetch: categoryRefetch,
  } = useCategories();
  const categories = categoryData?.data?.map((category, index) => (
    <li key={index} className=" ">
      <NavLink
        to={`/category/${category.slug}`}
        className="block whitespace-nowrap rounded-lg px-4 py-2  font-[400px]  hover:bg-gray-100 hover:text-gray-700"
      >
        {category.name}
      </NavLink>
      <Separator className="my-1" />
    </li>
  ));
  return (
    <>
      {categoryLoading ? (
        <CategorySkeleton />
      ) : categoryIsError ? (
        <div className="sm:flex h-fit flex-col bg-white fixed top-20 hidden xl:w-[360px] w-[200px] border-r items-center justify-center p-4">
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
      ) : (
        <div className="lg:flex h-screen flex-col bg-white sticky top-20 hidden xl:w-[360px] w-[200px]">
          <div className="flex items-center gap-2 pl-8">
            <div className="text-3xl">
              <TbCategory2 />
            </div>
            <div className="grid h-10 place-content-center rounded-lg text-lg font-semibold text-black">
              Category
            </div>
          </div>
          <Separator className="my-1 w-full" />

          <div className="px-4 overflow-auto">
            <ul className="">
              <li className="">
                <NavLink
                  to={`/`}
                  className="block whitespace-nowrap rounded-lg px-4 py-2  font-[400px]  hover:bg-gray-100 hover:text-gray-700"
                >
                  Latest Products
                </NavLink>
                <Separator className="my-1" />
              </li>
              {categories}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

export default Categories;
