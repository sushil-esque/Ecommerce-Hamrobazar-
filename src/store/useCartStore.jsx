import { getCart, saveCart } from "@/utils/cart";
import { toast } from "sonner";
import { create } from "zustand";

const localCart = getCart();
export const useCartStore = create((set) => ({
  cart: localCart || [],
  addToCart: (product) =>
    set((state) => {
      const existing = state.cart.find(
        (item) => item.productId === product._id
      );
      let updatedCart;
      if (existing) {
        updatedCart = state.cart.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [
          ...state.cart,
          {
            productId: product._id,
            name: product.name,
            price: product.price,
            image: product.image.url,
            quantity: 1,
          },
        ];
      }
      saveCart(updatedCart);
     
      return { cart: updatedCart };
    }),
    
}));
