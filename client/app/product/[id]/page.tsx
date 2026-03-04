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

  const addToCart = useCartStore((state) => state.addToCart);
  const cartItems = useCartStore((state) => state.cartItems);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm animate-pulse">
          Loading product...
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
          <span className="text-3xl">😕</span>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-1">
            {error ? "Failed to load product" : "Product not found"}
          </h2>
          <p className="text-muted-foreground text-sm">
            The product you&apos;re looking for doesn&apos;t exist or was
            removed.
          </p>
        </div>
        <Button asChild variant="outline" className="gap-2">
          <Link href="/">
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>
        </Button>
      </div>
    );
  }

  const isProductInCart = cartItems.some((item) => item.id === product.id);

  const features = [
    { icon: Download, label: "Instant Download" },
    { icon: Shield, label: "Commercial License" },
    { icon: Layers, label: "Layered Files" },
    { icon: Sparkles, label: "High Quality" },
  ];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground -ml-2 mb-6"
        >
          <Link href="/">
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>
        </Button>

        {/* 
          Grid layout:
          Desktop: [image | sidebar (row-span-2)]
                   [description |]
          Mobile:  image → sidebar → description (via order)
        */}
        <div className="grid lg:grid-cols-[1fr_360px] lg:grid-rows-[auto_1fr] gap-6 xl:gap-8 items-start">
          {/* Image — order 1 on mobile, top-left on desktop */}
          <div className="order-1 lg:row-start-1 lg:col-start-1 relative rounded-2xl overflow-hidden bg-muted border border-border/40 shadow-xl group lg:max-w-[calc(100vh-10rem)]">
            <div className="aspect-square relative">
              <Image
                src={product.imageUrl}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {/* Subtle gradient overlay at bottom */}
              <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Status badge on image */}
            <div className="absolute top-4 left-4">
              <Badge
                variant={product.isPublished ? "default" : "secondary"}
                className="backdrop-blur-sm bg-background/80 text-foreground border border-border/50 shadow-sm"
              >
                {product.isPublished ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                    In Stock
                  </span>
                ) : (
                  "Unavailable"
                )}
              </Badge>
            </div>
          </div>

          {/* Sidebar — order 2 on mobile, right col spanning both rows on desktop */}
          <div className="order-2 lg:row-start-1 lg:row-span-2 lg:col-start-2 lg:sticky lg:top-16 flex flex-col gap-4">
            {/* Title & price card */}
            <div className="rounded-2xl border border-border/40 bg-card shadow-sm p-6 flex flex-col gap-5">
              {/* Title */}
              <div>
                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-widest font-medium">
                  Digital Asset · #{product.id}
                </p>
                <h1 className="text-2xl font-bold tracking-tight text-foreground leading-tight">
                  {product.title}
                </h1>
              </div>

              {/* Divider */}
              <div className="h-px bg-border/60" />

              {/* Price */}
              <div className="flex items-end gap-2">
                <span className="text-4xl font-extrabold text-foreground tracking-tight">
                  {formatCurrency(product.price)}
                </span>
                <span className="text-muted-foreground text-sm mb-1">USD</span>
              </div>

              {/* CTA */}
              <Button
                size="lg"
                className="w-full gap-2 text-base py-6 transition-all duration-300"
                onClick={() => addToCart(product)}
                disabled={isProductInCart || !product.isPublished}
              >
                {isProductInCart ? (
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
                <p className="text-xs text-center text-muted-foreground">
                  This product is currently unavailable.
                </p>
              )}
            </div>

            {/* Features grid */}
            <div className="rounded-2xl border border-border/40 bg-card shadow-sm p-5">
              <div className="grid grid-cols-2 gap-3">
                {features.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2.5 rounded-xl bg-muted/50 px-3 py-2.5 text-sm font-medium text-foreground"
                  >
                    <Icon className="w-4 h-4 text-primary shrink-0" />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Guarantee note */}
            <p className="text-xs text-center text-muted-foreground px-2">
              🔒 Secure checkout via Stripe · All sales final
            </p>
          </div>

          {/* Description — order 3 on mobile, bottom-left on desktop */}
          <div className="order-3 lg:row-start-2 lg:col-start-1 rounded-2xl border border-border/40 bg-card p-6 shadow-sm">
            <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-primary inline-block" />
              About this asset
            </h2>
            <div className="prose prose-zinc dark:prose-invert max-w-none prose-p:text-muted-foreground prose-p:leading-relaxed prose-headings:text-foreground prose-strong:text-foreground">
              <ReactMarkdown>{product.description}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
