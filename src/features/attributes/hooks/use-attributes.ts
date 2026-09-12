"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { attributeKeys } from "@/lib/api/query-keys";
import { getAdminAttributes, getAdminAttribute, getAttributesForCategory } from "../api/get-attributes";
import type { GetAdminAttributesParams } from "../types";

export function useAdminAttributes(params?: GetAdminAttributesParams) {
  const queryParams: Record<string, string | number | boolean | undefined> = {};
  if (params?.search) queryParams.search = params.search;
  if (params?.page) queryParams.page = params.page;
  if (params?.pageSize) queryParams.pageSize = params.pageSize;
  if (params?.categoryId) queryParams.categoryId = params.categoryId;

  return useQuery({
    queryKey: attributeKeys.list(queryParams),
    queryFn: () => getAdminAttributes(queryParams),
    placeholderData: keepPreviousData,
  });
}

export function useAdminAttribute(uuid: string | null) {
  return useQuery({
    queryKey: attributeKeys.detail(uuid ?? ""),
    queryFn: () => getAdminAttribute(uuid!),
    enabled: !!uuid,
  });
}

export function useAttributesForCategory(categoryUuid: string | null) {
  return useQuery({
    queryKey: [...attributeKeys.all, "by-category", categoryUuid],
    queryFn: () => getAttributesForCategory(categoryUuid!),
    enabled: !!categoryUuid,
  });
}
