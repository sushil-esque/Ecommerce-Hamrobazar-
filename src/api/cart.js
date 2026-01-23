import { basicAxios } from "./interceptor";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const addtoCart = async (cartItems) => {
  return await basicAxios.post(
    BASE_URL + "cart",
    { items: cartItems },
    { withCredentials: true },
  );
};

export const getCart = async () => {
  return await basicAxios.get(BASE_URL + "cart", { withCredentials: true });
};
export const deleteFromCart = async (id) => {
  return await basicAxios.delete(`${BASE_URL}cart/item/${id}`, {
    withCredentials: true,
  });
};
