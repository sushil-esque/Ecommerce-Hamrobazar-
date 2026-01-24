import { basicAxios } from "./interceptor";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const checkout = async(data)=>{
 return basicAxios.post(`${BASE_URL}checkout`, data, {withCredentials:true})
}