import { create } from "zustand";

type Mode = "signup" | "login";

interface AuthDialogState {
  open: boolean;
  mode: Mode;
  openSignup: () => void;
  openLogin: () => void;
  setMode: (m: Mode) => void;
  close: () => void;
}

export const useAuthDialog = create<AuthDialogState>((set) => ({
  open: false,
  mode: "signup",
  openSignup: () => set({ open: true, mode: "signup" }),
  openLogin: () => set({ open: true, mode: "login" }),
  setMode: (mode) => set({ mode }),
  close: () => set({ open: false }),
}));
