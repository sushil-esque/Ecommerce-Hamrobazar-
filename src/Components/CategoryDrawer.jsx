import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/Components/ui/sheet";
import { useSidebarStore } from "@/store/useSidebarStore";
import { useCategories } from "@/hooks/useCategories";
import { Separator } from "@/Components/ui/separator";
import { TbCategory2 } from "react-icons/tb";
import { NavLink } from "react-router-dom";

function CategoryDrawer() {
  const { isCategoryDrawerOpen, setCategoryDrawerOpen } = useSidebarStore();
  const {
    data: categoryData,
    isLoading: categoryLoading,
    isError: categoryIsError,
    refetch: categoryRefetch,
  } = useCategories();

  const categories = categoryData?.data?.map((category, index) => (
    <li key={index} className="list-none">
      <NavLink
        to={`/category/${category.slug}`}
        onClick={() => setCategoryDrawerOpen(false)}
        className="block whitespace-nowrap rounded-lg px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
      >
        {category.name}
      </NavLink>
      <Separator className="my-1" />
    </li>
  ));

  return (
    <Sheet open={isCategoryDrawerOpen} onOpenChange={setCategoryDrawerOpen}>
      <SheetContent
        showCloseButton={false}
        side="left"
        className="w-[300px] sm:w-[360px] p-0"
      >
        <SheetHeader className="p-6 pb-2 border-b">
          <div className="flex items-center gap-2">
            <TbCategory2 className="text-2xl text-primary" />
            <SheetTitle className="text-xl font-bold">Categories</SheetTitle>
          </div>
        </SheetHeader>

        <div className="overflow-y-auto h-[calc(100vh-80px)] px-2 py-4">
          {categoryLoading ? (
            <div className="px-4 space-y-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="h-10 bg-gray-100 animate-pulse rounded-md"
                />
              ))}
            </div>
          ) : categoryIsError ? (
            <div className="p-8 text-center">
              <p className="text-sm text-red-500 mb-4">
                Failed to load categories
              </p>
              <button
                onClick={() => categoryRefetch()}
                className="text-primary underline text-sm"
              >
                Retry
              </button>
            </div>
          ) : (
            <ul>
              <li>
                <NavLink
                  onClick={() => setCategoryDrawerOpen(false)}
                  to="/"
                  className="block whitespace-nowrap rounded-lg px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  Latest Products
                </NavLink>
                <Separator className="my-1" />
              </li>
              {categories}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default CategoryDrawer;
