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
  isInitialized: false,
  setIsInitialized: (value) => set(() => ({ isInitialized: value })),
  logout: () => {
    set(() => ({
      user: null,
      isLoggedIn: false,
      isInitialized: false,
    }));
  },
}));

export default useAuthStore;
