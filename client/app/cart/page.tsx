"use client";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/use-cart-store";
import { Link, ArrowLeft, ShoppingCart } from "lucide-react";
import Image from "next/image";

export default function CartPage() {
  const { cartItems, clearCart, removeFromCart } = useCartStore();

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price, 0);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="text-6xl">
          <ShoppingCart className="w-16 h-16 text-gray-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Your cart is empty</h1>
        <p className="text-gray-500">
          {`It seems you haven't added anything yet.`}
        </p>
        <Link href="/">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to shopping
          </Button>
        </Link>
      </div>
    );
  }

  const handleCheckout = () => {
    // TODO: Implement checkout logic
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Your Cart</h1>
        <Button variant="outline" onClick={clearCart}>
          Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            <Image
              src={item.imageUrl}
              alt={item.title}
              className="rounded-lg"
              width={100}
              height={100}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="flex-1">
              <h2 className="text-lg font-bold">{item.title}</h2>
              <p className="text-gray-500">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(item.price / 100)}
              </p>
            </div>
            <Button variant="outline" onClick={() => removeFromCart(item.id)}>
              Remove
            </Button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-8">
        <h2 className="text-2xl font-bold">
          Total:{" "}
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(totalPrice / 100)}
        </h2>
        <Button onClick={handleCheckout}>Checkout</Button>
      </div>
    </div>
  );
}
