<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useConstants } from '../../composables/constants.js'
import { useData } from '../../composables/data.js'

const router = useRouter()
const data = useData()
const constants = useConstants()
const visible = ref(false)
const dismissed = ref(false)
let toastTimeoutId = null

const TOAST_SHOW_DELAY_MS = 3000

function clearToastTimeout() {
  if (toastTimeoutId !== null) {
    clearTimeout(toastTimeoutId)
    toastTimeoutId = null
  }
}

function scheduleToastShow() {
  clearToastTimeout()
  toastTimeoutId = setTimeout(() => {
    if (router.currentRoute.value.path === '/about')
      visible.value = true

    toastTimeoutId = null
  }, TOAST_SHOW_DELAY_MS)
}

const isSmallScreen = window.innerWidth <= constants.BOOTSTRAP_BREAKPOINTS.lg

onMounted(() => {
  // Show the toast only on larger screens and on the about page of mobile
  if (isSmallScreen && router.currentRoute.value.path !== '/about')
    return
  else if (isSmallScreen && router.currentRoute.value.path === '/about')
    return syncToastWithRoute()

  const storedData = localStorage.getItem(constants.LOCAL_STORAGE_ITEMS.storyToast)

  if (storedData) {
    const { timestamp } = JSON.parse(storedData)
    const now = Date.now()
    const oneDayMs = 24 * 60 * 60 * 1000

    // Check if more than one day has passed
    if (now - timestamp < oneDayMs) {
      dismissed.value = true
      return
    } else {
      // Clear expired dismissal
      localStorage.removeItem(constants.LOCAL_STORAGE_ITEMS.storyToast)
    }
  }

  scheduleToastShow()
})

/**
 * Shows the toast when navigating to the about page, and hides it when navigating away.
 */
function syncToastWithRoute() {
  if (router.currentRoute.value.path === '/about') {
    scheduleToastShow()
  } else {
    clearToastTimeout()
    visible.value = false
  }
}

watch(() => router.currentRoute.value.path, isSmallScreen ? syncToastWithRoute : () => {})

onBeforeUnmount(clearToastTimeout)

function goToStory() {
  dismiss()
  router.push('/')
}

function dismiss() {
  visible.value = false
  dismissed.value = true
  localStorage.setItem(constants.LOCAL_STORAGE_ITEMS.storyToast, JSON.stringify({
    timestamp: Date.now(),
  }))
}
</script>

<template>
  <Transition name="toast">
    <div v-if="visible && !dismissed" class="story-toast">
      <button class="story-toast__close" aria-label="Dismiss" @click="dismiss">
        <i class="fa-solid fa-xmark" />
      </button>
      <div class="story-toast__content" @click="goToStory">
        <i class="fa-solid fa-book-open story-toast__icon" />
        <div class="story-toast__text">
          <span class="story-toast__title">{{ data.getString('wannaKnowStory') }}</span>
          <span class="story-toast__subtitle">{{ data.getString('seeHowIGotHere') }}</span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
@import '/src/scss/_theming.scss';

.story-toast {
  position: fixed;
  bottom: 2%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9000;
  background: rgba(15, 15, 25, 0.92);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(129, 140, 248, 0.2);
  border-radius: 18px;
  padding: 26px 36px;
  min-width: 520px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(129, 140, 248, 0.08);

  @media (max-width: 1024px) {
    bottom: $story-toast-height;
    left: 20%;
    right: 20%;
    min-width: auto;
    padding: 18px 24px;
    transform: none;
  }

  @media (max-width: 768px) {
    bottom: $story-toast-height;
    left: 16px;
    right: 16px;
    transform: none;
  }
}

.story-toast__close {
  position: absolute;
  top: 8px;
  right: 10px;
  background: none;
  border: none;
  color: rgba(white, 0.3);
  cursor: pointer;
  font-size: 1rem;
  padding: 4px;
  transition: color 0.2s;

  &:hover {
    color: rgba(white, 0.7);
  }
}

.story-toast__content {
  display: flex;
  align-items: center;
  gap: 18px;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateX(2px);
  }
}

.story-toast__icon {
  font-size: 1.3rem;
  color: #818cf8;
  flex-shrink: 0;
}

.story-toast__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.story-toast__title {
  font-size: 0.88rem;
  font-weight: 600;
  color: rgba(white, 0.9);
  letter-spacing: 0.01em;
}

.story-toast__subtitle {
  font-size: 0.72rem;
  color: rgba(white, 0.4);
  letter-spacing: 0.03em;
}

.story-toast__arrow {
  font-size: 0.82rem;
  color: rgba(white, 0.3);
  flex-shrink: 0;
  transition:
    transform 0.2s ease,
    color 0.2s ease;

  .story-toast__content:hover & {
    transform: translateX(3px);
    color: #818cf8;
  }
}

.toast-enter-active {
  transition:
    opacity 0.4s ease-out,
    translate 0.4s ease-out,
    scale 0.4s ease-out;
}
.toast-leave-active {
  transition:
    opacity 0.3s ease-in,
    translate 0.3s ease-in,
    scale 0.3s ease-in;
}
.toast-enter-from {
  opacity: 0;
  translate: 0 16px;
  scale: 0.9;
}
.toast-enter-to {
  opacity: 1;
  translate: 0 0;
  scale: 1;
}
.toast-leave-from {
  opacity: 1;
  translate: 0 0;
  scale: 1;
}
.toast-leave-to {
  opacity: 0;
  translate: 0 8px;
  scale: 0.9;
}
</style>
