import axios from "axios";
import { basicAxios } from "./interceptor";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
async function getAllCategory() {
    return await basicAxios.get(BASE_URL + "products/categories");
}
export { getAllCategory };