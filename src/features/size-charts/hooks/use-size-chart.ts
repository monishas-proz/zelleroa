"use client";

import { useQuery } from "@tanstack/react-query";
import { getSizeChart } from "../api/get-size-chart";
import type { SizeChartGender } from "../types";

/** Empty (not an error) when the category has no size chart for that gender. */
export function useSizeChart(categoryUuid: string | null, gender: SizeChartGender | null) {
  return useQuery({
    queryKey: ["size-chart", categoryUuid, gender],
    queryFn: () => getSizeChart(categoryUuid!, gender!),
    enabled: !!categoryUuid && !!gender,
  });
}
