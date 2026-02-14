"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ShoppingCart, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Assuming the API supports fetching by ID:
        const response = await axios.get(
          `http://localhost:3001/products/${id}`,
        );
        setProduct(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-xl text-destructive mb-4">
          {error || "Product not found"}
        </h2>
        <Button asChild variant="outline">
          <Link href="/">Back to Shop</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
      <Button
        asChild
        variant="ghost"
        className="mb-6 hover:bg-transparent hover:text-primary p-0"
      >
        <Link href="/" className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </Link>
      </Button>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Product Image */}
        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-muted border border-border/50 shadow-sm">
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-cover transition-all hover:scale-105 duration-500"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant={product.isPublished ? "default" : "secondary"}>
                {product.isPublished ? "In Stock" : "Unavailable"}
              </Badge>
              {/* Added a placeholder category/tag if available, otherwise just ID for dev */}
              <span className="text-xs text-muted-foreground">
                ID: {product.id}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
              {product.title}
            </h1>

            <p className="text-2xl md:text-3xl font-bold text-primary">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(product.price / 100)}
            </p>
          </div>

          <div className="prose prose-zinc dark:prose-invert max-w-none">
            <p className="text-muted-foreground text-lg leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <Button
              size="lg"
              className="flex-1 w-full md:w-auto text-lg py-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
            >
              <ShoppingCart className="mr-2 w-5 h-5" />
              Add to Cart
            </Button>
            {/* Add more actions if needed, like wishlist */}
          </div>

          <Card className="p-4 bg-muted/30 border-none mt-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground block mb-1">
                  Delivery
                </span>
                <span className="font-medium">Instant Download</span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">
                  License
                </span>
                <span className="font-medium">Personal & Commercial</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
