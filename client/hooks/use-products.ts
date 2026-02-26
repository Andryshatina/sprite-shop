import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Product } from "@/types";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => api.get<Product[]>("/products").then((res) => res.data),
  });
}

export function useProduct(id: string | string[]) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => api.get<Product>(`/products/${id}`).then((res) => res.data),
    enabled: !!id,
  });
}
