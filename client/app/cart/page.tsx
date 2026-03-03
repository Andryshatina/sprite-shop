"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/use-cart-store";
import { useAuthStore } from "@/store/auth";
import Link from "next/link";
import {
  ArrowLeft,
  ShoppingCart,
  Trash2,
  CreditCard,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCheckout } from "@/hooks/use-checkout";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const { cartItems, clearCart, removeFromCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const { checkout, isLoading, totalPrice } = useCheckout();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    checkout();
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="text-6xl">
          <ShoppingCart className="w-16 h-16 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="text-muted-foreground">
          {`It seems you haven't added anything yet.`}
        </p>
        <Button asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to shopping
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Cart ({cartItems.length})</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: LIST OF PRODUCTS */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-0 flex items-center">
                  {/* Image */}
                  <div className="relative w-24 h-24 md:w-32 md:h-32 bg-muted shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="grow p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{item.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {item.description}
                        </p>
                      </div>
                      <div className="font-bold text-lg">
                        {formatCurrency(item.price)}
                      </div>
                    </div>

                    {/* Delete button */}
                    <div className="mt-4 flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive/80 hover:bg-destructive/5"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Clear all button */}
            <div className="flex justify-end pt-4">
              <Button variant="outline" size="sm" onClick={clearCart}>
                Clear cart
              </Button>
            </div>
          </div>

          {/* RIGHT COLUMN: SUMMARY */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-bold">Total</h2>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Total products
                    </span>
                    <span>{formatCurrency(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxes</span>
                    <span>$0.00</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-xl font-bold">
                  <span>Total to pay</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CreditCard className="mr-2 h-4 w-4" />
                  )}
                  Go to payment
                </Button>

                <p className="text-xs text-center text-muted-foreground/60">
                  Safe payment through Stripe
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
