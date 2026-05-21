<script setup>
import { useData } from '../../../composables/data.js'
import CopyButton from '/src/vue/components/widgets/CopyButton.vue'

/**
 * @property {object[]} items
 */

const props = defineProps({
  items: Array,
  displayAsList: Boolean,
})

const data = useData()

/**
 * @param {object} item
 * @return {string}
 * @private
 */
function _getItemLabel(item) {
  return item.value || item.valueShort
}

/**
 * @param {object} item
 * @return {object}
 * @private
 */
function _getBrandColor(item) {
  const brandColors = {
    email: '#0343ff',
    youtube: '#FF0000',
    github: '#333333',
    linkedin: '#0A66C2',
    instagram: '#E4405F',
    facebook: '#1877F2',
  }
  return {
    backgroundColor: brandColors[item.id] || '#2629e1',
  }
}
</script>

<template>
  <div class="row pt-1 pt-lg-3">
    <div
      v-for="item in props.items"
      :key="item.id"
      class="col-12"
      :class="!displayAsList ? 'col-md-6' : ''"
    >
      <!-- Item -->
      <div class="contact-item">
        <!-- Item Logo -->
        <a
          :href="item.href"
          target="_blank"
          class="contact-item-logo"
          :style="_getBrandColor(item)"
        >
          <i :class="item.faIcon" />
        </a>

        <!-- Item Texts -->
        <div class="contact-item-content">
          <!-- Item Title -->
          <h5 class="contact-item-title">
            {{ data.getString(item.id) }}
          </h5>

          <!-- Item Value + Copy -->
          <div class="d-flex">
            <!-- Item Link... -->
            <a
              v-if="item.href"
              :href="item.href"
              class="text-3 muted"
              target="_blank"
              v-html="_getItemLabel(item)"
            />

            <!-- Fallback (if there's not a link...) -->
            <p
              v-else
              class="text-3 text-muted mb-0"
              v-html="_getItemLabel(item)"
            />

            <CopyButton
              v-if="item.copy"
              :text="item.value"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '/src/scss/_theming.scss';

.contact-item {
  @include generate-dynamic-styles-with-hash(
    (
      xxxl: (
        height: 85px,
      ),
      xl: (
        height: 75px,
      ),
      lg: (
        height: 65px,
      ),
      md: (
        height: 60px,
      ),
      sm: (
        height: 55px,
      ),
    )
  );

  display: flex;
  padding-bottom: 0.5rem;
  text-align: left;
}

.contact-item-logo {
  --font-size: 1.5rem;

  @include media-breakpoint-down(xl) {
    --font-size: 1.4rem;
  }

  @include media-breakpoint-down(lg) {
    --font-size: 1.2rem;
  }

  @include media-breakpoint-down(md) {
    --font-size: 1.1rem;
  }

  @include media-breakpoint-down(sm) {
    --font-size: 1rem;
  }

  --dimensions: calc(var(--font-size) * 2.4);

  min-width: var(--dimensions);
  width: var(--dimensions);
  height: var(--dimensions);
  font-size: var(--font-size);

  display: inline-flex;
  justify-content: center;
  align-items: center;

  margin-top: 0;
  margin-right: 1rem;

  opacity: 0.9;
  border-radius: 50%;

  color: $white;
  transition: all 0.3s ease-in-out;

  &:hover {
    filter: brightness(1.1);
    transform: scale(1.05);
  }
}

.contact-item-content {
  @include generate-dynamic-styles-with-hash(
    (
      xxxl: (
        margin-top: 5px,
      ),
      lg: (
        margin-top: 1px,
      ),
    )
  );

  display: flex;
  flex-direction: column;
}

.contact-item-title {
  @include generate-dynamic-styles-with-hash(
    (
      xxxl: (
        margin-bottom: 0.25rem,
      ),
      lg: (
        margin-bottom: 0.2rem,
      ),
    )
  );

  font-weight: bold;
}
</style>
