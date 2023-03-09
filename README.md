# Nuxt Analytics Data Module

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

This module allows running of reports via the Google Analytics Data API, and includes pre-defined reports composables for trending and popular posts.

## Features

- Filtering of paths from report data
- Trending and Popular reports and composables

## TODO:
- Ability to define your own reports: *this is partially implemented, need to figure out the best way to pass functions to the module from the configuration.* 

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

That's it! You can now use Nuxt Analytics Data Module in your Nuxt app ✨

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
