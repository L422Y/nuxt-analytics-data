import { useState } from "#app"
import { computed } from "vue"
import { AnalyticsSummary } from "../types"

export const usePopular = async () => {
  const analyticsData = useState<AnalyticsSummary>("analyticsData", () => ( {} ))
  return computed(() => analyticsData?.value?.popular)
}
