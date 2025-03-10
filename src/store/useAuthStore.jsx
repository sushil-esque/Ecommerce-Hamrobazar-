import { create } from "zustand";
const isLoggedInInit = !!localStorage.getItem("token");
const tokenInit = localStorage.getItem("token");

const useAuthStore = create((set) => ({
  
  token: tokenInit,
  isLoggedIn: isLoggedInInit,
  count: 1,
  count2: { apple: "ball", cat: "dog" },
  setCount: (value) => set((state) => ({ ...state, count: value })),

  setCat: (value) =>
    set((state) => ({ count2: { ...state.count2, cat: value } })),
  setApple: (value) =>
    set((state) => ({ count2: { ...state.count2, apple: value } })),

  inc: () => {
    set((state) => {
      const prev = state.count;
      return { ...state, count: prev + 1 };
    });
  },
  dec: () => set((state) => ({ ...state, count: state.count - 1 })),
  reset: () => set((state) => ({ ...state, count: 0 })),
  setToken: (newToken) => {
    localStorage.setItem("token", newToken);
    set(() => ({
      token: newToken,
      isLoggedIn: !!newToken,
    }));
  },
  clearToken: () => {
    localStorage.removeItem("token");
    set(() => ({
      token: null,
      isLoggedIn: false,
    }));
  },
}));

export default useAuthStore;
