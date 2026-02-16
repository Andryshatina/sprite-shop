"use client";

import { useCartStore } from "@/store/use-cart-store";
import Link from "next/link";
import { Package, ShoppingCart } from "lucide-react";

export default function Header() {
  const items = useCartStore((state) => state.cartItems);

  return (
    <header className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Package className="w-6 h-6 mr-2" />
          <span className="text-lg font-bold">Sprite Shop</span>
        </Link>
        <div className="flex items-center">
          <Link href="/cart" className="flex items-center">
            <ShoppingCart className="w-6 h-6 mr-2" />
            {items.length > 0 && (
              <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                {items.length}
              </span>
            )}
          </Link>
          <Link href="/login" className="ml-6 text-lg font-bold">
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}
