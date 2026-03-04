import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Product } from "@/types";
import { useAuthStore } from "@/store/auth";

export function useLibrary() {
  const { isAuthenticated, _hasHydrated } = useAuthStore();

  return useQuery({
    queryKey: ["library"],
    queryFn: () =>
      api.get<Product[]>("/products/library").then((res) => res.data),
    enabled: _hasHydrated && isAuthenticated,
  });
}
