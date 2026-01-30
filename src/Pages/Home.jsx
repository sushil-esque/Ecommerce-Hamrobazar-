import AdsCarousel from "@/Components/AdsCarousel";
import Categories from "@/Components/Categories";
import GridCard from "@/Components/GridCard";
import LinearCard from "@/Components/LinearCard";
import ProductCardSkeleton from "@/Components/ProductCardSkeleton";
import ProductCardSkeletonGrid from "@/Components/ProductCardSkeletonGrid";
import { Button } from "@/Components/ui/button";
import { useSearchPlaceHolder } from "@/store/useSearchPlaceHolder";
import { useSidebarStore } from "@/store/useSidebarStore";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { BsGrid } from "react-icons/bs";
import { CiGrid2H } from "react-icons/ci";
import { TbCategory2 } from "react-icons/tb";
import { useInView } from "react-intersection-observer";
import { NavLink, useSearchParams } from "react-router-dom";
import { getAllProducts, getSearchResults } from "../api/products";

function Home() {
  const [searchParam] = useSearchParams();
  const searchQuery = searchParam.get("query");
  const [isGrid, setIsGrid] = useState(false);
  const { setSearchPlaceHolder } = useSearchPlaceHolder();

  const { toggleCategoryDrawer } = useSidebarStore();
  const toggleSidebar = () => {
    toggleCategoryDrawer();
  };

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

  const products = allProducts?.map((product) => (
    <LinearCard product={product} key={product?._id} />
  ));
  const productsGrid = allProducts?.map((product) => (
    <GridCard product={product} key={product?._id} />
  ));

  return (
    <div className="flex max-w-[1320px] mx-auto lg:mx-24 md:mx-4 sm:mx-4 ">
      <Categories />

      <div className="flex  flex-col flex-1 ">
        <AdsCarousel />
        <div className="flex w-full">
          <div className="flex flex-1 w-fit flex-col  lg:border-x-2 sm:border-r-2 p-4">
            <div className=" text-lg h-fit mx-0  border-b-2 mb-3 flex flex-col  sticky top-[64px] z-10 bg-white">
              <div className=" hidden sm:block lg:hidden">
               
                <Button
                  variant="ghost"
                  onClick={() => {
                    toggleSidebar();
                  }}
                  className="py-2 px-1"
                >
                  <TbCategory2 /> Categories <ChevronDown />
                </Button>
              </div>
              <div className="flex justify-between py-4 pt-2 px-1  items-center ">
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
              <div className="flex flex-col gap-3">
                {products}
                {isFetchingNextPage &&
                  Array.from({ length: 5 }).map((_, index) => (
                    <ProductCardSkeleton key={index} />
                  ))}
              </div>
            ) : (
              <>
                <div className="grid  grid-cols-2 sm:grid-cols-3  gap-3">
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
          <div className="w-[30%] p-4 sticky top-[64px] h-fit hidden sm:block">
            <div className="mt-8">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-gray-500">
                <NavLink
                  to="#"
                  className="hover:text-primary transition-colors"
                >
                  Return Policy
                </NavLink>
                <NavLink
                  to="#"
                  className="hover:text-primary transition-colors"
                >
                  About Us
                </NavLink>
                <NavLink
                  to="#"
                  className="hover:text-primary transition-colors"
                >
                  FAQ
                </NavLink>
                <NavLink
                  to="#"
                  className="hover:text-primary transition-colors"
                >
                  Terms of Use
                </NavLink>
                <NavLink
                  to="#"
                  className="hover:text-primary transition-colors"
                >
                  Privacy Policy
                </NavLink>
                <NavLink
                  to="#"
                  className="hover:text-primary transition-colors"
                >
                  Contact Us
                </NavLink>
              </div>
              <p className="mt-6 text-[10px] text-gray-400">
                © 2026 Hamrobazar Clone. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
