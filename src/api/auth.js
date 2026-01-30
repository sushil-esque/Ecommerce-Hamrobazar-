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
    url: BASE_URL + "signup",
    method: "POST",
    data: data,
  });
}

async function login(data) {
  return await basicAxios({
    url: BASE_URL + "login",
    method: "POST",
    data: data,
    withCredentials: true,
  });
}
export async function logout(data) {
  return await basicAxios({
    url: BASE_URL + "logout",
    method: "POST",
    data: data,
    withCredentials: true,
  });
}

export async function me() {
  return await basicAxios.get(BASE_URL + "me", {
    withCredentials: true,
  });
}
export { login };
export { registerUser };

export { registerFakeStore };
export { loginFakeStore };
