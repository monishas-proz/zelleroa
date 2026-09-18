"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { styleKeys, itemKeys, variantKeys } from "@/lib/api/query-keys";
import { createAdminStyle, updateAdminStyle, deleteAdminStyle } from "../api/get-styles";

export function useCreateStyle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productUuid,
      data,
    }: {
      productUuid: string;
      data: Record<string, unknown>;
    }) => createAdminStyle(productUuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: styleKeys.all });
    },
  });
}

export function useUpdateStyle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productUuid,
      styleUuid,
      data,
    }: {
      productUuid: string;
      styleUuid: string;
      data: Record<string, unknown>;
    }) => updateAdminStyle(productUuid, styleUuid, data),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: styleKeys.all });
      queryClient.invalidateQueries({ queryKey: styleKeys.detail(variables.styleUuid) });
      // The Style's name/slug/base price feed Item/variant display copy too.
      queryClient.invalidateQueries({ queryKey: itemKeys.all });
      queryClient.invalidateQueries({ queryKey: variantKeys.all });
    },
  });
}

export function useDeleteStyle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productUuid,
      styleUuid,
    }: {
      productUuid: string;
      styleUuid: string;
    }) => deleteAdminStyle(productUuid, styleUuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: styleKeys.all });
      queryClient.invalidateQueries({ queryKey: itemKeys.all });
      queryClient.invalidateQueries({ queryKey: variantKeys.all });
    },
  });
}
