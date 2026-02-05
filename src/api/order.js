import { basicAxios } from "./interceptor";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const checkout = async(data)=>{
 return basicAxios.post(`${BASE_URL}checkout`, data, {withCredentials:true})
}

export const esewaInitiate = async(data)=>{
    return basicAxios.post(`${BASE_URL}payment/esewa/initiate`, data, {withCredentials:true})
}
export const esewaVerify = async(data)=>{
    return basicAxios.post(`${BASE_URL}payment/esewa/verify`, data, {withCredentials:true})
}