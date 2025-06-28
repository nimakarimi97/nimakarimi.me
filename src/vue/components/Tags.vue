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

div.badge {
  display: inline-flex;
  align-items: center;
  justify-content: start;

  background-color: lighten($background-color, 3%);
  border: 1px solid rgba(black, 0.1);
  border-radius: 10px;
  white-space: nowrap;

  padding: 4px 12px;
  font-size: 0.8rem;

  box-shadow:
    0 2px 8px 0 rgba(0, 0, 0, 0.08),
    0 1.5px 4px 0 rgba(0, 0, 0, 0.06);

  i {
    margin-right: 5px;
    color: $dark;
  }

  span {
    width: 100%;
    text-align: center;
  }

  @include media-breakpoint-down(xl) {
    font-size: 0.75rem;
    padding: 3px 12px;
  }

  @include media-breakpoint-down(lg) {
    font-size: 0.725rem;
    padding: 3px 10px;
  }

  @include media-breakpoint-down(sm) {
    font-size: 0.7rem;
    padding: 3px 9px;
  }
}
</style>
