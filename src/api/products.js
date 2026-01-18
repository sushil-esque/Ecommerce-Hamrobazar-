import { axiosWithAuth, basicAxios } from "./interceptor";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export async function getProduct({id}) {
  return await basicAxios.get("https://fakestoreapi.com/" + `products/` + id);
}
async function getUserCart() {
  return await axiosWithAuth.get("https://fakestoreapi.com/" + `carts/1`);
}
export async function getProducts(params = "") {
  return await basicAxios.get("https://fakestoreapi.com/" + `products` + params);
}

export async function getAllProducts({ pageParam = 1, limit = 4 }) {
  return await basicAxios.get(
    BASE_URL + `products?page=${pageParam}&limit=${limit}`
  );
}
export async function addProduct(data) {
  return await basicAxios({
    url: BASE_URL + "products",
    method: "POST",
    data: data,
    withCredentials: true,
  });
}
export const getSingleProduct = async (id) => {
  return await basicAxios({
    url: BASE_URL + `products/${id}`,
  });
};
export const deleteImage = async ({ productId, public_id }) => {
  // axios.delete expects (url, config). When sending a request body with DELETE,
  // pass it as `data` inside the config object.
  const url = BASE_URL + `image/${productId}`;
  return await basicAxios.delete(url, {
    data: { public_id },
    withCredentials: true,
  });
};
export const editProduct = async ({ id, data }) => {
  const url = BASE_URL + `products/${id}`;

  return await basicAxios.put(url, data, {
    withCredentials: true,
  });
};
export const deleteProduct = async (productId) => {
  // axios.delete expects (url, config). When sending a request body with DELETE,
  // pass it as `data` inside the config object.
  const url = BASE_URL + `products/${productId}`;
  return await basicAxios.delete(url, {
    withCredentials: true,
  });
};

export const getCategoryWiseProducts = async ({
  pageParam = 1,
  limit = 2,
  categorySlug,
  searchQuery,
}) => {
  let url = `categorywiseProducts/${categorySlug}?page=${pageParam}&limit=${limit}`;
  if (searchQuery) url += `&query=${encodeURIComponent(searchQuery)}`;
  return await basicAxios.get(BASE_URL + url);
};

export const getSearchResults = async ({
  pageParam = 1,
  limit = 2,
  searchQuery,
}) => {
  return await basicAxios.get(
    BASE_URL +
      `searchProducts?query=${searchQuery}&page=${pageParam}&limit=${limit}`
  );
};

export const syncCart = async (cartItems) => {
  return await axiosWithAuth.post(
    BASE_URL + "cart/sync",
    { items: cartItems },
    { withCredentials: true }
  );
};

export { getUserCart };
