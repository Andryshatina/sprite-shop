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

export default function CreateProductPage() {
  return (
    <div className="flex min-h-screen bg-gray-50 items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Create Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                name="title"
                placeholder="Title"
                required
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
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                name="price"
                min={0}
                placeholder="Price"
                required
              />
            </div>
            <Field>
              <FieldLabel>Preview Image</FieldLabel>
              <FieldContent>
                <Input
                  id="previewImage"
                  type="file"
                  name="previewImage"
                  required
                />
              </FieldContent>
              <FieldDescription>
                Upload a preview image for the product
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel>Product File</FieldLabel>
              <FieldContent>
                <Input
                  id="productFile"
                  type="file"
                  name="productFile"
                  required
                />
              </FieldContent>
              <FieldDescription>
                Upload a product file for the product
              </FieldDescription>
            </Field>
            <Button type="submit" className="w-full">
              Create Product
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
