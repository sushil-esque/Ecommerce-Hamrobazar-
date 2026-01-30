import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { useCategories } from "@/hooks/useCategories";
import { TbCategory2 } from "react-icons/tb";
import { NavLink } from "react-router-dom";
function CategorySidebar() {
  const { data: categoryData, isLoading, isError, refetch } = useCategories();
  return (
    <Sidebar >
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroupLabel>
          {" "}
          <TbCategory2 /> Categories
        </SidebarGroupLabel>
        <SidebarGroupContent>
          {isLoading ? (
            <SidebarMenu>
              {Array.from({ length: 5 }).map((_, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuSkeleton />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          ) : isError ? (
            <div className="flex flex-col items-center gap-2 mt-4">
              <p className="text-sm text-red-500">Failed to load categories</p>
              <button onClick={() => refetch()} className="text-sm underline">
                Retry
              </button>
            </div>
          ) : (
            <SidebarMenu>
              {categoryData?.data?.map((category) => (
                <SidebarMenuItem key={category._id}>
                  <SidebarMenuButton asChild>
                    <NavLink to={`/category/${category.slug}`}>
                      <span>{category.name}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          )}
        </SidebarGroupContent>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}

export default CategorySidebar;
