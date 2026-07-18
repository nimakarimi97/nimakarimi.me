<script setup>
import { computed } from 'vue'
import InlineList from '../../components/InlineList.vue'
import SocialLinks from '../../components/SocialLinks.vue'
import SectionTemplate from '../_templates/SectionTemplate.vue'

/**
 * @property {object} sectionData
 */
const props = defineProps({
  sectionData: Object,
})

/**
 * @type {ComputedRef<string>}
 */
const coverTitle = computed(() => {
  return props.sectionData.content.locales.welcome
})
</script>

<template>
  <SectionTemplate :section-data="props.sectionData">
    <!-- Title -->
    <h1 class="cover-title display-1 mb-3">
      <span v-html="coverTitle" />
    </h1>

    <!-- Gradient Divider -->
    <hr class="gradient-divider ms-1 me-1 mb-4">

    <!-- Contact Info Card (21st.dev Glassmorphism inspired) -->
    <InlineList class="info-list" :items="props.sectionData.content.items.contactListItems" />

    <!-- Description -->
    <p class="cover-description lead text-normal mb-4 mb-md-5">
      <span v-html="props.sectionData.content.locales.bio" />
    </p>

    <!-- Social Links -->
    <div>
      <SocialLinks :items="props.sectionData.content.items.socialCircles" />
    </div>
  </SectionTemplate>
</template>

<style lang="scss" scoped>
@import '/src/scss/_theming.scss';

.cover-title {
  font-family: $headings-font-family;
  font-weight: bold;
  background: linear-gradient(135deg, $headings-color 30%, lighten($headings-color, 15%) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.cover-description :deep(strong) {
  font-weight: bold;
  color: $primary;
}

.solid-divider {
  @include media-breakpoint-up($navigation-sidebar-breakpoint) {
    display: none;
  }
}

.info-list {
  @include generate-dynamic-styles-with-hash(
    (
      xxxl: (
        margin-bottom: 2.5rem,
      ),
      lg: (
        margin-bottom: 2rem,
      ),
      md: (
        margin-bottom: 1.2rem,
      ),
    )
  );
}
</style>
