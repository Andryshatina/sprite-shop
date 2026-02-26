import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useCartStore } from "@/store/use-cart-store";

interface CheckoutResult {
  url: string;
}

export function useCheckout() {
  const cartItems = useCartStore((state) => state.cartItems);

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price, 0);

  const mutation = useMutation({
    mutationFn: async (productIds: number[]) => {
      const order = await api.post("/orders", { productIds });
      const session = await api.post<CheckoutResult>(
        `/orders/${order.data.id}/checkout`,
      );

      if (!session.data.url) {
        throw new Error("Checkout session not created");
      }

      return session.data.url;
    },
    onSuccess: (url) => {
      window.location.href = url;
    },
  });

  const checkout = () => {
    mutation.mutate(cartItems.map((item) => item.id));
  };

  return {
    checkout,
    isLoading: mutation.isPending,
    error: mutation.error,
    totalPrice,
  };
}
