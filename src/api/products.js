import { axiosWithAuth, basicAxios } from "./interceptor";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
async function getProducts(params = "") {
  return await basicAxios.get(BASE_URL + `products` + params);
}
async function getUserCart() {
  return await axiosWithAuth.get(BASE_URL + `carts/1`);
}
export { getUserCart };
export { getProducts };
