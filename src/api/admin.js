import { basicAxios } from "./interceptor";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getAdminStats = async () => {
  return basicAxios.get(`${BASE_URL}stats`, {
    withCredentials: true,
  });
};
