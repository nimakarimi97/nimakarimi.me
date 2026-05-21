<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
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

const elRef = ref(null)
const animatedPercentageText = ref('')
let observer = null
let animationRafId = null
let isUnmounted = false

onMounted(() => {
  isUnmounted = false
  animatedPercentageText.value = props.item.formattedPercentage ?? ''

  if (props.item.formattedPercentage && props.item.formattedPercentage.endsWith('%')) {
    const targetVal = Number.parseInt(props.item.formattedPercentage)
    if (!Number.isNaN(targetVal)) {
      animatedPercentageText.value = '0%'

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              _animateCount(targetVal)
              observer.disconnect()
            }
          })
        },
        { threshold: 0.1 },
      )

      if (elRef.value) {
        observer.observe(elRef.value)
      }
    }
  }
})

onUnmounted(() => {
  isUnmounted = true
  if (observer) {
    observer.disconnect()
  }

  if (animationRafId !== null) {
    window.cancelAnimationFrame(animationRafId)
    animationRafId = null
  }
})

function _animateCount(target) {
  let current = 0
  const duration = 1200 // ms
  const start = performance.now()

  function update(time) {
    if (isUnmounted) {
      return
    }

    const elapsed = time - start
    const progress = Math.min(elapsed / duration, 1)

    // Ease out cubic
    const easeProgress = 1 - (1 - progress) ** 3
    current = Math.round(easeProgress * target)
    animatedPercentageText.value = `${current}%`

    if (progress < 1) {
      animationRafId = requestAnimationFrame(update)
    } else {
      animationRafId = null
    }
  }

  animationRafId = requestAnimationFrame(update)
}

/**
 * @param {object} item
 * @return {string}
 * @private
 */
function _getItemColor(_item) {
  // console.log('_getItemColor ~ item:', _item)
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
function _getProgressBarColor(_item) {
  // console.log(' _getProgressBarColor ~ item:', _item)
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
function _getItemFontAwesomeTextClass(_item) {
  // console.log(' _getItemFontAwesomeTextClass ~ item:', _item)
  if (props.iconColorStyle === 'transparent') {
    return 'text-primary'
  }

  return 'text-white'
}
</script>

<template>
  <div ref="elRef" class="info-item">
    <!-- Icon -->
    <CircleIcon
      :src="item.imageIconUrl || item.faIcon || 'fa-regular fa-sticky-note'" type="standard"
      :color="_getItemColor(item)" :text-class="_getItemFontAwesomeTextClass(item)" class="info-item-icon"
    />

    <!-- Content -->
    <div class="info-item-content">
      <!-- Header (Highlighted Style) -->
      <div v-if="highlightedHeader" class="info-item-content-header-highlight mb-1">
        <p class="info-item-title text-4 fw-bold text-normal mb-0">
          {{ item.locales.title }}
        </p>
        <span class="info-item-progress-span text-1 text-muted fw-bold">{{
          animatedPercentageText
        }}</span>
      </div>

      <!-- Header (Simplified Style) -->
      <div v-else class="info-item-content-header">
        <p class="text-light-7 text-4 mb-0">
          <strong>{{ item.locales.title }}</strong>
          <span v-if="props.item.formattedPercentage" class="text-3">
            – {{ animatedPercentageText }}</span>
        </p>
      </div>

      <!-- Description With Progress Bar -->
      <ProgressBar
        v-if="props.descriptionWithProgressBar && item.formattedPercentage" :percentage="item.value"
        :description="item.locales.description" :color="_getProgressBarColor(item)" class="mt-1"
      />

      <!-- Description -->
      <div v-else class="info-item-description-wrapper">
        <p
          class="item-description text-muted mb-0" :class="smallDescription ? 'text-1' : 'text-2'"
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
