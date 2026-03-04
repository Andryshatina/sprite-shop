"use client";

import { useProducts } from "@/hooks/use-products";
import ProductCard from "@/components/product-card";
import { Loader2, Sparkles, Layers, Shield, Zap } from "lucide-react";

const FEATURES = [
  {
    icon: Zap,
    label: "Instant Delivery",
    desc: "Download immediately after purchase",
  },
  {
    icon: Shield,
    label: "Commercial License",
    desc: "Use in personal and commercial projects",
  },
  {
    icon: Layers,
    label: "High Resolution",
    desc: "Every asset in premium quality",
  },
];

export default function Home() {
  const { data: products, isLoading, error } = useProducts();

  return (
    <main className="min-h-screen bg-background">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-border/50 py-24 md:py-36 px-4">
        {/* Background glow blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-150 h-150 rounded-full bg-primary/8 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-primary/5 blur-2xl" />
        </div>

        <div className="container mx-auto text-center relative z-10 space-y-8">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-4 py-1.5 text-sm font-medium text-primary animate-in fade-in slide-in-from-bottom-3 duration-700">
            <Sparkles className="w-3.5 h-3.5" />
            Premium Digital Assets
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[1.05] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Elevate Your{" "}
            <span className="relative inline-block">
              <span className="text-primary">Game</span>
              {/* Underline accent */}
              <span className="absolute -bottom-1 left-0 right-0 h-1 rounded-full bg-primary/30" />
            </span>
          </h1>

          {/* Sub */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            Curated sprites, textures &amp; assets for your next project —
            crafted by professionals, ready to ship.
          </p>

          {/* Feature pills row */}
          <div className="flex flex-wrap justify-center gap-3 pt-2 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
            {FEATURES.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                title={desc}
                className="flex items-center gap-2 rounded-xl border border-border/60 bg-card px-4 py-2 text-sm text-muted-foreground shadow-sm hover:border-primary/30 hover:text-foreground transition-colors cursor-default"
              >
                <Icon className="w-4 h-4 text-primary shrink-0" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Products Grid ── */}
      <section className="container mx-auto px-4 py-14">
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-1">
              Browse
            </p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Featured Assets
            </h2>
          </div>
          {!isLoading && !error && (
            <span className="text-sm text-muted-foreground shrink-0">
              {products?.length ?? 0}{" "}
              {products?.length === 1 ? "item" : "items"}
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-28 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground text-sm animate-pulse">
              Loading assets...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-28 gap-3 text-center rounded-2xl border-2 border-dashed border-destructive/20 bg-destructive/5">
            <p className="text-base font-semibold text-destructive">
              Failed to load products
            </p>
            <p className="text-sm text-muted-foreground">
              Please try refreshing the page.
            </p>
          </div>
        ) : products?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 gap-3 rounded-2xl border-2 border-dashed border-muted">
            <Layers className="w-10 h-10 text-muted-foreground/40" />
            <p className="text-lg font-medium text-muted-foreground">
              No products yet
            </p>
            <p className="text-sm text-muted-foreground">
              Check back later for new inventory.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products?.map((product, index) => (
              <div
                key={product.id}
                className="animate-in fade-in slide-in-from-bottom-6 duration-500 fill-mode-both"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
