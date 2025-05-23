<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useData } from '../../../composables/data.js'
import { useNavigation } from '../../../composables/navigation.js'
import LanguagePicker from '../../components/LanguagePicker.vue'
import NavProfileCard from '../partials/NavProfileCard.vue'

const emit = defineEmits(['linkClicked'])
const data = useData()
const navigation = useNavigation()
const router = useRouter()

const canShrink = computed(() => {
  return data.getSettings().sidebarShrinkingEnabled
})

onMounted(() => {
  if (!canShrink.value) {
    navigation.setSidebarStatus(true)
  }
})

/**
 * @type {ComputedRef<object>}
 */
const profileData = computed(() => {
  return data.getProfile()
})

/**
 * @param {object} section
 * @private
 */
function _getNavItemClassList(section) {
  let classList = 'nav-item'
  if (navigation.isSectionActive(section.id)) {
    classList += ' nav-item-selected'
  }

  return classList
}

/**
 * @param {object} section
 * @private
 */
function _onLinkClicked(section) {
  emit('linkClicked', section.id)
  router.push({ name: section.id })
}

/**
 * @private
 */
function _onToggleButton() {
  navigation.toggleSidebarStatus()
}
</script>

<template>
  <nav
    class="nav-sidebar"
    :class="navigation.isSidebarExpanded() ? '' : 'nav-sidebar-shrink'"
  >
    <!-- Main Content -->
    <div
      v-if="profileData"
      class="nav-sidebar-content"
    >
      <!-- Profile Card -->
      <NavProfileCard
        :profile-data="profileData"
        :shrink="!navigation.isSidebarExpanded()"
      />

      <!-- Nav Link List -->
      <ul class="nav-links">
        <!-- Nav Link -->
        <li
          v-for="section in data.getSections()"
          :key="section.id"
          :class="_getNavItemClassList(section)"
        >
          <button
            class="nav-link"
            @click="_onLinkClicked(section)"
          >
            <i :class="section.faIcon" />
            <span>{{ data.getString(section.id) }}</span>
          </button>
        </li>
      </ul>
    </div>

    <!-- Footer -->
    <div
      v-if="profileData"
      class="nav-sidebar-footer"
    >
      <!-- Language Picker -->
      <LanguagePicker
        :display-language-label="navigation.isSidebarExpanded()"
        class="language-picker"
      />

      <!-- Credits -->
      <div
        class="nav-sidebar-footer-credits text-2 mt-3"
        :class="!canShrink ? 'mb-3' : 'mb-0'"
      >
        <span v-html="profileData.locales.credits" />
      </div>

      <!-- Toggle Button -->
      <button
        v-if="canShrink"
        class="nav-toggle-button mt-3"
        @click="_onToggleButton()"
      >
        <i
          class="fa-solid"
          :class="navigation.isSidebarExpanded() ? 'fa-caret-left' : 'fa-caret-right'"
        />
      </button>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
@import '/src/scss/_theming.scss';

.nav-sidebar {
  position: fixed;
  display: flex;
  flex-direction: column;

  height: 100vh;
  width: $nav-sidebar-column-size;
  overflow: auto;
  z-index: 99;

  background-color: $nav-background-color;

  .nav-sidebar-content {
    width: 100%;
    margin: auto 0;
    padding: 0 2.7rem;
  }

  ul.nav-links {
    position: relative;
    list-style: none;
    padding: 0;

    @media screen and (min-height: 780px) {
      padding-top: 1rem;
    }
  }

  li.nav-item {
    display: inline-flex;
    justify-content: left;
    align-items: center;

    width: 100%;
    min-height: clamp(2rem, calc(100vh / 41) * 2, 2.7rem);

    .nav-link {
      cursor: pointer;
      font-size: clamp(0.9rem, calc(100vh / 50), 1rem);

      font-family: $headings-font-family;
      text-transform: uppercase;
      text-align: center;

      transition: all 0.3s ease-in-out;
      color: $light-1;

      i {
        min-width: 35px;
        color: $nav-item-grayed-out-color;
        transition: color 0.2s;
      }

      &:hover {
        color: darken($nav-item-lighten-color, 10%);

        i {
          color: $nav-item-lighten-strong-color;
        }
      }

      &:active {
        color: darken($nav-item-lighten-color, 20%);
        transform: scale(0.9);
      }
    }

    &.nav-item-selected {
      .nav-link {
        color: $nav-item-lighten-color;
        margin-left: 1.5rem;

        i {
          color: $nav-item-lighten-strong-color;
        }
      }
    }
  }

  .nav-sidebar-footer {
    text-align: center;
    padding: 1rem;
    color: $white;

    .nav-sidebar-footer-credits {
      font-family: $custom-subheadings-font-family;
      color: $light-4;

      display: block;

      @media screen and (max-height: 680px) {
        display: none;
      }
    }
  }

  .nav-toggle-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    border: none;
    border-radius: 100%;

    width: 32px;
    height: 32px;

    background-color: rgba(black, 0.2);
    color: $light-3;

    &:hover {
      background-color: rgba(black, 0.25);
      color: $light-1;
    }
  }

  .nav-sidebar-shrink {
    width: $nav-sidebar-column-size-shrink;
    overflow: visible;
    transition: $nav-sidebar-transition;

    li.nav-item {
      border-radius: 7px;
      margin-left: 0.5rem;
      padding: 0;
      width: calc($nav-sidebar-column-size-shrink - 1rem);
      min-height: 2.7rem;

      display: flex;
      align-items: center;
      justify-content: center;

      span {
        display: none;
      }

      &.nav-item-selected {
        background-color: rgba(black, 0.25);
      }
    }

    .nav-sidebar-footer-credits {
      display: none;
    }

    .nav-toggle-button {
      margin: 1.5rem 0 1rem !important;
    }

    @media screen and (max-height: 620px) {
      ul.nav-links {
        margin-bottom: 0.5rem !important;
      }

      .language-picker {
        display: none;
      }

      .nav-sidebar-footer {
        padding: 0;
      }

      .nav-toggle-button {
        margin-top: 0 !important;
      }
    }

    @media screen and (max-height: 550px) {
      overflow-y: auto;
    }
  }
}
</style>
