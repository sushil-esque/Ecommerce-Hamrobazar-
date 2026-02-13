import { Outlet, ScrollRestoration } from "react-router-dom";

import { SidebarProvider } from "@/Components/ui/sidebar";
import AdminHeader from "@/Components/Admin/AdminHeader";
import AdminSidebar from "@/Components/Admin/AdminSidebar";

function AdminLayout() {
  return (
    <SidebarProvider>
      <ScrollRestoration />

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
