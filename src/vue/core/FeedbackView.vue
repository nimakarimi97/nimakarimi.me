<script setup>
import { ref } from 'vue'
import { useLayout } from '../../composables/layout.js'
import ActivitySpinner from '../feedbacks/ActivitySpinner.vue'
import Loader from '../feedbacks/Loader.vue'

const layout = useLayout()
const loader = ref(null)
const activitySpinner = ref(null)

const _loaderListeners = {
  onShown: null,
  onComplete: null,
}

/**
 * @public
 * @param {string} message
 * @param {string} iconImagePath
 */
function setLoader(message, iconImagePath) {
  layout.setPageScrollingEnabled(false)
  loader.value.run(message, iconImagePath)
}

/**
 * @public
 * @param {Function} onShown
 * @param {Function} [onComplete]
 */
function setLoaderListeners(onShown, onComplete) {
  _loaderListeners.onShown = onShown
  _loaderListeners.onComplete = onComplete
}

/**
 * @public
 * @param {number} progress
 */
function updateLoaderProgress(progress) {
  loader.value.setTaskProgress(progress)
}

/**
 * @private
 */
function _onLoaderShown() {
  if (_loaderListeners.onShown) {
    _loaderListeners.onShown()
  }
}

/**
 * @private
 */
function _onLoaderCompleted() {
  if (_loaderListeners.onComplete) {
    _loaderListeners.onComplete()
  }
}

/**
 * @private
 */
function _onLoaderWillHide() {
  layout.setPageScrollingEnabled(true)
  _loaderListeners.onShown = null
  _loaderListeners.onComplete = null
}

/**
 * @public
 * @param {string} message
 */
function showActivitySpinner(message) {
  activitySpinner.value.show(message)
}

/**
 * @public
 */
function hideActivitySpinner() {
  activitySpinner.value.hide()
}

defineExpose({
  setLoader,
  setLoaderListeners,
  updateLoaderProgress,
  showActivitySpinner,
  hideActivitySpinner,
})
</script>

<template>
  <!-- Fullscreen Loader -->
  <Loader
    ref="loader"
    @shown="_onLoaderShown"
    @completed="_onLoaderCompleted"
    @will-hide="_onLoaderWillHide"
  />

  <!-- Spinner -->
  <ActivitySpinner ref="activitySpinner" />
</template>

<style lang="scss" scoped>
@import '/src/scss/_theming.scss';
</style>
