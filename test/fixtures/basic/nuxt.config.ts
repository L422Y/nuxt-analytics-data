import NuxtAnalyticsData from "../../../src/module"
export default defineNuxtConfig({
  modules: [
    NuxtAnalyticsData
  ],
  analyticsData: {
    credentialsFile: "./playground/src/google-service-account.json",
    propertyId: "331054024",
    filteredPaths: [
      "/blog",
      "/projects"
    ]
  }
})
