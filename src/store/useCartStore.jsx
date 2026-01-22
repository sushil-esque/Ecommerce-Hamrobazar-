import { getLocalCart, saveLocalCart } from "@/utils/cart";
import { create } from "zustand";

const localCart = getLocalCart();
export const useCartStore = create((set) => ({
  cart: localCart || [],
  addToLocalCart: (product) =>
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
      saveLocalCart(updatedCart);
     
      return { cart: updatedCart };
    }),
    
}));
