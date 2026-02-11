import { basicAxios } from "./interceptor";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const checkout = async (data) => {
  return basicAxios.post(`${BASE_URL}checkout`, data, {
    withCredentials: true,
  });
};

export const esewaInitiate = async (data) => {
  return basicAxios.post(`${BASE_URL}payment/esewa/initiate`, data, {
    withCredentials: true,
  });
};
export const esewaVerify = async (data) => {
  return basicAxios.post(`${BASE_URL}payment/esewa/verify`, data, {
    withCredentials: true,
  });
};

export const getAllOrders = async ({ page = 1, limit = 10 }) => {
  return basicAxios.get(`${BASE_URL}orders?page=${page}&limit=${limit}`, {
    withCredentials: true,
  });
};

export const updateStatus = async (id, data) => {
  return basicAxios.put(`${BASE_URL}admin/orders/${id}/status`, data, {
    withCredentials: true,
  });
};

export const getUserOrders = async ({ page = 1, limit = 10 }) => {
  return basicAxios.get(`${BASE_URL}user/orders?page=${page}&limit=${limit}`, {
    withCredentials: true,
  });
};

export const updateFailedStatus = async () => {
  // Empty {} as the body, config as the 3rd argument
  return basicAxios.put(`${BASE_URL}user/failedOrder`, {}, {
    withCredentials: true,
  });
};
