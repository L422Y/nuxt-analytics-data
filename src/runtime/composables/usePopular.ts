import { useState } from "#app"
import { computed } from "vue"
import { AnalyticsSummary } from "../../module"

export const usePopular = async () => {
  const analyticsData = await useState<AnalyticsSummary>("analyticsData", () => ( {} ))
  return computed(() => analyticsData?.value?.popular)
}
