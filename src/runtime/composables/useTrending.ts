import { useState } from "#app"
import { computed } from "vue"
import { AnalyticsSummary } from "../types"

export const useTrending = async () => {
  const analyticsData = useState<AnalyticsSummary>("analyticsData")
  return computed(() => analyticsData?.value?.trending)
}
