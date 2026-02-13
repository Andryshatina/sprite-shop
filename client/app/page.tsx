"use client";

import { useState } from "react";
import axios from "axios";
import { Product } from "@/types";
import { useEffect } from "react";
import ProductCard from "@/components/product-card";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3001/products");
        setProducts(response.data);
      } catch (error) {
        console.error(error);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <main>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">Error: {error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
