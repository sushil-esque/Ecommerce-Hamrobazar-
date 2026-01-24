import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  setUser: (userData) => {
    set(() => ({ user: userData }));
  },
  redirectTo: null,
  setRedirectTo: (location) => set(() => ({ redirectTo: location })),
  clearRedirectTo: () => set(() => ({ redirectTo: null })),
  searchPlaceHolder: null,
  setSearchPlacePlaceHolder: (placeHolder) =>
    set(() => ({ searchPlaceHolder: placeHolder })),
  isLoggedIn: false,
  setIsLoggedIn: (value) => set(() => ({ isLoggedIn: value })),
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
  logout: () => {
    set(() => ({
      user: null,
      isLoggedIn: false,
    }));
  },
}));

export default useAuthStore;
