"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import api from "@/lib/axios";
import { FileUpload } from "@/components/file-upload";
import { useState, useEffect } from "react";
import { useCreateProduct, getErrorMessage } from "@/hooks/use-auth";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreateProductPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [previewImage, setPreviewImage] = useState<File | null>(null);
  const [productFile, setProductFile] = useState<File | null>(null);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [isAuthenticated, user, router]);

  const createProductMutation = useCreateProduct();

  const uploadToR2 = async (file: File, isPrivate: boolean) => {
    const {
      data: { uploadUrl, fileKey },
    } = await api.post("/r2/upload-url", {
      fileName: file.name,
      contentType: file.type,
      isPrivate,
    });


    const response = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to upload file to R2");
    }

    return fileKey;
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();


    if (!previewImage || !productFile) {
      toast.error("Please upload both a preview image and a product file");
      return;
    }

    try {
      const previewImageKey = await uploadToR2(previewImage, false);
      const productFileKey = await uploadToR2(productFile, true);

      await createProductMutation.mutateAsync({
        title,
        description,
        price: Number(price) * 100,
        imageKey: previewImageKey,
        fileKey: productFileKey,
      });

      toast.success("Product created successfully!");
      setTitle("");
      setDescription("");
      setPrice("");
      setPreviewImage(null);
      setProductFile(null);
    } catch {
      toast.error(getErrorMessage(createProductMutation.error, "Failed to create product"));
    }
  };


  return (
    <div className="flex min-h-screen bg-background items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Create Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                name="title"
                placeholder="Title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Markdown)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Product description — supports **Markdown** formatting"
                required
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                name="price"
                min={0}
                placeholder="Price in $"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <Field>
              <FieldLabel>Preview Image</FieldLabel>
              <FieldContent>
                <FileUpload
                  value={previewImage}
                  onChange={setPreviewImage}
                  type="image"
                  accept={{ "image/*": [] }}
                />
              </FieldContent>
              <FieldDescription>
                Upload a preview image for the product
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel>Product File</FieldLabel>
              <FieldContent>
                <FileUpload
                  value={productFile}
                  onChange={setProductFile}
                  type="file"
                />
              </FieldContent>
              <FieldDescription>
                Upload a product file for the product
              </FieldDescription>
            </Field>

            <Button
              type="submit"
              className="w-full"
              disabled={createProductMutation.isPending}
            >
              {createProductMutation.isPending
                ? "Creating..."
                : "Create Product"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
