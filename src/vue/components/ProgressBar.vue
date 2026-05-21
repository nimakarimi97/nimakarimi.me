<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useScrollReveal } from '../../composables/scrollReveal.js'
import { useUtils } from '../../composables/utils.js'

/**
 * @property {number} percentage
 * @property {string} description
 * @property {string} color
 */
const props = defineProps({
  percentage: Number,
  description: String,
  color: String,
})

const utils = useUtils()
const { observe } = useScrollReveal()
const barRef = ref(null)
const revealed = ref(false)

let _teardown = null

onMounted(() => {
  if (!barRef.value)
    return

  // Already in the viewport: wait for Vue to paint width:0, then animate.
  const rect = barRef.value.getBoundingClientRect()
  if (rect.top < window.innerHeight && rect.bottom > 0) {
    nextTick(() => {
      requestAnimationFrame(() => {
        revealed.value = true
      })
    })
    return
  }

  // Off-screen: directly set revealed when the element scrolls into view.
  _teardown = observe([barRef.value], {
    threshold: 0.15,
    once: true,
    onReveal: () => {
      revealed.value = true
    },
  })
})

onUnmounted(() => {
  if (_teardown) {
    _teardown()
    _teardown = null
  }
})

/**
 * @type {ComputedRef<number>}
 */
const percentage = computed(() => {
  return utils.clamp(props.percentage, 0, 100)
})

/**
 * @type {ComputedRef<string>}
 */
const style = computed(() => {
  const percentageValue = percentage.value
  const opacity = (50 + percentageValue * 0.5) / 100
  // width is 0 until revealed, then animates to target
  const width = revealed.value ? percentageValue : 0

  const styleObject = {
    width: `${width}%`,
    opacity,
  }

  if (props.color) {
    styleObject.backgroundColor = props.color
  }

  return styleObject
})
</script>

<template>
  <div
    ref="barRef"
    class="progress-bar-wrapper"
  >
    <!-- Bootstrap Progress -->
    <div class="progress">
      <div
        class="progress-bar"
        role="progressbar"
        :style="style"
        :aria-valuenow="percentage"
        aria-valuemin="0"
        aria-valuemax="100"
      />
    </div>

    <!-- ProgressBar Description -->
    <div class="progress-description">
      <p
        v-if="props.description"
        class="text-1 text-description mb-0"
        v-html="props.description"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '/src/scss/_theming.scss';

.progress {
  @include generate-dynamic-styles-with-hash(
    (
      xxxl: (
        height: 5px,
      ),
      md: (
        height: 4px,
      ),
    )
  );

  background-color: lighten($light-3, 2%);
}

.progress-bar {
  background: linear-gradient(90deg, lighten($primary, 15%), $primary);
  transition: width 1.1s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 4px;
  box-shadow: 0 1px 6px rgba(38, 41, 225, 0.3);
}

.progress-description {
  margin-top: 0.2rem;
  color: $light-6;
}
</style>
