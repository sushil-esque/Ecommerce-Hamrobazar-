import AdsCarousel from "@/Components/AdsCarousel";
import GridCard from "@/Components/GridCard";
import LinearCard from "@/Components/LinearCard";
import Loader from "@/Components/Loader";
import ProductCardSkeleton from "@/Components/ProductCardSkeleton";
import ProductCardSkeletonGrid from "@/Components/ProductCardSkeletonGrid";
import { Separator } from "@/components/ui/separator";
import useAuthStore from "@/store/useAuthStore";
import { useSearchPlaceHolder } from "@/store/useSearchPlaceHolder";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { BsGrid } from "react-icons/bs";
import { CiGrid2H } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import { TbCategory2 } from "react-icons/tb";
import { useInView } from "react-intersection-observer";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { getCategories } from "../api/allCategory";
import { getAllProducts, getSearchResults } from "../api/products";

function Home() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { user } = useAuthStore();


  const [searchParam] = useSearchParams();
  const searchQuery = searchParam.get("query");
  const [toggle, setToggle] = useState(false);
  const [isGrid, setIsGrid] = useState(false);
  const { setSearchPlaceHolder } = useSearchPlaceHolder();

  const navigate = useNavigate();
  const handleToggle = () => {
    setToggle(!toggle);
  };

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

  const {
    data: productsData,
    refetch,
    fetchNextPage,
    hasNextPage,

    isLoading,
    isFetchingNextPage,

    isLoadingError,
    isFetchNextPageError,
  } = useInfiniteQuery({
    queryKey: searchQuery ? ["searchResults", searchQuery] : ["products"],
    queryFn: ({ pageParam }) =>
      searchQuery
        ? getSearchResults({ searchQuery, pageParam })
        : getAllProducts({ pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage?.nextPage,
  });

  console.log(isLoadingError + " error");
  const { ref, inView } = useInView();
  console.log(productsData);
  const allProducts = productsData?.pages?.map((obj) => obj.data).flat() ?? [];
  // const { data, error, isLoading, isError } = useQuery({
  //   queryKey: ["products", selectedCategory],
  //   queryFn: () =>
  //     getProducts(
  //       selectedCategory === "all" ? "" : `/category/${selectedCategory}`
  //     ),
  //   retry: 2,
  // });
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };
 
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && !isFetchNextPageError)
      fetchNextPage();
  }, [
    inView,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  ]);
  useEffect(() => {
    setSearchPlaceHolder("Search for anything");
  }, []);

  if (categoryLoading) {
    return <Loader />;
  }

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
 
  const products = allProducts?.map((product) => (
    <LinearCard product={product} key={product?._id}  />
  ));
  const productsGrid = allProducts?.map((product) => (
    <GridCard product={product} key={product?._id} />
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

        <ul className="space-y-1">
          <li onClick={() => handleCategoryClick("all")} className="border-b-2">
            <a
              href="#"
              className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
              All
            </a>
          </li>
          {categories}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="flex max-w-[1320px] mx-auto lg:mx-24 md:mx-4 sm:mx-4 ">
      {categoryData && (
        <div className="sm:flex h-screen flex-col   bg-white   sticky top-20 hidden lg:w-[360px] w-[200px] ">
          <div className="flex items-center gap-2 pl-8 ">
            <div className=" text-3xl">
              <TbCategory2 />
            </div>
            <div className="grid h-10 place-content-center rounded-lg text-lg font-semibold text-black">
              Category
            </div>
          </div>
          <Separator className="my-1 w-full" />

          <div className="px-4 overflow-auto">
            <ul className="">{categories}</ul>
          </div>
        </div>
      )}

      {toggle ? sidebar : null}
      <div className="flex flex-col flex-1 ">
        <AdsCarousel />
        <div className="flex w-full">
          <div className="flex flex-1 w-fit flex-col gap-5 border-x-2 p-4">
            <div className=" text-lg h-fit mx-0  border-b-2 flex justify-between p-4 text-l items-center gap-3 sticky top-[64px] z-10 bg-white">
              <TbCategory2
                className="text-2xl block sm:hidden"
                onClick={() => handleToggle()}
              />
              {searchQuery
                ? `search results for: "${searchQuery}" `
                : "Latest Products"}

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
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))
            ) : isLoadingError ? (
              <div className="flex flex-col items-center gap-2 mt-4">
                <p className="text-sm text-red-500">Failed to load products</p>
                <button onClick={() => refetch()} className="text-sm underline">
                  Retry
                </button>
              </div>
            ) : !isGrid ? (
              <>
                {products}
                {isFetchingNextPage &&
                  Array.from({ length: 5 }).map((_, index) => (
                    <ProductCardSkeleton key={index} />
                  ))}
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3  gap-3">
                  {productsGrid}
                  {isFetchingNextPage &&
                    Array.from({ length: 5 }).map((_, index) => (
                      <ProductCardSkeletonGrid key={index} />
                    ))}
                </div>
                {isFetchNextPageError && (
                  <div className="flex flex-col items-center gap-2 mt-4">
                    <p className="text-sm text-red-500">
                      Failed to load more products
                    </p>
                    <button
                      onClick={() => fetchNextPage()}
                      className="text-sm underline"
                    >
                      Retry
                    </button>
                  </div>
                )}
              </>
            )}

            <div ref={ref}> </div>
          </div>
          <div className="w-[40%] hidden lg:block"></div>
        </div>
      </div>
    </div>
  );
}

export default Home;
