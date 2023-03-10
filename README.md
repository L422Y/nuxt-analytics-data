# Nuxt Analytics Data Module

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

This SSR-enabled Nuxt module allows running of reports via the Google Analytics Data API, and includes pre-defined
reports and composables for trending and popular posts, as well as an AnalyticsWidget component for trending and popular
posts.

API responses are cached on the server side and expire

## Features

- Filtering of paths (exact strings or RegEx) from report data, filtering parameters are supplied to the API
- String removal (exact string or RegEx)
- Trending and Popular reports, composables and a `AnalyticeWidget` component.

### TODO:

- Ability to define your own reports: *this is partially implemented, need to figure out the best way to pass functions
  to the module from the configuration.*

## Quick Setup

1. Add `nuxt-analytics-data` dependency to your project

```bash
# Using pnpm
pnpm add -D nuxt-analytics-data

# Using yarn
yarn add --dev nuxt-analytics-data

# Using npm
npm install --save-dev nuxt-analytics-data
```

2. Add `nuxt-analytics-data` to the `modules` section of `nuxt.config.ts`

```js
export default defineNuxtConfig({
  modules: [
    'nuxt-analytics-data'
  ]
})
```

3. Add configuration for the module:

```ts
export default defineNuxtConfig({
  // ...
  analyticsData: {
    // Specify the path to your GA credentials file or use `credentials` with the data itself
    credentialsFile: "./playground/src/google-service-account.json",
    // The GA4 property ID you are accessing
    propertyId: "331054024",
    // Clear API response cache after 15 minutes (value is in seconds)
    cacheTimeout: 15 * 60,
    // Use `filteredPaths` to exclude paths from your query, i.e. if you
    // don't want the homepage or contact page.
    filteredPaths: {
      // Exact path filters
      exact: ["/references"],
      // RegEx Path filters -- ex: filter any first-level paths (i.e. "/blog" "/projects")
      regEx: [`^/(\\w+)?\\/?$`]
    },

    // removeStrings will remove any matching text from the pageTitles in results
    removeStrings: {
      // Exact matches, ex: removing trailing tags from the title
      exact: [` - Larry Williamson`],
      // and/or RegEx matches
      regEx: [` - .* - Larry Williamson`]
    }
    // ...
  }
});
```

That's it! You can now use Nuxt Analytics Data Module in your Nuxt app ✨

## Usage

### `$analyticsData`

The retrieved data is stored in `useState('analyticsData')` as well as provided in the Nuxt application
as `$analyticsData`

```ts
const {$analyticsData} = useNuxtApp()

const analyticsData = useState("analyticsData")

```

Data is formatted like this:

```json

{
  "popular": {
    "/blog": {
      "pageTitle": "Blog",
      "screenPageViews": "129"
    },
    "/blog/countdown-for-vue-with-composables": {
      "pageTitle": "Building a Countdown Component for Vue with Composables",
      "screenPageViews": "96"
    }
  },
  "trending": {
    "/": {
      "pageTitle": "Home",
      "screenPageViews": "999999"
    }
  }
}

```

### `usePopular` and `useTrending` composables

Provides the specific data from the analyticsData object

```ts
const allPopular = await usePopular()
const allTrending = await useTrending()
```

### `usePagePopular` and `usePageTrending` composables

Returns a boolean indicating whether a page is within popular or trending page lists.
If no argument is supplied it uses the current route path.

```vue
<template>
  <nav>
    <NuxtLink :to="/blog">Blog<span v-if="trendingBlog"> 🔥</span></NuxtLink>
  </nav>
</template>
<script lang="ts" setup>
  const popular = await usePagePopular()
  const trending = await usePageTrending()

  const popularBlog = await usePagePopular("/blog")
  const trendingBlog = await usePageTrending("/blog")
</script>
```

Then

## Development

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Develop with the playground
npm run dev

# Build the playground
npm run dev:build

# Run ESLint
npm run lint

# Run Vitest
npm run test
npm run test:watch

# Release new version
npm run release
```

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/nuxt-analytics-data/latest.svg?style=flat&colorA=18181B&colorB=28CF8D

[npm-version-href]: https://npmjs.com/package/nuxt-analytics-data

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-analytics-data.svg?style=flat&colorA=18181B&colorB=28CF8D

[npm-downloads-href]: https://npmjs.com/package/nuxt-analytics-data

[license-src]: https://img.shields.io/npm/l/nuxt-analytics-data.svg?style=flat&colorA=18181B&colorB=28CF8D

[license-href]: https://npmjs.com/package/nuxt-analytics-data

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js

[nuxt-href]: https://nuxt.com
