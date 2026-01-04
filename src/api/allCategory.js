import axios from "axios";
import { basicAxios } from "./interceptor";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
async function getAllCategory() {
    return await basicAxios.get(BASE_URL + "products/categories");
}
export async function getCategories(){
    return await basicAxios.get("http://localhost:3000/api/categories")
}

export { getAllCategory };