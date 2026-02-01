import { Skeleton } from "@/components/ui/skeleton";

export default function SingleProductSkeleton() {
  return (
    <div className="md:flex xl:w-3/4 gap-6">
      {/* LEFT SIDE */}
      <div className="md:w-[500px] w-full sm:p-5 flex flex-col">
        {/* Main image */}
        <Skeleton className="md:w-[331px] md:h-[270px] w-full h-[300px] rounded-md mx-auto" />

        {/* Thumbnails */}
        <div className="mt-4 flex justify-center gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-8 rounded-sm" />
          ))}
        </div>

        {/* Buttons */}
        <div className="border-t-2 mt-6 flex gap-6 p-4">
          <Skeleton className="h-10 w-full sm:w-1/2 rounded-md" />
          <Skeleton className="h-10 w-full sm:w-1/2 rounded-md" />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-col w-full gap-4 sm:p-5">
        {/* Product name */}
        <Skeleton className="h-7 w-3/4" />

        {/* Tabs */}
        <div className="flex gap-6 border-b pb-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-20" />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* Specifications */}
        <div className="mt-4">
          <Skeleton className="h-5 w-40 mb-3" />
          <div className="space-y-3 bg-[#f9f8f9] p-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-4 w-[30%]" />
                <Skeleton className="h-4 w-[70%]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
