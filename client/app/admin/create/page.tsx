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
import { Label } from "@/components/ui/label";
import api from "@/lib/axios";
import { FileUpload } from "@/components/file-upload";
import { useState, useEffect } from "react";
import { useCreateProduct, getErrorMessage } from "@/hooks/use-auth";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";

export default function CreateProductPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [previewImage, setPreviewImage] = useState<File | null>(null);
  const [productFile, setProductFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState("");

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

    await api.put(uploadUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
      baseURL: "",
    });

    return fileKey;
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploadError("");

    if (!previewImage || !productFile) {
      setUploadError("Please upload both a preview image and a product file");
      return;
    }

    try {
      const previewImageKey = await uploadToR2(previewImage, false);
      const productFileKey = await uploadToR2(productFile, true);

      createProductMutation.mutate({
        title,
        description,
        price: Number(price) * 100,
        imageKey: previewImageKey,
        fileKey: productFileKey,
      });
    } catch {
      setUploadError("Failed to upload files");
    }
  };

  const errorMessage =
    uploadError ||
    (createProductMutation.isError
      ? getErrorMessage(createProductMutation.error, "Something went wrong")
      : "");

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
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                type="text"
                name="description"
                placeholder="Description"
                required
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
            {errorMessage && (
              <div className="text-destructive text-sm text-center">
                {errorMessage}
              </div>
            )}
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
