import { BetaAnalyticsDataClient } from "@google-analytics/data"
import { ModuleOptions } from "../../module"
import { AnalyticsReport, AnalyticsSummary } from "../types"
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

    // Build our expressions array once
    const expressions = []
    if (filteredPaths?.exact?.length > 0) {
        expressions.push({filter: {fieldName: "pagePath", inListFilter: {values: filteredPaths.exact}}})
    }
    if (filteredPaths?.regEx?.length > 0) {
        for (const regEx of filteredPaths.regEx) {
            expressions.push({filter: {fieldName: "pagePath", stringFilter: {matchType: 5, value: regEx}}})
        }
    }


    for (const [alias, report] of Object.entries(reports)) {

        const params = {alias, propertyId, limit, filteredPaths, expressions}

        if (config.analyticsData.parameters) {
            if (config.analyticsData.parameters[alias]?.startDate) {
                params["startDate"] = config.analyticsData.parameters[alias].startDate
            }

            if (config.analyticsData.parameters[alias]?.endDate) {
                params["endDate"] = config.analyticsData.parameters[alias].endDate
            }
        }

        const reportQuery = report(params)
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
                let removals = []
                if (removeStrings) {
                    if (removeStrings.exact?.length > 0) {
                        removals = [...removeStrings.exact]
                    }
                    if (removeStrings.regEx?.length > 0) {
                        for (const regEx of removeStrings.regEx) {
                            removals.unshift(new RegExp(regEx))
                        }
                    }
                }

                if (row && row.dimensionValues && row.dimensionValues.length > 0 && row.metricValues) {
                    const item: any = {}
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
                    if (results[pagePath]) {
                        results[pagePath].screenPageViews = parseInt(results[pagePath].screenPageViews) + parseInt(item.screenPageViews)
                    } else {
                        results[pagePath] = item
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
