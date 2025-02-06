<script setup>
import InfoItem from '../InfoItem.vue'

const props = defineProps({
  items: Array,
})
</script>

<template>
  <div class="row">
    <div
      v-for="item in props.items"
      :key="item.id"
      class="col-12 item-container"
    >
      <InfoItem
        :item="item"
        :highlighted-header="false"
        :small-description="false"
        :description-with-progress-bar="false"
        icon-color-style="transparent"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '/src/scss/_theming.scss';

.item-container {
  @include generate-dynamic-styles-with-hash(
    (
      xxxl: (
        min-height: 4rem,
      ),
      xxl: (
        min-height: 3.75rem,
      ),
      xl: (
        min-height: 3.5rem,
      ),
      sm: (
        min-height: 0,
      ),
    )
  );
}
</style>
