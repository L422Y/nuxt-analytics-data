import { BetaAnalyticsDataClient } from "@google-analytics/data"
import { AnalyticsReport, AnalyticsSummary, ModuleOptions } from "../../module"
import { createStorage } from "unstorage"
import memoryDriver from "unstorage/drivers/memory"
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

  const removeStrings = config.analyticsData?.removeStrings
  const removeStringsRegEx = config.analyticsData?.removeStringsRegEx

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

        let pagePath = ""
        const removals = [...removeStrings]
        for (const toReplace of removeStringsRegEx) {
          removals.unshift(new RegExp(toReplace))
        }

        if (row && row.dimensionValues && row.dimensionValues.length > 0 && row.metricValues) {
          const item = {}
          for (let idx = 0; idx < row.dimensionValues.length; idx++) {
            const dimensionKey = <string>reportQuery.dimensions[idx].name
            let dimensionValue = <string>row.dimensionValues[idx].value

            for (const toReplace of removals) {
              dimensionValue = dimensionValue.replace(toReplace, "")
            }

            if (dimensionKey === "pagePath") {
              if (!exact && dimensionValue !== "/") {
                dimensionValue = dimensionValue.replace(/\/$/, "")
              }
              pagePath = dimensionValue
            } else {
              item[dimensionKey] = dimensionValue
            }
          }

          for (let idx = 0; idx < row.metricValues.length; idx++) {
            const metricKey = <string>reportQuery.metrics[idx].name
            const metricValue = <string>row.metricValues[idx].value
            item[metricKey] = metricValue
          }
          results[pagePath] = item
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
