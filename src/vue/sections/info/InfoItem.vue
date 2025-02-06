<script setup>
import CircleIcon from '../../components/CircleIcon.vue'
import ProgressBar from '../../components/ProgressBar.vue'

/**
 * @property {object} item
 * @property {boolean} highlightedHeader
 * @property {boolean} descriptionWithProgressBar
 * @property {string} iconColorStyle
 * @property {descriptionWithProgressBar} smallDescription
 */
const props = defineProps({
  item: Object,
  highlightedHeader: Boolean,
  descriptionWithProgressBar: Boolean,
  iconColorStyle: String,
  smallDescription: Boolean,
})

/**
 * @param {object} item
 * @return {string}
 * @private
 */
function _getItemColor(item) {
  console.log('_getItemColor ~ item:', item)
  if (props.iconColorStyle === 'transparent') {
    return 'transparent'
  } else if (props.iconColorStyle === 'customColor') {
    return props.item.customColor
  }
}

/**
 * @param {object} item
 * @return {string|null}
 * @private
 */
function _getProgressBarColor(item) {
  console.log(' _getProgressBarColor ~ item:', item)
  if (props.iconColorStyle === 'customColor') {
    return props.item.customColor
  }

  return null
}

/**
 * @param {object} item
 * @return {string}
 * @private
 */
function _getItemFontAwesomeTextClass(item) {
  console.log(' _getItemFontAwesomeTextClass ~ item:', item)
  if (props.iconColorStyle === 'transparent') {
    return 'text-primary'
  }

  return 'text-white'
}
</script>

<template>
  <div class="info-item">
    <!-- Icon -->
    <CircleIcon
      :src="item.imageIconUrl || item.faIcon || 'fa-regular fa-sticky-note'"
      type="standard"
      :color="_getItemColor(item)"
      :text-class="_getItemFontAwesomeTextClass(item)"
      class="info-item-icon"
    />

    <!-- Content -->
    <div class="info-item-content">
      <!-- Header (Highlighted Style) -->
      <div
        v-if="highlightedHeader"
        class="info-item-content-header-highlight mb-1"
      >
        <p class="info-item-title text-4 fw-bold text-normal mb-0">
          {{ item.locales.title }}
        </p>
        <span class="info-item-progress-span text-1 text-muted fw-bold">{{
          item.formattedPercentage ?? ''
        }}</span>
      </div>

      <!-- Header (Simplified Style) -->
      <div
        v-else
        class="info-item-content-header"
      >
        <p class="text-light-7 text-4 mb-0">
          <strong>{{ item.locales.title }}</strong>
          <span
            v-if="item.formattedPercentage"
            class="text-3"
          >
            – {{ item.formattedPercentage }}</span>
        </p>
      </div>

      <!-- Description With Progress Bar -->
      <ProgressBar
        v-if="props.descriptionWithProgressBar && item.formattedPercentage"
        :percentage="item.value"
        :description="item.locales.description"
        :color="_getProgressBarColor(item)"
        class="mt-1"
      />

      <!-- Description -->
      <div
        v-else
        class="info-item-description-wrapper"
      >
        <p
          class="item-description text-muted mb-0"
          :class="smallDescription ? 'text-1' : 'text-2'"
          v-html="item.locales.description"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '/src/scss/_theming.scss';

.info-item {
  display: flex;
  flex-direction: row;
  margin-bottom: 1rem;
}

.info-item-icon {
  @include generate-dynamic-styles-with-hash(
    (
      xxxl: (
        margin-right: 1rem,
      ),
      lg: (
        margin-right: 0.75rem,
      ),
    )
  );
}

.info-item-content {
  align-self: center;
  width: 100%;
}

.info-item-content-header-highlight {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
</style>
