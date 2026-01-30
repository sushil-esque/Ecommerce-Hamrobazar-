import { getSimilarProducts, getSingleProduct } from "@/api/products";
import GridCard from "@/Components/GridCard";
import Loader from "@/Components/Loader";
import { Button } from "@/Components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/Components/ui/carousel";
import { Spinner } from "@/Components/ui/spinner";
import useAddToCart from "@/hooks/useAddToCart";
import { formatPrice } from "@/utils/formatPrice";
import { Separator } from "@radix-ui/react-select";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { CiBookmark } from "react-icons/ci";
import { GoShareAndroid } from "react-icons/go";
import { useParams } from "react-router-dom";

function SingleProduct() {
  const { id } = useParams();
  // const [images, setImages] = useState();
  const [api, setApi] = useState();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [tab, setTab] = useState("description");
  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["singleProduct", id],
    queryFn: () => getSingleProduct(id),
    retry: 2,
  });
  const {
    data: similarProducts,
    isLoading: similarLoading,
    isError: similarError,
  } = useQuery({
    queryKey: ["similarProducts", id],
    queryFn: () => getSimilarProducts(id),
    retry: 2,
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
  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return <div>Something went wrong</div>;
  }
  return (
    <div className="lg:mx-24 md:mx-4 sm:mx-4 p-2 sm:p-0 mb-24">
      <div className="flex sm:gap-5 flex-col xl:flex-row">
        <div className="md:flex">
          <div className="md:w-[500px]  h-full sm:p-5  flex flex-col">
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
                        setCurrentSlide(idx);
                        api?.scrollTo(idx);
                      }}
                    />
                  ))}
              </div>
            </div>

            <div className="border-t-2 mt-3 w-full flex items-center justify-center gap-6 p-4">
              <Button
                disabled={addingtoCart}
                variant="secondary"
                className="flex min-w-[130px] w-full sm:w-1/2  items-center gap-1 justify-center cursor-pointer"
                onClick={() => handleAddToCart(product)}
              >
                { addingtoCart?  <Spinner/> : 
                <div className="flex items-center justify-center gap-1 w-full">
                <CiBookmark className="text-2xl " />
                <div className=" whitespace-nowrap">Add to cart</div>
                </div>}
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
          <div className="flex flex-col gap-3 md:border-l-2  xl:border-x-2  sm:p-5 md:max-w-[615px] ">
            <div className="text-2xl font-bold ">{product?.name}</div>

            <div>
              <div className="border-b flex justify-between items-center">
                <div className="flex">
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

                <GoShareAndroid className="text-xl" />
              </div>
              {tab === "description" ? (
                <div className=" py-2">{product?.description}</div>
              ) : (
                <div className=" py-2">reviews</div>
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
        <div className=" xl:w-[350px] w-full h-full sm:p-2 mt-5 flex flex-col">
          <h3 className="text-lg font-bold mb-3">Similar Products</h3>
          <div className="grid grid-cols-2  sm:grid-cols-4 md:grid-cols-4 xl:grid-cols-2 gap-4">
            {productsGrid}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleProduct;
