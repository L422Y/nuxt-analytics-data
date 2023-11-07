import { useNuxtApp, useRoute, useRuntimeConfig, useState } from "#app"
import { ref } from "#imports"
import { Ref, watch } from "vue"
import { AnalyticsSummary } from "../types"

export const usePagePopular = async (path?: string | undefined) => {
  if (!path) {
    path = useRoute().path
  }

  if (path !== undefined) {
    const response: Ref<boolean> = ref(false)
    const config = useRuntimeConfig().public.analyticsData
    const analyticsData = useState<AnalyticsSummary>("analyticsData", () => ( {} ))
    const {exact} = config

    if (!exact && path != "/") {
      path = path.replace(/\/$/, "")
    }

    if (process.client) {
      const unwatch = watch(analyticsData.value, (data: AnalyticsSummary) => {
        response.value = data?.popular && !!data?.popular[`${path}`]
      })
      useNuxtApp().hook("page:start", () => {
        unwatch()
      })
    }

    response.value = analyticsData?.value?.popular && !!analyticsData.value["popular"][`${path}`]
    return response
  }
}
