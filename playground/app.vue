<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>Path</th>
          <th>Popular</th>
          <th>Trending</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ useRoute().path }}</td>
          <td>{{ popular }}</td>
          <td>{{ trending }}</td>
        </tr>
        <tr>
          <td>/blog</td>
          <td>{{ popularBlog }}</td>
          <td>{{ trendingBlog }}</td>
        </tr>
      </tbody>
    </table>
    <div>
      <AnalyticsWidget
        :show-views="false"
        label="Trending Pages (24 hours)"
        list-type="trending"
      />
      <AnalyticsWidget
        :show-views="true"
        label="Popular Pages (30 days)"
        list-type="popular"
      />
    </div>
    <div>
      <h2>Popular Data</h2>
      <ul>
        <li
          v-for="[key,value] in Object.entries(allPopular)"
          :key="key"
        >
          {{ key }}: {{ value }}
        </li>
      </ul>
    </div>
    <div>
      <h2>Trending Data</h2>
      <ul>
        <li
          v-for="[key,value] in Object.entries(allTrending)"
          :key="key"
        >
          {{ key }}: {{ value }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useRoute } from "#app"
import { usePagePopular, usePageTrending, usePopular, useTrending } from "#imports"

// const {$analyticsData} = useNuxtApp()
// const analyticsData = useState("analyticsData")

const popular = await usePagePopular()
const trending = await usePageTrending()

const popularBlog = await usePagePopular("/blog")
const trendingBlog = await usePageTrending("/blog")

const allPopular = await usePopular()
const allTrending = await useTrending()

</script>
<style>
body {
  font-family: Helvetica, Arial, sans-serif;
}

th, td {
  text-align: left;
  border-spacing: 1rem;
  border-collapse: collapse;
  padding: 10px;
}
</style>
