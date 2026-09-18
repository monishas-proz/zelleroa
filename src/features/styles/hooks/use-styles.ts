"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { styleKeys } from "@/lib/api/query-keys";
import { getAdminStyles, getAdminStyle, getAdminStyleByUuid, getAdminStyleList } from "../api/get-styles";
import type { GetAdminStylesParams } from "../types";

export function useStyles(
  productUuid: string | null,
  params?: GetAdminStylesParams
) {
  return useQuery({
    queryKey: productUuid
      ? ([...styleKeys.all, "product", productUuid, params ?? {}] as const)
      : styleKeys.list((params ?? {}) as Record<string, unknown>),
    queryFn: () => getAdminStyles(productUuid!, params),
    enabled: !!productUuid,
    placeholderData: keepPreviousData,
  });
}

export function useStyle(productUuid: string | null, styleUuid: string | null) {
  return useQuery({
    queryKey: styleKeys.detail(styleUuid ?? ""),
    queryFn: () => getAdminStyle(productUuid!, styleUuid!),
    enabled: !!productUuid && !!styleUuid,
  });
}

export function useStyleByUuid(styleUuid: string | null) {
  return useQuery({
    queryKey: styleKeys.detail(styleUuid ?? ""),
    queryFn: () => getAdminStyleByUuid(styleUuid!),
    enabled: !!styleUuid,
  });
}

export function useStyleList(params?: GetAdminStylesParams) {
  return useQuery({
    queryKey: styleKeys.list((params ?? {}) as Record<string, unknown>),
    queryFn: () => getAdminStyleList(params),
    placeholderData: keepPreviousData,
  });
}
