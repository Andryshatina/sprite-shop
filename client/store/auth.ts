import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";

interface User {
  id: number;
  email: string;
  name: string;
  role: "ADMIN" | "USER";
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (token) => {
        try {
          const decoded: {
            sub: number;
            email: string;
            name: string;
            role: "ADMIN" | "USER";
          } = jwtDecode(token);
          set({
            token,
            user: {
              id: decoded.sub,
              email: decoded.email,
              name: decoded.name,
              role: decoded.role,
            },
            isAuthenticated: true,
          });
          localStorage.setItem("token", token);
        } catch (error) {
          console.error(error);
          set({ token: null, user: null, isAuthenticated: false });
        }
      },
      logout: () => {
        set({ token: null, user: null, isAuthenticated: false });
        localStorage.removeItem("token");
      },
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
