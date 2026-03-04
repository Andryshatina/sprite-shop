"use client";

import { XCircle, ShoppingCart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-3xl mx-auto pt-20">
        <Card>
          <CardContent className="p-10">
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center">
                  <XCircle className="h-12 w-12 text-destructive" />
                </div>
              </div>

              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">Payment cancelled</h1>
                <p className="text-muted-foreground max-w-md">
                  No worries — your cart is still saved. You can go back and
                  complete your purchase whenever you&apos;re ready.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button asChild variant="outline" className="gap-2">
                  <Link href="/">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Shop
                  </Link>
                </Button>
                <Button asChild className="gap-2">
                  <Link href="/cart">
                    <ShoppingCart className="w-4 h-4" />
                    Return to Cart
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
