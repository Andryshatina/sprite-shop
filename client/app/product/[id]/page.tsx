"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useProduct } from "@/hooks/use-products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ShoppingCart,
  Loader2,
  Download,
  Shield,
  Layers,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/use-cart-store";
import { formatCurrency } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

export default function ProductPage() {
  const { id } = useParams();
  const { data: product, isLoading, error } = useProduct(id as string);

  const addToCart = useCartStore((s) => s.addToCart);
  const cartItems = useCartStore((s) => s.cartItems);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading product…</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 px-4 text-center">
        <div>
          <h2 className="text-lg font-semibold mb-1">
            {error ? "Failed to load product" : "Product not found"}
          </h2>
          <p className="text-sm text-muted-foreground">
            The product you&apos;re looking for doesn&apos;t exist or was
            removed.
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="gap-2">
          <Link href="/">
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>
        </Button>
      </div>
    );
  }

  const isInCart = cartItems.some((item) => item.id === product.id);

  const features = [
    { icon: Download, label: "Instant Download" },
    { icon: Shield, label: "Commercial License" },
    { icon: Layers, label: "Layered Files" },
    { icon: Sparkles, label: "High Quality" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground hover:text-foreground -ml-2 mb-8"
        >
          <Link href="/">
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>
        </Button>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8 xl:gap-12 items-start">
          <div className="relative rounded-2xl overflow-hidden bg-muted aspect-square w-full">
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 55vw"
              priority
            />
            <div className="absolute top-3 left-3">
              <Badge
                variant={product.isPublished ? "default" : "secondary"}
                className="bg-background/80 backdrop-blur-sm text-foreground border border-border/40 text-xs font-medium"
              >
                {product.isPublished ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                    In Stock
                  </span>
                ) : (
                  "Unavailable"
                )}
              </Badge>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:sticky lg:top-20 lg:col-start-2 lg:row-start-1 lg:row-span-2">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
              Digital Asset · #{product.id}
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-foreground leading-snug">
              {product.title}
            </h1>

            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-4xl font-extrabold tracking-tight text-foreground">
                {formatCurrency(product.price)}
              </span>
              <span className="text-sm text-muted-foreground">USD</span>
            </div>

            <Button
              size="lg"
              className="w-full gap-2 h-12 text-base mt-1"
              onClick={() => addToCart(product)}
              disabled={isInCart || !product.isPublished}
            >
              {isInCart ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </>
              )}
            </Button>

            {!product.isPublished && (
              <p className="text-xs text-center text-muted-foreground -mt-1">
                This product is currently unavailable.
              </p>
            )}

            <div className="h-px bg-border/50 my-1" />

            <div className="grid grid-cols-2 gap-2">
              {features.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-2.5 text-sm font-medium text-foreground"
                >
                  <Icon className="w-4 h-4 text-primary shrink-0" />
                  {label}
                </div>
              ))}
            </div>

            <p className="text-xs text-center text-muted-foreground pt-1">
              🔒 Secure checkout via Stripe · All sales final
            </p>
          </div>

          <div className="rounded-2xl border border-border/40 bg-card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              About this asset
            </h2>
            <div className="prose prose-zinc dark:prose-invert max-w-none prose-p:text-muted-foreground prose-p:leading-relaxed prose-headings:text-foreground prose-strong:text-foreground text-sm">
              <ReactMarkdown>{product.description}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
