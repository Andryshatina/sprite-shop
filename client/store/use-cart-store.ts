import { Product } from "@/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CartState {
  cartItems: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  isInCart: (productId: number) => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      addToCart: (product: Product) => {
        const isAlreadyInCart = get().isInCart(product.id);
        if (isAlreadyInCart) {
          return;
        }
        set((state) => ({
          cartItems: [...state.cartItems, product],
        }));
      },
      removeFromCart: (productId: number) => {
        const isAlreadyInCart = get().isInCart(productId);
        if (!isAlreadyInCart) {
          return;
        }
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.id !== productId),
        }));
      },
      clearCart: () => {
        set(() => ({
          cartItems: [],
        }));
      },
      isInCart: (productId: number) => {
        return get().cartItems.some((item) => item.id === productId);
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
