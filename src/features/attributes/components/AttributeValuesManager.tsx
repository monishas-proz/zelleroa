"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import {
  useAddAttributeValue,
  useUpdateAttributeValue,
  useDeleteAttributeValue,
} from "../hooks";
import type { AttributeListItem } from "../types";

interface AttributeValuesManagerProps {
  attribute: AttributeListItem;
}

function AttributeValuesManager({ attribute }: AttributeValuesManagerProps) {
  const [draft, setDraft] = useState("");
  const [draftPriceAdjustment, setDraftPriceAdjustment] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [editPriceAdjustment, setEditPriceAdjustment] = useState("");

  const addMutation = useAddAttributeValue();
  const updateMutation = useUpdateAttributeValue();
  const deleteMutation = useDeleteAttributeValue();

  const handleAdd = () => {
    const value = draft.trim();
    if (!value) return;
    const priceAdjustment = Number(draftPriceAdjustment);
    addMutation.mutate(
      {
        attributeUuid: attribute.id,
        value,
        priceAdjustment: Number.isFinite(priceAdjustment) ? priceAdjustment : 0,
      },
      {
        onSuccess: () => {
          setDraft("");
          setDraftPriceAdjustment("");
        },
      }
    );
  };

  const startEdit = (id: string, value: string, priceAdjustment: number) => {
    setEditingId(id);
    setEditDraft(value);
    setEditPriceAdjustment(String(priceAdjustment ?? 0));
  };

  const saveEdit = () => {
    if (!editingId || !editDraft.trim()) return;
    const priceAdjustment = Number(editPriceAdjustment);
    updateMutation.mutate(
      {
        attributeUuid: attribute.id,
        valueUuid: editingId,
        value: editDraft.trim(),
        priceAdjustment: Number.isFinite(priceAdjustment) ? priceAdjustment : 0,
      },
      { onSuccess: () => setEditingId(null) }
    );
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-neutral-500">
        These are the selectable options shown for &ldquo;{attribute.name}&rdquo; when adding a
        product (e.g. Red, Blue, Cotton, Silk). The price add-on (₹) is added on top of the
        product&apos;s base price whenever this value is picked (e.g. Size &ldquo;L&rdquo; = +₹50)
        — leave it at 0 if this value shouldn&apos;t change the price.
      </p>

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
          placeholder="e.g. Cotton"
          className="flex-1 min-w-0 rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-secondary-600 focus:ring-2 focus:ring-secondary-600/20"
        />
        <input
          type="number"
          step="any"
          value={draftPriceAdjustment}
          onChange={(e) => setDraftPriceAdjustment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder="+₹ add-on"
          title="Price add-on (₹)"
          className="w-28 shrink-0 rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-secondary-600 focus:ring-2 focus:ring-secondary-600/20"
        />
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
                  <input
                    type="number"
                    step="any"
                    value={editPriceAdjustment}
                    onChange={(e) => setEditPriceAdjustment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        saveEdit();
                      }
                    }}
                    title="Price add-on (₹)"
                    className="w-24 shrink-0 rounded-md border border-secondary-300 px-2 py-1 text-sm outline-none"
                  />
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
                  <span className="text-sm text-neutral-800 flex items-center gap-2">
                    {v.value}
                    {Number(v.priceAdjustment) > 0 && (
                      <span className="text-[11px] font-semibold text-secondary-700 bg-secondary-50 border border-secondary-200 rounded-full px-1.5 py-0.5">
                        +₹{v.priceAdjustment}
                      </span>
                    )}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => startEdit(v.id, v.value, v.priceAdjustment)}
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
