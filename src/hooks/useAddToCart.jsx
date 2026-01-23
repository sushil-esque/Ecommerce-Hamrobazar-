import { addtoCart } from "@/api/cart";
import useAuthStore from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

function useAddToCart() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const addToLocalCart = useCartStore((state) => state.addToLocalCart);
  const { mutate: cartMutate, isPending: addingtoCart } = useMutation({
    mutationFn: addtoCart,
    onSuccess: () => {
      toast.success("Product added to cart");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (err) => {
      toast.error(err.error || "Failed to add to cart");
    },
  });
  const handleAddToCart = (product) => {
    if (!user) {
      addToLocalCart(product);
      toast.success("Product added to cart");
    } else {
      const items = [
        {
          product: product._id,
          quantity: 1,
        },
      ];
      cartMutate(items);
    }
  };
  return { handleAddToCart, addingtoCart };
}

export default useAddToCart;
