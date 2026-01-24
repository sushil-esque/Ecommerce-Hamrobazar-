import { basicAxios } from "./interceptor";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
async function loginFakeStore(data) {
  return await basicAxios({
    url: BASE_URL + "auth/login",
    method: "POST",
    data: data,
  });
}

async function registerFakeStore(data) {
  return await basicAxios({
    url: BASE_URL + "users",
    method: "POST",
    data: data,
  });
}

async function registerUser(data) {
  return await basicAxios({
    url: "http://localhost:3000/api/signup",
    method: "POST",
    data: data,
  });
}

async function login(data) {
  return await basicAxios({
    url: "http://localhost:3000/api/login",
    method: "POST",
    data: data,
    withCredentials: true,
  });
}
export async function logout(data) {
  return await basicAxios({
    url: "http://localhost:3000/api/logout",
    method: "POST",
    data: data,
    withCredentials: true,
  });
}

export async function me() {
  return await basicAxios.get("http://localhost:3000/api/me", {
    withCredentials: true,
  });
}
export { login };
export { registerUser };

export { registerFakeStore };
export { loginFakeStore };
