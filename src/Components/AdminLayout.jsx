import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

function AdminLayout() {
  return (
    <SidebarProvider>
      <AdminSidebar />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminHeader />
        <div className="p-7 overflow-y-auto flex-1">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}

export default AdminLayout;
