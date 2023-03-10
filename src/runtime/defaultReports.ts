interface IQueryObjectOptions {
  propertyId: string
  limit: number
  filteredPaths?: string[]
}

export const defaultReports = {
  popular: ({propertyId, limit, filteredPaths}: IQueryObjectOptions) => {
    const query = {
      property: `properties/${propertyId}`,
      limit,
      dateRanges: [
        {
          startDate: "30daysAgo",
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
    if (Array.isArray(filteredPaths) && filteredPaths.length > 0) {
      query["dimensionFilter"] = {
        notExpression: {
          filter: {
            fieldName: "pagePath",
            inListFilter: {
              values: filteredPaths
            }
          }
        }
      }
    }
    return query
  },
  trending: ({propertyId, limit, filteredPaths}) => {
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
    if (Array.isArray(filteredPaths) && filteredPaths.length > 0) {
      query["dimensionFilter"] = {
        notExpression: {
          filter: {
            fieldName: "pagePath",
            inListFilter: {
              values: filteredPaths
            }
          }
        }
      }
    }
    return query
  }
}
