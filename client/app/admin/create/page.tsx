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
import axios from "axios";
import { FileUpload } from "@/components/file-upload";
import { useState } from "react";

export default function CreateProductPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [previewImage, setPreviewImage] = useState<File | null>(null);
  const [productFile, setProductFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const uploadToR2 = async (file: File, isPrivate: boolean, token: string) => {
    const {
      data: { uploadUrl, fileKey },
    } = await axios.post(
      "http://localhost:3001/r2/upload-url",
      {
        fileName: file.name,
        contentType: file.type,
        isPrivate,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    await axios.put(uploadUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
    });

    return fileKey;
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You are not authorized to create a product");
        return;
      }

      if (!previewImage || !productFile) {
        setError("Please upload both a preview image and a product file");
        return;
      }

      const previewImageKey = await uploadToR2(previewImage, false, token);
      const productFileKey = await uploadToR2(productFile, true, token);

      const response = await axios.post(
        "http://localhost:3001/products",
        {
          title,
          description,
          price: Number(price) * 100,
          imageKey: previewImageKey,
          fileKey: productFileKey,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(response);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 items-center justify-center p-4">
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
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create Product"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
