"use client";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

interface AuthResponse {
  access_token: string;
}

export function useLogin() {
  const { login } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      api.post<AuthResponse>("/auth/login", data).then((res) => res.data),
    onSuccess: (data) => {
      login(data.access_token);
      router.push("/");
    },
  });
}

export function useRegister() {
  const { login } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: { name: string; email: string; password: string }) =>
      api.post<AuthResponse>("/auth/register", data).then((res) => res.data),
    onSuccess: (data) => {
      login(data.access_token);
      router.push("/");
    },
  });
}

export function useCreateProduct() {
  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      price: number;
      imageKey: string;
      fileKey: string;
    }) => {
      return api.post("/products", data).then((res) => res.data);
    },
  });
}

export function getErrorMessage(error: Error | null, fallback: string): string {
  if (!error) return fallback;
  const axiosError = error as AxiosError<{ message: string }>;
  return axiosError.response?.data?.message || fallback;
}
