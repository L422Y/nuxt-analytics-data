import { useState } from "#app"
import { computed } from "vue"
import { AnalyticsSummary } from "../../module"

export const useTrending = async () => {
  const analyticsData = await useState<AnalyticsSummary>("analyticsData")
  return computed(() => analyticsData?.value?.trending)
}
