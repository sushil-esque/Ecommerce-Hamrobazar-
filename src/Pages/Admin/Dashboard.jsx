import { useQuery } from "@tanstack/react-query";
import { getAllOrders } from "@/api/order";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Clock,
  IndianRupee,
} from "lucide-react";
import Loader from "@/Components/Loader";
import { OrderDetailsDialog } from "@/Components/Admin/OrderDetailsDialog";

import { getAdminStats } from "@/api/admin";

function Dashboard() {
  // Fetch dashboard stats
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["AdminStats"],
    queryFn: getAdminStats,
  });

  // Fetch recent orders for the table
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ["Orders", 1],
    queryFn: () => getAllOrders({ page: 1, limit: 5 }),
  });

  if (statsLoading || ordersLoading) {
    return <Loader />;
  }

  const {
    totalOrders = 0,
    totalProducts = 0,
    totalCategories = 0,
    totalRevenue = 0,
  } = statsData || {};
  const recentOrders = ordersData?.data || [];
  const stats = [
    {
      title: "Total Orders",
      value: totalOrders,
      icon: ShoppingBag,
      description: "Lifetime orders",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Total Products",
      value: totalProducts,
      icon: Package,
      description: "Items in catalog",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Categories",
      value: totalCategories,
      icon: Layers,
      description: "Product categories",
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      title: "Total Revenue",
      value: `Rs ${totalRevenue.toLocaleString()}`,
      icon: IndianRupee,
      description: "Total sales amount",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  const getOrderStatusBadge = (status) => {
    const styles = {
      placed: "bg-slate-50 text-slate-700 border-slate-200",
      confirmed: "bg-blue-50 text-blue-700 border-blue-200",
      shipped: "bg-violet-50 text-violet-700 border-violet-200",
      delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
      cancelled: "bg-rose-50 text-rose-700 border-rose-200",
    };
    return (
      <Badge
        className={`${styles[status] || styles.placed} capitalize shadow-none border`}
      >
        {status}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <LayoutDashboard className="text-primary h-8 w-8" />
          Admin Dashboard
        </h1>
        <p className="text-slate-500 font-medium">
          Welcome back! Here&apos;s what&apos;s happening with your store today.
        </p>
      </div>

      {/* {/* Stats Grid  */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card
            key={i}
            className="border-none shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                    {stat.title}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-black text-slate-900">
                      {stat.value}
                    </h3>
                  </div>
                </div>
                <div
                  className={`${stat.bg} ${stat.color} p-3 rounded-2xl group-hover:scale-110 transition-transform`}
                >
                  <stat.icon size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs font-bold text-slate-400">
                <TrendingUp size={14} className="mr-1 text-emerald-500" />
                <span>{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <Card className="lg:col-span-2 border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-6">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" /> Recent Orders
              </CardTitle>
              <CardDescription>Review the latest transactions</CardDescription>
            </div>
            <NavLink to={"/AdminDashboard/Orders"}
          
              className="text-sm font-bold text-primary hover:underline flex items-center"
            >
              View All <ArrowUpRight size={14} className="ml-1" />
            </NavLink>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="font-bold text-slate-400 pl-6 uppercase text-[10px] tracking-widest">
                      Order ID
                    </TableHead>
                    <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">
                      Customer
                    </TableHead>
                    <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest text-right">
                      Amount
                    </TableHead>
                    <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest text-center">
                      Status
                    </TableHead>
                    <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest text-right pr-6">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                      <TableRow
                        key={order._id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <TableCell className="font-mono font-bold text-primary pl-6 py-4 italic">
                          #{order._id.slice(-6).toUpperCase()}
                        </TableCell>
                        <TableCell>
                          <div className="font-bold text-slate-700 text-sm">
                            {order.shippingAddress.fullName}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {order.user.email}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-black text-slate-900">
                          Rs {order.totalPrice.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center">
                          {getOrderStatusBadge(order.orderStatus)}
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <OrderDetailsDialog order={order} />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-40 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-400">
                          <ShoppingBag size={40} className="mb-2 opacity-20" />
                          <p className="font-bold uppercase tracking-widest text-xs">
                            No Recent Orders
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Status Breakdown / Quick Actions */}
        <div className="space-y-6">
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3">
              <NavLink
              to={"/AdminDashboard/addProducts"}
                
                className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors rounded-2xl border border-slate-100 group"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-xl shadow-sm text-primary group-hover:scale-110 transition-transform">
                    <PlusCircle size={20} />
                  </div>
                  <span className="font-bold text-slate-700">
                    Add New Product
                  </span>
                </div>
                <ArrowUpRight
                  size={16}
                  className="text-slate-300 group-hover:text-primary transition-colors"
                />
              </NavLink>
              <NavLink
              to={"/AdminDashboard/Categories"}
                
                className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors rounded-2xl border border-slate-100 group"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-xl shadow-sm text-violet-500 group-hover:scale-110 transition-transform">
                    <Layers size={20} />
                  </div>
                  <span className="font-bold text-slate-700">
                    Manage Categories
                  </span>
                </div>
                <ArrowUpRight
                  size={16}
                  className="text-slate-300 group-hover:text-violet-500 transition-colors"
                />
              </NavLink>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { PlusCircle } from "lucide-react";
import { NavLink } from "react-router-dom";

export default Dashboard;
