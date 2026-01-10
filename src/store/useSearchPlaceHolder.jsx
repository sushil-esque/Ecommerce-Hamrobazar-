import { create } from "zustand";

export const useSearchPlaceHolder = create((set) => ({
  searchPlaceHolder: null,
  setSearchPlaceHolder: (placeHolder) =>
    set(() => ({ searchPlaceHolder: placeHolder })),
}));


