import { axiosWithAuth, basicAxios } from "./interceptor";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
async function getProducts(params = "") {
  return await basicAxios.get(BASE_URL + `products` + params);
}
async function getUserCart() {
  return await axiosWithAuth.get(BASE_URL + `carts/1`);
}

export async function getAllProducts({ page = 1, limit = 10 }) {
  return await basicAxios.get(
   BASE_URL+  `products?page=${page}&&limit=${limit}`
  );
}
export async function addProduct(data) {
  return await basicAxios({
    url: BASE_URL+ "products",
    method: "POST",
    data: data,
    withCredentials: true,
  });
}
export const getSingleProduct = async (id) => {
  return await basicAxios({
    url:  BASE_URL+`products/${id}`,
  });
};
export const deleteImage = async ({ productId, public_id }) => {
  // axios.delete expects (url, config). When sending a request body with DELETE,
  // pass it as `data` inside the config object.
  const url = BASE_URL+ `image/${productId}`;
  return await basicAxios.delete(url, {
    data: { public_id },
    withCredentials: true,
  });
};
export const editProduct = async ({ id, data }) => {
  const url = BASE_URL+ `products/${id}`;

  return await basicAxios.put(url, data, {
    withCredentials: true,
  });
};
export const deleteProduct = async (productId) => {
  // axios.delete expects (url, config). When sending a request body with DELETE,
  // pass it as `data` inside the config object.
  const url = BASE_URL+`products/${productId}`;
  return await basicAxios.delete(url, {
    withCredentials: true,
  });
};

export const getCategoryWiseProducts = async(categorySlug)=>{
  return await basicAxios.get(BASE_URL + `categorywiseProducts/${categorySlug}`)
}

export { getUserCart };
export { getProducts };
