import { logout } from "@/api/auth";
import useAuthStore from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useLogout = () => {
  const { setUser, setIsLoggedIn } = useAuthStore();

  const { mutate: logoutMutate, isPending } = useMutation({
    mutationFn: logout,
    onError: (err) => {
      toast.error(err.response?.data?.error || "Logout failed");
    },
    onSuccess: () => {
      useCartStore.setState(() => ({ cart: [] }));
      setUser(null);
      setIsLoggedIn(false);
      localStorage.removeItem("user");

      toast.success("Logout Successful");
    //   navigate("/");
    },
  });

  return {  logoutMutate, isPending };
};
