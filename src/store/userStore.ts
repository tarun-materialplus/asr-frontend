import { create } from "zustand";

interface UserState {
  name: string;
  email: string;
  updateProfile: (name: string, email: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  name: "Tarun Yadav",
  email: "tarun@mediacorp.com",

  updateProfile: (name, email) => 
    set(() => ({ name, email })),
}));