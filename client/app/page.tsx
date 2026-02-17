"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Product } from "@/types";
import ProductCard from "@/components/product-card";
import { Loader2, Sparkles } from "lucide-react";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await api.get("/products");
        setProducts(response.data);
      } catch (error) {
        console.error(error);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 md:py-32 bg-secondary/30 border-b overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent pointer-events-none" />
        <div className="container mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary/10 text-primary mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700 border border-primary/20">
            <Sparkles className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Premium Digital Assets</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
            Elevate Your <span className="text-primary">Game</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 leading-relaxed">
            Discover high-quality sprites, textures, and models for your next
            project. Curated by professionals for professionals.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Featured Assets</h2>
          {/* Filter controls can go here */}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading assets...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-destructive bg-destructive/5 rounded-lg border border-destructive/20 relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-lg font-medium mb-1">Error Loading Products</p>
              <p className="text-sm opacity-80">{error}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="animate-in fade-in slide-in-from-bottom-8 duration-500 fill-mode-both"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="text-center py-32 border-2 border-dashed border-muted rounded-xl">
            <p className="text-xl text-muted-foreground">No products found.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Check back later for new inventory.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
