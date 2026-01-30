import { basicAxios } from "./interceptor";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
async function getAllCategory() {
  return await basicAxios.get(BASE_URL + "products/categories");
}
export async function getCategories() {
  return await basicAxios.get(BASE_URL + "categories");
}
export async function updateCategory({ data, id }) {
  return await basicAxios.put(
    BASE_URL + `categories/${id}`,
    data,
    { withCredentials: true }
  );
}
export const addCategory = async (data) => {
  return await basicAxios.post(BASE_URL + "categories", data, {
    withCredentials: true,
  });
};
export const deleteCategory = async (id) => {
  return await basicAxios.delete(BASE_URL + `categories/${id}`, {
    withCredentials: true,
  });
};


export { getAllCategory };

