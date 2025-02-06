<script setup>
import { computed } from 'vue'
import { useData } from '../../composables/data.js'
import { useLanguage } from '../../composables/language.js'
import { useLayout } from '../../composables/layout.js'

const props = defineProps({
  displayLanguageLabel: Boolean,
})
const data = useData()
const language = useLanguage()
const layout = useLayout()

/**
 * @type {ComputedRef<object>}
 */
const selectedLanguage = computed(() => {
  return language.getSelectedLanguage()
})

/**
 * @type {ComputedRef<object[]>}
 */
const availableLanguages = computed(() => {
  return language.getAvailableLanguages()
})

/**
 * @param {object} lang
 * @private
 */
function _onLanguageSelected(lang) {
  const feedbackView = layout.getFeedbackView()
  feedbackView.showActivitySpinner(`${data.getString('changingLanguage')}...`)

  setTimeout(() => {
    language.selectLanguage(lang)
    feedbackView.hideActivitySpinner()
  }, 300)
}
</script>

<template>
  <div
    v-if="language.supportsMultipleLanguages()"
    class="language-picker"
  >
    <!-- Bootstrap Dropdown -->
    <div class="dropdown">
      <!-- Dropdown Toggle Button -->
      <button
        class="dropdown-toggle"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <!-- Selected Flag Icon -->
        <img
          :alt="selectedLanguage.name"
          :src="selectedLanguage.flagUrl"
          class="img-fluid img-selected-language-flag"
        >

        <!-- Selected Language Name -->
        <span
          v-if="props.displayLanguageLabel"
          class="dropdown-item-label d-none d-lg-inline"
        >
          {{ selectedLanguage.name }}
        </span>
      </button>

      <!-- Dropdown Menu -->
      <ul class="dropdown-menu">
        <!-- Dropdown Item -->
        <li
          v-for="lang in availableLanguages"
          :key="lang.id"
        >
          <button
            class="dropdown-item"
            @click="_onLanguageSelected(lang)"
          >
            <!-- Language Flag Icon -->
            <img
              :alt="lang.name"
              :src="lang.flagUrl"
              class="img-fluid img-language-flag"
            >

            <!-- Language Name -->
            <span class="dropdown-item-label">
              {{ lang.name }}
            </span>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '/src/scss/_theming.scss';

$menu-background-color: lighten($nav-background-color, 5%);
$menu-border-color: darken($nav-background-color, 1%);
$menu-hover-background-color: lighten($nav-background-color, 10%);

.dropdown-toggle {
  border-width: 0;
  opacity: 0.9;
  background-color: transparent;
  color: $white;

  &:hover {
    opacity: 1;
  }
}

li {
  &:not(:last-child) {
    border-bottom: 1px solid $menu-border-color;
  }
}

.dropdown-menu {
  padding: 1px;
  border: 2px solid $menu-border-color;
  background-color: $menu-background-color;
}

.dropdown-item {
  padding: 10px 15px;
  background-color: $menu-background-color;
  color: $white;

  &:hover {
    background-color: $menu-hover-background-color;
  }
}

.dropdown-item-label {
  margin-left: 8px;
  font-family: $custom-subheadings-font-family;
  font-size: 0.9rem;
}

.img-language-flag {
  width: 20px;
  height: 20px;
}

.img-selected-language-flag {
  width: 24px;
  height: 24px;
}
</style>
