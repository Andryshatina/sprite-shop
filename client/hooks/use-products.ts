import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Product } from "@/types";

interface PaginatedProducts {
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: () =>
      api.get<PaginatedProducts>("/products").then((res) => res.data.data),
  });
}

export function useProduct(id: string | string[]) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => api.get<Product>(`/products/${id}`).then((res) => res.data),
    enabled: !!id,
  });
}
