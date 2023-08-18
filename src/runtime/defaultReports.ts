import { NuxtConfig } from "@nuxt/schema"

interface IQueryObjectOptions {
  propertyId: string
  limit: number
  filteredPaths?: string[]
  expressions: any[],
  startDate?: string
}

export const defaultReports = {
  popular: ({propertyId, limit, expressions, startDate}: IQueryObjectOptions) => {
    const query = {
      property: `properties/${propertyId}`,
      limit,
      dateRanges: [
        {
          startDate: startDate || "30daysAgo",
          endDate: "today",
        },
      ],
      dimensions: [
        {
          name: "pagePath",
        },
        {
          name: "pageTitle",
        },
      ],
      metrics: [
        {
          name: "screenPageViews",
        },
      ],
      orderBys: [
        {
          metric: {
            metricName: "screenPageViews"
          },
          desc: true
        }
      ]
    }

    if (expressions.length > 0) {
      query["dimensionFilter"] = {notExpression: {orGroup: {expressions}}}
    }

    return query
  },
  trending: ({propertyId, limit, expressions}) => {
    const query = {
      property: `properties/${propertyId}`,
      limit,
      dateRanges: [
        {
          startDate: "1daysAgo",
          endDate: "today"
        }
      ],
      dimensions: [
        {
          name: "pagePath"
        },
        {
          name: "pageTitle",
        },
      ],
      metrics: [
        {
          name: "screenPageViews"
        }
      ],
      orderBys: [
        {
          metric: {
            metricName: "screenPageViews"
          },
          desc: true
        }
      ]
    }

    if (expressions.length > 0) {
      query["dimensionFilter"] = {notExpression: {orGroup: {expressions}}}
    }

    return query
  }
}
