import { appendHeader, defineEventHandler, getQuery, } from "h3"
import { QueryObject } from "ufo"
import { useGoogleAnalyticsDataReports } from "../../composables/useGoogleAnalyticsDataReports"
import { useRuntimeConfig } from "#imports"
import memoryDriver from "unstorage/drivers/memory"
import { createStorage } from "unstorage"

const storage = createStorage({
  driver: memoryDriver(),
})

storage.setItemRaw("cache:analyticsData", null)
storage.setItemRaw("cache:analyticsDataCacheProcessing", false)
storage.setItemRaw("cache:analyticsDataCacheRefresh", false)

export default defineEventHandler(async (event) => {
  let trendingCache = ( await storage.getItemRaw("cache:analyticsData") )
  const trendingCacheProcessing = ( await storage.getItemRaw("cache:analyticsDataCacheProcessing") ) as boolean
  const trendingCacheRefresh = ( await storage.getItemRaw("cache:analyticsDataCacheRefresh") ) as boolean

  appendHeader(event, "Access-Control-Allow-Origin", "*")
  appendHeader(event, "Content-Type", "application/json")

  const query: QueryObject = getQuery(event)
  let path: string = query.path as string
  const config = await useRuntimeConfig()
  if (!config.exact && path != "/") {
    path = path.replace(/\/$/, "")
  }

  const shouldRefresh = !trendingCacheProcessing && ( trendingCache === null || trendingCacheRefresh )

  if (shouldRefresh) {
    trendingCache = await useGoogleAnalyticsDataReports(config, trendingCache)
    await storage.setItemRaw("cache:analyticsData", trendingCache)
  }

  if (trendingCache != null) {
    if (path === "*") {
      return trendingCache
    } else if (path in trendingCache) {
      // @ts-ignore
      return {views: parseInt(trendingCache[path])}
    }
  }
  return {views: 0, empty: true}
})
