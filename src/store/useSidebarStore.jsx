import { create } from "zustand";

export const useSidebarStore = create((set) => ({
  isCategoryDrawerOpen: false,
  setCategoryDrawerOpen: (isOpen) => set({ isCategoryDrawerOpen: isOpen }),
  toggleCategoryDrawer: () =>
    set((state) => ({ isCategoryDrawerOpen: !state.isCategoryDrawerOpen })),
}));
