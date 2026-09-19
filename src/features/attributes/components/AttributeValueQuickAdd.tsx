"use client";

import { useState } from "react";
import { Plus, Loader2, X } from "lucide-react";
import { useAddAttributeValue } from "../hooks";
import type { AttributeType } from "../types";
import { ColorImagePicker } from "./ColorImagePicker";

const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;

interface AttributeValueQuickAddProps {
  /** Attribute UUID the new value belongs to. */
  attributeUuid: string;
  /** Attribute name, used for the trigger label ("+ Add Color"). */
  attributeName: string;
  type: AttributeType;
  disabled?: boolean;
  /** Fired with the created value's UUID so the caller can pre-select it. */
  onAdded?: (valueId: string | null) => void;
}

/**
 * Inline "add a missing value" form - the same name / hex / image fields the
 * Attributes page offers in its values list, dropped straight into the Add Item
 * flow so an admin never has to leave the modal to create a Colour that isn't
 * on the list yet.
 */
function AttributeValueQuickAdd({
  attributeUuid,
  attributeName,
  type,
  disabled,
  onAdded,
}: AttributeValueQuickAddProps) {
  const isColor = type === "color";
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");
  const [colorHex, setColorHex] = useState("#000000");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const addMutation = useAddAttributeValue();

  const reset = () => {
    setValue("");
    setColorHex("#000000");
    setImageUrl("");
    setError(null);
  };

  const close = () => {
    setIsOpen(false);
    reset();
  };

  const handleAdd = () => {
    const trimmed = value.trim();
    if (!trimmed) {
      setError(`Enter a ${attributeName.toLowerCase()} name`);
      return;
    }
    if (isColor && !HEX_COLOR_REGEX.test(colorHex)) {
      setError("Enter a valid color code, e.g. #000000");
      return;
    }
    setError(null);
    addMutation.mutate(
      {
        attributeUuid,
        value: trimmed,
        ...(isColor ? { colorHex } : {}),
        ...(isColor && imageUrl ? { imageUrl } : {}),
      },
      {
        onSuccess: (attribute) => {
          const created =
            attribute?.values?.find((v) => v.value.toLowerCase() === trimmed.toLowerCase()) ?? null;
          onAdded?.(created?.id ?? null);
          close();
        },
        onError: (err) =>
          setError(err instanceof Error ? err.message : `Failed to add ${attributeName}`),
      }
    );
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-secondary-600 hover:text-secondary-700 disabled:opacity-50 cursor-pointer"
      >
        <Plus className="h-3 w-3" />
        Add {attributeName}
      </button>
    );
  }

  return (
    <div className="mt-2 rounded-lg border border-neutral-200 bg-neutral-50/60 p-2.5 space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          autoFocus
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
            if (e.key === "Escape") close();
          }}
          placeholder={isColor ? "e.g. Navy Blue" : `e.g. new ${attributeName.toLowerCase()}`}
          className="flex-1 min-w-0 rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-secondary-600 focus:ring-2 focus:ring-secondary-600/20"
        />
        {isColor && (
          <>
            <input
              type="color"
              value={colorHex}
              onChange={(e) => setColorHex(e.target.value)}
              title="Color swatch"
              className="h-[38px] w-10 shrink-0 cursor-pointer rounded-lg border border-neutral-200 p-1"
            />
            <input
              type="text"
              value={colorHex}
              onChange={(e) => setColorHex(e.target.value)}
              placeholder="#000000"
              title="Color hex code"
              className="w-24 shrink-0 rounded-lg border border-neutral-200 px-2 py-2 text-sm font-mono outline-none focus:border-secondary-600 focus:ring-2 focus:ring-secondary-600/20"
            />
            <ColorImagePicker
              imageUrl={imageUrl}
              onChange={setImageUrl}
              disabled={addMutation.isPending}
            />
          </>
        )}
        <button
          type="button"
          onClick={handleAdd}
          disabled={addMutation.isPending}
          className="inline-flex items-center gap-1 rounded-lg bg-secondary-600 px-3 py-2 text-sm font-medium text-white hover:bg-secondary-700 disabled:opacity-50 cursor-pointer"
        >
          {addMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Add
        </button>
        <button
          type="button"
          onClick={close}
          disabled={addMutation.isPending}
          title="Cancel"
          className="rounded-lg p-2 text-neutral-400 hover:text-neutral-700 disabled:opacity-50 cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      {error && <p className="text-xs font-medium text-error-600">{error}</p>}
    </div>
  );
}

export { AttributeValueQuickAdd };
