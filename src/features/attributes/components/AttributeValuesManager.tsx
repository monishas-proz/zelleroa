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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");

  const addMutation = useAddAttributeValue();
  const updateMutation = useUpdateAttributeValue();
  const deleteMutation = useDeleteAttributeValue();

  const handleAdd = () => {
    const value = draft.trim();
    if (!value) return;
    addMutation.mutate(
      { attributeUuid: attribute.id, value },
      { onSuccess: () => setDraft("") }
    );
  };

  const startEdit = (id: string, value: string) => {
    setEditingId(id);
    setEditDraft(value);
  };

  const saveEdit = () => {
    if (!editingId || !editDraft.trim()) return;
    updateMutation.mutate(
      { attributeUuid: attribute.id, valueUuid: editingId, value: editDraft.trim() },
      { onSuccess: () => setEditingId(null) }
    );
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-neutral-500">
        These are the selectable options shown for &ldquo;{attribute.name}&rdquo; when adding a
        product (e.g. Red, Blue, Cotton, Silk).
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
                  <span className="text-sm text-neutral-800">{v.value}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => startEdit(v.id, v.value)}
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
