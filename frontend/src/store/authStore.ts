import { create } from "zustand";
import { api } from "../lib/api";

interface User {
  _id: string;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,

  // ✅ LOGIN
  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await api.post("/auth/login", { email, password });

      // backend sends: { message, user }
      set({ user: res.data.user });
    } catch (error: any) {
      throw error.response?.data?.message || "Login failed";
    } finally {
      set({ loading: false });
    }
  },

  // ✅ REGISTER
  register: async (username, email, password) => {
    set({ loading: true });
    try {
      const res = await api.post("/auth/register", {
        username,
        email,
        password,
      });

      // backend sends: { message, user }
      set({ user: res.data.user });
    } catch (error: any) {
      throw error.response?.data?.message || "Registration failed";
    } finally {
      set({ loading: false });
    }
  },

  // ✅ LOGOUT
  logout: async () => {
    set({ loading: true });
    try {
      await api.post("/auth/logout");
      set({ user: null });
    } finally {
      set({ loading: false });
    }
  },

  // ✅ GET CURRENT USER (cookie based)
  getCurrentUser: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/auth/get-me");

      // backend should return the user object directly
      set({ user: res.data });
    } catch {
      set({ user: null });
    } finally {
      set({ loading: false });
    }
  },
}));