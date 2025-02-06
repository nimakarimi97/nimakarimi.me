<script setup>
import { useUtils } from '../../composables/utils.js'
import ImageView from './ImageView.vue'

const props = defineProps({
  src: String,
  type: String,
  color: String,
  textClass: String,
})

const utils = useUtils()

/**
 * @constant
 * @type {string[]}
 */
const AVAILABLE_TYPES = ['standard', 'small']

/**
 * @return {boolean}
 * @private
 */
function _isImage() {
  return utils.isStringAnImageUrl(props.src)
}

/**
 * @return {string}
 * @private
 */
function _getCircleClassList() {
  let type = props.type
  if (!AVAILABLE_TYPES.includes(type))
    type = AVAILABLE_TYPES[0]

  let classList = 'circle-icon'
  classList += ` circle-icon-${type}`
  return classList
}

/**
 * @return {string}
 * @private
 */
function _getCircleIconClassList() {
  let classList = props.src
  if (props.textClass) {
    classList += ` ${props.textClass}`
  }

  return classList
}

/**
 * @return {string}
 * @private
 */
function _getStyle() {
  if (!props.color || _isImage()) {
    return ``
  }

  return `background-color:${props.color}`
}
</script>

<template>
  <div :class="_getCircleClassList()">
    <!-- If src is an image... -->
    <ImageView
      v-if="_isImage()"
      class="circle-icon-img"
      :src="props.src"
      alt="icon"
      :style="_getStyle()"
    />

    <div
      v-else
      class="circle-icon-fa-icon"
      :style="_getStyle()"
    >
      <i
        class="fa-inverse"
        :class="_getCircleIconClassList()"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '/src/scss/_theming.scss';

@mixin create-size-variant($sizes, $modifier) {
  @each $size, $value in $sizes {
    @include media-breakpoint-down(#{$size}) {
      .circle-icon-#{$modifier} {
        height: $value * 2;
        width: $value * 2;
        min-width: $value * 2;
        min-height: $value * 2;

        font-size: $value;
        z-index: 50;

        // .circle-icon-img {
        // }
      }
    }
  }
}

.circle-icon {
  display: inline-flex;
  vertical-align: top;
}

.circle-icon-img,
.circle-icon-fa-icon {
  border-radius: 100%;
  width: 100%;
  height: 100%;
}

.circle-icon-fa-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $primary;
}

@include create-size-variant(
  (
    xxxl: 1.2rem,
    xxl: 1.15rem,
    xl: 1.1rem,
    lg: 1.05rem,
    md: 0.95rem,
    sm: 0.9rem,
  ),
  standard
);

@include create-size-variant(
  (
    xxxl: 1rem,
    xxl: 1rem,
    lg: 0.9rem,
    md: 0.8rem,
    sm: 0.7rem,
  ),
  small
);
</style>
