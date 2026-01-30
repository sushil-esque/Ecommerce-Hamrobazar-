import { Separator } from "./ui/separator"
import { Skeleton } from "./ui/skeleton"

function CategorySkeleton() {
  return (
  <div className="sm:flex h-screen flex-col bg-white sticky top-20 hidden xl:w-[360px] w-[200px]">
      {/* Header */}
      <div className="flex items-center gap-2 pl-8 py-2">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-6 w-24" />
      </div>

      <Separator className="my-1 w-full" />

      {/* Category list */}
      <div className="px-4 space-y-3 mt-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-10 w-full rounded-lg"
          />
        ))}
      </div>
    </div>  )
}

export default CategorySkeleton