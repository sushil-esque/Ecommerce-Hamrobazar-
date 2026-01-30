import ProductCardSkeleton from "@/Components/ProductCardSkeleton";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { CiGrid2H } from "react-icons/ci";
import { TbCategory2 } from "react-icons/tb";
import {
  NavLink,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { getCategoryWiseProducts } from "../api/products";
import { BsGrid } from "react-icons/bs";
import LinearCard from "@/Components/LinearCard";
import GridCard from "@/Components/GridCard";
import { useInView } from "react-intersection-observer";
import ProductCardSkeletonGrid from "@/Components/ProductCardSkeletonGrid";
import { useSearchPlaceHolder } from "@/store/useSearchPlaceHolder";
import { Input } from "@/Components/ui/input";
import { Slider } from "@/Components/ui/slider";
import { Button } from "@/Components/ui/button";
import { ChevronDown } from "lucide-react";
import { useSidebarStore } from "@/store/useSidebarStore";

function CategoryWiseProducts() {
  // const { data, error, isLoading, isError } = useQuery({
  //   queryKey: ["products"],
  //   queryFn: getProducts,
  //   retry: 2,
  // });
  // console.log(data?.data);
  const { slug } = useParams();
  const [searchParam, setSearchParam] = useSearchParams();

  const searchQuery = searchParam.get("query");
  const minPrice = searchParam.get("minPrice");
  const maxPrice = searchParam.get("maxPrice");
  const [value, setValue] = useState([0, 5000000]);

  const [toggle, setToggle] = useState(false);
  const navigate = useNavigate();
  const handleToggle = () => {
    setToggle(!toggle);
  };
  console.log(toggle);
  const [isGrid, setIsGrid] = useState(false);
  const { setSearchPlaceHolder } = useSearchPlaceHolder();
  const { toggleCategoryDrawer } = useSidebarStore();
  const toggleSidebar = () => {
    toggleCategoryDrawer();
  };

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
    queryKey: ["CategoryWiseProducts", slug, searchQuery, minPrice, maxPrice],
    queryFn: ({ pageParam }) =>
      getCategoryWiseProducts({
        categorySlug: slug,
        pageParam,
        searchQuery,
        minPrice,
        maxPrice,
      }),
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
      <div className="flex flex-1 w-fit flex-col gap-5lg:border-x-2 sm:border-r-2 p-4">
        <div className=" text-lg h-fit mx-0  border-b-2 mb-3 flex flex-col  sticky top-[64px] z-10 bg-white">
          <div className="block lg:hidden">
            <Button
              variant="ghost"
              onClick={toggleSidebar}
              className="py-2 px-1"
            >
              <TbCategory2 /> Categories <ChevronDown />
            </Button>
          </div>
          <div className="flex justify-between py-4 pt-2 px-1  gap-2">
            <div className="flex flex-wrap items-center gap-1">
              <span className="truncate text-xl">
                {searchQuery
                  ? `Search results for "${searchQuery}"`
                  : ` ${productsData?.pages?.[0]?.categoryName ?? "All"}`}
              </span>
              <span className="text-sm text-gray-500">
                ({productsData?.pages?.[0]?.total} products)
              </span>
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
      <div className="w-[30%] sticky top-[64px]  h-fit p-4 hidden sm:block">
        <h3 className="text-xl font-semibold">Filter</h3>
        <div className="flex font-semibold gap-2 mt-2">
          <p>Price Range (in NPR)</p>
        </div>
        <div className="flex gap-2 mt-2"></div>
        <div className="mx-auto grid w-full max-w-xs gap-3">
          <div className="flex items-center justify-between gap-2">
            <Input
              type="number"
              min={0}
              placeholder="Min"
              value={value[0]}
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              onChange={(e) => setValue([Number(e.target.value), value[1]])}
            />
            <Input
              type="number"
              min={0}
              placeholder="Max"
              value={value[1]}
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              onChange={(e) => setValue([value[0], Number(e.target.value)])}
            />
          </div>
          <Slider
            value={value}
            onValueChange={setValue}
            min={0}
            max={5000000}
            step={1000}
          />
          <Button
            variant="outline"
            disabled={
              value[0] === value[1] || value[0] === "" || value[1] === ""
            }
            onClick={() => {
              setSearchParam({
                minPrice: value[0],
                maxPrice: value[1],
              });
            }}
          >
            Apply
          </Button>
        </div>

        <div className="mt-8">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-gray-500">
            <NavLink to="#" className="hover:text-primary transition-colors">
              Return Policy
            </NavLink>
            <NavLink to="#" className="hover:text-primary transition-colors">
              About Us
            </NavLink>
            <NavLink to="#" className="hover:text-primary transition-colors">
              FAQ
            </NavLink>
            <NavLink to="#" className="hover:text-primary transition-colors">
              Terms of Use
            </NavLink>
            <NavLink to="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </NavLink>
            <NavLink to="#" className="hover:text-primary transition-colors">
              Contact Us
            </NavLink>
          </div>
          <p className="mt-6 text-[10px] text-gray-400">
            © 2026 Hamrobazar Clone. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CategoryWiseProducts;
