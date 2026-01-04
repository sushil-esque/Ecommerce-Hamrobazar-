import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

function AdminLayout() {
  return (
    <SidebarProvider className="min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col w-full ">
        <main className="flex-1 overflow-auto ">
          <AdminHeader />
          <div className="p-7">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

export default AdminLayout;
