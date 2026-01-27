import ProductCardSkeleton from "@/Components/ProductCardSkeleton";
import { Separator } from "@/components/ui/separator";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { CiBookmarkPlus, CiGrid2H } from "react-icons/ci";
import { GoShareAndroid } from "react-icons/go";
import { TbCategory2 } from "react-icons/tb";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getCategoryWiseProducts } from "../api/products";
import { BsGrid } from "react-icons/bs";
import LinearCard from "@/Components/LinearCard";
import GridCard from "@/Components/GridCard";
import { useInView } from "react-intersection-observer";
import ProductCardSkeletonGrid from "@/Components/ProductCardSkeletonGrid";
import { useSearchPlaceHolder } from "@/store/useSearchPlaceHolder";
function CategoryWiseProducts() {
  // const { data, error, isLoading, isError } = useQuery({
  //   queryKey: ["products"],
  //   queryFn: getProducts,
  //   retry: 2,
  // });
  // console.log(data?.data);
  const { slug } = useParams();
  const [searchParam] = useSearchParams();
  const searchQuery = searchParam.get("query");

  const [toggle, setToggle] = useState(false);
  const navigate = useNavigate();
  const handleToggle = () => {
    setToggle(!toggle);
  };
  console.log(toggle);
  const [isGrid, setIsGrid] = useState(false);
  const { setSearchPlaceHolder } = useSearchPlaceHolder();

  const {
    data: productsData,

    fetchNextPage,
    refetch,
    hasNextPage,

    isLoading,
    isFetchingNextPage,

    isLoadingError,
    isFetchNextPageError,
  } = useInfiniteQuery({
    queryKey: ["CategoryWiseProducts", slug, searchQuery],
    queryFn: ({ pageParam }) =>
      getCategoryWiseProducts({ categorySlug: slug, pageParam, searchQuery }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage?.nextPage || undefined,
  });
  console.log(productsData);

  const allProducts = productsData?.pages?.map((obj) => obj.data).flat();
  console.log(allProducts);
  const { ref, inView } = useInView();
  console.log(inView);

  const products = allProducts?.map((product) => (
    <LinearCard product={product} key={product._id} />
  ));
  const productsGrid = allProducts?.map((product) => (
    <GridCard product={product} key={product._id} />
  ));
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
    if (productsData?.pages?.[0]?.categoryName) {
      setSearchPlaceHolder(`search for ${productsData.pages[0].categoryName}`);
    }
  }, [productsData?.pages]);

  return (
    <div className="flex w-full">
      <div className="flex flex-1 w-fit flex-col gap-5 border-x-2 p-4">
        <div className=" text-lg h-fit mx-0  border-b-2 flex justify-between p-4 text-l items-center gap-3 sticky top-[64px] z-10 bg-white">
        
          <div className="flex  gap-2">
              <TbCategory2
            className="text-2xl block sm:hidden"
            onClick={() => handleToggle()}
          />
          <div className="flex flex-wrap items-center gap-1">

         
            <span className="truncate">
              {searchQuery
                ? `Search results for "${searchQuery}"`
                : ` ${productsData?.pages?.[0]?.categoryName ?? "All"}`}
            </span>
              <span className="text-sm text-gray-500">
              ({productsData?.pages?.[0]?.total} products)
            </span>
             </div>
          </div>
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
  );
}

export default CategoryWiseProducts;
