import { addPlugin, addServerHandler, createResolver, defineNuxtModule } from "@nuxt/kit"
import defu from "defu"
import { fileURLToPath } from "node:url"
import { defaultReports } from "./runtime/defaultReports"

export interface ModuleOptions {
  /**
   * Half-life of cache (in seconds)
   */
  cacheTimeout?: number
  credentialsFile?: string
  credentials?: {
    type: "service_account"
    project_id: string,
    private_key_id: string
    private_key: string
    client_email: string
    client_id: string
    auth_uri?: string
    token_ur?: string
    auth_provider_x509_cert_url?: string
    client_x509_cert_url: string
  }
  reports: { [key: string]: Function }
  propertyId: string
  endpoint: string
  /**
   * Get views for exact URLs, do not merge views for URLs that may or may not have a trailing slash
   */
  exact: boolean

  /**
   * Array of relative paths to filter from the list
   */
  filteredPaths: string[]
  limit: number
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "nuxt-analytics-data",
    configKey: "analyticsData",
  },
  defaults: {
    propertyId: "5555555",
    endpoint: "/api/analyticsData",
    exact: false,
    filteredPaths: [],
    reports: {},
    cacheTimeout: 60 * 30,
    limit: 20
  } as ModuleOptions,
  setup(options, nuxt) {
    const {resolve} = createResolver(import.meta.url)
    const runtimeDir = fileURLToPath(new URL("./runtime", import.meta.url))
    const pluginPath = resolve("./runtime/plugin")

    options.reports = {...options.reports, ...defaultReports}

    nuxt.options.runtimeConfig.analyticsData = defu(nuxt.options.runtimeConfig.analyticsData, options)
    nuxt.options.runtimeConfig.public.analyticsData = {endpoint: options.endpoint, exact: options.exact}
    nuxt.options.build.transpile.push(runtimeDir)

    const endpoint = options.endpoint

    addPlugin(pluginPath)
    addServerHandler({
      route: endpoint,
      method: "get",
      handler: resolve(runtimeDir, "server/api/analyticsData.get")
    })

    nuxt.hook("imports:dirs", (dirs) => {
      dirs.push(resolve(runtimeDir, "composables"))
    })

    // nuxt.hook("prepare:types", (options) => {
    //   options.references.push({path: resolve(nuxt.options.buildDir, "types/trending.d.ts")})
    // })
  }
})
