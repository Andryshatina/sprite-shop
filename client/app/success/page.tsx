"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCartStore } from "@/store/use-cart-store";
import { Suspense, useEffect, useState } from "react";
import api from "@/lib/axios";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const router = useRouter();
  const clearCart = useCartStore((state) => state.clearCart);

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  useEffect(() => {
    if (sessionId) {
      const verifyOrder = async () => {
        try {
          const response = await api.post(`/orders/${sessionId}/verify`);
          if (response.data.success) {
            setStatus("success");
            clearCart();
          }
        } catch (error) {
          console.error(error);
          setStatus("error");
        }
      };
      verifyOrder();
    }
  }, [sessionId, clearCart, router]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <h2 className="text-xl font-semibold">Loading...</h2>
        <p className="text-gray-500">Please do not close the page.</p>
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <XCircle className="h-16 w-16 text-red-500" />
        <h2 className="text-2xl font-bold">Payment Error</h2>
        <p className="text-gray-500">We were unable to verify your payment.</p>
        <Button onClick={() => router.push("/cart")}>Go back to cart</Button>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
      <CheckCircle2 className="h-20 w-20 text-green-500" />
      <h1 className="text-3xl font-bold text-gray-900">Payment successful!</h1>
      <p className="text-gray-500 text-center max-w-md">
        Thank you for your purchase. Your items are now available for download
        in your library.
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
