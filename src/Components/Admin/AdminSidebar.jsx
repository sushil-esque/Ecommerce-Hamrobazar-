import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import {
  LayoutDashboard,
  PlusCircle,
  Package,
  Layers,
  ShoppingBag,
} from "lucide-react";

function AdminSidebar() {
  const items = [
    {
      title: "Dashboard",
      url: "/AdminDashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Add Products",
      url: "/AdminDashboard/addProducts",
      icon: PlusCircle,
    },
    {
      title: "View Products",
      url: "/AdminDashboard/viewProducts",
      icon: Package,
    },
    {
      title: "Categories",
      url: "/AdminDashboard/Categories",
      icon: Layers,
    },
    {
      title: "Orders",
      url: "/AdminDashboard/Orders",
      icon: ShoppingBag,
    },
  ];

  return (
    <>
      <Sidebar collapsible="icon" className="">
        <SidebarContent className="bg-white">
          <SidebarGroup>
            <SidebarGroupLabel>Admin Dashboard</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
}

export default AdminSidebar;
