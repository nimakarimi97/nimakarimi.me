<script setup>
import { useData } from '../../../composables/data.js'
import { useLayout } from '../../../composables/layout.js'

import { useUtils } from '../../../composables/utils.js'
import SectionTemplate from '../_templates/SectionTemplate.vue'
import SubHeading from '../_templates/SubHeading.vue'

import InfoGrid from './layouts/InfoGrid.vue'
import InfoList from './layouts/InfoList.vue'
import InfoPie from './layouts/InfoPie.vue'

const props = defineProps({
  sectionData: Object,
})

const data = useData()
const layout = useLayout()
const utils = useUtils()

const COMPONENTS_MAP = {
  grid: InfoGrid,
  pie: InfoPie,
  list: InfoList,
  fallback: InfoList,
}

const STYLE_PREFERENCES = layout.getStylePreferencesForPlugins()

/**
 * @param {object} subcategory
 * @private
 */
function _getComponentFor(subcategory) {
  const dataType = subcategory.type
  return COMPONENTS_MAP[dataType] || COMPONENTS_MAP.fallback
}

/**
 * @param subcategory
 * @return {object[]}
 * @private
 */
function _fetchAndParseItemsFor(subcategory) {
  const items = props.sectionData.content.items[subcategory.id]

  let colorIdCount = 0
  for (const item of items) {
    item.customColor = STYLE_PREFERENCES.colors.random[colorIdCount]
    colorIdCount++

    if (subcategory.progress) {
      const percentage = item.value
      const breakpoints = subcategory.progress
      const parsedPercentage = utils.parsePercentage(percentage, breakpoints)

      item.formattedPercentage = typeof breakpoints !== 'string'
        ? data.getString(parsedPercentage)
        : parsedPercentage
    }
  }

  return items
}
</script>

<template>
  <SectionTemplate :section-data="props.sectionData">
    <div class="info-row row gx-4 gx-xl-5">
      <div
        v-for="subcategory in props.sectionData.content.subcategories"
        :key="subcategory.id"
        class="col-12 subcategory-col"
      >
        <!-- Subcategory Title -->
        <SubHeading
          v-if="subcategory.locales.title"
          :title="subcategory.locales.title"
          :fa-icon="subcategory.faIcon"
          :img="subcategory.imageIconUrl"
        />

        <!-- Group Component -->
        <component
          :is="_getComponentFor(subcategory)"
          :items="_fetchAndParseItemsFor(subcategory)"
        />
      </div>
    </div>
  </SectionTemplate>
</template>

<style lang="scss" scoped>
@import '/src/scss/_theming.scss';

.subcategory-col {
  &:not(:last-child) {
    @include generate-dynamic-styles-with-hash(
      (
        xxxl: (
          margin-bottom: 2.75rem,
        ),
        xl: (
          margin-bottom: 1.5rem,
        ),
      )
    );
  }
}
</style>
