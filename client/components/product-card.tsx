"use client";
import Link from "next/link";
import { Product } from "@/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Eye } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.id}`} className="block h-full">
      <Card className="overflow-hidden h-full flex flex-col pt-0 group hover:border-primary/50 hover:shadow-lg transition-all duration-300">
        <div className="relative aspect-square w-full overflow-hidden bg-muted">
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button
              variant="secondary"
              size="sm"
              className="gap-2 pointer-events-none"
            >
              <Eye className="w-4 h-4" /> View Details
            </Button>
          </div>
        </div>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="line-clamp-1 text-lg group-hover:text-primary transition-colors">
              {product.title}
            </CardTitle>
            {product.isPublished ? (
              <Badge
                variant="outline"
                className="text-xs font-normal border-primary/20 text-primary bg-primary/5"
              >
                Stock
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-xs font-normal">
                Draft
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="grow">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        </CardContent>
        <CardFooter className="pt-0 pb-4">
          <div className="flex w-full items-center justify-between">
            <span className="font-bold text-xl text-foreground">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(product.price / 100)}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

export default ProductCard;
