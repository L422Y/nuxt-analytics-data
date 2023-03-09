import { defineNuxtPlugin, useLazyAsyncData, useRuntimeConfig, useState } from "#app"

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()
  const endpoint = config.public.analyticsData.endpoint
  const analyticsData = await useState("analyticsData", () => ( {} ))
  const {data} = await useLazyAsyncData(`analytics-data`, () => $fetch(`${endpoint}?path=*`))

  if (data.value) {
    analyticsData.value = data.value
  }

  return {
    provide: {
      analyticsData
    }
  }
})
