<script setup>
import { computed } from 'vue'
import { useData } from '../../../composables/data.js'
import SectionTemplate from '../_templates/SectionTemplate.vue'
import SubHeading from '../_templates/SubHeading.vue'
import ContactForm from './ContactForm.vue'
import ContactOptions from './ContactOptions.vue'

/**
 * @property {object} sectionData
 */
const props = defineProps({
  sectionData: Object,
})

const data = useData()

const contactFormEnabled = computed(() => {
  return data.getSettings().contactFormEnabled
})
</script>

<template>
  <SectionTemplate :section-data="props.sectionData">
    <!-- Form -->
    <ContactForm v-if="contactFormEnabled" />

    <!-- SubHeading -->
    <SubHeading
      v-if="contactFormEnabled"
      :title="props.sectionData.content.locales.subtitle"
      :description="props.sectionData.content.locales.subtitleDescription"
      class="mt-4"
    />

    <!-- Contact Items -->
    <ContactOptions
      :items="props.sectionData.content.items"
      :display-as-list="!contactFormEnabled"
    />
  </SectionTemplate>
</template>

<style lang="scss" scoped></style>
