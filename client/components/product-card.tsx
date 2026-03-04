"use client";
import Link from "next/link";
import { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.id}`} className="block h-full group">
      <div className="overflow-hidden h-full flex flex-col rounded-2xl border border-border/50 bg-card shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300">
        {/* Image */}
        <div className="relative aspect-square w-full overflow-hidden bg-muted shrink-0">
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="flex items-center gap-1.5 text-white text-sm font-medium translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              View Details
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          {/* Status badge */}
          <div className="absolute top-3 left-3">
            {product.isPublished ? (
              <Badge className="text-[10px] font-semibold backdrop-blur-sm bg-background/80 text-foreground border border-border/50 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block mr-1.5" />
                In Stock
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="text-[10px] backdrop-blur-sm bg-background/80"
              >
                Draft
              </Badge>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-1.5 p-4 grow">
          <h3 className="font-semibold text-base leading-snug line-clamp-1 text-foreground group-hover:text-primary transition-colors duration-200">
            {product.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed grow">
            {product.description}
          </p>
        </div>

        {/* Footer */}
        <div className="px-4 pb-4 pt-0 flex items-center justify-between">
          <span className="text-lg font-bold text-foreground">
            {formatCurrency(product.price)}
          </span>
          <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors duration-200 font-medium">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
