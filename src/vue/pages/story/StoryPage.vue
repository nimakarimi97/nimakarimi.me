<script setup>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useConstants } from '../../../composables/constants.js'
import { useData } from '../../../composables/data.js'
import { useLanguage } from '../../../composables/language.js'

gsap.registerPlugin(ScrollTrigger)

const router = useRouter()
const language = useLanguage()
const data = useData()
const constants = useConstants()

// Language dropdown state
const showLanguageDropdown = ref(false)

// Computed language properties
const selectedLanguage = computed(() => language.getSelectedLanguage())
const availableLanguages = computed(() => language.getAvailableLanguages())

// Translation helper
const getString = key => data.getString(key)

// ─────────────────────────────────────────────────────────────────────────────
// Refs
// ─────────────────────────────────────────────────────────────────────────────
const wrapper = ref(null)
const cursorOuter = ref(null)
const cursorInner = ref(null)
const progressBar = ref(null)
const scrollIndicator = ref(null)
const heroSection = ref(null)

// ─────────────────────────────────────────────────────────────────────────────
// Cursor
// ─────────────────────────────────────────────────────────────────────────────
let mouseX = 0
let mouseY = 0
let outerX = 0
let outerY = 0
let cursorRaf = null
let isTouch = false
let curScale = 1
let targetScale = 1

function lerp(a, b, t) {
  return a + (b - a) * t
}

function onMouseMove(e) {
  mouseX = e.clientX
  mouseY = e.clientY
  // Activate custom cursor on first move (fallback: system cursor stays until then)
  if (wrapper.value && !wrapper.value.classList.contains('cursor-active')) {
    wrapper.value.classList.add('cursor-active')
    document.body.classList.add('story-cursor-active')
  }
  if (cursorOuter.value)
    cursorOuter.value.style.opacity = '1'
  if (cursorInner.value) {
    cursorInner.value.style.opacity = '1'
    cursorInner.value.style.animationPlayState = 'running'
  }
}

function animateCursor() {
  outerX = lerp(outerX, mouseX, 0.09)
  outerY = lerp(outerY, mouseY, 0.09)
  // Lerp scale inside RAF so it never conflicts with the translate transform
  curScale = lerp(curScale, targetScale, 0.15)
  if (cursorOuter.value) {
    cursorOuter.value.style.transform = `translate3d(${outerX}px,${outerY}px,0) translate(-50%,-50%) scale(${curScale})`
  }
  if (cursorInner.value) {
    cursorInner.value.style.transform = `translate3d(${mouseX}px,${mouseY}px,0) translate(-50%,-50%)`
  }
  cursorRaf = requestAnimationFrame(animateCursor)
}

function onMouseEnterLink() {
  targetScale = 2.2
}
function onMouseLeaveLink() {
  targetScale = 1
}

function persistStoryToast() {
  localStorage.setItem(constants.LOCAL_STORAGE_ITEMS.storyToast, JSON.stringify({
    timestamp: Date.now(),
  }))
}

function navigateToResume() {
  persistStoryToast()

  window.scrollTo({ top: 0, behavior: 'instant' })
  router.push('/about')
}

function selectLanguage(lang) {
  language.selectLanguage(lang)
  showLanguageDropdown.value = false
}

function toggleLanguageDropdown() {
  showLanguageDropdown.value = !showLanguageDropdown.value
}

// ─────────────────────────────────────────────────────────────────────────────
// Code lines for scene 3
// ─────────────────────────────────────────────────────────────────────────────
const codeLines = [
  'import { Robot } from "ros/control"',
  'const joints = new KinematicChain({ dof: 6 })',
  'function pid(desired, actual, Kp, Ki, Kd) {',
  '  const error = desired - actual',
  '  return Kp * error + Ki * ∫error + Kd * Δerror',
  '}',
  'planner.computePath(start, goal)',
  'robot.execute(trajectory)',
  'gazebo.simulate(world, dt=0.001)',
  'console.log("wait... this is actually fun")',
  'ros.subscribe("/joint_states", handler)',
  'while (true) { await controlLoop() }',
]

// ─────────────────────────────────────────────────────────────────────────────
// GSAP animation setup
// ─────────────────────────────────────────────────────────────────────────────
function initAnimations() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced)
    return

  const mm = gsap.matchMedia()

  // ── Desktop: full pinned scroll-driven experience ─────────────────────────
  mm.add('(min-width: 1024px)', () => {
    const PIN_EASE = 600
    const PIN_LONG = 900

    const mkTrigger = (selector, dur = PIN_EASE) => ({
      trigger: selector,
      start: 'top top',
      end: `+=${dur}`,
      pin: true,
      pinSpacing: true,
      scrub: 1.2,
      anticipatePin: 1,
    })

    // ── Scene 1: Origin ──────────────────────────────────────────────────────
    gsap.timeline({ scrollTrigger: mkTrigger('.scene-origin') })
      .from('.s1-bg-text', { opacity: 0, scale: 0.85, duration: 0.5 })
      .from('.s1-chapter', { opacity: 0, y: -24, duration: 0.25 }, 0.05)
      .from('.s1-title .w', {
        y: 100,
        opacity: 0,
        stagger: 0.04,
        duration: 0.5,
        ease: 'power3.out',
      }, 0.15)
      .from('.s1-subtitle', { y: 40, opacity: 0, duration: 0.4 }, 0.5)
      .from('.s1-detail', { y: 20, opacity: 0, duration: 0.3 }, 0.7)
      .from('.s1-gear', {
        rotation: -180,
        scale: 0,
        opacity: 0,
        filter: 'drop-shadow(0 0 0px rgba(100, 200, 255, 0))',
        duration: 0.8,
        ease: 'back.out(1.7)',
      }, 0.7)
      .to('.s1-gear', {
        filter: 'drop-shadow(0 0 20px rgba(100, 200, 255, 0.6))',
        duration: 0.6,
        ease: 'sine.inOut',
        yoyo: true,
      }, 0.8)

    // ── Scene 2: Robotics ────────────────────────────────────────────────────
    gsap.timeline({ scrollTrigger: mkTrigger('.scene-robotics') })
      .from('.s2-chapter', { opacity: 0, y: -24, duration: 0.25 })
      .from('.s2-title .w', {
        x: -120,
        opacity: 0,
        stagger: 1,
        duration: 0.5,
        ease: 'power3.out',
      }, 0.1)
      .from('.s2-robot', { scale: 0, opacity: 0, rotation: -30, duration: 0.7, ease: 'back.out(1.7)' }, 3.5)
      .to('.sr-drone', {
        y: -20,
        filter: 'drop-shadow(0 20px 40px rgba(100, 200, 255, 0.3))',
        duration: 2,
        ease: 'power2.inOut',
      }, 4.0)
      .to('.sr-drone .sr-prop span', {
        rotation: 360,
        duration: 1,
        ease: 'none',
      }, 4.0)
      .to('.sr-drone-light', {
        opacity: 0.8,
        filter: 'drop-shadow(0 0 15px rgba(255, 150, 0, 0.6))',
        duration: 1.5,
        ease: 'power2.inOut',
      }, 2.0)
      .from('.s2-paper', { y: -70, opacity: 0, duration: 0.5 }, 5.8)
      .from('.s2-subtitle', { y: 30, opacity: 0, duration: 0.4 }, 6.5)

    // ── Scene 3: Code revelation ─────────────────────────────────────────────
    gsap.timeline({ scrollTrigger: mkTrigger('.scene-code', PIN_LONG) })
      .from('.s3-chapter', { opacity: 0, duration: 0.2 })
      .from('.s3-code-bg .cl', { opacity: 0, x: 40, stagger: 0.02, duration: 0.15 }, 0)
      .from('.s3-hate', { opacity: 0, y: 70, duration: 0.4 }, 0.1)
      .from('.s3-strike', { scaleX: 0, transformOrigin: 'left center', duration: 0.35 }, 0.5)
      .from('.s3-love', { opacity: 0, y: 70, duration: 0.4 }, 0.5)
      .from('.s3-subtitle', { opacity: 0, y: 30, duration: 0.4 }, 0.75)

    // ── Scene 4: COVID ───────────────────────────────────────────────────────
    gsap.timeline({ scrollTrigger: mkTrigger('.scene-covid') })
      .from('.s4-year', { opacity: 0, scale: 1.1, duration: 0.4 })
      .from('.s4-chapter', { opacity: 0, y: -24, duration: 0.25 }, 0.05)
      .from('.s4-title .w', {
        y: 80,
        opacity: 0,
        stagger: 0.05,
        duration: 0.5,
        ease: 'power3.out',
      }, 0.2)
      .from('.s4-subtitle', { y: 30, opacity: 0, duration: 0.4 }, 0.6)
      .from('.s4-techs .tc', { y: 22, opacity: 0, stagger: 0.07, duration: 0.3 }, 0.7)
      .from('.s4-mac-robot', { scale: 0.85, opacity: 0, duration: 0.6, ease: 'back.out(1.5)' }, 0.4)

    // ── Scene 5: Academia ────────────────────────────────────────────────────
    gsap.timeline({ scrollTrigger: mkTrigger('.scene-academia', PIN_EASE + 100) })
      .from('.s5-chapter', { opacity: 0, y: -24, duration: 0.25 })
      .from('.s5-title .w', {
        y: 80,
        opacity: 0,
        stagger: 0.05,
        duration: 0.5,
        ease: 'power3.out',
      }, 0.1)
      .from('.s5-uni', { scale: 0.85, opacity: 0, duration: 0.5, ease: 'back.out' }, 0.35)
      .from('.s5-visual', { scale: 0.95, opacity: 0, duration: 0.5, ease: 'power3.out' }, 0.4)
      .from('.s5-subtitle', { y: 30, opacity: 0, duration: 0.4 }, 0.55)
      .from('.s5-acts .ac', { x: -50, opacity: 0, stagger: 0.1, duration: 0.4 }, 0.65)
      .from('.s5-arches .arch', { scale: 0, opacity: 0, stagger: 0.12, duration: 0.5, ease: 'back.out' }, 0.1)

    // ── Scene 6: Challenges ──────────────────────────────────────────────────
    gsap.timeline({ scrollTrigger: mkTrigger('.scene-challenges', PIN_EASE + 100) })
      .from('.s6-chapter', { opacity: 0, duration: 0.2 })
      .from('.s6-n1', { opacity: 0, y: 50, duration: 0.4 }, 0.1)
      .from('.s6-n2', { opacity: 0, y: 50, duration: 0.4 }, 0.25)
      .from('.s6-n3', { opacity: 0, y: 50, duration: 0.4 }, 0.4)
      .from('.s6-divider', { scaleX: 0, transformOrigin: 'center', duration: 1 }, 0.6)
      .from('.s6-persist', {
        opacity: 0,
        y: 100,
        filter: 'blur(15px)',
        duration: 2.5,
      }, 1.7)

    // ── Scene 7: Breakthrough ────────────────────────────────────────────────
    gsap.timeline({ scrollTrigger: mkTrigger('.scene-breakthrough', PIN_LONG) })
      .from('.s7-glow', { scale: 0, opacity: 0, duration: 0.8, ease: 'power2.out' }, 0)
      .from('.s7-chapter', { opacity: 0, duration: 0.2 }, 0)
      .from('.s7-title .w', {
        opacity: 0,
        clipPath: 'inset(0 100% 0 0)',
        duration: 2,
      }, 0.2)
      .from('.s7-title', {
        opacity: 0,
        y: 40,
      }, 0.2)
      .from('.s7-steps .step', { x: -80, opacity: 0, stagger: 0.15, duration: 0.5 }, 0.45)
      .from('.s7-subtitle', { y: 30, opacity: 0, duration: 0.4 }, 0.9)

    // ── Scene 8: Evolution ───────────────────────────────────────────────────
    gsap.timeline({ scrollTrigger: mkTrigger('.scene-evolution', PIN_LONG) })
      .from('.s8-chapter', { opacity: 0, y: -24, duration: 0.25 })
      .from('.s8-title .w', {
        y: 80,
        opacity: 0,
        stagger: 0.05,
        duration: 0.5,
        ease: 'power3.out',
      }, 0.1)
      .from('.s8-stack .si', { y: 50, opacity: 0, stagger: 0.08, duration: 0.4 }, 0.45)
      .from('.s8-stack .sa', { opacity: 0, duration: 0.3, stagger: 0.08 }, 0.5)
      .from('.s8-badge', { scale: 0.85, opacity: 0, duration: 0.5 }, 0.75)
      .from('.s8-subtitle', { y: 30, opacity: 0, duration: 0.4 }, 0.9)

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  })

  // ── Tablet & Mobile: entrance reveals (no pins) ───────────────────────────
  mm.add('(max-width: 1023px)', () => {
    document.querySelectorAll('.scene').forEach((scene) => {
      gsap.timeline({
        scrollTrigger: {
          trigger: scene,
          start: 'top 78%',
          once: true,
        },
      })
        .from(scene.querySelectorAll('.chapter-label, .display-title, .scene-sub, .scene-det'), {
          y: 50,
          opacity: 0,
          stagger: 0.12,
          duration: 0.8,
          ease: 'power2.out',
        })
        .from(scene.querySelectorAll('.s2-paper, .s4-techs, .s5-uni, .s5-acts, .s7-steps, .s8-stack, .s8-badge'), {
          y: 30,
          opacity: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power2.out',
        }, '-=0.4')
    })
  })

  // ── Background color transitions (all screen sizes) ────────────────────────
  const bgMap = [
    ['.scene-origin', '#06080f'],
    ['.scene-robotics', '#080b18'],
    ['.scene-code', '#0a0b1e'],
    ['.scene-covid', '#060608'],
    ['.scene-academia', '#08101e'],
    ['.scene-challenges', '#050507'],
    ['.scene-breakthrough', '#0d0f1a'],
    ['.scene-evolution', '#060e1a'],
    ['.scene-present', '#06080f'],
  ]

  bgMap.forEach(([cls, color]) => {
    ScrollTrigger.create({
      trigger: cls,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => gsap.to(wrapper.value, { backgroundColor: color, duration: 0.9, ease: 'none' }),
      onEnterBack: () => gsap.to(wrapper.value, { backgroundColor: color, duration: 0.9, ease: 'none' }),
    })
  })

  // ── Scroll progress bar ────────────────────────────────────────────────────
  ScrollTrigger.create({
    start: 'top top',
    end: 'max',
    onUpdate: (self) => {
      if (progressBar.value)
        progressBar.value.style.transform = `scaleX(${self.progress})`
    },
  })

  // ── Scroll hint fade out ────────────────────────────────────────────────────
  ScrollTrigger.create({
    start: 'top top',
    end: '+=400',
    onUpdate: (self) => {
      if (scrollIndicator.value) {
        const progress = Math.min(self.progress / 0.15, 1)
        scrollIndicator.value.style.opacity = 1 - progress
      }
    },
  })

  // ── Scene 9: Present — simple entrance (no pin) ───────────────────────────
  gsap.timeline({
    scrollTrigger: {
      trigger: '.scene-present',
      start: 'top 75%',
      once: true,
    },
  })
    .from('.s9-chapter', { opacity: 0, y: -24, duration: 0.4 })
    .from('.s9-title .w', {
      y: 90,
      opacity: 0,
      stagger: 0.08,
      duration: 0.7,
      ease: 'power3.out',
    }, '-=0.2')
    .from('.s9-body', { y: 40, opacity: 0, duration: 0.6 }, '-=0.3')
    .from('.s9-cta .cta-btn', { y: 30, opacity: 0, stagger: 0.15, duration: 0.5 }, '-=0.3')
    .from('.s9-sig', { opacity: 0, duration: 0.4 }, '-=0.1')
}

// ─────────────────────────────────────────────────────────────────────────────
// Lifecycle
// ─────────────────────────────────────────────────────────────────────────────
onMounted(() => {
  window.scrollTo({ top: 0, behavior: 'instant' })
  isTouch = 'ontouchstart' in window
  document.body.classList.add('story-mode')

  if (!isTouch) {
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    cursorRaf = requestAnimationFrame(animateCursor)

    document.querySelectorAll('a, button').forEach((el) => {
      el.addEventListener('mouseenter', onMouseEnterLink)
      el.addEventListener('mouseleave', onMouseLeaveLink)
    })
  }

  // two rAF frames to ensure DOM + GSAP are ready
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      initAnimations()
    })
  })
})

onUnmounted(() => {
  document.body.classList.remove('story-mode')
  document.body.classList.remove('story-cursor-active')
  window.removeEventListener('mousemove', onMouseMove)
  if (cursorRaf)
    cancelAnimationFrame(cursorRaf)
  ScrollTrigger.getAll().forEach(t => t.kill())
  gsap.globalTimeline.clear()
})
</script>

<template>
  <div ref="wrapper" class="story-wrapper">
    <!-- ── Custom cursor ─────────────────────────────────────── -->
    <div ref="cursorOuter" class="s-cur-outer" aria-hidden="true" />
    <div ref="cursorInner" class="s-cur-inner" aria-hidden="true" />

    <!-- ── Progress bar ──────────────────────────────────────── -->
    <div ref="progressBar" class="s-progress" aria-hidden="true" />

    <!-- ── Scroll indicator ──────────────────────────────────── -->
    <div ref="scrollIndicator" class="s-scroll-hint" aria-hidden="true">
      <span>{{ getString('story_scroll_hint') }}</span>
      <i class="fa-solid fa-chevron-down" />
    </div>

    <!-- ── Hero Intro ────────────────────────────────────────── -->
    <div ref="heroSection" class="s-hero">
      <div class="hero-content">
        <h1 class="hero-title">
          <span>{{ getString('story_hero_title_1') }}</span>
          <span>{{ getString('story_hero_title_2') }}</span>
          <span>{{ getString('story_hero_title_3') }}</span>
          <span>{{ getString('story_hero_title_4') }}</span>
        </h1>
        <p class="hero-subtitle">
          {{ getString('story_hero_subtitle') }}
        </p>
      </div>
    </div>

    <!-- ── Top nav ───────────────────────────────────────────── -->
    <nav class="s-nav" aria-label="Story navigation">
      <button class="s-back" @click="navigateToResume">
        <i class="fa-solid fa-arrow-left" aria-hidden="true" />
        <span>{{ getString('story_resume') }}</span>
      </button>

      <span class="s-nav-label">{{ getString('story_page_title') }}</span>

      <div v-if="language.supportsMultipleLanguages()" class="s-nav-language">
        <button class="s-lang-dropdown-toggle" @click="toggleLanguageDropdown">
          <img :src="selectedLanguage.flagUrl" :alt="selectedLanguage.name" class="s-lang-flag">
          <span class="s-lang-name">{{ selectedLanguage.id }}</span>
          <i class="fa-solid fa-chevron-down" />
        </button>

        <div v-if="showLanguageDropdown" class="s-lang-dropdown">
          <button
            v-for="lang in availableLanguages"
            :key="lang.id"
            class="s-lang-option"
            @click="selectLanguage(lang)"
          >
            <img :src="lang.flagUrl" :alt="lang.name" class="s-lang-flag">
            <span>{{ lang.name }}</span>
          </button>
        </div>
      </div>
    </nav>

    <!-- ════════════════════════════════════════════════════════
        SCENE 1 · ORIGIN
    ═════════════════════════════════════════════════════════ -->
    <section class="scene scene-origin" aria-label="Chapter 1: Origin">
      <div class="scene-bg grid-bg" aria-hidden="true" />
      <div class="s1-bg-text" aria-hidden="true">
        🎓 <br> 2015
      </div>

      <div class="scene-content">
        <span class="s1-chapter chapter-label">{{ getString('s1_ch01_label') }}</span>
        <h1 class="s1-title display-title">
          <span class="w">{{ getString('s1_title_w1') }}</span>&#32;<span class="w">{{ getString('s1_title_w2') }}</span>&#32;<span class="w">{{ getString('s1_title_w3') }}</span>&#32;<span class="w">{{ getString('s1_title_w4') }}</span>
        </h1>
        <p class="s1-subtitle scene-sub">
          {{ getString('s1_subtitle_line1') }}<br>
          {{ getString('s1_subtitle_line2') }}
        </p>
        <p class="s1-detail scene-det">
          {{ getString('s1_detail') }}
        </p>
        <div class="s1-gear" aria-hidden="true">
          <i class="fa-solid fa-gear" />
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════════
        SCENE 2 · ROBOTICS
    ═════════════════════════════════════════════════════════ -->
    <section class="scene scene-robotics" aria-label="Chapter 2: Robotics">
      <div class="scene-content scene-content--split">
        <div class="s2-text">
          <span class="s2-chapter chapter-label">{{ getString('s2_ch02_label') }}</span>
          <h2 class="s2-title display-title">
            <span class="w">{{ getString('s2_title_w1') }}</span>&#32;<span class="w">{{ getString('s2_title_w2') }}</span>&#32;<span class="w">{{ getString('s2_title_w3') }}</span>&#32;<span class="w">{{ getString('s2_title_w4') }}</span>
          </h2>
          <div class="s2-paper">
            <div class="paper-icon">
              <i class="fa-solid fa-file-lines" aria-hidden="true" />
            </div>
            <div class="paper-body">
              <div class="paper-tag">
                {{ getString('s2_paper_tag') }}
              </div>
              <p class="paper-title">
                {{ getString('s2_paper_title_line1') }}<br>
                {{ getString('s2_paper_title_line2') }}
              </p>
            </div>
            <!-- ─── Rescue Robot ───────────────────────────── -->
            <div class="sr-bot">
              <div class="sr-cab">
                <div class="sr-window sr-window-front" />
                <div class="sr-window sr-window-side" />
                <div class="sr-lamp sr-lamp-l" />
                <div class="sr-lamp sr-lamp-r" />
                <div class="sr-smokestack">
                  <span class="sr-smoke sr-smoke-1" />
                  <span class="sr-smoke sr-smoke-2" />
                </div>
              </div>

              <div class="sr-chassis">
                <div class="sr-hatch" />
                <div class="sr-grille">
                  <i /><i /><i /><i />
                </div>
                <div class="sr-warning-light" />
                <div class="sr-chassis-bolt sr-cb-l" />
                <div class="sr-chassis-bolt sr-cb-r" />
              </div>

              <div class="sr-track sr-track-l">
                <span class="sr-wheel" />
                <span class="sr-wheel" />
                <span class="sr-wheel" />
              </div>

              <div class="sr-track sr-track-r">
                <span class="sr-wheel" />
                <span class="sr-wheel" />
                <span class="sr-wheel" />
              </div>
            </div>
          </div>
          <p class="s2-subtitle scene-sub">
            {{ getString('s2_subtitle_line1') }}<br>
            {{ getString('s2_subtitle_line2') }}
          </p>
        </div>

        <div class="s2-robot" aria-hidden="true">
          <!-- ─── Drone ────────────────────────────────── -->
          <div class="sr-drone">
            <div class="sr-drone-body">
              <div class="sr-drone-cam" />
            </div>
            <div class="sr-drone-arm sr-drone-arm-fl">
              <div class="sr-prop">
                <span /><span />
              </div>
            </div>
            <div class="sr-drone-arm sr-drone-arm-fr">
              <div class="sr-prop">
                <span /><span />
              </div>
            </div>
            <div class="sr-drone-arm sr-drone-arm-bl">
              <div class="sr-prop">
                <span /><span />
              </div>
            </div>
            <div class="sr-drone-arm sr-drone-arm-br">
              <div class="sr-prop">
                <span /><span />
              </div>
            </div>
            <div class="sr-drone-light" />
          </div>

          <!-- Ambient particles -->
          <div class="robot-spark spark-1" />
          <div class="robot-spark spark-2" />
          <div class="robot-spark spark-3" />
          <div class="robot-spark spark-4" />
          <div class="robot-spark spark-5" />
          <div class="robot-spark spark-6" />

          <!-- Sky particles near drone -->
          <div class="drone-star ds-1" />
          <div class="drone-star ds-2" />
          <div class="drone-star ds-3" />
          <div class="drone-star ds-4" />
          <div class="drone-star ds-5" />
          <div class="drone-star ds-6" />
          <div class="drone-star ds-7" />
          <div class="drone-star ds-8" />
          <div class="drone-star ds-9" />
          <div class="drone-star ds-10" />

          <!-- Faint constellation trail in the drone corridor -->
          <div class="drone-trail" />

          <!-- ─── Industrial Robot Arm ──────────────────── -->
          <div class="robot-base">
            <div class="robot-base-plate" />
            <div class="robot-joint robot-joint-1">
              <div class="robot-segment robot-seg-1">
                <div class="robot-joint robot-joint-2">
                  <div class="robot-segment robot-seg-2">
                    <div class="robot-joint robot-joint-3">
                      <div class="robot-gripper">
                        <div class="gripper-finger gripper-l" />
                        <div class="gripper-finger gripper-r" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════════
        SCENE 3 · CODE REVELATION
    ═════════════════════════════════════════════════════════ -->
    <section class="scene scene-code" aria-label="Chapter 3: Code Revelation">
      <div class="s3-code-bg" aria-hidden="true">
        <span v-for="(line, i) in codeLines" :key="i" class="cl">{{ line }}</span>
      </div>

      <div class="scene-content scene-content--center">
        <span class="s3-chapter chapter-label">{{ getString('s3_ch03_label') }}</span>
        <div class="s3-duel">
          <h2 class="s3-hate display-title display-title--dim">
            {{ getString('s3_hate') }}
            <span class="s3-strike" aria-hidden="true" />
          </h2>
          <h2 class="s3-love display-title display-title--grad">
            {{ getString('s3_love') }}
          </h2>
        </div>
        <p class="s3-subtitle scene-sub">
          {{ getString('s3_subtitle_line1') }}<br>
          {{ getString('s3_subtitle_line2') }}<br>
          {{ getString('s3_subtitle_line3') }}
        </p>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════════
        SCENE 4 · COVID
    ═════════════════════════════════════════════════════════ -->
    <section class="scene scene-covid" aria-label="Chapter 4: COVID era">
      <div class="s4-year" aria-hidden="true">
        2020
      </div>

      <div class="scene-content scene-content--split">
        <div class="s4-text">
          <span class="s4-chapter chapter-label">{{ getString('s4_ch04_label') }}</span>
          <h2 class="s4-title display-title">
            <span class="w">{{ getString('s4_title_line1') }}</span><br>
            <span class="w">{{ getString('s4_title_line2') }}</span>
          </h2>
          <p class="s4-subtitle scene-sub">
            {{ getString('s4_subtitle_line1') }}
            {{ getString('s4_subtitle_line2') }}
          </p>
          <div class="s4-techs">
            <span class="tc">{{ getString('s4_tech_html') }}</span>
            <span class="tc">{{ getString('s4_tech_css') }}</span>
            <span class="tc">{{ getString('s4_tech_js') }}</span>
            <span class="tc">{{ getString('s4_tech_react') }}</span>
            <span class="tc">{{ getString('s4_tech_vue') }}</span>
          </div>
        </div>

        <!-- typing on Mac -->
        <div class="s4-mac-robot" aria-hidden="true">
          <div class="rt-stage">
            <div class="rt-mac">
              <div class="rt-mac-lid">
                <div class="rt-mac-bezel">
                  <div class="rt-mac-cam" />
                  <div class="rt-mac-screen">
                    <div class="rt-screen-bar">
                      <span class="rt-dot rt-dot-r" />
                      <span class="rt-dot rt-dot-y" />
                      <span class="rt-dot rt-dot-g" />
                    </div>
                    <div class="rt-screen-code">
                      <span class="rt-line rt-l1">$ npm run dev</span>
                      <span class="rt-line rt-l2">&gt; compiling...</span>
                      <span class="rt-line rt-l3">const App = () =&gt; {</span>
                      <span class="rt-line rt-l4">  return &lt;Hello /&gt;</span>
                      <span class="rt-line rt-l5">}<span class="rt-caret">▍</span></span>
                    </div>
                  </div>
                </div>
                <div class="rt-mac-chin">
                  <span class="rt-mac-logo" />
                </div>
              </div>
              <div class="rt-mac-base">
                <div class="rt-mac-keyboard">
                  <span v-for="k in 36" :key="k" class="rt-key" />
                </div>
                <div class="rt-mac-trackpad" />
                <div class="rt-mac-hinge" />
              </div>
            </div>
            <div class="rt-spark rt-spark-1" />
            <div class="rt-spark rt-spark-2" />
            <div class="rt-spark rt-spark-3" />
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════════
        SCENE 5 · ACADEMIA
    ═════════════════════════════════════════════════════════ -->
    <section class="scene scene-academia" aria-label="Chapter 5: Academia">
      <div class="scene-content scene-content--split">
        <div class="s5-text">
          <span class="s5-chapter chapter-label">{{ getString('s5_ch05_label') }}</span>
          <h2 class="s5-title display-title">
            <span class="w">{{ getString('s5_title') }}</span>
          </h2>
          <div class="s5-uni">
            <div class="uni-icon">
              <i class="fa-solid fa-graduation-cap" aria-hidden="true" />
            </div>
            <div class="uni-body">
              <div class="uni-name">
                {{ getString('s5_uni_name') }}
              </div>
              <div class="uni-deg">
                {{ getString('s5_uni_degree') }}
              </div>
              <div class="uni-yr">
                {{ getString('s5_uni_year') }}
              </div>
            </div>
          </div>
          <p class="s5-subtitle scene-sub">
            {{ getString('s5_subtitle_line1') }}
            {{ getString('s5_subtitle_line2') }}
          </p>
          <div class="s5-acts">
            <div class="ac">
              <i class="fa-solid fa-book" aria-hidden="true" />{{ getString('s5_act_study') }}
            </div>
            <div class="ac">
              <i class="fa-solid fa-code" aria-hidden="true" />{{ getString('s5_act_build') }}
            </div>
            <div class="ac">
              <i class="fa-solid fa-briefcase" aria-hidden="true" />{{ getString('s5_act_work') }}
            </div>
          </div>
        </div>

        <div class="s5-visual" aria-hidden="true">
          <div class="s5-arches">
            <div class="arch arch-3" />
            <div class="arch arch-2" />
            <div class="arch arch-1" />
            <div class="arch-label">
              📌 Padova
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════════
        SCENE 6 · CHALLENGES
    ═════════════════════════════════════════════════════════ -->
    <section class="scene scene-challenges" aria-label="Chapter 6: The Grind">
      <div class="scene-content scene-content--center">
        <span class="s6-chapter chapter-label">{{ getString('s6_ch06_label') }}</span>
        <div class="s6-negatives">
          <h2 class="s6-n1 display-title display-title--ghost">
            {{ getString('s6_negative_1') }}
          </h2>
          <h2 class="s6-n2 display-title display-title--ghost">
            {{ getString('s6_negative_2') }}
          </h2>
          <h2 class="s6-n3 display-title display-title--ghost">
            {{ getString('s6_negative_3') }}
          </h2>
        </div>
        <div class="s6-divider" aria-hidden="true" />
        <h2 class="s6-persist display-title display-title--accent">
          {{ getString('s6_persist') }}
        </h2>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════════
        SCENE 7 · BREAKTHROUGH
    ═════════════════════════════════════════════════════════ -->
    <section class="scene scene-breakthrough" aria-label="Chapter 7: Breakthrough">
      <div class="s7-glow" aria-hidden="true" />

      <div class="scene-content scene-content--center">
        <span class="s7-chapter chapter-label">{{ getString('s7_ch07_label') }}</span>
        <h2 class="s7-title display-title">
          <span class="w">{{ getString('s7_title') }}</span>
        </h2>
        <div class="s7-steps">
          <div class="step">
            <span class="sn">{{ getString('s7_step_1_num') }}</span>
            <span class="sr">{{ getString('s7_step_1_role') }}</span>
            <span class="sp">{{ getString('s7_step_1_company') }}</span>
          </div>
          <div class="step">
            <span class="sn">{{ getString('s7_step_2_num') }}</span>
            <span class="sr">{{ getString('s7_step_2_role') }}</span>
            <span class="sp">{{ getString('s7_step_2_company') }}</span>
          </div>
          <div class="step">
            <span class="sn">{{ getString('s7_step_3_num') }}</span>
            <span class="sr">{{ getString('s7_step_3_role') }}</span>
            <span class="sp">{{ getString('s7_step_3_company') }}</span>
          </div>
          <div class="step">
            <span class="sn">{{ getString('s7_step_4_num') }}</span>
            <span class="sr">{{ getString('s7_step_4_role') }}</span>
            <span class="sp">{{ getString('s7_step_4_company') }}</span>
          </div>
        </div>
        <p class="s7-subtitle scene-sub">
          {{ getString('s7_subtitle') }}
        </p>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════════
        SCENE 8 · EVOLUTION
    ═════════════════════════════════════════════════════════ -->
    <section class="scene scene-evolution" aria-label="Chapter 8: Evolution">
      <div class="scene-content">
        <span class="s8-chapter chapter-label">{{ getString('s8_ch08_label') }}</span>
        <h2 class="s8-title display-title">
          <span class="w" v-html="getString('s8_title')" />
        </h2>

        <div class="s8-stack">
          <div class="si si--fe">
            <i class="fa-brands fa-vuejs" aria-hidden="true" />
            <span>{{ getString('s8_stack_frontend') }}</span>
          </div>
          <span class="sa" aria-hidden="true"><i class="fa-solid fa-arrow-right" /></span>
          <div class="si si--be">
            <i class="fa-solid fa-server" aria-hidden="true" />
            <span>{{ getString('s8_stack_backend') }}</span>
          </div>
          <span class="sa" aria-hidden="true"><i class="fa-solid fa-arrow-right" /></span>
          <div class="si si--do">
            <i class="fa-brands fa-docker" aria-hidden="true" />
            <span>{{ getString('s8_stack_devops') }}</span>
          </div>
          <span class="sa" aria-hidden="true"><i class="fa-solid fa-arrow-right" /></span>
          <div class="si si--iot">
            <i class="fa-solid fa-microchip" aria-hidden="true" />
            <span>{{ getString('s8_stack_iot') }}</span>
          </div>
          <span class="sa" aria-hidden="true"><i class="fa-solid fa-arrow-right" /></span>
          <div class="si si--mob">
            <i class="fa-solid fa-mobile-screen" aria-hidden="true" />
            <span>{{ getString('s8_stack_mobile') }}</span>
          </div>
        </div>

        <div class="s8-badge">
          <i class="fa-solid fa-building" aria-hidden="true" />
          <span>{{ getString('s8_badge') }}</span>
        </div>

        <p class="s8-subtitle scene-sub">
          {{ getString('s8_subtitle_line1') }}<br>
          {{ getString('s8_subtitle_line2') }}
        </p>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════════
        SCENE 9 · PRESENT
    ═════════════════════════════════════════════════════════ -->
    <section class="scene scene-present" aria-label="Chapter 9: Today">
      <div class="scene-content scene-content--center ">
        <span class="s9-chapter chapter-label">{{ getString('s9_ch09_label') }}</span>

        <h2 class="s9-title display-title display-title--hero">
          <span class="w">{{ getString('s9_title_line1') }}</span><br>
          <span class="w">{{ getString('s9_title_line2') }}</span><br>
          <span class="w">{{ getString('s9_title_line3') }}</span>
        </h2>
        <p class="s9-body scene-sub">
          {{ getString('s9_body_line1') }}<br>
          {{ getString('s9_body_line2') }}
        </p>

        <div class="s9-cta">
          <button class="cta-btn cta-btn--primary" @click="navigateToResume">
            {{ getString('story_ch09_btn_resume') }}
          </button>
          <router-link to="/contact" class="cta-btn cta-btn--outline" @click="persistStoryToast">
            {{ getString('story_ch09_btn_contact') }}
          </router-link>
        </div>
        <p class="s9-sig">
          {{ getString('footer_copyright') }} {{ new Date().getFullYear() }}
        </p>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
/* Hide system cursor only after custom cursor is confirmed working via JS */
body.story-cursor-active,
body.story-cursor-active * {
  cursor: none !important;
}
</style>

<style lang="scss" scoped>
// ─────────────────────────────────────────────────────────────────────────────
// Design tokens
// ─────────────────────────────────────────────────────────────────────────────
$dark: #06080f;
$text: #e8eaf6;
$muted: #4a556e;
$accent: #4f8ef7;
$purple: #a855f7;
$cyan: #06b6d4;
$amber: #f59e0b;
$green: #10b981;
$ghost: #1e2535;
$font-head: 'Caveat', cursive, 'Saira', sans-serif;
$font-body: 'Lato', sans-serif;

// ─────────────────────────────────────────────────────────────────────────────
// Wrapper
// ─────────────────────────────────────────────────────────────────────────────
.story-wrapper {
  position: relative;
  background-color: $dark;
  color: $text;
  font-family: $font-body;
  overflow-x: hidden;
  min-height: 100vh;
}

// ─────────────────────────────────────────────────────────────────────────────
// Custom cursor — coding style ([ blinking caret ])
// cursor: none is set here so it kicks in the instant the template renders,
// not waiting for the onMounted body-class add (fixes direct-URL flash)
// ─────────────────────────────────────────────────────────────────────────────
$code-green: #39ff14;

// Only suppress system cursor after custom cursor confirms working via JS class
.story-wrapper.cursor-active,
.story-wrapper.cursor-active * {
  cursor: none !important;
}

.s-cur-outer {
  position: fixed;
  top: 0;
  left: 0;
  width: 52px;
  height: 30px;
  border: none;
  border-radius: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: 0;
  will-change: transform;

  // Left bracket [
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 9px;
    height: 100%;
    border-top: 1.5px solid $code-green;
    border-bottom: 1.5px solid $code-green;
    border-left: 1.5px solid $code-green;
    box-shadow: -2px 0 8px rgba($code-green, 0.35);
  }

  // Right bracket ]
  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    width: 9px;
    height: 100%;
    border-top: 1.5px solid $code-green;
    border-bottom: 1.5px solid $code-green;
    border-right: 1.5px solid $code-green;
    box-shadow: 2px 0 8px rgba($code-green, 0.35);
  }

  @media (max-width: 1023px) {
    display: none;
  }
}

.s-cur-inner {
  position: fixed;
  top: 0;
  left: 0;
  width: 2px;
  height: 20px;
  background: $code-green;
  border-radius: 0;
  pointer-events: none;
  z-index: 10000;
  opacity: 0;
  will-change: transform;
  box-shadow: 0 0 8px rgba($code-green, 0.9);
  animation: code-blink 0.8s step-end infinite;
  animation-play-state: paused;

  @media (max-width: 1023px) {
    display: none;
  }
}

@keyframes code-blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Progress bar
// ─────────────────────────────────────────────────────────────────────────────
.s-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, $accent 0%, $purple 50%, $cyan 100%);
  transform-origin: left;
  transform: scaleX(0);
  z-index: 1000;
  will-change: transform;
}

// ─────────────────────────────────────────────────────────────────────────────
// Scroll indicator
// ─────────────────────────────────────────────────────────────────────────────
.s-scroll-hint {
  position: fixed;
  bottom: 48px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  z-index: 50;
  opacity: 1;
  will-change: opacity;
  transition: opacity 0.3s ease;

  span {
    font-size: 0.75rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: $muted;
  }

  i {
    font-size: 0.9rem;
    color: $muted;
    animation: scrollBounce 2s ease-in-out infinite;
  }

  @media (max-width: 768px) {
    bottom: 32px;
    span {
      font-size: 0.68rem;
    }
  }
}

@keyframes scrollBounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(6px);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Top nav
// ─────────────────────────────────────────────────────────────────────────────
.s-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 48px;
  background: linear-gradient(to bottom, rgba($dark, 0.92) 0%, transparent 100%);
  z-index: 100;
  backdrop-filter: blur(2px);

  @media (max-width: 768px) {
    padding: 14px 20px;
  }
}

.s-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: $muted;
  text-decoration: none;
  font-size: 0.82rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  transition: color 0.25s;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-family: inherit;

  &:hover {
    color: $text;
  }

  i {
    font-size: 0.72rem;
  }
}

.s-nav-label {
  font-family: cursive, $font-head;
  font-size: clamp(0.65rem, 1vw, 1rem);
  color: $text;
  letter-spacing: 0.12em;
}

.s-nav-language {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
}

.s-lang-dropdown-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  color: $text;
  transition: all 0.25s ease;
  font-size: 0.85rem;
  font-family: $font-body;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
  }

  i {
    font-size: 0.7rem;
    transition: transform 0.25s ease;
  }

  &.open i {
    transform: rotate(180deg);
  }

  @media (max-width: 768px) {
    padding: 6px 10px;
    font-size: 0.75rem;
  }
}

.s-lang-flag {
  width: 20px;
  height: 20px;
  border-radius: 3px;
  display: block;
}

.s-lang-name {
  display: none;

  @media (min-width: 768px) {
    display: inline;
  }
}

.s-lang-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: rgba(20, 20, 35, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 6px;
  margin-top: 8px;
  z-index: 1000;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  min-width: 160px;
  animation: languageDropdownIn 0.2s ease-out;

  @media (max-width: 768px) {
    min-width: 140px;
  }
}

@keyframes languageDropdownIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.s-lang-option {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: rgba($text, 0.8);
  font-size: 0.85rem;
  transition: all 0.2s ease;
  text-align: left;
  font-family: $font-body;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: $text;
  }

  &:active {
    background: rgba(255, 255, 255, 0.12);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Hero intro
// ─────────────────────────────────────────────────────────────────────────────
.s-hero {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(140deg, #06080f 0%, #080c1a 100%);
  z-index: 1;

  .hero-content {
    text-align: center;
    z-index: 2;
  }
}

.hero-title {
  font-family: $font-head;
  font-optical-sizing: auto;
  font-weight: 700;
  font-style: normal;
  font-size: clamp(2.5rem, 6vw, 5.5rem);
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.025em;
  color: $text;
  margin-bottom: 24px;

  span {
    display: block;
    will-change: opacity, transform;
  }

  span:nth-child(1) {
    animation: heroFadeIn 0.8s ease-out forwards 0.1s;
  }
  span:nth-child(2) {
    animation: heroFadeIn 0.8s ease-out forwards 0.25s;
  }
  span:nth-child(3) {
    animation: heroFadeIn 0.8s ease-out forwards 0.4s;
  }
  span:nth-child(4) {
    background: linear-gradient(135deg, $accent 0%, $purple 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: heroFadeIn 0.8s ease-out forwards 0.55s;
  }
}

.hero-subtitle {
  font-size: clamp(0.8rem, 1.5vw, 1.25rem);
  color: $accent;
  line-height: 1.6;
  max-width: 700px;
  letter-spacing: 0.1em;
  padding: 1rem;
  margin: 0 auto;
  animation: heroFadeIn 0.8s ease-out forwards 0.7s;
  opacity: 0;
}

@keyframes heroFadeIn {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Scene base
// ─────────────────────────────────────────────────────────────────────────────
.scene {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  padding: 80px 0;
}

.scene-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 80px;

  @media (max-width: 1024px) {
    padding: 0 48px;
  }
  @media (max-width: 768px) {
    padding: 0 24px;
  }

  &.scene-content--split {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 48px;
    }
  }

  &.scene-content--center {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Typography system
// ─────────────────────────────────────────────────────────────────────────────
.chapter-label {
  display: inline-block;
  font-size: 0.72rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: $accent;
  margin-bottom: 2rem;
  font-family: $font-body;
}

.display-title {
  font-family: $font-head;
  font-optical-sizing: auto;
  font-weight: 700;
  font-style: normal;
  font-size: clamp(2.8rem, 5.5vw, 5rem);
  font-weight: 800;
  line-height: 1.04;
  letter-spacing: -0.025em;
  color: $text;
  margin-bottom: 28px;

  .w {
    display: inline-block;
    will-change: transform, opacity;
    padding-right: 0.08em;
  }

  &.display-title--dim {
    color: rgba($text, 0.15);
  }
  &.display-title--ghost {
    color: $ghost;
  }
  &.display-title--accent {
    background: linear-gradient(135deg, $accent 0%, $purple 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  &.display-title--grad {
    background: linear-gradient(135deg, $accent 0%, $cyan 50%, $purple 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  &.display-title--hero {
    font-size: clamp(4rem, 7vw, 7rem);
  }
}

.scene-sub {
  font-size: clamp(1rem, 1.4vw, 1.22rem);
  color: $muted;
  line-height: 1.75;
  max-width: 580px;
  margin-bottom: 24px;
}

.scene-det {
  font-size: 0.82rem;
  color: rgba($muted, 0.7);
  letter-spacing: 0.06em;
}

// ─────────────────────────────────────────────────────────────────────────────
// Scene 1 · Origin
// ─────────────────────────────────────────────────────────────────────────────
.scene-origin {
  background: linear-gradient(140deg, #06080f 0%, #080c1a 100%);
}

.scene-bg.grid-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.018) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.018) 1px, transparent 1px);
  background-size: 64px 64px;
  pointer-events: none;
}

.s1-bg-text {
  position: absolute;
  font-family: $font-head;
  font-size: clamp(14rem, 24vw, 30rem);
  font-weight: 900;
  text-align: right;
  color: rgb(255, 255, 255);
  opacity: 0.1;
  padding-right: 24px;
  right: -1%;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  z-index: 0;
  letter-spacing: -0.04em;
  line-height: 1;
  will-change: opacity, transform;
}

.s1-gear {
  margin-top: 40px;
  font-size: 2.8rem;
  color: rgba($accent, 0.28);
  animation: gearSpin 8s linear infinite;
  display: inline-block;
  will-change: transform, opacity;

  filter: drop-shadow(0 0 10px rgba(100, 200, 255, 0.1));
  text-shadow: 0 0 10px rgba(100, 200, 255, 0.5);
}

@keyframes gearSpin {
  to {
    transform: rotate(360deg);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Scene 2 · Robotics
// ─────────────────────────────────────────────────────────────────────────────
.scene-robotics {
  background: linear-gradient(140deg, #080b18 0%, #0a0f22 100%);
}

.s2-paper {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-left: 3px solid $accent;
  border-radius: 10px;
  padding: 18px 118px 28px 22px;
  margin: 28px 0;
  max-width: 500px;
  overflow: visible;
  will-change: opacity, transform;

  @media (max-width: 1024px) {
    padding: 16px 108px 26px 18px;
  }

  @media (max-width: 768px) {
    padding: 14px 96px 24px 16px;
  }

  @media (max-width: 480px) {
    padding: 14px 86px 22px 14px;
  }

  .paper-icon {
    color: $accent;
    font-size: 1.4rem;
    flex-shrink: 0;
    padding-top: 2px;
  }
  .paper-tag {
    font-size: 0.68rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: $accent;
    margin-bottom: 6px;
  }
  .paper-title {
    font-size: 0.9rem;
    color: rgba($text, 0.8);
    line-height: 1.55;
    font-style: italic;
    margin: 0;
  }
}

// ───  Robot + Drone ───────────────────────────────────────────
// CSS robot visual — Industrial Robot Arm
.s2-robot {
  position: relative;
  width: min(100%, 500px);
  height: 430px;
  margin: 0 auto;
  will-change: opacity, transform;

  @media (max-width: 1024px) {
    width: min(100%, 420px);
    height: 390px;
  }

  @media (max-width: 768px) {
    width: min(100%, 330px);
    height: 410px;
  }

  @media (max-width: 480px) {
    width: min(100%, 290px);
    height: 360px;
  }
}

.robot-base {
  position: absolute;
  left: 36%;
  top: auto;
  bottom: 22px;
  transform: translateX(-50%);
  transform-origin: center bottom;
  z-index: 4;

  @media (max-width: 1024px) {
    left: 34%;
    bottom: 20px;
    transform: translateX(-50%) scale(0.9);
  }

  @media (max-width: 768px) {
    left: 32%;
    bottom: 18px;
    transform: translateX(-50%) scale(0.8);
  }

  @media (max-width: 480px) {
    left: 30%;
    bottom: 14px;
    transform: translateX(-50%) scale(0.7);
  }
}

.robot-base-plate {
  width: 60px;
  height: 10px;
  background: linear-gradient(to bottom, rgba($accent, 0.5), rgba($accent, 0.2));
  border-radius: 4px;
  box-shadow: 0 4px 16px rgba($accent, 0.3);
}

.robot-joint {
  position: relative;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: $accent;
  box-shadow: 0 0 12px rgba($accent, 0.5);
  margin: -7px auto 0;
}

.robot-joint-1 {
  animation: robotJ1 3.2s cubic-bezier(0.55, 0.08, 0.3, 1) infinite;
  transform-origin: center bottom;
}

.robot-segment {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  transform-origin: center bottom;
}

.robot-seg-1 {
  width: 6px;
  height: 90px;
  background: linear-gradient(to top, rgba($accent, 0.6), rgba($purple, 0.4));
  border-radius: 3px;
  animation: robotSeg1 3.2s cubic-bezier(0.55, 0.08, 0.3, 1) infinite;

  @media (max-width: 768px) {
    height: 64px;
  }
}

.robot-joint-2 {
  position: absolute;
  top: -7px;
  left: 50%;
  transform: translateX(-50%);
}

.robot-seg-2 {
  width: 5px;
  height: 72px;
  background: linear-gradient(to top, rgba($purple, 0.5), rgba($cyan, 0.4));
  border-radius: 3px;
  animation: robotSeg2 3.2s cubic-bezier(0.55, 0.08, 0.3, 1) infinite;

  @media (max-width: 768px) {
    height: 50px;
  }
}

.robot-joint-3 {
  position: absolute;
  top: -7px;
  left: 50%;
  transform: translateX(-50%);
  width: 10px;
  height: 10px;
  background: $cyan;
  box-shadow: 0 0 10px rgba($cyan, 0.6);
}

.robot-gripper {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 20px;
}

.gripper-finger {
  position: absolute;
  bottom: 0;
  width: 3px;
  height: 16px;
  background: rgba($cyan, 0.7);
  border-radius: 2px;

  &.gripper-l {
    left: 3px;
    animation: gripperL 3.2s cubic-bezier(0.55, 0.08, 0.3, 1) infinite;
    transform-origin: top center;
  }
  &.gripper-r {
    right: 3px;
    animation: gripperR 3.2s cubic-bezier(0.55, 0.08, 0.3, 1) infinite;
    transform-origin: top center;
  }
}

// Arm swings right toward drone. At 32% = "almost catch" moment.
@keyframes robotJ1 {
  0%,
  100% {
    transform: rotate(5deg);
  }
  20% {
    transform: rotate(18deg);
  }
  32% {
    transform: rotate(34deg);
  }
  50% {
    transform: rotate(14deg);
  }
  75% {
    transform: rotate(8deg);
  }
}

@keyframes robotSeg1 {
  0%,
  100% {
    transform: translateX(-50%) rotate(-8deg);
  }
  20% {
    transform: translateX(-50%) rotate(10deg);
  }
  32% {
    transform: translateX(-50%) rotate(22deg);
  }
  50% {
    transform: translateX(-50%) rotate(-2deg);
  }
  75% {
    transform: translateX(-50%) rotate(-6deg);
  }
}

@keyframes robotSeg2 {
  0%,
  100% {
    transform: translateX(-50%) rotate(-12deg);
  }
  20% {
    transform: translateX(-50%) rotate(-28deg);
  }
  32% {
    transform: translateX(-50%) rotate(-38deg);
  }
  50% {
    transform: translateX(-50%) rotate(-18deg);
  }
  75% {
    transform: translateX(-50%) rotate(-10deg);
  }
}

// Gripper snaps almost-shut at 32% (catch attempt), open otherwise
@keyframes robotGripReach {
  0%,
  100% {
    transform: translateX(-50%) translateY(0);
  }
  32% {
    transform: translateX(-50%) translateY(-4px);
  }
}

@keyframes gripperL {
  0%,
  28%,
  40%,
  100% {
    transform: rotate(-12deg);
  }
  32% {
    transform: rotate(18deg);
  }
}

@keyframes gripperR {
  0%,
  28%,
  40%,
  100% {
    transform: rotate(12deg);
  }
  32% {
    transform: rotate(-18deg);
  }
}

@keyframes sparkFloat {
  0%,
  100% {
    opacity: 0;
    transform: translateY(0) scale(0.5);
  }
  50% {
    opacity: 1;
    transform: translateY(-12px) scale(1);
  }
}

$metal-1: #d6dbe6;
$metal-2: #8a93a8;
$metal-3: #3a4256;
$metal-4: #1a1f2e;
$rivet: #5a6378;

// .sr-scene wrapper removed — drone and arm are direct children of .s2-robot.

// ─── Drone ──────────────────────────────────────────────
// Sits near the arm so the catch attempt reads as near-contact.
.sr-drone {
  --drone-x18: -10px;
  --drone-y18: 16px;
  --drone-x32: -16px;
  --drone-y32: 36px;
  --drone-x42: 40px;
  --drone-y42: -10px;
  --drone-x62: 30px;
  --drone-y62: -14px;
  --drone-x80: 5px;
  --drone-y80: -6px;
  position: absolute;
  top: 114px;
  left: 52%;
  transform: translateX(-50%);
  width: 80px;
  height: 36px;
  animation: sr-drone-escape 3.2s cubic-bezier(0.55, 0.08, 0.3, 1) infinite;
  z-index: 10;

  @media (max-width: 1024px) {
    top: 106px;
    left: 51%;
    width: 72px;
    height: 32px;
  }

  @media (max-width: 768px) {
    top: 218px;
    left: 63%;
    width: 58px;
    height: 26px;
    --drone-x18: -14px;
    --drone-y18: 20px;
    --drone-x32: -26px;
    --drone-y32: 44px;
    --drone-x42: 50px;
    --drone-y42: -14px;
    --drone-x62: 36px;
    --drone-y62: -16px;
    --drone-x80: 8px;
    --drone-y80: -8px;
  }

  @media (max-width: 480px) {
    top: 190px;
    left: 63%;
    width: 50px;
    height: 22px;
    --drone-x18: -12px;
    --drone-y18: 18px;
    --drone-x32: -22px;
    --drone-y32: 38px;
    --drone-x42: 42px;
    --drone-y42: -12px;
    --drone-x62: 30px;
    --drone-y62: -14px;
    --drone-x80: 6px;
    --drone-y80: -6px;
  }
}

// Drone dips toward arm at 32% (sync with arm reach), then escapes
@keyframes sr-drone-escape {
  0%,
  100% {
    transform: translateX(-50%) translateY(0px) rotate(-2deg);
  }
  18% {
    transform: translateX(calc(-50% + var(--drone-x18))) translateY(var(--drone-y18)) rotate(-5deg);
  }
  32% {
    transform: translateX(calc(-50% + var(--drone-x32))) translateY(var(--drone-y32)) rotate(0deg);
  }
  42% {
    transform: translateX(calc(-50% + var(--drone-x42))) translateY(var(--drone-y42)) rotate(12deg);
  }
  62% {
    transform: translateX(calc(-50% + var(--drone-x62))) translateY(var(--drone-y62)) rotate(6deg);
  }
  80% {
    transform: translateX(calc(-50% + var(--drone-x80))) translateY(var(--drone-y80)) rotate(-3deg);
  }
}

.sr-drone-body {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 32px;
  height: 14px;
  background: linear-gradient(180deg, $metal-1 0%, $metal-2 60%, $metal-3 100%);
  border-radius: 7px;
  border: 1px solid $metal-4;
  box-shadow:
    inset 0 -3px 4px rgba(0, 0, 0, 0.4),
    inset 0 2px 2px rgba(255, 255, 255, 0.5),
    0 4px 10px rgba(0, 0, 0, 0.5);

  @media (max-width: 768px) {
    width: 24px;
    height: 10px;
  }
}

.sr-drone-cam {
  position: absolute;
  bottom: -3px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: radial-gradient(circle, #111 0%, #000 70%);
  border: 1px solid $metal-4;
  box-shadow: 0 0 6px rgba($cyan, 0.6);
}

.sr-drone-arm {
  position: absolute;
  top: 50%;
  width: 22px;
  height: 3px;
  background: linear-gradient(90deg, $metal-3, $metal-2);
  border-radius: 2px;
  transform-origin: center center;

  @media (max-width: 768px) {
    width: 16px;
    height: 2px;
  }

  &.sr-drone-arm-fl {
    left: -8px;
    transform: translateY(-50%) rotate(-15deg);
  }
  &.sr-drone-arm-fr {
    right: -8px;
    transform: translateY(-50%) rotate(15deg);
  }
  &.sr-drone-arm-bl {
    left: -4px;
    top: 65%;
    transform: translateY(-50%) rotate(-25deg);
  }
  &.sr-drone-arm-br {
    right: -4px;
    top: 65%;
    transform: translateY(-50%) rotate(25deg);
  }
}

.sr-prop {
  position: absolute;
  top: -4px;
  right: -2px;
  width: 18px;
  height: 4px;

  @media (max-width: 768px) {
    width: 14px;
  }

  span {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 1.5px;
    background: rgba($cyan, 0.7);
    border-radius: 2px;
    transform-origin: center center;
    animation: sr-prop-spin 0.08s linear infinite;

    &:nth-child(2) {
      transform: translate(-50%, -50%) rotate(90deg);
    }
    &:nth-child(1) {
      transform: translate(-50%, -50%) rotate(0deg);
    }
  }
}

@keyframes sr-prop-spin {
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.sr-drone-light {
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: $cyan;
  box-shadow:
    0 0 8px $cyan,
    0 0 16px rgba($cyan, 0.5);
  animation: sr-drone-led 1s ease-in-out infinite;
}

@keyframes sr-drone-led {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

.robot-spark {
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: $cyan;
  box-shadow: 0 0 8px rgba($cyan, 0.9);
  z-index: 9;
  animation:
    robotSparkFloat var(--spark-float-dur, 2.8s) ease-in-out infinite,
    robotSparkDrift var(--spark-drift-dur, 5.4s) ease-in-out infinite;

  &.spark-1 {
    top: 46%;
    left: 42%;
    animation-delay: 0s;
    --spark-float-dur: 2.6s;
    --spark-drift-dur: 4.8s;
    --spark-dx: 5px;
  }
  &.spark-2 {
    top: 28%;
    left: 56%;
    animation-delay: 0.4s;
    background: $purple;
    box-shadow: 0 0 8px rgba($purple, 0.9);
    --spark-float-dur: 3.1s;
    --spark-drift-dur: 6.2s;
    --spark-dx: -7px;
  }
  &.spark-3 {
    top: 38%;
    right: 18%;
    animation-delay: 0.9s;
    background: $accent;
    box-shadow: 0 0 8px rgba($accent, 0.9);
    --spark-float-dur: 2.9s;
    --spark-drift-dur: 5.7s;
    --spark-dx: 8px;
  }
  &.spark-4 {
    top: 34%;
    left: 48%;
    animation-delay: 1.2s;
    --spark-float-dur: 2.4s;
    --spark-drift-dur: 4.4s;
    --spark-dx: -6px;
  }
  &.spark-5 {
    top: 22%;
    right: 22%;
    animation-delay: 1.7s;
    background: $purple;
    box-shadow: 0 0 8px rgba($purple, 0.8);
    --spark-float-dur: 3.3s;
    --spark-drift-dur: 6.8s;
    --spark-dx: 10px;
  }
  &.spark-6 {
    top: 52%;
    right: 28%;
    animation-delay: 2.1s;
    background: $accent;
    box-shadow: 0 0 8px rgba($accent, 0.8);
    --spark-float-dur: 2.7s;
    --spark-drift-dur: 5.1s;
    --spark-dx: -9px;
  }

  @media (max-width: 768px) {
    &.spark-1 {
      top: 58%;
      left: 38%;
    }
    &.spark-2 {
      top: 44%;
      left: 54%;
    }
    &.spark-3 {
      top: 50%;
      right: 10%;
    }
    &.spark-4 {
      top: 54%;
      left: 46%;
    }
    &.spark-5 {
      top: 38%;
      right: 14%;
    }
    &.spark-6 {
      top: 64%;
      right: 22%;
    }
  }

  @media (max-width: 480px) {
    &.spark-1 {
      top: 56%;
      left: 36%;
    }
    &.spark-2 {
      top: 42%;
      left: 52%;
    }
    &.spark-3 {
      top: 48%;
      right: 8%;
    }
    &.spark-4 {
      top: 52%;
      left: 44%;
    }
    &.spark-5 {
      top: 36%;
      right: 12%;
    }
    &.spark-6 {
      top: 62%;
      right: 20%;
    }
  }
}

@keyframes robotSparkFloat {
  0%,
  100% {
    opacity: 0;
    transform: translateY(0) scale(0.45);
  }
  50% {
    opacity: 1;
    transform: translateY(-14px) scale(1);
  }
}

@keyframes robotSparkDrift {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(var(--spark-dx, 6px));
  }
}

.drone-star {
  position: absolute;
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background: rgba(#d7f3ff, 0.95);
  box-shadow: 0 0 7px rgba($cyan, 0.8);
  z-index: 8;
  animation:
    droneStarTwinkle var(--star-twinkle-dur, 3.2s) ease-in-out infinite,
    droneStarDrift var(--star-drift-dur, 7s) ease-in-out infinite;

  &.ds-1 {
    top: 16%;
    left: 48%;
    animation-delay: 0.1s;
    --star-twinkle-dur: 2.8s;
    --star-drift-dur: 6.2s;
    --star-dx: 8px;
    --star-dy: -2px;
  }
  &.ds-2 {
    top: 12%;
    left: 54%;
    animation-delay: 0.4s;
    --star-twinkle-dur: 3.6s;
    --star-drift-dur: 8.6s;
    --star-dx: -6px;
    --star-dy: 3px;
  }
  &.ds-3 {
    top: 18%;
    left: 58%;
    animation-delay: 0.7s;
    --star-twinkle-dur: 3s;
    --star-drift-dur: 7.2s;
    --star-dx: 10px;
    --star-dy: -1px;
  }
  &.ds-4 {
    top: 10%;
    left: 62%;
    animation-delay: 1s;
    --star-twinkle-dur: 3.8s;
    --star-drift-dur: 9.2s;
    --star-dx: -8px;
    --star-dy: 4px;
  }
  &.ds-5 {
    top: 15%;
    left: 66%;
    animation-delay: 1.3s;
    --star-twinkle-dur: 3.1s;
    --star-drift-dur: 7.8s;
    --star-dx: 7px;
    --star-dy: -3px;
  }
  &.ds-6 {
    top: 20%;
    left: 64%;
    animation-delay: 1.6s;
    --star-twinkle-dur: 2.7s;
    --star-drift-dur: 6.4s;
    --star-dx: -5px;
    --star-dy: 2px;
  }
  &.ds-7 {
    top: 23%;
    left: 60%;
    animation-delay: 1.9s;
    --star-twinkle-dur: 3.4s;
    --star-drift-dur: 8.1s;
    --star-dx: 9px;
    --star-dy: -2px;
  }
  &.ds-8 {
    top: 21%;
    left: 52%;
    animation-delay: 2.2s;
    --star-twinkle-dur: 2.9s;
    --star-drift-dur: 6.7s;
    --star-dx: -7px;
    --star-dy: 3px;
  }
  &.ds-9 {
    top: 26%;
    left: 56%;
    animation-delay: 2.5s;
    --star-twinkle-dur: 3.2s;
    --star-drift-dur: 7.5s;
    --star-dx: 6px;
    --star-dy: -3px;
  }
  &.ds-10 {
    top: 14%;
    left: 70%;
    animation-delay: 2.8s;
    --star-twinkle-dur: 4s;
    --star-drift-dur: 9.6s;
    --star-dx: -10px;
    --star-dy: 4px;
  }

  @media (max-width: 768px) {
    &.ds-1 {
      top: 34%;
      left: 55%;
    }
    &.ds-2 {
      top: 30%;
      left: 61%;
    }
    &.ds-3 {
      top: 36%;
      left: 66%;
    }
    &.ds-4 {
      top: 28%;
      left: 70%;
    }
    &.ds-5 {
      top: 33%;
      left: 74%;
    }
    &.ds-6 {
      top: 39%;
      left: 72%;
    }
    &.ds-7 {
      top: 42%;
      left: 68%;
    }
    &.ds-8 {
      top: 40%;
      left: 60%;
    }
    &.ds-9 {
      top: 45%;
      left: 64%;
    }
    &.ds-10 {
      top: 32%;
      left: 78%;
    }
  }

  @media (max-width: 480px) {
    &.ds-1 {
      top: 32%;
      left: 52%;
    }
    &.ds-2 {
      top: 29%;
      left: 58%;
    }
    &.ds-3 {
      top: 35%;
      left: 63%;
    }
    &.ds-4 {
      top: 27%;
      left: 67%;
    }
    &.ds-5 {
      top: 32%;
      left: 71%;
    }
    &.ds-6 {
      top: 38%;
      left: 69%;
    }
    &.ds-7 {
      top: 41%;
      left: 65%;
    }
    &.ds-8 {
      top: 39%;
      left: 57%;
    }
    &.ds-9 {
      top: 44%;
      left: 61%;
    }
    &.ds-10 {
      top: 31%;
      left: 75%;
    }
  }
}

@keyframes droneStarTwinkle {
  0%,
  100% {
    opacity: 0.2;
    transform: translateY(0) scale(0.75);
  }
  50% {
    opacity: 1;
    transform: translateY(-5px) scale(1.15);
  }
}

@keyframes droneStarDrift {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(var(--star-dx, 6px), var(--star-dy, -2px));
  }
}

.drone-trail {
  position: absolute;
  top: 76px;
  left: 42%;
  width: 180px;
  height: 84px;
  pointer-events: none;
  z-index: 7;
  opacity: 0.35;
  filter: blur(0.35px);
  animation: droneTrailFollow 3.2s cubic-bezier(0.55, 0.08, 0.3, 1) infinite;

  background:
    radial-gradient(circle at 10% 62%, rgba($cyan, 0.22) 0 2px, transparent 3px),
    radial-gradient(circle at 24% 46%, rgba(#d7f3ff, 0.2) 0 1.5px, transparent 3px),
    radial-gradient(circle at 42% 38%, rgba($cyan, 0.16) 0 1.5px, transparent 3px),
    radial-gradient(circle at 58% 34%, rgba(#d7f3ff, 0.16) 0 1.5px, transparent 3px),
    radial-gradient(circle at 76% 28%, rgba($cyan, 0.14) 0 1.5px, transparent 3px),
    radial-gradient(circle at 90% 22%, rgba(#d7f3ff, 0.14) 0 1.5px, transparent 3px);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 999px;
    background: radial-gradient(120% 80% at 24% 74%, rgba($cyan, 0.1), transparent 72%);
    animation: droneTrailPulse 2.1s ease-in-out infinite;
  }

  @media (max-width: 1024px) {
    display: none;
  }

  @keyframes droneTrailFollow {
    0%,
    100% {
      transform: translate(0, 0) rotate(-3deg);
    }
    18% {
      transform: translate(-8px, 10px) rotate(-5deg);
    }
    32% {
      transform: translate(-14px, 22px) rotate(-2deg);
    }
    42% {
      transform: translate(22px, -8px) rotate(6deg);
    }
    62% {
      transform: translate(15px, -10px) rotate(3deg);
    }
    80% {
      transform: translate(2px, -4px) rotate(-1deg);
    }
  }

  @keyframes droneTrailPulse {
    0%,
    100% {
      opacity: 0.35;
    }
    50% {
      opacity: 0.72;
    }
  }
}

// ─── Mechanical rescue robot ──────────────────────────────
// Anchored to the paper card corner at a compact scale.
.sr-bot {
  --sr-bot-scale: 0.46;
  position: absolute;
  right: -18px;
  bottom: -34px;
  width: 190px;
  height: 220px;
  margin-bottom: 0;
  transform-origin: right bottom;
  animation: sr-mech-rock 3.6s cubic-bezier(0.45, 0.02, 0.2, 1) infinite;
  z-index: 3;
  pointer-events: none;

  @media (max-width: 1024px) {
    --sr-bot-scale: 0.42;
    right: -20px;
    bottom: -34px;
  }

  @media (max-width: 768px) {
    --sr-bot-scale: 0.37;
    right: -18px;
    bottom: -32px;
  }

  @media (max-width: 480px) {
    --sr-bot-scale: 0.33;
    right: -16px;
    bottom: -30px;
  }
}

@keyframes sr-mech-rock {
  0%,
  18%,
  100% {
    transform: translateY(0) rotate(0deg) scale(var(--sr-bot-scale));
  }
  42% {
    transform: translateY(-3px) rotate(-1.1deg) scale(var(--sr-bot-scale));
  }
  68% {
    transform: translateY(1px) rotate(0.9deg) scale(var(--sr-bot-scale));
  }
}

.sr-cab {
  position: absolute;
  right: 26px;
  bottom: 82px;
  width: 80px;
  height: 66px;
  border: 1.5px solid $metal-4;
  border-radius: 10px 14px 8px 8px;
  background: linear-gradient(180deg, #d7dce5 0%, #989fb0 44%, #4a5267 100%);
  box-shadow:
    inset 0 -5px 8px rgba(0, 0, 0, 0.4),
    inset 0 2px 3px rgba(255, 255, 255, 0.35),
    0 5px 12px rgba(0, 0, 0, 0.35);
  clip-path: polygon(0 18%, 24% 0, 100% 0, 100% 100%, 0 100%);
  z-index: 3;

  &::after {
    content: '';
    position: absolute;
    top: 6px;
    left: 12px;
    width: 34px;
    height: 8px;
    border-radius: 999px;
    background: linear-gradient(90deg, #d64545 0%, #ffed8d 46%, #d64545 100%);
    box-shadow: 0 0 10px rgba(#d64545, 0.3);
  }

  @media (max-width: 768px) {
    right: 42px;
    bottom: 68px;
    width: 62px;
    height: 50px;

    &::after {
      top: 5px;
      left: 9px;
      width: 26px;
      height: 6px;
    }
  }
}

.sr-window {
  position: absolute;
  background: linear-gradient(180deg, rgba(#a6d3dd, 0.85) 0%, rgba(#274050, 0.92) 100%);
  border: 1px solid rgba($metal-4, 0.9);
  box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.3);
}

.sr-window-front {
  top: 12px;
  left: 10px;
  width: 40px;
  height: 22px;
  border-radius: 8px 10px 4px 4px;

  @media (max-width: 768px) {
    top: 9px;
    left: 8px;
    width: 30px;
    height: 17px;
  }
}

.sr-window-side {
  top: 14px;
  right: 8px;
  width: 16px;
  height: 18px;
  border-radius: 4px;

  @media (max-width: 768px) {
    top: 11px;
    right: 6px;
    width: 12px;
    height: 14px;
  }
}

.sr-lamp {
  position: absolute;
  bottom: 14px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: radial-gradient(circle, #ffe59a 0%, darken($amber, 14%) 76%);
  border: 1px solid rgba($metal-4, 0.9);
  box-shadow: 0 0 7px rgba($amber, 0.55);
  animation: sr-headlamp 1.6s ease-in-out infinite;

  &.sr-lamp-l {
    left: 10px;
  }

  &.sr-lamp-r {
    left: 24px;
    animation-delay: 0.2s;
  }

  @media (max-width: 768px) {
    width: 8px;
    height: 8px;
    bottom: 11px;

    &.sr-lamp-r {
      left: 20px;
    }
  }
}

@keyframes sr-headlamp {
  0%,
  100% {
    opacity: 0.9;
  }
  50% {
    opacity: 0.45;
  }
}

.sr-smokestack {
  position: absolute;
  top: -16px;
  right: 14px;
  width: 10px;
  height: 24px;
  border-radius: 4px 4px 0 0;
  background: linear-gradient(180deg, $metal-2 0%, $metal-4 100%);
  border: 1px solid $metal-4;

  @media (max-width: 768px) {
    top: -12px;
    right: 10px;
    width: 8px;
    height: 18px;
  }
}

.sr-smoke {
  position: absolute;
  left: 50%;
  bottom: calc(100% - 2px);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba($metal-1, 0.34);
  filter: blur(0.5px);
  opacity: 0;
  animation: sr-smoke-rise 2.4s ease-out infinite;

  &.sr-smoke-2 {
    animation-delay: 1.2s;
  }

  @media (max-width: 768px) {
    width: 8px;
    height: 8px;
  }
}

@keyframes sr-smoke-rise {
  0% {
    opacity: 0;
    transform: translate(-50%, 0) scale(0.45);
  }
  20% {
    opacity: 0.35;
  }
  100% {
    opacity: 0;
    transform: translate(-18%, -24px) scale(1.4);
  }
}

.sr-chassis {
  position: absolute;
  left: 50%;
  bottom: 34px;
  transform: translateX(-50%);
  width: 138px;
  height: 58px;
  border: 1.5px solid $metal-4;
  border-radius: 14px 16px 18px 18px;
  background: linear-gradient(180deg, #d8dde6 0%, #9198aa 45%, #434b61 100%);
  box-shadow:
    inset 0 -6px 10px rgba(0, 0, 0, 0.45),
    inset 0 3px 4px rgba(255, 255, 255, 0.35),
    0 5px 12px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  z-index: 2;

  &::before {
    content: '';
    position: absolute;
    top: 12px;
    left: 12px;
    width: 44px;
    height: 10px;
    border-radius: 3px;
    background: repeating-linear-gradient(
      90deg,
      rgba(#d64545, 0.95) 0 8px,
      rgba(#fff1a8, 0.96) 8px 16px,
      rgba($metal-4, 0.95) 16px 24px
    );
    opacity: 0.85;
  }

  &::after {
    content: '';
    position: absolute;
    top: 10px;
    right: 14px;
    width: 18px;
    height: 18px;
    border-radius: 4px;
    border: 1px solid rgba($metal-4, 0.92);
    background:
      linear-gradient(#d64545, #d64545) center/38% 100% no-repeat,
      linear-gradient(#d64545, #d64545) center/100% 38% no-repeat,
      linear-gradient(180deg, rgba($metal-1, 0.95), rgba($metal-3, 0.85));
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    bottom: 26px;
    width: 106px;
    height: 46px;

    &::before {
      top: 10px;
      left: 10px;
      width: 34px;
      height: 8px;
    }

    &::after {
      top: 8px;
      right: 11px;
      width: 14px;
      height: 14px;
    }
  }
}

.sr-hatch {
  position: absolute;
  top: 10px;
  right: 18px;
  width: 30px;
  height: 12px;
  border-radius: 4px;
  background: linear-gradient(180deg, rgba($metal-1, 0.8), rgba($metal-3, 0.85));
  border: 1px solid rgba($metal-4, 0.95);

  @media (max-width: 768px) {
    top: 8px;
    right: 14px;
    width: 22px;
    height: 9px;
  }
}

.sr-grille {
  position: absolute;
  left: 18px;
  bottom: 13px;
  display: flex;
  gap: 4px;

  i {
    display: block;
    width: 4px;
    height: 18px;
    border-radius: 2px;
    background: linear-gradient(180deg, rgba($metal-4, 0.92), rgba($metal-2, 0.2));
  }

  @media (max-width: 768px) {
    left: 14px;
    bottom: 10px;
    gap: 3px;

    i {
      width: 3px;
      height: 14px;
    }
  }
}

.sr-warning-light {
  position: absolute;
  right: 16px;
  bottom: 11px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: radial-gradient(circle, #ff8a78 0%, #b11b1b 82%);
  border: 1px solid rgba($metal-4, 0.95);
  box-shadow: 0 0 9px rgba(#d64545, 0.6);
  animation: sr-beacon 1.1s steps(2, end) infinite;

  @media (max-width: 768px) {
    right: 12px;
    bottom: 9px;
    width: 11px;
    height: 11px;
  }
}

@keyframes sr-beacon {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.35;
  }
}

.sr-chassis-bolt {
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: radial-gradient(circle, $metal-1, $rivet, $metal-4);

  &.sr-cb-l {
    bottom: 12px;
    left: 64px;
  }

  &.sr-cb-r {
    bottom: 12px;
    right: 38px;
  }

  @media (max-width: 768px) {
    width: 4px;
    height: 4px;

    &.sr-cb-l {
      left: 48px;
    }

    &.sr-cb-r {
      right: 29px;
    }
  }
}

.sr-track {
  position: absolute;
  bottom: 0;
  width: 76px;
  height: 44px;
  border-radius: 22px;
  background: linear-gradient(180deg, #394151 0%, #1b202b 100%);
  border: 1.5px solid $metal-4;
  box-shadow:
    inset 0 3px 4px rgba(255, 255, 255, 0.08),
    inset 0 -6px 8px rgba(0, 0, 0, 0.55),
    0 4px 10px rgba(0, 0, 0, 0.35);
  overflow: hidden;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    inset: 6px 4px;
    border-radius: 16px;
    background: repeating-linear-gradient(90deg, rgba($metal-4, 0.96) 0 8px, rgba($metal-2, 0.45) 8px 14px);
    animation: sr-track-run 1.35s linear infinite;
  }

  &.sr-track-l {
    left: 10px;
  }

  &.sr-track-r {
    right: 10px;
  }

  @media (max-width: 768px) {
    width: 58px;
    height: 34px;

    &::before {
      inset: 5px 3px;
      border-radius: 12px;
    }

    &.sr-track-l {
      left: 30px;
    }

    &.sr-track-r {
      right: 30px;
    }
  }
}

@keyframes sr-track-run {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-18px);
  }
}

.sr-wheel {
  position: absolute;
  bottom: 10px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, $metal-1 0%, $metal-2 35%, $metal-4 100%);
  border: 1px solid rgba($metal-1, 0.22);
  box-shadow: inset 0 -1px 2px rgba(0, 0, 0, 0.5);
  z-index: 1;

  &::after {
    content: '';
    position: absolute;
    inset: 4px;
    border-radius: 50%;
    background: rgba($metal-4, 0.85);
  }

  &:nth-child(1) {
    left: 10px;
  }

  &:nth-child(2) {
    left: 30px;
  }

  &:nth-child(3) {
    left: 50px;
  }

  @media (max-width: 768px) {
    bottom: 8px;
    width: 11px;
    height: 11px;

    &:nth-child(1) {
      left: 8px;
    }

    &:nth-child(2) {
      left: 23px;
    }

    &:nth-child(3) {
      left: 38px;
    }

    &::after {
      inset: 3px;
    }
  }
}

// Floor + shadow — sits directly under the rescue robot
.sr-floor {
  position: absolute;
  right: 6%;
  bottom: 16px;
  width: 210px;
  height: 6px;

  @media (max-width: 1024px) {
    right: 4%;
    bottom: 14px;
    width: 188px;
  }

  @media (max-width: 768px) {
    right: 4%;
    bottom: 12px;
    width: 160px;
  }

  @media (max-width: 480px) {
    right: 2%;
    bottom: 10px;
    width: 142px;
  }
}

.sr-shadow {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 116px;
  height: 6px;
  background: radial-gradient(ellipse, rgba(0, 0, 0, 0.5) 0%, transparent 70%);
  border-radius: 50%;
  animation: sr-shadow-pulse 3.6s cubic-bezier(0.45, 0.02, 0.2, 1) infinite;

  @media (max-width: 768px) {
    width: 82px;
  }
}

@keyframes sr-shadow-pulse {
  0%,
  100% {
    transform: translateX(-50%) scaleX(1);
    opacity: 0.6;
  }
  50% {
    transform: translateX(-50%) scaleX(0.7);
    opacity: 0.3;
  }
}

// Sparks
.sr-spark {
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: $cyan;
  box-shadow: 0 0 6px $cyan;
  animation: sr-spark 2.8s ease-in-out infinite;

  // Sparks scatter in the zone between drone, arm, and rescue robot
  &.sr-sp-1 {
    top: 48%;
    left: 42%;
    animation-delay: 0s;
  }
  &.sr-sp-2 {
    top: 22%;
    right: 10%;
    animation-delay: 0.9s;
    background: $purple;
    box-shadow: 0 0 6px $purple;
  }
  &.sr-sp-3 {
    top: 38%;
    right: 8%;
    animation-delay: 1.8s;
    background: $accent;
    box-shadow: 0 0 6px $accent;
  }
}

@keyframes sr-spark {
  0%,
  100% {
    opacity: 0;
    transform: translateY(0) scale(0.4);
  }
  50% {
    opacity: 1;
    transform: translateY(-12px) scale(1);
  }
}

// ─── Mac Typing Robot (Scene 4) ──────────────────────────────────────────────
.s4-mac-robot {
  position: relative;
  width: 320px;
  height: 340px;
  margin: 0 auto;

  @media (max-width: 768px) {
    width: 240px;
    height: 260px;
  }

  .rt-stage {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    perspective: 800px;
  }

  .rt-antenna {
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 20px;

    .rt-antenna-rod {
      position: absolute;
      left: 50%;
      bottom: 0;
      transform: translateX(-50%);
      width: 2px;
      height: 20px;
      background: linear-gradient($metal-2, $metal-3);
    }
    .rt-antenna-bulb {
      position: absolute;
      top: -3px;
      left: 50%;
      transform: translateX(-50%);
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: $cyan;
      box-shadow:
        0 0 8px rgba($cyan, 0.9),
        0 0 16px rgba($cyan, 0.5);
      animation: rt-blink 1.2s ease-in-out infinite;
    }
  }

  .rt-head {
    position: relative;
    width: 74px;
    height: 58px;
    margin: 0 auto;
    background: linear-gradient(180deg, $metal-1 0%, $metal-2 60%, $metal-3 100%);
    border-radius: 12px 12px 8px 8px;
    border: 1.5px solid $metal-4;
    box-shadow:
      inset 0 -5px 7px rgba(0, 0, 0, 0.4),
      inset 0 3px 4px rgba(255, 255, 255, 0.4),
      0 3px 10px rgba(0, 0, 0, 0.5);

    @media (max-width: 768px) {
      width: 56px;
      height: 44px;
    }
  }

  .rt-head-plate {
    position: absolute;
    top: 4px;
    left: 5px;
    right: 5px;
    height: 4px;
    background: linear-gradient(90deg, $metal-3, $metal-2, $metal-3);
    border-radius: 3px;
  }

  .rt-eye {
    position: absolute;
    top: 16px;
    width: 18px;
    height: 15px;
    background: #0a0e18;
    border-radius: 5px;
    border: 1px solid $metal-4;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.9);
    overflow: hidden;

    @media (max-width: 768px) {
      top: 12px;
      width: 14px;
      height: 11px;
    }

    &.rt-eye-l {
      left: 8px;
    }
    &.rt-eye-r {
      right: 8px;
    }

    .rt-pupil {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: $cyan;
      box-shadow:
        0 0 6px $cyan,
        0 0 12px rgba($cyan, 0.7);
      animation: rt-scan 3.4s ease-in-out infinite;

      @media (max-width: 768px) {
        width: 5px;
        height: 5px;
      }
    }
  }

  .rt-mouth {
    position: absolute;
    bottom: 7px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 2px;
    padding: 2px 4px;
    background: #0a0e18;
    border-radius: 3px;
    border: 1px solid $metal-4;

    span {
      width: 2.5px;
      height: 4px;
      background: $cyan;
      box-shadow: 0 0 3px rgba($cyan, 0.8);
      animation: rt-eq 0.6s ease-in-out infinite;
    }
    span:nth-child(2) {
      animation-delay: 0.1s;
    }
    span:nth-child(3) {
      animation-delay: 0.2s;
    }
    span:nth-child(4) {
      animation-delay: 0.15s;
    }
    span:nth-child(5) {
      animation-delay: 0.05s;
    }
  }

  .rt-ear {
    position: absolute;
    top: 20px;
    width: 5px;
    height: 14px;
    background: linear-gradient($metal-3, $metal-4);
    border-radius: 2px;

    &.rt-ear-l {
      left: -4px;
    }
    &.rt-ear-r {
      right: -4px;
    }
  }

  .rt-neck {
    position: relative;
    width: 26px;
    height: 10px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
      width: 3px;
      height: 100%;
      background: linear-gradient($metal-2, $metal-4);
      border-radius: 2px;
    }
  }

  .rt-torso {
    position: relative;
    width: 94px;
    height: 80px;
    margin: 0 auto;
    background: linear-gradient(180deg, $metal-1 0%, $metal-2 40%, $metal-3 100%);
    border-radius: 12px;
    border: 1.5px solid $metal-4;
    box-shadow:
      inset 0 -8px 12px rgba(0, 0, 0, 0.45),
      inset 0 3px 5px rgba(255, 255, 255, 0.4),
      0 5px 14px rgba(0, 0, 0, 0.5);

    @media (max-width: 768px) {
      width: 70px;
      height: 60px;
    }
  }

  .rt-chest-led {
    position: absolute;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: radial-gradient(circle, #ff4d4d 0%, #7a0c0c 80%);
    border: 1.5px solid $metal-4;
    box-shadow: 0 0 8px rgba(255, 80, 80, 0.7);
    animation: rt-pulse 1.4s ease-in-out infinite;
  }

  .rt-chest-grill {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    gap: 3px;

    i {
      display: block;
      width: 30px;
      height: 2px;
      background: $metal-4;
      border-radius: 2px;
    }
  }

  .rt-bolt {
    position: absolute;
    width: 5px;
    height: 5px;
    background: radial-gradient(circle, $metal-1, $rivet, $metal-4);
    border-radius: 50%;

    &.rt-bolt-tl {
      top: 4px;
      left: 4px;
    }
    &.rt-bolt-tr {
      top: 4px;
      right: 4px;
    }
    &.rt-bolt-bl {
      bottom: 4px;
      left: 4px;
    }
    &.rt-bolt-br {
      bottom: 4px;
      right: 4px;
    }
  }

  .rt-arm {
    position: absolute;
    top: 15px;
    width: 14px;
    height: 68px;
    transform-origin: 50% 7px;

    @media (max-width: 768px) {
      height: 50px;
      width: 11px;
    }

    &.rt-arm-l {
      left: -12px;
      animation: rt-shoulder-l 0.42s ease-in-out infinite;
    }
    &.rt-arm-r {
      right: -12px;
      animation: rt-shoulder-r 0.38s ease-in-out infinite;
    }
  }

  .rt-shoulder {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, $metal-1, $metal-3 70%, $metal-4);
    border: 1.5px solid $metal-4;
  }

  .rt-upper-arm {
    position: absolute;
    top: 7px;
    left: 50%;
    transform: translateX(-50%);
    width: 7px;
    height: 26px;
    background: linear-gradient(90deg, $metal-3, $metal-2, $metal-3);
    border-radius: 3px;
    border: 1px solid $metal-4;

    @media (max-width: 768px) {
      height: 18px;
    }
  }

  .rt-elbow {
    position: absolute;
    top: 30px;
    left: 50%;
    transform: translateX(-50%);
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, $metal-1, $metal-3 70%);
    border: 1px solid $metal-4;

    @media (max-width: 768px) {
      top: 22px;
      width: 8px;
      height: 8px;
    }
  }

  .rt-forearm {
    position: absolute;
    top: 37px;
    left: 50%;
    transform: translateX(-50%);
    width: 6px;
    height: 24px;
    background: linear-gradient(90deg, $metal-3, $metal-2, $metal-3);
    border-radius: 3px;
    border: 1px solid $metal-4;

    @media (max-width: 768px) {
      top: 28px;
      height: 16px;
    }
  }

  .rt-hand {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 12px;
    height: 8px;
    background: linear-gradient(180deg, $metal-2, $metal-4);
    border-radius: 2px;
    border: 1px solid $metal-4;
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.5);
  }

  // Mac laptop
  .rt-mac {
    position: relative;
    width: 240px;
    z-index: 3;
    filter: drop-shadow(0 12px 20px rgba(0, 0, 0, 0.55));

    @media (max-width: 768px) {
      width: 180px;
    }
  }

  .rt-mac-lid {
    position: relative;
    width: 100%;
    height: 110px;
    background: linear-gradient(180deg, #2a2f3a 0%, #1a1f2a 100%);
    border-radius: 8px 8px 3px 3px;
    border: 1px solid #0a0d14;
    padding: 5px;

    @media (max-width: 768px) {
      height: 85px;
    }
  }

  .rt-mac-bezel {
    position: relative;
    width: 100%;
    height: calc(100% - 10px);
    background: #050608;
    border-radius: 3px;
    overflow: hidden;
    border: 1px solid #000;
  }

  .rt-mac-cam {
    position: absolute;
    top: 2px;
    left: 50%;
    transform: translateX(-50%);
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: #2a3040;
    z-index: 2;
  }

  .rt-mac-screen {
    position: absolute;
    inset: 8px 5px 5px 5px;
    background: linear-gradient(180deg, #0e1422 0%, #060912 100%);
    border-radius: 2px;
    overflow: hidden;
    font-family: 'Courier New', monospace;
  }

  .rt-screen-bar {
    display: flex;
    gap: 3px;
    padding: 3px 4px;
    background: rgba(255, 255, 255, 0.04);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);

    .rt-dot {
      width: 4px;
      height: 4px;
      border-radius: 50%;

      &.rt-dot-r {
        background: #ff5f57;
      }
      &.rt-dot-y {
        background: #febc2e;
      }
      &.rt-dot-g {
        background: #28c840;
      }
    }
  }

  .rt-screen-code {
    padding: 4px 6px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: 6.5px;
    line-height: 1.2;

    @media (max-width: 768px) {
      font-size: 5.5px;
      padding: 3px 4px;
    }

    .rt-line {
      opacity: 0;
      color: rgba($cyan, 0.85);
      white-space: nowrap;
      overflow: hidden;
      animation: rt-type 4s steps(30, end) infinite;
    }
    .rt-l1 {
      color: #6fe07a;
      animation-delay: 0s;
    }
    .rt-l2 {
      color: rgba(255, 255, 255, 0.55);
      animation-delay: 0.5s;
    }
    .rt-l3 {
      color: $accent;
      animation-delay: 1s;
    }
    .rt-l4 {
      color: $purple;
      animation-delay: 1.5s;
    }
    .rt-l5 {
      color: $accent;
      animation-delay: 2s;
    }

    .rt-caret {
      color: $cyan;
      animation: rt-caret-blink 0.6s step-end infinite;
    }
  }

  .rt-mac-chin {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 8px;
    display: flex;
    align-items: center;
    justify-content: center;

    .rt-mac-logo {
      width: 18px;
      height: 2px;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.12), transparent);
      border-radius: 1px;
    }
  }

  .rt-mac-base {
    position: relative;
    width: 110%;
    margin-left: -5%;
    height: 12px;
    background: linear-gradient(180deg, #c8ccd6 0%, #8a8f9c 60%, #5a606f 100%);
    border-radius: 2px 2px 8px 8px;
    border: 1px solid #2a2f3a;
    border-top: none;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5);

    @media (max-width: 768px) {
      height: 9px;
    }
  }

  .rt-mac-hinge {
    position: absolute;
    top: 0;
    left: 8%;
    right: 8%;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.5), transparent);
  }

  .rt-mac-keyboard {
    position: absolute;
    top: 2px;
    left: 12%;
    right: 12%;
    height: 4px;
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 1px;

    @media (max-width: 768px) {
      height: 3px;
    }

    .rt-key {
      background: #1a1f2a;
      border-radius: 1px;
      animation: rt-key-press 0.42s ease-in-out infinite;
    }

    @for $i from 1 through 36 {
      .rt-key:nth-child(#{$i}) {
        animation-delay: #{($i % 7) * 0.06}s;
      }
    }
  }

  .rt-mac-trackpad {
    position: absolute;
    bottom: 1px;
    left: 50%;
    transform: translateX(-50%);
    width: 40%;
    height: 2px;
    background: #2a2f3a;
    border-radius: 1px;
  }

  .rt-spark {
    position: absolute;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: $cyan;
    box-shadow: 0 0 6px $cyan;
    animation: rt-spark 2.4s ease-in-out infinite;

    &.rt-spark-1 {
      top: 20%;
      left: 15%;
      animation-delay: 0s;
    }
    &.rt-spark-2 {
      top: 10%;
      right: 20%;
      animation-delay: 0.8s;
      background: $purple;
      box-shadow: 0 0 6px $purple;
    }
    &.rt-spark-3 {
      top: 30%;
      right: 8%;
      animation-delay: 1.6s;
      background: $accent;
      box-shadow: 0 0 6px $accent;
    }
  }
}

// Shared keyframes for typing robot
@keyframes rt-bob {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}

@keyframes rt-blink {
  0%,
  60%,
  100% {
    opacity: 1;
  }
  70%,
  90% {
    opacity: 0.25;
  }
}

@keyframes rt-scan {
  0%,
  100% {
    transform: translate(-90%, -50%);
  }
  25% {
    transform: translate(-50%, -50%);
  }
  50% {
    transform: translate(-10%, -50%);
  }
  75% {
    transform: translate(-50%, -50%);
  }
}

@keyframes rt-eq {
  0%,
  100% {
    transform: scaleY(0.3);
  }
  50% {
    transform: scaleY(1);
  }
}

@keyframes rt-pulse {
  0%,
  100% {
    box-shadow: 0 0 10px rgba(255, 80, 80, 0.7);
  }
  50% {
    box-shadow: 0 0 18px rgba(255, 80, 80, 1);
  }
}

@keyframes rt-shoulder-l {
  0%,
  100% {
    transform: rotate(-4deg);
  }
  50% {
    transform: rotate(8deg);
  }
}
@keyframes rt-shoulder-r {
  0%,
  100% {
    transform: rotate(4deg);
  }
  50% {
    transform: rotate(-8deg);
  }
}

@keyframes rt-type {
  0% {
    opacity: 0;
    max-width: 0;
  }
  8% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 1;
    max-width: 100%;
  }
}

@keyframes rt-caret-blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

@keyframes rt-key-press {
  0%,
  70%,
  100% {
    transform: translateY(0);
    background: #1a1f2a;
  }
  35% {
    transform: translateY(0.5px);
    background: rgba($cyan, 0.4);
  }
}

@keyframes rt-spark {
  0%,
  100% {
    opacity: 0;
    transform: translateY(0) scale(0.4);
  }
  50% {
    opacity: 1;
    transform: translateY(-14px) scale(1);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Scene 3 · Code Revelation
// ─────────────────────────────────────────────────────────────────────────────
.scene-code {
  background: linear-gradient(140deg, #0a0b1e 0%, #0c0d24 100%);
}

.s3-code-bg {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  pointer-events: none;
  overflow: hidden;

  .cl {
    display: block;
    font-family: 'Courier New', monospace;
    font-size: clamp(0.7rem, 1vw, 0.9rem);
    color: rgba(255, 255, 255, 0.1);
    padding: 3px 0;
    white-space: nowrap;
    will-change: opacity, transform;
  }
}

.s3-duel {
  position: relative;
  margin-bottom: 32px;
}

.s3-hate {
  position: relative;
  display: inline-block;
  margin-bottom: 8px;
  will-change: opacity, transform;
}

.s3-strike {
  position: absolute;
  bottom: 48%;
  left: -3%;
  width: 106%;
  height: 3px;
  background: linear-gradient(90deg, transparent, rgba($purple, 0.8), transparent);
  will-change: transform;
}

.s3-love {
  will-change: opacity, transform;
}

// ─────────────────────────────────────────────────────────────────────────────
// Scene 4 · COVID
// ─────────────────────────────────────────────────────────────────────────────
.scene-covid {
  background: linear-gradient(140deg, #060608 0%, #080810 100%);
}

.s4-year {
  position: absolute;
  font-family: $font-head;
  font-size: clamp(12rem, 22vw, 28rem);
  font-weight: 900;
  color: rgba(255, 255, 255, 0.025);
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 0;
  letter-spacing: -0.04em;
  white-space: nowrap;
  will-change: opacity, transform;
}

.s4-techs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 28px;

  .tc {
    padding: 8px 20px;
    border: 1px solid rgba($accent, 0.28);
    border-radius: 100px;
    font-size: 0.83rem;
    color: $accent;
    letter-spacing: 0.06em;
    transition: background 0.25s;
    will-change: opacity, transform;

    &:hover {
      background: rgba($accent, 0.08);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Scene 5 · Academia
// ─────────────────────────────────────────────────────────────────────────────
.scene-academia {
  background: linear-gradient(140deg, #08101e 0%, #0a1428 100%);
}

.s5-uni {
  display: flex;
  align-items: center;
  gap: 18px;
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 12px;
  padding: 20px 24px;
  margin: 28px 0;
  max-width: 440px;
  will-change: opacity, transform;

  .uni-icon {
    font-size: 2rem;
    color: $amber;
    flex-shrink: 0;
  }
  .uni-name {
    font-weight: 700;
    color: $text;
    font-size: 1rem;
    margin-bottom: 3px;
  }
  .uni-deg {
    font-size: 0.83rem;
    color: $muted;
    margin-bottom: 2px;
  }
  .uni-yr {
    font-size: 0.72rem;
    color: $accent;
    letter-spacing: 0.1em;
  }
}

.s5-acts {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  margin-top: 20px;

  .ac {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
    color: $muted;
    will-change: opacity, transform;

    i {
      color: $accent;
    }
  }
}

.s5-visual {
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    display: none;
  }
}

.s5-arches {
  position: relative;
  width: 260px;
  height: 260px;
}

.arch {
  position: absolute;
  border-radius: 50% 50% 0 0;
  border: 1.5px solid;
  will-change: opacity, transform;

  &.arch-1 {
    inset: 0;
    border-color: rgba($amber, 0.15);
  }
  &.arch-2 {
    inset: 20%;
    border-color: rgba($amber, 0.2);
  }
  &.arch-3 {
    inset: 40%;
    border-color: rgba($amber, 0.35);
    background: rgba($amber, 0.04);
  }
}

.arch-label {
  position: absolute;
  bottom: -28px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.72rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba($amber, 0.5);
}

// ─────────────────────────────────────────────────────────────────────────────
// Scene 6 · Challenges
// ─────────────────────────────────────────────────────────────────────────────
.scene-challenges {
  background: #050507;

  .s6-negatives {
    margin-bottom: 48px;

    .display-title {
      font-size: clamp(2.5rem, 5vw, 4rem);
      margin-bottom: 4px;
    }
  }

  .s6-divider {
    width: 50%;
    height: 3px;
    background: $accent;
    margin-bottom: 32px;
    will-change: transform;
  }

  .s6-persist {
    min-height: 120px;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Scene 7 · Breakthrough
// ─────────────────────────────────────────────────────────────────────────────
.scene-breakthrough {
  background: linear-gradient(140deg, #0d0f1a 0%, #0f1120 100%);
}

.s7-glow {
  position: absolute;
  width: 700px;
  height: 700px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba($accent, 0.07) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  will-change: opacity, transform;
}

.s7-steps {
  width: 100%;
  max-width: 600px;
  margin: 36px 0;

  .step {
    display: flex;
    align-items: baseline;
    gap: 18px;
    padding: 16px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    will-change: opacity, transform;

    &:last-child {
      border-bottom: none;
    }

    .sn {
      font-size: 0.68rem;
      color: $accent;
      letter-spacing: 0.16em;
      flex-shrink: 0;
      font-family: $font-head;
    }
    .sr {
      font-size: 1.05rem;
      color: $text;
      font-weight: 600;
      flex: 1;
    }
    .sp {
      font-size: 0.78rem;
      color: $muted;
      white-space: nowrap;
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Scene 8 · Evolution
// ─────────────────────────────────────────────────────────────────────────────
.scene-evolution {
  background: linear-gradient(140deg, #060e1a 0%, #071220 100%);
}

.s8-stack {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 40px 0;
  flex-wrap: wrap;

  .si {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 18px 22px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 14px;
    will-change: opacity, transform;
    transition:
      background 0.25s,
      border-color 0.25s;

    &:hover {
      background: rgba(255, 255, 255, 0.06);
    }

    i {
      font-size: 1.8rem;
    }
    span {
      font-size: 0.68rem;
      color: $muted;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    &.si--fe {
      border-color: rgba($accent, 0.3);
      i {
        color: $accent;
      }
    }
    &.si--be {
      border-color: rgba($green, 0.3);
      i {
        color: $green;
      }
    }
    &.si--do {
      border-color: rgba($cyan, 0.3);
      i {
        color: $cyan;
      }
    }
    &.si--iot {
      border-color: rgba($purple, 0.3);
      i {
        color: $purple;
      }
    }
    &.si--mob {
      border-color: rgba($amber, 0.3);
      i {
        color: $amber;
      }
    }
  }

  .sa {
    color: rgba($muted, 0.5);
    font-size: 0.85rem;
    will-change: opacity;

    @media (max-width: 640px) {
      display: none;
    }
  }
}

.s8-badge {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 12px 26px;
  border: 1px solid rgba($cyan, 0.28);
  border-radius: 100px;
  color: $cyan;
  font-size: 0.88rem;
  margin-bottom: 24px;
  letter-spacing: 0.03em;
  will-change: opacity, transform;

  i {
    opacity: 0.7;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Scene 9 · Present
// ─────────────────────────────────────────────────────────────────────────────
.scene-present {
  background: linear-gradient(140deg, #06080f 0%, #080b14 100%);
  min-height: 100vh;
  padding-bottom: 0;

  .chapter-label {
    margin-bottom: 5rem;
  }

  // on Safari the last letter gets cut off without extra padding
  h2 > span:nth-child(1),
  h2 > span:last-child {
    @supports (-webkit-hyphens: none) {
      padding-right: 1.5rem;
    }
  }

  .s9-cta {
    display: flex;
    gap: 14px;
    margin-top: 48px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .cta-btn {
    display: inline-flex;
    align-items: center;
    padding: 15px 2rem;
    border-radius: 100px;
    font-size: 0.92rem;
    text-decoration: none;
    letter-spacing: 0.06em;
    font-family: $font-head;
    transition:
      transform 0.25s ease,
      box-shadow 0.25s ease,
      background 0.25s ease;
    will-change: opacity, transform;

    &.cta-btn--primary {
      background: $accent;
      color: white;
      border: none;

      &:hover {
        background: lighten($accent, 5%);
        transform: translateY(-3px);
        box-shadow: 0 10px 36px rgba($accent, 0.35);
      }
    }

    &.cta-btn--outline {
      background: transparent;
      border: 1.5px solid rgba(255, 255, 255, 0.18);
      color: $text;

      &:hover {
        border-color: rgba(255, 255, 255, 0.45);
        transform: translateY(-3px);
        box-shadow: 0 10px 36px rgba($text, 0.3);
      }
    }
  }

  .s9-sig {
    margin-top: 5rem;
    font-size: 0.72rem;
    color: $muted;
    letter-spacing: 0.22em;
    text-transform: uppercase;
  }
}
</style>
