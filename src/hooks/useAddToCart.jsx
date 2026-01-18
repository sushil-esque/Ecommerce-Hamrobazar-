import { useCartStore } from "@/store/useCartStore";
import { getCart, saveCart } from "@/utils/cart";

export const useAddToCart = () => {
  
  const { cart, setCart } = useCartStore();
  const addToCart = (product) => {
    let existingItem = cart.find((item) => item.productId === product._id);

    if (existingItem) {
      console.log(existingItem, "existing item");
      existingItem.quantity += 1;
      for (let i; i < cart.length; i++) {
        if (cart[i].productId === existingItem.productId) {
          cart[i].push(existingItem);
        }
      }
      console.log(cart, "from existing");
      saveCart(cart);
      return;
    }
    const item = {
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.image.url,
      quantity: 1,
    };
    cart.push(item);
    saveCart(cart);

    console.log(cart, "from other");
  };
  return addToCart;
};
