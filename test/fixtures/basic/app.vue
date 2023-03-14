<template>
  <div>
    <div>
      <h2>Popular Data</h2>
      <ul>
        <li
          v-for="[key,value] in Object.entries(allPopular)"
          :key="key"
        >::{{ key }}:: {{ value }}
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
          ::{{ key }}:: {{ value }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { usePopular, useTrending } from "#imports"

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
