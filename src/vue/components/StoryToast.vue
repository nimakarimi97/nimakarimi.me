<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const visible = ref(false)
const dismissed = ref(false)

onMounted(() => {
  const storedData = localStorage.getItem('story-toast-dismissed')

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
      localStorage.removeItem('story-toast-dismissed')
    }
  }

  setTimeout(() => {
    visible.value = true
  }, 3000)
})

function goToStory() {
  dismiss()
  router.push('/')
}

function dismiss() {
  visible.value = false
  dismissed.value = true
  localStorage.setItem('story-toast-dismissed', JSON.stringify({
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
          <span class="story-toast__title">Wanna know my story?</span>
          <span class="story-toast__subtitle">See how I got here</span>
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
    bottom: $nav-tabs-height + 10px;
    left: 20%;
    right: 20%;
    min-width: auto;
    padding: 18px 24px;
    transform: none;
  }

  @media (max-width: 768px) {
    bottom: $nav-tabs-height + 10px;
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
