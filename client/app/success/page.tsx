"use client";

import { useSearchParams } from "next/navigation";
import { useCartStore } from "@/store/use-cart-store";
import { Suspense, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    if (sessionId) {
      clearCart();
    }
  }, [sessionId, clearCart]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
      <CheckCircle2 className="h-20 w-20 text-green-500" />
      <h1 className="text-3xl font-bold text-gray-900">Payment successful!</h1>
      <p className="text-gray-500 text-center max-w-md">
        Thank you for your purchase. Your items will be available for download
        in your library shortly as soon as the payment is processed.
      </p>

      <div className="flex gap-4 pt-4">
        <Link href="/">
          <Button variant="outline">Go to home</Button>
        </Link>
        <Link href="/library">
          <Button>Go to library</Button>
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto pt-20">
        <Card>
          <CardContent className="p-10">
            <Suspense fallback={<div className="text-center">Loading...</div>}>
              <SuccessContent />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
