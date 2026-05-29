<script setup>
import { useLanguage } from '../../composables/language.js'
import { useUtils } from '../../composables/utils.js'

const props = defineProps({
  items: { type: Array, required: true },
})

const language = useLanguage()
const utils = useUtils()

/**
 * @param {[string, string|null]} period
 * @return {string}
 */
function formatPeriod(period) {
  if (!period || !period.length)
    return ''
  const lang = language.getSelectedLanguage().id
  const from = utils.localizeDate(period[0], lang)
  if (period.length < 2 || period[1] == null)
    return from
  const to = utils.localizeDate(period[1], lang)
  return `${from} <span class="me-1 ms-1">➔</span> ${to}`
}
</script>

<template>
  <ul class="sub-timeline">
    <li
      v-for="sub in props.items"
      :key="sub.id"
      class="sub-timeline-item"
    >
      <span class="sub-timeline-dot">
        <i :class="sub.faIcon || 'fa-solid fa-circle-dot'" />
      </span>

      <div class="sub-timeline-content">
        <div class="sub-timeline-header">
          <h6
            class="sub-timeline-title fw-bold mb-0"
            v-html="sub.locales.title"
          />
          <span
            v-if="sub.period"
            class="sub-timeline-period text-light-6 text-1"
            v-html="formatPeriod(sub.period)"
          />
        </div>
        <p
          v-if="sub.locales.description"
          class="sub-timeline-desc text-2 text-normal mb-0 mt-1"
          v-html="sub.locales.description"
        />
      </div>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
@import '/src/scss/_theming.scss';

ul.sub-timeline {
  --sub-dot-size: 28px;
  --sub-line-width: 2px;

  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0 0;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    top: calc(var(--sub-dot-size) / 2);
    bottom: calc(var(--sub-dot-size) / 2);
    left: calc(var(--sub-dot-size) / 2 - var(--sub-line-width) / 2);
    width: var(--sub-line-width);
    background-color: $light-4;
  }
}

.sub-timeline-item {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;

  &:not(:last-child) {
    margin-bottom: 1rem;
  }
}

.sub-timeline-dot {
  flex: 0 0 auto;
  width: var(--sub-dot-size);
  height: var(--sub-dot-size);
  border-radius: 50%;
  background-color: lighten($primary, 20%);
  color: $white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  z-index: 1;
  border: 2px solid $light-3;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.sub-timeline-content {
  flex: 1 1 auto;
  background-color: lighten($background-color, 3%);
  border: 1px solid rgba(black, 0.06);
  border-radius: 8px;
  padding: 0.6rem 0.85rem;
  box-shadow:
    0 2px 6px 0 rgba(0, 0, 0, 0.04),
    0 1px 3px 0 rgba(0, 0, 0, 0.04);
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.25s ease-in-out;

  &:hover {
    transform: translateY(-1px);
    box-shadow:
      0 4px 12px 0 rgba(0, 0, 0, 0.08),
      0 2px 4px 0 rgba(0, 0, 0, 0.05);
  }
}

.sub-timeline-header {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
}

.sub-timeline-title {
  color: $dark;
}

.sub-timeline-period {
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  &:before {
    content: '\f133';
    font-family: 'Font Awesome 6 Free';
    font-weight: 400;
    margin-right: 0.35rem;
    opacity: 0.7;
  }
}

.sub-timeline-desc {
  color: $dark;
  opacity: 0.85;
}

@include media-breakpoint-down(sm) {
  .sub-timeline-header {
    flex-direction: column;
    gap: 0.15rem;
  }
}
</style>
