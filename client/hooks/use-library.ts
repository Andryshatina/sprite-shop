import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Product } from "@/types";

export function useLibrary() {
  return useQuery({
    queryKey: ["library"],
    queryFn: () =>
      api.get<Product[]>("/products/library").then((res) => res.data),
  });
}
