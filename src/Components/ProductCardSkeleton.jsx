import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

function ProductCardSkeleton() {
  return (
    <div className="md:w-[600px] animate-pulse">
      <div className="flex">
        <div className="border-2 w-full rounded-2xl p-2 flex gap-2">

          {/* Image */}
          <div className="relative w-[8.125rem] shrink-0">
            <Skeleton className="h-[7.625rem] w-[8rem] rounded-md" />

            <div className="mt-2 flex justify-center gap-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-5 w-5 rounded-sm" />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="w-full space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-[60%]" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>

            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-[90%]" />
            <Skeleton className="h-3 w-[70%]" />

            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <Skeleton className="h-4 w-14" />
                <Skeleton className="h-4 w-px" />
                <Skeleton className="h-3 w-20" />
              </div>

              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
          </div>

        </div>
      </div>

      <Separator className="w-full h-px bg-gray-300 mt-4" />
    </div>
  );
}

export default ProductCardSkeleton;
