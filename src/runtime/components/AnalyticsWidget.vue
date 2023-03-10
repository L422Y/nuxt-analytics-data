<template>
  <div
    :class="`analytics-widget--${listType}`"
    class="analytics-widget"
  >
    <header class="analytics-widget__header" v-text="props?.label" />
    <ol v-if="items" class="analytics-widget__list">
      <li
        v-for="[path,{pageTitle, screenPageViews}] of Object.entries(items)"
        :key="path"
        class="analytics-widget__item"
      >
        <NuxtLink :to="path">
          {{ pageTitle }}
          <span
            v-if="showViews!==false"
            class="analytics-widget__views"
          >
            ({{ screenPageViews }} views)
          </span>
        </NuxtLink>
      </li>
    </ol>
  </div>
</template>

<script lang="ts" setup>
import { ref, usePopular, useTrending } from "#imports"
import { Ref } from "vue"
import { AnalyticsReport, AnalyticsWidgetType } from "../../module"

const props = defineProps<{ listType: AnalyticsWidgetType, label: string, showViews: boolean }>()
let items: Ref<AnalyticsReport> = ref([])
switch (props.listType) {
  case AnalyticsWidgetType.TRENDING:
    items = await useTrending()
    break
  case AnalyticsWidgetType.POPULAR:
    items = await usePopular()
    break
  default:
    items = await usePopular()
}
</script>

<style lang="scss">
.analytics-widget {
  &__header {
    font-weight: bold;
    text-transform: uppercase;
  }

  &__item {
  }
}
</style>
