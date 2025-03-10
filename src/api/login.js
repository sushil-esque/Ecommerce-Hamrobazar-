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
export { registerFakeStore };
export { loginFakeStore };
