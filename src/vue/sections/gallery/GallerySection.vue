<script setup>
import { computed, ref } from 'vue'
import { useData } from '../../../composables/data.js'
import FilterTabs from '../../components/FilterTabs.vue'
import SectionTemplate from '../_templates/SectionTemplate.vue'
import GalleryGrid from './GalleryGrid.vue'
import GalleryModal from './GalleryModal.vue'

/**
 * @property {object} sectionData
 */
const props = defineProps({
  sectionData: Object,
})

const data = useData()

const selectedCategoryId = ref(null)
const selectedProject = ref(null)
const modal = ref(null)

/**
 * @type {ComputedRef<Array>}
 */
const tabItems = computed(() => {
  const items = [
    {
      id: 'all',
      label: data.getString('all'),
    },
  ]

  const subcategories = props.sectionData.content.subcategories
  for (const i in subcategories) {
    const subcategory = subcategories[i]

    items.push({
      id: subcategory.id,
      label: subcategory.locales.title,
    })
  }

  return items
})

/**
 * @type {ComputedRef<Array>}
 */
const filteredResults = computed(() => {
  const filteredItems = []

  const itemsByCategory = props.sectionData.content.items
  const selectedCategoryIdValue = selectedCategoryId.value

  for (const subcategory of props.sectionData.content.subcategories) {
    const subcategoryId = subcategory.id
    const subcategoryItems = itemsByCategory[subcategoryId]

    for (const itemData of subcategoryItems) {
      const isVisible = !selectedCategoryIdValue
        || selectedCategoryIdValue === 'all'
        || selectedCategoryIdValue === subcategoryId

      filteredItems.push({
        data: itemData,
        subcategory,
        visible: isVisible,
      })
    }
  }

  return filteredItems
})

/**
 * @param {string} categoryId
 * @private
 */
function _onFilterTabSelected(categoryId) {
  selectedCategoryId.value = categoryId
}

/**
 * @param {object} project
 * @private
 */
function _onProjectOpened(project) {
  selectedProject.value = project
  modal.value.display()
}
</script>

<template>
  <SectionTemplate :section-data="props.sectionData">
    <div class="gallery-section-row row g-0">
      <!-- Filter -->
      <div class="col-12">
        <FilterTabs
          :items="tabItems"
          @selected="_onFilterTabSelected"
        />
      </div>

      <!-- Grid -->
      <div class="col-12">
        <GalleryGrid
          :items="filteredResults"
          :selected-category-id="selectedCategoryId"
          @open="_onProjectOpened"
        />
      </div>
    </div>
  </SectionTemplate>

  <GalleryModal
    ref="modal"
    :project="selectedProject"
  />
</template>

<style lang="scss" scoped>
@import '/src/scss/_theming.scss';
</style>
