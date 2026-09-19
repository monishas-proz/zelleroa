"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";

async function uploadAttributeImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", "attributes");

  const response = await fetch("/api/admin/upload", {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.message || "Image upload failed");
  }
  return result.data.path as string;
}

/** Small click-to-upload thumbnail used next to a Color value's swatch/hex
 * inputs - upload happens immediately on file select, same pattern as
 * FormImageUpload, just without react-hook-form since callers keep this in
 * plain local state. */
function ColorImagePicker({
  imageUrl,
  onChange,
  disabled,
}: {
  imageUrl?: string | null;
  onChange: (url: string) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setIsUploading(true);
    try {
      const path = await uploadAttributeImage(file);
      onChange(path);
    } catch {
      // Swallow here - parent form error banner covers the add/edit flow;
      // picker just stays empty so the admin notices and retries.
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => !disabled && inputRef.current?.click()}
      disabled={disabled || isUploading}
      title={imageUrl ? "Change photo" : "Add photo"}
      className="relative h-[38px] w-[38px] shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 hover:border-secondary-600 disabled:opacity-50 cursor-pointer"
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFile}
      />
      {isUploading ? (
        <span className="flex h-full w-full items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
        </span>
      ) : imageUrl ? (
        <img src={imageUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <span className="flex h-full w-full items-center justify-center">
          <ImagePlus className="h-4 w-4 text-neutral-400" />
        </span>
      )}
      {imageUrl && !isUploading && (
        <span
          role="button"
          onClick={(e) => {
            e.stopPropagation();
            onChange("");
          }}
          title="Remove photo"
          className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-error-600 text-white"
        >
          <X className="h-2.5 w-2.5" />
        </span>
      )}
    </button>
  );
}

export { ColorImagePicker };
