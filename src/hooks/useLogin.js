import { login } from "@/api/auth";
import { addtoCart } from "@/api/cart";
import useAuthStore from "@/store/useAuthStore";
import { getLocalCart } from "@/utils/cart";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useLogin = () => {
  const { setUser, setIsLoggedIn, redirectTo, clearRedirectTo } =
    useAuthStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { state } = useLocation();

  const { mutate: cartMutate } = useMutation({
    mutationFn: addtoCart,
    onError: (err) => {
      console.error(err);
      toast.error("Failed to sync cart");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Cart synced successfully");
      localStorage.removeItem("cart");
    },
  });

  const { mutate: loginMutate, isPending } = useMutation({
    mutationFn: login,
    onError: (err) => {
      console.error(err);
      toast.error(err.response?.data?.error || "Login failed");
    },
    onSuccess: (data) => {
      setUser(data.user);
      setIsLoggedIn(true);

      // Sync local cart
      const localCart = getLocalCart();
      if (localCart && localCart.length > 0) {
        const items = localCart.map((item) => ({
          product: item.productId,
          quantity: item.quantity,
        }));
        cartMutate(items);
      }

    

   if (state?.redirect && state.redirect !== "/login" && state.redirect !== "/register"  && data.user.role !== "admin") {
        console.log(state.redirect,"state.redirect");
        navigate(state.redirect, { replace: true });
      } else if (redirectTo && redirectTo !== "/login" && redirectTo !== "/register" && data.user.role !== "admin") {
        console.log(redirectTo,"redirectTo");
        navigate(redirectTo, { replace: true });
        clearRedirectTo();
      } else if ( data.user.role === "user" && data.user.role !== "admin") {
        console.log("user");
        navigate("/", { replace: true });
      } else if (data.user.role === "admin" && data.user.role !== "user") {
        console.log("admin");
        navigate("/AdminDashboard", { replace: true });
      }

      toast.success("Login successful");
    },
  });

  return { loginMutate, isPending };
};
