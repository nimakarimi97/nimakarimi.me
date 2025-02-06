<script setup>
import { useData } from '../../composables/data.js'
import DefaultSection from '../sections/_templates/SectionTemplate.vue'
import ContactSection from '../sections/contact/ContactSection.vue'
import CoverSection from '../sections/cover/CoverSection.vue'
import GallerySection from '../sections/gallery/GallerySection.vue'
import InfoSection from '../sections/info/InfoSection.vue'
import ThreadsSection from '../sections/threads/ThreadsSection.vue'
import TimelineSection from '../sections/timeline/TimelineSection.vue'

const data = useData()

/**
 * @type {object}
 */
const SECTION_VUE_COMPONENTS = {
  DefaultSection,
  ContactSection,
  CoverSection,
  GallerySection,
  InfoSection,
  ThreadsSection,
  TimelineSection,
}

/**
 * @param {string} componentName
 * @return {*}
 * @private
 */
function _getSectionComponentByName(componentName) {
  if (SECTION_VUE_COMPONENTS[componentName])
    return SECTION_VUE_COMPONENTS[componentName]

  console.warn(
    `Couldn't find component with name: ${
      componentName
    }. All section components must be registered on RouterView.vue.`,
  )
  return DefaultSection
}
</script>

<template>
  <component
    :is="_getSectionComponentByName(section.component)"
    v-for="section in data.getSections()"
    :key="section.id"
    :section-data="section"
  />
</template>

<style lang="scss" scoped></style>
