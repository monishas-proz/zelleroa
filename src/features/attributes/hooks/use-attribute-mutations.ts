"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { attributeKeys } from "@/lib/api/query-keys";
import {
  createAttribute,
  updateAttribute,
  deleteAttribute,
  addAttributeValue,
  updateAttributeValue,
  deleteAttributeValue,
  setAttributeCategories,
} from "../api/get-attributes";

export function useCreateAttribute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => createAttribute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attributeKeys.all });
    },
  });
}

export function useUpdateAttribute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: Record<string, unknown> }) =>
      updateAttribute(uuid, data),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: attributeKeys.all });
      queryClient.invalidateQueries({ queryKey: attributeKeys.detail(variables.uuid) });
    },
  });
}

export function useDeleteAttribute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uuid: string) => deleteAttribute(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attributeKeys.all });
    },
  });
}

export function useAddAttributeValue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      attributeUuid,
      value,
      priceAdjustment,
    }: {
      attributeUuid: string;
      value: string;
      priceAdjustment?: number;
    }) => addAttributeValue(attributeUuid, value, priceAdjustment),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: attributeKeys.all });
      queryClient.invalidateQueries({ queryKey: attributeKeys.detail(variables.attributeUuid) });
    },
  });
}

export function useUpdateAttributeValue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      attributeUuid,
      valueUuid,
      value,
      priceAdjustment,
    }: {
      attributeUuid: string;
      valueUuid: string;
      value: string;
      priceAdjustment?: number;
    }) => updateAttributeValue(attributeUuid, valueUuid, value, priceAdjustment),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: attributeKeys.all });
      queryClient.invalidateQueries({ queryKey: attributeKeys.detail(variables.attributeUuid) });
    },
  });
}

export function useDeleteAttributeValue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ attributeUuid, valueUuid }: { attributeUuid: string; valueUuid: string }) =>
      deleteAttributeValue(attributeUuid, valueUuid),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: attributeKeys.all });
      queryClient.invalidateQueries({ queryKey: attributeKeys.detail(variables.attributeUuid) });
    },
  });
}

export function useSetAttributeCategories() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ attributeUuid, categoryIds }: { attributeUuid: string; categoryIds: string[] }) =>
      setAttributeCategories(attributeUuid, categoryIds),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: attributeKeys.all });
      queryClient.invalidateQueries({ queryKey: attributeKeys.detail(variables.attributeUuid) });
    },
  });
}
