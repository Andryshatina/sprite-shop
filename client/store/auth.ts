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
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
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
        } catch (error) {
          console.error(error);
          set({ token: null, user: null, isAuthenticated: false });
        }
      },
      logout: () => {
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
