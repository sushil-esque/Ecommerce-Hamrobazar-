import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

function AdsCarousel() {
  return (
    <div className="max-w-[963px] h-auto">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 2000,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent className="m-0">
          <CarouselItem className="pl-0 w-full">
            <img
              src="/public/ad1.png"
              className="w-full h-auto aspect-[3/1] object-cover"
              alt="Ad 1"
            />
          </CarouselItem>
          <CarouselItem className="pl-0 w-full">
            <img
              src="/public/ad2.png"
              className="w-full h-auto aspect-[3/1] object-cover"
              alt="Ad 2"
            />
          </CarouselItem>
          <CarouselItem className="pl-0 w-full">
            <img
              src="/public/ad3.jpg"
              className="w-full h-auto aspect-[3/1] object-cover"
              alt="Ad 3"
            />
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious className="left-0" variant="ghost" />
        <CarouselNext className="right-0" variant="ghost" />
      </Carousel>
    </div>
  );
}

export default AdsCarousel;
