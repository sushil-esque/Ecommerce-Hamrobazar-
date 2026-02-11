import { basicAxios } from "./interceptor";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getReviews = async (id) => {
  return await basicAxios.get(`${BASE_URL}review/${id}`, {
    withCredentials: true,
  });
};

export const addReview = async ({ id, data }) => {
  return await basicAxios.post(`${BASE_URL}review/${id}`, data, {
    withCredentials: true,
  });
};

export const deleteReview = async (id) => {
  return await basicAxios.delete(`${BASE_URL}review/${id}`, {
    withCredentials: true,
  });
};
