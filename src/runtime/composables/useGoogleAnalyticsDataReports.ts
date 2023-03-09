import { BetaAnalyticsDataClient } from "@google-analytics/data"
import { ModuleOptions } from "../../module"
import { createStorage } from "unstorage"
import memoryDriver from "unstorage/drivers/memory"
import { AnalyticsReport, AnalyticsSummary } from "../types"
import { defaultReports } from "../defaultReports"

const storage = createStorage({
  driver: memoryDriver(),
})

export const useGoogleAnalyticsDataReports = async (config: any, analyticsCache: AnalyticsSummary): Promise<AnalyticsSummary> => {
  const {
    credentialsFile,
    credentials,
    propertyId,
    exact,
    cacheTimeout,
    limit,
    filteredPaths
  }: ModuleOptions = config.analyticsData

  let reports: { [key: string]: Function } = config.analyticsData?.reports || {}

  const opts = {}
  if (credentials) {
    opts["credentials"] = credentials
  } else if (credentialsFile) {
    opts["keyFilename"] = credentialsFile
  } else {
    throw new Error("Unable to locate Google Analytics credentials")
  }

  const analyticsDataClient = new BetaAnalyticsDataClient(opts)
  await storage.setItem("cache:analyticsDataCacheRefresh", false)
  await storage.setItem("cache:analyticsDataCacheProcessing", true)
  const summary: AnalyticsSummary = {}

  reports = {...defaultReports, ...reports}
  console.info(reports)

  for (const [alias, report] of Object.entries(reports)) {
    const reportQuery = report({alias, propertyId, limit, filteredPaths})
    const response = await analyticsDataClient.runReport(reportQuery)
      .then((value) => {
        return value[0]
      })
      .catch((err) => {
        console.error(err)
      })

    const results: AnalyticsReport = {}

    if (response && response.rows) {
      for (const row of response.rows) {
        if (row && row.dimensionValues && row.dimensionValues.length > 0 && row.metricValues) {
          let key = row.dimensionValues[0].value as string
          if (!exact && key != "/") {
            key = key.replace(/\/$/, "")
          }
          if (key in results) {
            results[key] += parseInt(row.metricValues[0].value)
          } else {
            results[key] = parseInt(row.metricValues[0].value)
          }
        }
      }
    }
    summary[alias] = results
  }

  await storage.setItem("cache:analyticsData", summary)
  await storage.setItem("cache:analyticsDataCacheProcessing", false)
  analyticsCache = summary

  setTimeout(async () => {
    await storage.setItem("cache:analyticsDataCacheRefresh", true)
  }, cacheTimeout * 1000)

  return analyticsCache
}
