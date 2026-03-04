"use client";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLibrary } from "@/hooks/use-library";
import { Download, Loader2, Lock, Package } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import api from "@/lib/axios";

export default function LibraryPage() {
  const { isAuthenticated, user, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const { data: products, isLoading, error } = useLibrary();
  const [downloading, setDownloading] = useState<number | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, _hasHydrated, router]);

  const handleDownload = async (id: number) => {
    try {
      setDownloading(id);
      setDownloadError(null);
      const { data } = await api.get(`/products/${id}/download`);
      if (data.url) {
        const link = document.createElement("a");
        link.href = data.url;
        link.setAttribute("download", "");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch {
      setDownloadError("Failed to download product");
    } finally {
      setDownloading(null);
    }
  };

  if (!_hasHydrated || isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading your library...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center gap-3 border-b pb-4">
          <Package className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Library</h1>
            <p className="text-muted-foreground">
              Hello, {user?.email}! Here are all your purchases.
            </p>
          </div>
        </div>

        {error && (
          <div className="text-center py-6 text-destructive bg-destructive/5 rounded-lg border border-destructive/20">
            <p className="text-lg font-medium">Failed to load library</p>
          </div>
        )}

        {downloadError && (
          <div className="text-center py-4 text-destructive bg-destructive/5 rounded-lg border border-destructive/20">
            <p className="text-sm">{downloadError}</p>
          </div>
        )}

        {!error && products?.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-lg border border-dashed">
            <Lock className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-muted-foreground">
              Your library is empty
            </h2>
            <p className="text-muted-foreground/70 mb-6">
              Time to find something cool in our store!
            </p>
            <Link href="/">
              <Button>Go to catalog</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products?.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow border-primary/10"
              >
                <div className="relative w-full h-48 bg-muted">
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <CardHeader className="p-4 pb-0">
                  <h3
                    className="font-bold text-lg line-clamp-1"
                    title={product.title}
                  >
                    {product.title}
                  </h3>
                </CardHeader>

                <CardContent className="p-4 grow">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                </CardContent>

                <CardFooter className="p-4 pt-0 mt-auto">
                  <Button
                    className="w-full"
                    onClick={() => handleDownload(product.id)}
                    disabled={downloading === product.id}
                  >
                    {downloading === product.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="mr-2 h-4 w-4" />
                    )}
                    {downloading === product.id ? "Generating..." : "Download"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
