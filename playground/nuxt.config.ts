import NuxtAnalyticsData from "../src/module"

export default defineNuxtConfig({
  modules: [
    NuxtAnalyticsData
  ],
  analyticsData: {
    cacheTimeout: 15 * 60,
    credentialsFile: "./playground/src/google-service-account.json",
    propertyId: "331054024",
    filteredPaths: {
      exact: ["/references"],
      // Filter any first-level paths (i.e. "/blog" "/projects" "/subscribe/")
      regEx: [`^/(\\w+)?\\/?$`]
    },
    removeStrings: {
      exact: [` - Larry Williamson`],
      regEx: [` - .* - Larry Williamson`]
    }
  }
})


