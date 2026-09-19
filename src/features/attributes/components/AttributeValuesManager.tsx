"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import {
  useAddAttributeValue,
  useUpdateAttributeValue,
  useDeleteAttributeValue,
} from "../hooks";
import type { AttributeListItem } from "../types";
import { ColorImagePicker } from "./ColorImagePicker";

interface AttributeValuesManagerProps {
  attribute: AttributeListItem;
}

const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;

function AttributeValuesManager({ attribute }: AttributeValuesManagerProps) {
  const isColor = attribute.type === "color";
  const [draft, setDraft] = useState("");
  const [draftColorHex, setDraftColorHex] = useState("#000000");
  const [draftImageUrl, setDraftImageUrl] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [editColorHex, setEditColorHex] = useState("#000000");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const addMutation = useAddAttributeValue();
  const updateMutation = useUpdateAttributeValue();
  const deleteMutation = useDeleteAttributeValue();

  const handleAdd = () => {
    const value = draft.trim();
    if (!value) return;
    if (isColor && !HEX_COLOR_REGEX.test(draftColorHex)) {
      setFormError("Enter a valid color code, e.g. #000000");
      return;
    }
    setFormError(null);
    addMutation.mutate(
      {
        attributeUuid: attribute.id,
        value,
        ...(isColor ? { colorHex: draftColorHex } : {}),
        ...(isColor && draftImageUrl ? { imageUrl: draftImageUrl } : {}),
      },
      {
        onSuccess: () => {
          setDraft("");
          setDraftColorHex("#000000");
          setDraftImageUrl("");
        },
        onError: (err) => setFormError(err instanceof Error ? err.message : "Failed to add value"),
      }
    );
  };

  const startEdit = (
    id: string,
    value: string,
    colorHex?: string | null,
    imageUrl?: string | null
  ) => {
    setEditingId(id);
    setEditDraft(value);
    setEditColorHex(colorHex || "#000000");
    setEditImageUrl(imageUrl || "");
    setFormError(null);
  };

  const saveEdit = () => {
    if (!editingId || !editDraft.trim()) return;
    if (isColor && !HEX_COLOR_REGEX.test(editColorHex)) {
      setFormError("Enter a valid color code, e.g. #000000");
      return;
    }
    setFormError(null);
    updateMutation.mutate(
      {
        attributeUuid: attribute.id,
        valueUuid: editingId,
        value: editDraft.trim(),
        ...(isColor ? { colorHex: editColorHex, imageUrl: editImageUrl } : {}),
      },
      {
        onSuccess: () => setEditingId(null),
        onError: (err) => setFormError(err instanceof Error ? err.message : "Failed to update value"),
      }
    );
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-neutral-500">
        {isColor ? (
          <>
            These are the selectable colors shown for &ldquo;{attribute.name}&rdquo;. Enter the
            color name and its hex code once here — items will pick from this list, they
            won&apos;t need to enter the code again.
          </>
        ) : (
          <>
            These are the selectable options shown for &ldquo;{attribute.name}&rdquo; when adding
            a product (e.g. Red, Blue, Cotton, Silk).
          </>
        )}
      </p>

      {formError && <p className="text-xs font-medium text-error-600">{formError}</p>}

      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder={isColor ? "e.g. Navy Blue" : "e.g. Cotton"}
          className="flex-1 min-w-0 rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-secondary-600 focus:ring-2 focus:ring-secondary-600/20"
        />
        {isColor && (
          <>
            <input
              type="color"
              value={draftColorHex}
              onChange={(e) => setDraftColorHex(e.target.value)}
              title="Color swatch"
              className="h-[38px] w-10 shrink-0 cursor-pointer rounded-lg border border-neutral-200 p-1"
            />
            <input
              type="text"
              value={draftColorHex}
              onChange={(e) => setDraftColorHex(e.target.value)}
              placeholder="#000000"
              title="Color hex code"
              className="w-24 shrink-0 rounded-lg border border-neutral-200 px-2 py-2 text-sm font-mono outline-none focus:border-secondary-600 focus:ring-2 focus:ring-secondary-600/20"
            />
            <ColorImagePicker
              imageUrl={draftImageUrl}
              onChange={setDraftImageUrl}
              disabled={addMutation.isPending}
            />
          </>
        )}
        <button
          type="button"
          onClick={handleAdd}
          disabled={addMutation.isPending}
          className="inline-flex items-center gap-1 rounded-lg bg-secondary-600 px-3 py-2 text-sm font-medium text-white hover:bg-secondary-700 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>

      <div className="max-h-64 overflow-y-auto rounded-lg border border-neutral-200 divide-y divide-neutral-100">
        {attribute.values.length === 0 ? (
          <p className="px-3 py-4 text-center text-sm text-neutral-400">
            No values yet. Add one above.
          </p>
        ) : (
          attribute.values.map((v) => (
            <div key={v.id} className="flex items-center justify-between gap-2 px-3 py-2">
              {editingId === v.id ? (
                <>
                  <input
                    type="text"
                    value={editDraft}
                    autoFocus
                    onChange={(e) => setEditDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        saveEdit();
                      }
                    }}
                    className="flex-1 min-w-0 rounded-md border border-secondary-300 px-2 py-1 text-sm outline-none"
                  />
                  {isColor && (
                    <>
                      <input
                        type="color"
                        value={editColorHex}
                        onChange={(e) => setEditColorHex(e.target.value)}
                        title="Color swatch"
                        className="h-[30px] w-9 shrink-0 cursor-pointer rounded-md border border-secondary-300 p-0.5"
                      />
                      <input
                        type="text"
                        value={editColorHex}
                        onChange={(e) => setEditColorHex(e.target.value)}
                        title="Color hex code"
                        className="w-20 shrink-0 rounded-md border border-secondary-300 px-2 py-1 text-sm font-mono outline-none"
                      />
                      <ColorImagePicker
                        imageUrl={editImageUrl}
                        onChange={setEditImageUrl}
                        disabled={updateMutation.isPending}
                      />
                    </>
                  )}
                  <button type="button" onClick={saveEdit} className="text-success-600 p-1">
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="text-neutral-400 p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <span className="text-sm text-neutral-800 flex items-center gap-2 min-w-0">
                    {isColor && v.imageUrl ? (
                      <img
                        src={v.imageUrl}
                        alt=""
                        className="h-6 w-6 shrink-0 rounded-md border border-neutral-200 object-cover"
                      />
                    ) : (
                      isColor &&
                      v.colorHex && (
                        <span
                          className="h-4 w-4 shrink-0 rounded-full border border-neutral-200"
                          style={{ backgroundColor: v.colorHex }}
                          title={v.colorHex}
                        />
                      )
                    )}
                    <span className="truncate">{v.value}</span>
                    {isColor && v.colorHex && (
                      <span className="text-[11px] font-mono text-neutral-400 shrink-0">
                        {v.colorHex}
                      </span>
                    )}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => startEdit(v.id, v.value, v.colorHex, v.imageUrl)}
                      className="p-1 text-neutral-400 hover:text-secondary-600"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        deleteMutation.mutate({ attributeUuid: attribute.id, valueUuid: v.id })
                      }
                      className="p-1 text-neutral-400 hover:text-error-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export { AttributeValuesManager };
