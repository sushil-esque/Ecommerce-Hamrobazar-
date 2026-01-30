import { Outlet, ScrollRestoration } from "react-router-dom";
import BottomNavBar from "../Components/BottomNavBar";
import Header from "../Components/Header";
import { useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import useAuthStore from "@/store/useAuthStore";
import { getCart } from "@/api/cart";
import { useQuery } from "@tanstack/react-query";
import { getLocalCart } from "@/utils/cart";

import { SidebarProvider, SidebarInset } from "@/Components/ui/sidebar";
import CategorySidebar from "@/Components/CategorySidebar";

function Layout() {
  const { user } = useAuthStore();
  const { data: cartData } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: !!user,
    retry: 1,
  });
  const localCart = getLocalCart();

  useEffect(() => {
    console.log(user, "USER");

    if (user) {
      const dbCartForCartStore =
        cartData?.items?.map((item) => ({
          productId: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          image: item.product.image.url,
          price: item.product.price,
          _id: item._id,
        })) || [];

      useCartStore.setState({ cart: dbCartForCartStore });
    } else {
      useCartStore.setState({ cart: localCart || [] });
    }
  }, [user, cartData, localCart]);

  return (
    <SidebarProvider  >
      <ScrollRestoration />
      <CategorySidebar />
      <SidebarInset>
        <Header />
        <main className="mt-20 px-4 md:px-0">
          <Outlet />
        </main>
        <BottomNavBar />
        {/* <Footer /> */}
      </SidebarInset>
    </SidebarProvider>
  );
}

export default Layout;
