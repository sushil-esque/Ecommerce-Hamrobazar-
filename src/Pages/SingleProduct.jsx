import { getProduct } from "@/api/products";
import Loader from "@/Components/Loader";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/Components/ui/carousel";
import { Separator } from "@radix-ui/react-select";
import { useQuery } from "@tanstack/react-query";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useMemo, useState } from "react";
import { CiBookmark, CiBookmarkPlus, CiShoppingCart } from "react-icons/ci";
import { GoShareAndroid } from "react-icons/go";
import { TbCurrencyRupeeNepalese } from "react-icons/tb";
import { useParams } from "react-router-dom";

function SingleProduct() {
  const { id } = useParams();
  // const [images, setImages] = useState();
  const [api, setApi] = useState();
  const [currentSlide, setCurrentSlide] = useState(0);
  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["singleProduct", id],
    queryFn: () => getProduct({ id }),
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
      <div className="flex gap-5 flex-wrap">
        <div className="w-[340px] h-full p-5 flex flex-col">
          <div className="flex flex-col mb-8">
            <Carousel
              setApi={setApi}
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="m-0">
                {images?.map((img, index) => (
                  <CarouselItem key={index} className=" w-full">
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
            <div className="border-b-2 flex justify-between items-center">
              <div
                className={`text-lg  border-b-2 w-fit  px-4 pb-2 pt-0 -mb-0.5 border-black 
                 `}
              >
                Description
              </div>
              <GoShareAndroid className="text-xl" />
            </div>

            <div className="text-gray-700 py-2">{product?.description}</div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-5">Specifications</h3>
            <div className="bg-[#f9f8f9] px-5 py-3">
              <div className="flex w-full font-[380] p-1 border-b ">
                <div className="w-[30%] ">hello</div>
                <div className="w-[70%]">value</div>
              </div>
              <div className="flex w-full font-[380] p-1 border-b ">
                <div className="w-[30%] ">hello</div>
                <div className="w-[70%]">
                  value k xa bto fkjfsd sf fmlmls fnsdlk fndlsnflks slnflsnf
                  anslnflsf{" "}
                </div>
              </div>
              <div className="flex w-full font-[380] p-1 border-b ">
                <div className="w-[30%] ">hello</div>
                <div className="w-[70%]">value</div>
              </div>
              <div className="flex w-full font-[380] p-1 border-b ">
                <div className="w-[30%] ">hello</div>
                <div className="w-[70%]">value</div>
              </div>
              <div className="flex w-full font-[380] p-1 border-b ">
                <div className="w-[30%] ">hello</div>
                <div className="w-[70%]">value</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleProduct;
