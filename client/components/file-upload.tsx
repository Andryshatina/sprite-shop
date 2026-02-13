"use client";

import { useCallback, useEffect } from "react";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import { UploadCloud, File, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileWithPreview extends File {
  preview?: string;
}

interface FileUploadProps {
  onChange: (file: File | null) => void;
  value: File | null;
  accept?: DropzoneOptions["accept"];
  className?: string;
  type?: "image" | "file";
}

export function FileUpload({
  onChange,
  value,
  accept,
  className,
  type = "file",
}: FileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        if (type === "image") {
          Object.assign(file, { preview: URL.createObjectURL(file) });
        }
        onChange(file);
      }
    },
    [onChange, type],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    multiple: false,
  });

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  // Derived state for preview URL (attached to the file object)
  const previewUrl = value && (value as FileWithPreview).preview;

  // Effect to revoke object URL on cleanup
  useEffect(() => {
    return () => {
      if (value && (value as FileWithPreview).preview) {
        URL.revokeObjectURL((value as FileWithPreview).preview!);
      }
    };
  }, [value]);

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-muted/50 transition-colors flex flex-col items-center justify-center gap-2 text-center",
        isDragActive ? "border-primary bg-muted" : "border-muted-foreground/25",
        className,
      )}
    >
      <input {...getInputProps()} />

      {value ? (
        <div className="relative flex flex-col items-center gap-2 w-full group">
          {type === "image" && previewUrl ? (
            <div className="relative aspect-video w-full max-w-62.5 overflow-hidden rounded-md border shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Preview"
                className="object-cover w-full h-full"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 p-4 rounded-md border bg-background w-full max-w-sm justify-center shadow-sm">
              <File className="w-8 h-8 text-primary" />
              <div className="grid gap-0.5 text-left">
                <p className="text-sm font-medium truncate max-w-45">
                  {value.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(value.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          )}

          <button
            onClick={removeFile}
            className="absolute -top-2 -right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors shadow-sm"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <>
          <div className="p-4 rounded-full bg-muted shadow-sm">
            {type === "image" ? (
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
            ) : (
              <UploadCloud className="w-8 h-8 text-muted-foreground" />
            )}
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {isDragActive ? "Drop it here!" : "Click or drag to upload"}
            </p>
            <p className="text-xs text-muted-foreground">
              {type === "image" ? "SVG, PNG, JPG or GIF" : "Any file type"}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
