import { getSimilarProducts, getSingleProduct } from "@/api/products";
import { deleteReview, getReviews } from "@/api/review";
import GridCard from "@/Components/GridCard";
import ProductCardSkeletonGrid from "@/Components/ProductCardSkeletonGrid";
import ShareDialog from "@/Components/ShareDialog";
import SingleProductSkeleton from "@/Components/SingleProductSkeleton";
import { Button } from "@/Components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/Components/ui/carousel";
import { Skeleton } from "@/Components/ui/skeleton";
import { Spinner } from "@/Components/ui/spinner";
import useAddToCart from "@/hooks/useAddToCart";
import { formatPrice } from "@/utils/formatPrice";
import { formatRelativeTime } from "@/utils/formatDate";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LucideStar, Trash2, Trash2Icon, UserRound } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { CiBookmark } from "react-icons/ci";
import { GoShareAndroid } from "react-icons/go";
import { useNavigate, useParams } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/Components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const ProductError = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-white rounded-3xl shadow-sm border border-slate-100 my-10 max-w-4xl mx-auto">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-red-50 rounded-full blur-3xl animate-pulse"></div>
        <div className="relative bg-white p-8 rounded-full shadow-lg border border-red-50">
          <svg
            className="w-20 h-20 text-red-500 opacity-80"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>
      </div>
      <h3 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
        Oops! Product Not Found
      </h3>
      <p className="text-slate-500 max-w-md mx-auto mb-10 text-lg leading-relaxed">
        We couldn&apos;t find the product you&apos;re looking for. It might have
        been moved, deleted, or the link might be broken.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          size="lg"
          variant="outline"
          className="px-10 py-6 text-lg font-semibold rounded-2xl hover:bg-slate-50 transition-all duration-300"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
        <Button
          size="lg"
          className="px-10 py-6 text-lg font-semibold rounded-2xl "
          onClick={() => navigate("/")}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};

function SingleProduct() {
  const { id } = useParams();
  // const [images, setImages] = useState();
  const [api, setApi] = useState();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [tab, setTab] = useState("description");
  const scrollRef = useRef();
  const [open, setOpen] = useState(false);

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["singleProduct", id],
    queryFn: () => getSingleProduct(id),
    retry: 2,
  });
  const { data: similarProducts, isLoading: similarLoading } = useQuery({
    queryKey: ["similarProducts", id],
    queryFn: () => getSimilarProducts(id),
    retry: 2,
  });
  const { data: reviews } = useQuery({
    queryKey: ["reviews", id],
    queryFn: () => getReviews(id),
    retry: 2,
  });
  const queryClient = useQueryClient();

  const { mutate: reviewDelete, isPending } = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      toast.success("successfully deleted the review");
      queryClient.invalidateQueries({ queryKey: ["reviews", id] });
      queryClient.invalidateQueries({ queryKey: ["singleProduct", id] });
    },
    onError: (err) => {
      toast.error(err.err || "Error deleting the review");
    },
    onSettled: () => {
      setOpen(false);
    },
  });

  const { handleAddToCart, addingtoCart } = useAddToCart();

  const images = useMemo(() => {
    if (!product) return [];

    return [
      ...(product.image?.url ? [product.image.url] : []),

      ...(product.images?.map((img) => img.url) ?? []),
    ];
  }, [product]);

  console.log(images);
  const productsGrid = similarProducts?.map((product) => (
    <GridCard product={product} key={product?._id} />
  ));
  // useEffect(() => {
  //   if (product)
  //     setImages([...product?.images?.map((img) => img.url), product.image.url]);
  // }, [product]);
  const isMobile = useIsMobile();
  const handleReviewDelete = (id) => {
    reviewDelete(id);
  };
  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrentSlide(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrentSlide(api.selectedScrollSnap());
    });
  }, [api]);

  // Scroll to ref on mobile when tab changes
  useEffect(() => {
    if (isMobile && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    } else {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 0);
    }
  }, [tab, isMobile]);

  // Reset tab to description when product changes
  useEffect(() => {
    setTab("description");
  }, [id]);

  if (isError) {
    return <ProductError />;
  }
  return (
    <div className="lg:mx-24 md:mx-4 sm:mx-4 p-2 sm:p-0 mb-24">
      <div className="flex sm:gap-5 flex-col xl:flex-row">
        {isLoading ? (
          <SingleProductSkeleton />
        ) : (
          <div className="md:flex xl:w-3/4">
            <div className="md:w-[500px] w-full  h-full sm:p-5  flex flex-col">
              <div className="flex flex-col mb-8 ">
                <Carousel
                  setApi={setApi}
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent className="m-0  ">
                    {images?.map((img, index) => (
                      <CarouselItem
                        key={index}
                        className=" w-full flex items-center justify-center"
                      >
                        <img
                          src={img}
                          className="md:w-[331px] md:h-[270px] w-full h-[300px] object-contain rounded-md"
                          alt="Ad 1"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {/* <CarouselPrevious className="left-0" variant="ghost" />
              <CarouselNext className="right-0" variant="ghost" /> */}
                </Carousel>
                {/* <img
              src={product?.image.url}
              alt="image"
              className="w-[331px] h-[270px] object-contain rounded-md "
            /> */}
                <div className="mt-2 flex w-full justify-center gap-5 items-center">
                  {images &&
                    images.length > 0 &&
                    images.map((img, idx) => (
                      <img
                        key={idx}
                        className={`h-8 w-8 object-cover rounded-[2px] ${
                          currentSlide === idx ? "opacity-100" : "opacity-60"
                        }   `}
                        src={img}
                        alt={`Additional Image ${idx + 1}`}
                        onClick={() => {
                          api?.scrollTo(idx);
                        }}
                      />
                    ))}
                </div>
              </div>

              <div
                ref={scrollRef}
                className="border-t-2 mt-3 w-full flex items-center justify-center gap-6 p-4"
              >
                <Button
                  disabled={addingtoCart}
                  variant="secondary"
                  className="flex min-w-[130px] w-full sm:w-1/2  items-center gap-1 justify-center cursor-pointer"
                  onClick={() => handleAddToCart(product)}
                >
                  {addingtoCart ? (
                    <Spinner />
                  ) : (
                    <div className="flex items-center justify-center gap-1 w-full">
                      <CiBookmark className="text-2xl " />
                      <div className=" whitespace-nowrap">Add to cart</div>
                    </div>
                  )}
                </Button>
                <Button
                  variant="secondary"
                  className="flex  min-w-[130px] w-full sm:w-1/2 cursor-default items-center gap-1 justify-center "
                >
                  <div className=" font-bold w-full flex items-center justify-center gap-1 whitespace-nowrap">
                    <span>रू</span> <span>{formatPrice(product?.price)}</span>
                  </div>
                </Button>
              </div>
            </div>
            <div className="flex flex-col w-full gap-3 md:border-l-2  xl:border-x-2  sm:p-5  ">
              <div className="text-2xl font-bold ">{product?.name}</div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <LucideStar
                      key={i}
                      className={`w-4 h-4 ${i < (product?.avgRating || 0) ? "fill-black" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  ({reviews?.data.length || 0} reviews)
                </span>
              </div>

              <div className="">
                <div className="border-b sticky top-[62px] sm:top-[72px]  bg-white flex justify-between items-center">
                  <div className="flex ">
                    <div
                      className={`text-lg   w-fit  px-4 pb-2 pt-0 cursor-pointer ${
                        tab === "description" && "border-b-2 border-b-black "
                      } 
                 `}
                      onClick={() => setTab("description")}
                    >
                      Description
                    </div>
                    <div
                      className={`text-lg  w-fit  px-4 pb-2 pt-0  cursor-pointer  ${
                        tab === "reviews" && "border-b-2 border-b-black "
                      } 
                 `}
                      onClick={() => setTab("reviews")}
                    >
                      Reviews
                    </div>
                  </div>
                  <ShareDialog product={product}>
                    <GoShareAndroid className="text-xl" />
                  </ShareDialog>
                </div>
                {tab === "description" ? (
                  <div className=" py-2 ">{product?.description}</div>
                ) : (
                  <div className=" py-2 flex flex-col gap-2">
                    {reviews?.data.length > 0 ? (
                      reviews?.data.map((item) => (
                        <div
                          key={item._id}
                          className="bg-[#fafafa] rounded-md p-4 flex flex-col gap-2"
                        >
                          <div className="flex items-center">
                            <div className="rounded-full h-8 w-8 bg-[#e5e5e5] p-1 flex items-center justify-center">
                              <UserRound className="h-full w-full text-gray-500" />
                            </div>
                            <div className="ml-2">
                              <div className="flex flex-col">
                                <span className="text-xs">
                                  {item?.user?.username ?? item?.user?.email}
                                </span>
                                <span className="text-[0.6rem] text-gray-500">
                                  {formatRelativeTime(item.updatedAt)}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-1 ml-auto">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <LucideStar
                                  key={i}
                                  className={`w-4 ${i < item.rating ? "fill-black " : ""}`}
                                />
                              ))}
                            </div>
                            {item.userReview && (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="shadow"
                                    className="p-0 h-fit"
                                  >
                                    <BsThreeDotsVertical />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-30 p-2">
                                  <AlertDialog
                                    open={open}
                                    onOpenChange={setOpen}
                                  >
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        className="w-full text-red-600 hover:text-red-600"
                                        variant="outline"
                                      >
                                        <Trash2 />
                                        Delete
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                                          <Trash2Icon />
                                        </AlertDialogMedia>
                                        <AlertDialogTitle>
                                          Delete review?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          you won&apos;t be able to recover this
                                          review once it&apos;s deleted. Do you
                                          want to continue?
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel variant="outline">
                                          Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          className="bg-red-500 hover:bg-red-600"
                                          disabled={isPending}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            handleReviewDelete(item._id);
                                          }}
                                        >
                                          {isPending ? (
                                            <div className="flex items-center gap-2">
                                              <Spinner className="h-4 w-4" />
                                              <span>Deleting...</span>
                                            </div>
                                          ) : (
                                            "Delete"
                                          )}
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                  {/* <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        className="w-full text-red-600 hover:text-red-600"
                                        variant="outline"
                                      >
                                        <Trash2 />
                                        Delete
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Delete review
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                         you won't be able to recover this comment once it's deleted. Do you want to continue?
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction className="destructive">
                                          Continue
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog> */}
                                </PopoverContent>
                              </Popover>
                            )}
                          </div>
                          <p className="text-sm">{item.comment}</p>
                        </div>
                      ))
                    ) : (
                      <div className="flex justify-center h-16 items-center">
                        No reviews yet
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium mb-3">Specifications</h3>
                <div className="bg-[#f9f8f9] sm:px-5 py-3">
                  {product?.specifications?.map((spec) => (
                    <div
                      key={spec._id}
                      className="flex gap-4 w-full font-[380] p-1 border-b "
                    >
                      <div className="sm:w-[30%] w-[40%] font-medium ">
                        {spec.name}
                      </div>
                      <div className="sm:w-[70%] w-[60%]">{spec.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className=" xl:w-1/4 w-full h-full sm:p-2 mt-5 flex flex-col">
          {similarLoading || isLoading ? (
            <Skeleton className="w-[160px] h-[20px]" />
          ) : (
            <h3 className="text-lg font-bold mb-3">Similar Products</h3>
          )}
          <div className="grid grid-cols-2  sm:grid-cols-4 md:grid-cols-4 xl:grid-cols-2 gap-4">
            {isLoading || similarLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <ProductCardSkeletonGrid key={i} />
                ))
              : productsGrid}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleProduct;
