<script setup>
import { computed } from 'vue'

/**
 * @property {number} scrollProgress - Scroll progress as a percentage (0-100)
 */
const props = defineProps({
  scrollProgress: {
    type: Number,
    default: 0,
  },
})

/**
 * @type {ComputedRef<number>}
 */
const progress = computed(() => {
  return Math.min(Math.max(props.scrollProgress, 0), 100)
})
</script>

<template>
  <div class="scroll-progress-bar-container">
    <div
      class="scroll-progress-bar"
      :style="{ width: `${progress}%` }"
    />
  </div>
</template>

<style lang="scss" scoped>
@import '/src/scss/_theming.scss';
@import '/src/scss/_variables.scss';
@import '/src/scss/_mixins.scss';

.scroll-progress-bar-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: rgba(0, 0, 0, 0.05);
  z-index: 1000;
  pointer-events: none;

  @media (prefers-color-scheme: dark) {
    background-color: rgba(255, 255, 255, 0.05);
  }

  @include media-breakpoint-down($navigation-sidebar-breakpoint) {
    display: none;
  }
}

.scroll-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color, #3b82f6), var(--accent-color, #8b5cf6));
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
  width: 0%;
  transition: width 0.1s ease-out;

  @media (prefers-color-scheme: dark) {
    box-shadow: 0 0 15px rgba(59, 130, 246, 0.6);
  }
}
</style>
