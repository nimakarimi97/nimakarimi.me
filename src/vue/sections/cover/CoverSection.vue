<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLayout } from '../../../composables/layout.js'
import InlineList from '../../components/InlineList.vue'
import SocialLinks from '../../components/SocialLinks.vue'
import SectionTemplate from '../_templates/SectionTemplate.vue'

/**
 * @property {object} sectionData
 */
const props = defineProps({
  sectionData: Object,
})

const layout = useLayout()
const router = useRouter()

/**
 * @type {ComputedRef<string>}
 */
const coverTitle = computed(() => {
  return props.sectionData.content.locales.welcome
})

function scrollToExperience() {
  layout.smoothScrollToElement('experience', false)
  router.push({ name: 'experience' })
}
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
    <div class="mb-4">
      <SocialLinks :items="props.sectionData.content.items.socialCircles" />
    </div>

    <!-- Scroll To Explore Experience Hint (Centered) -->
    <div class="cover-scroll-hint-wrapper">
      <div
        class="cover-scroll-hint"
        role="button"
        tabindex="0"
        @click="scrollToExperience"
        @keydown.enter="scrollToExperience"
      >
        <span>SCROLL TO EXPLORE FULL EXPERIENCE TIMELINE</span>
        <i class="fa-solid fa-chevron-down" />
      </div>
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

.cover-scroll-hint-wrapper {
  position: absolute;
  bottom: 2.2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  width: max-content;
  z-index: 10;

  @include media-breakpoint-down($navigation-sidebar-breakpoint) {
    bottom: calc(#{$nav-tabs-height} + 1rem);
  }
}

.cover-scroll-hint {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;

  &:hover {
    opacity: 0.8;
    transform: translateY(2px);
  }

  span {
    font-size: 0.72rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba($text-normal, 0.45);
    font-family: $font-family-base;
    font-weight: 600;
  }

  i {
    font-size: 0.85rem;
    color: $primary;
    animation: hintBounce 2s ease-in-out infinite;
  }
}

@keyframes hintBounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(6px);
  }
}
</style>
