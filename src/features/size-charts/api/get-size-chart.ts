import { apiClient } from "@/lib/api/api-client";
import type { SizeChartEntry, SizeChartGender } from "../types";

export async function getSizeChart(
  categoryUuid: string,
  gender: SizeChartGender
): Promise<SizeChartEntry[]> {
  const response = await apiClient.get<SizeChartEntry[]>("/api/size-charts", {
    params: { category_id: categoryUuid, gender },
  });
  return response.data ?? [];
}
