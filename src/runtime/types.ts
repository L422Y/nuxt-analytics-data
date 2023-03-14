
export type AnalyticsSummary = { [key: string]: AnalyticsReport }
export type AnalyticsReport = { [key: string]: any }

export enum AnalyticsWidgetType {
  POPULAR = "popular",
  TRENDING = "trending"
}
