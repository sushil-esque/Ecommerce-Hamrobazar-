import { getSingleProduct } from "@/api/products";
import Loader from "@/Components/Loader";
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from "@/Components/ui/carousel";
import { Separator } from "@radix-ui/react-select";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { CiBookmark } from "react-icons/ci";
import { GoShareAndroid } from "react-icons/go";
import { TbCurrencyRupeeNepalese } from "react-icons/tb";
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
  const images = useMemo(() => {
    if (!product) return [];

    return [
      ...(product.images?.map((img) => img.url) ?? []),
      ...(product.image?.url ? [product.image.url] : []),
    ];
  }, [product]);

  console.log(images);
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
    <div className="lg:mx-24 md:mx-4 sm:mx-4 mb-24">
      <div className="flex sm:gap-5 flex-wrap">
        <div className="sm:w-[340px] h-full p-5 flex flex-col">
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
                  <CarouselItem key={index} className=" w-full flex items-center justify-center">
                    <img
                      src={img}
                      className="w-[331px] h-[270px] object-contain rounded-md "
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

          <div className="border-t-2 mt-3 flex items-center justify-center gap-6 p-4">
            <div className="flex items-center gap-1 justify-center cursor-pointer">
              <CiBookmark className="text-2xl " />

              <div className="text-gray-400">Add to cart</div>
            </div>
            {/* <div className="w-px h-4 bg-gray-300 mx-2"></div> Gray line */}
            <Separator
              orientation="vertical"
              className="h-5 w-px bg-gray-300"
            />
            <div className="flex items-center gap-1 justify-center">
              <TbCurrencyRupeeNepalese />
              <div className=" font-bold">{product?.price}</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 border-x-2 p-5 w-[615px] ">
          <div className="text-2xl font-bold ">{product?.name}</div>

          <div>
            {/* <div className="text-lg border-y-2 flex justify-between items-center py-2">
              <div>Description</div>
              <div>
                <GoShareAndroid />
              </div>
            </div> */}
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
            <h3 className="text-lg font-medium mb-5">Specifications</h3>
            <div className="bg-[#f9f8f9] px-5 py-3">
              {product?.specifications?.map((spec) => (
                <div
                  key={spec._id}
                  className="flex w-full font-[380] p-1 border-b "
                >
                  <div className="w-[30%] ">{spec.name}</div>
                  <div className="w-[70%]">{spec.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleProduct;
