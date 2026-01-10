import { Skeleton } from "./ui/skeleton";
import { Separator } from "@radix-ui/react-select";

function ProductCardSkeletonGrid() {
  return (
    <div>
      <div className="h-fit mx-0 flex">
        <div className="border-2 w-full border-transparent rounded-2xl p-2 flex flex-col gap-2">
          {/* Image */}
          <div className="shrink-0 flex justify-center">
            <Skeleton className="w-full h-32 rounded-md" />
          </div>

          <div className="w-full">
            {/* Title + Share */}
            <div className="flex items-center justify-between mb-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>

            {/* Category */}
            <Skeleton className="h-3 w-24 mb-4" />

            {/* Price + Bookmark */}
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-[1px]" />
              </div>

              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCardSkeletonGrid;
