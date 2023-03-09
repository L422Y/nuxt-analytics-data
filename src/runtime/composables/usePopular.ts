import { useNuxtApp, useRoute, useState } from "#app"
import { ref } from "#imports"
import { Ref, watch } from "vue"
import { AnalyticsReport, AnalyticsSummary } from "../types"

export const usePopular = async (path?: string | undefined) => {
  if (!path) {
    path = useRoute().path
  }

  if (path !== undefined) {
    const response: Ref<AnalyticsReport> = ref()
    const analyticsData = await useState<AnalyticsSummary>("analyticsData", () => ( {} ))

    if (process.client) {
      const unwatch = watch(analyticsData.value, (data: AnalyticsSummary) => {
        response.value = data?.popular
      })
      useNuxtApp().hook("page:start", () => {
        unwatch()
      })
    }

    response.value = analyticsData?.value?.popular
    return response
  }
}
