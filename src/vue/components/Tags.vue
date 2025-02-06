<script setup>
import { computed } from 'vue'

/**
 * @property {string[] | {label: string, icon: string}[]} items
 * @property {string} [itemClass]
 */
const props = defineProps({
  items: Array,
  itemClass: String,
})

/**
 * @type {ComputedRef<string>}
 */
const badgeClassList = computed(() => {
  return props.itemClass ? props.itemClass : 'bg-light text-dark'
})
</script>

<template>
  <!-- Tag List -->
  <div class="tags">
    <!-- Bootstrap Badge -->
    <div
      v-for="item in props.items"
      :key="item.label || item"
      class="tag badge text-1"
      :class="badgeClassList"
    >
      <!-- Badge Label -->
      <i
        v-if="item.faIcon"
        :class="item.faIcon"
        class="me-2"
      />
      <span v-html="item.label || item" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '/src/scss/_theming.scss';

.tag {
  &:not(:last-child) {
    margin-right: 0.3rem;
  }
}
</style>
