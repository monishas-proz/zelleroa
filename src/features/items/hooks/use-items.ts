"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { itemKeys } from "@/lib/api/query-keys";
import { getAdminItems, getAdminItem } from "../api/get-items";
import type { GetAdminItemsParams } from "../types";

export function useItems(
  productUuid: string | null,
  styleUuid: string | null,
  params?: GetAdminItemsParams
) {
  return useQuery({
    queryKey: styleUuid
      ? ([...itemKeys.all, "style", styleUuid, params ?? {}] as const)
      : itemKeys.list((params ?? {}) as Record<string, unknown>),
    queryFn: () => getAdminItems(productUuid!, styleUuid!, params),
    enabled: !!productUuid && !!styleUuid,
    placeholderData: keepPreviousData,
  });
}

export function useItem(
  productUuid: string | null,
  styleUuid: string | null,
  itemUuid: string | null
) {
  return useQuery({
    queryKey: itemKeys.detail(itemUuid ?? ""),
    queryFn: () => getAdminItem(productUuid!, styleUuid!, itemUuid!),
    enabled: !!productUuid && !!styleUuid && !!itemUuid,
  });
}
