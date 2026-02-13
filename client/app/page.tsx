"use client";

import { useState } from "react";
import axios from "axios";
import { Product } from "@/types";
import { useEffect } from "react";
import ProductCard from "@/components/product-card";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get("http://localhost:3001/products");
      setProducts(response.data);
    };
    fetchProducts();
  }, []);

  return (
    <main>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
