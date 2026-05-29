<script setup>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

gsap.registerPlugin(ScrollTrigger)

const router = useRouter()

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

function lerp(a, b, t) {
  return a + (b - a) * t
}

function onMouseMove(e) {
  mouseX = e.clientX
  mouseY = e.clientY
  if (cursorOuter.value)
    cursorOuter.value.style.opacity = '1'
  if (cursorInner.value)
    cursorInner.value.style.animationPlayState = 'running'
}

function animateCursor() {
  outerX = lerp(outerX, mouseX, 0.09)
  outerY = lerp(outerY, mouseY, 0.09)
  if (cursorOuter.value) {
    cursorOuter.value.style.transform = `translate3d(${outerX}px,${outerY}px,0) translate(-50%,-50%)`
  }
  if (cursorInner.value) {
    cursorInner.value.style.transform = `translate3d(${mouseX}px,${mouseY}px,0) translate(-50%,-50%)`
  }
  cursorRaf = requestAnimationFrame(animateCursor)
}

function onMouseEnterLink() {
  if (cursorOuter.value)
    gsap.to(cursorOuter.value, { scale: 2.2, duration: 0.3, ease: 'power2.out' })
}
function onMouseLeaveLink() {
  if (cursorOuter.value)
    gsap.to(cursorOuter.value, { scale: 1, duration: 0.3, ease: 'power2.out' })
}

function navigateToPortfolio() {
  router.push('/about')
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
      .from('.s1-gear', { rotation: 0, scale: 0, opacity: 0, duration: 0.6, ease: 'back.out(1.7)' }, 0)

    // ── Scene 2: Robotics ────────────────────────────────────────────────────
    gsap.timeline({ scrollTrigger: mkTrigger('.scene-robotics') })
      .from('.s2-chapter', { opacity: 0, y: -24, duration: 0.25 })
      .from('.s2-title .w', {
        x: -120,
        opacity: 0,
        stagger: 0.06,
        duration: 0.5,
        ease: 'power3.out',
      }, 0.1)
      .from('.s2-robot', { scale: 0, opacity: 0, rotation: -30, duration: 0.7, ease: 'back.out(1.7)' }, 0.05)
      .from('.s2-paper', { y: -70, opacity: 0, duration: 0.5 }, 0.5)
      .from('.s2-subtitle', { y: 30, opacity: 0, duration: 0.4 }, 0.7)

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
      .from('.s6-divider', { scaleX: 0, transformOrigin: 'center', duration: 0.4 }, 0.6)
      .from('.s6-persist', { opacity: 0, y: 30, duration: 0.5 }, 0.7)

    // ── Scene 7: Breakthrough ────────────────────────────────────────────────
    gsap.timeline({ scrollTrigger: mkTrigger('.scene-breakthrough', PIN_LONG) })
      .from('.s7-glow', { scale: 0, opacity: 0, duration: 0.8, ease: 'power2.out' }, 0)
      .from('.s7-chapter', { opacity: 0, duration: 0.2 }, 0)
      .from('.s7-title .w', {
        y: 100,
        opacity: 0,
        stagger: 0.06,
        duration: 0.5,
        ease: 'power3.out',
      }, 0.1)
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
      <span>Scroll to continue</span>
      <i class="fa-solid fa-chevron-down" />
    </div>

    <!-- ── Hero Intro ────────────────────────────────────────── -->
    <div ref="heroSection" class="s-hero">
      <div class="hero-content">
        <h1 class="hero-title">
          <span>Every</span>
          <span>Expert</span>
          <span>Started</span>
          <span>Somewhere</span>
        </h1>
        <p class="hero-subtitle">
          This is my journey. From curious student to building at scale.
        </p>
      </div>
    </div>

    <!-- ── Top nav ───────────────────────────────────────────── -->
    <nav class="s-nav" aria-label="Story navigation">
      <button class="s-back" @click="navigateToPortfolio">
        <i class="fa-solid fa-arrow-left" aria-hidden="true" />
        <span>Portfolio</span>
      </button>
      <span class="s-nav-label">Nima Karimi — The Story</span>
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
        <span class="s1-chapter chapter-label">Chapter 01 — Origin</span>
        <h1 class="s1-title display-title">
          <span class="w">Where</span>&#32;<span class="w">it</span>&#32;<span class="w">all</span>&#32;<span class="w">began</span>
        </h1>
        <p class="s1-subtitle scene-sub">
          Mechanical engineering gave me the foundation.<br>
          Mechatronics gave me direction.
        </p>
        <p class="s1-detail scene-det">
          B.Sc. Mechatronics Engineering
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
          <span class="s2-chapter chapter-label">Chapter 02 — Curiosity</span>
          <h2 class="s2-title display-title">
            <span class="w">Then</span>&#32;<span class="w">came</span>&#32;<span class="w">the</span>&#32;<span class="w">robots.</span>
          </h2>
          <div class="s2-paper">
            <div class="paper-icon">
              <i class="fa-solid fa-file-lines" aria-hidden="true" />
            </div>
            <div class="paper-body">
              <div class="paper-tag">
                Published Research
              </div>
              <p class="paper-title">
                ROS-based Motion Planner for Gazebo-Simulated<br>
                Rescue Robots in RoboCup
              </p>
            </div>
          </div>
          <p class="s2-subtitle scene-sub">
            ROS. Gazebo. Inverse kinematics. Control loops.<br>
            I was hooked — and I published to prove it.
          </p>
        </div>

        <div class="s2-robot" aria-hidden="true">
          <!-- Industrial Robot Arm -->
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
          <!-- Ambient particles -->
          <div class="robot-spark spark-1" />
          <div class="robot-spark spark-2" />
          <div class="robot-spark spark-3" />
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
        <span class="s3-chapter chapter-label">Chapter 03 — Revelation</span>
        <div class="s3-duel">
          <h2 class="s3-hate display-title display-title--dim">
            I hated code.
            <span class="s3-strike" aria-hidden="true" />
          </h2>
          <h2 class="s3-love display-title display-title--grad">
            Then I loved it.
          </h2>
        </div>
        <p class="s3-subtitle scene-sub">
          Building robots forced me into C++, Python, and ROS.<br>
          Somewhere between debugging a control loop and watching<br>
          a robot move for the first time — it just clicked.
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

      <div class="scene-content">
        <span class="s4-chapter chapter-label">Chapter 04 — Pivot</span>
        <h2 class="s4-title display-title">
          <span class="w">The</span>&#32;<span class="w">world</span>&#32;<span class="w">paused.</span><br>
          <span class="w">I</span>&#32;<span class="w">started</span>&#32;<span class="w">building.</span>
        </h2>
        <p class="s4-subtitle scene-sub">
          COVID-19 brought a lockdown. I used it to learn web development from scratch,
          one tutorial at a time.
        </p>
        <div class="s4-techs">
          <span class="tc">HTML</span>
          <span class="tc">CSS</span>
          <span class="tc">JavaScript</span>
          <span class="tc">React</span>
          <span class="tc">Vue</span>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════════
         SCENE 5 · ACADEMIA
    ═════════════════════════════════════════════════════════ -->
    <section class="scene scene-academia" aria-label="Chapter 5: Academia">
      <div class="scene-content scene-content--split">
        <div class="s5-text">
          <span class="s5-chapter chapter-label">Chapter 05 — Academia</span>
          <h2 class="s5-title display-title">
            <span class="w">I</span>&#32;<span class="w">moved</span>&#32;<span class="w">to</span>&#32;<span class="w">Italy 🇮🇹</span>
          </h2>
          <div class="s5-uni">
            <div class="uni-icon">
              <i class="fa-solid fa-graduation-cap" aria-hidden="true" />
            </div>
            <div class="uni-body">
              <div class="uni-name">
                University of Padova
              </div>
              <div class="uni-deg">
                M.Sc. Management Engineering
              </div>
              <div class="uni-yr">
                2021 — 2023
              </div>
            </div>
          </div>
          <p class="s5-subtitle scene-sub">
            While earning my Master's, I was simultaneously coding,
            learning, and doing my first internship. All at once.
          </p>
          <div class="s5-acts">
            <div class="ac">
              <i class="fa-solid fa-book" aria-hidden="true" />Studying
            </div>
            <div class="ac">
              <i class="fa-solid fa-code" aria-hidden="true" />Building
            </div>
            <div class="ac">
              <i class="fa-solid fa-briefcase" aria-hidden="true" />Working
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
        <span class="s6-chapter chapter-label">Chapter 06 — The Grind</span>
        <div class="s6-negatives">
          <h2 class="s6-n1 display-title display-title--ghost">
            No degree.
          </h2>
          <h2 class="s6-n2 display-title display-title--ghost">
            No experience.
          </h2>
          <h2 class="s6-n3 display-title display-title--ghost">
            No offers.
          </h2>
        </div>
        <div class="s6-divider" aria-hidden="true" />
        <h2 class="s6-persist display-title display-title--accent">
          I kept building anyway.
        </h2>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════════
         SCENE 7 · BREAKTHROUGH
    ═════════════════════════════════════════════════════════ -->
    <section class="scene scene-breakthrough" aria-label="Chapter 7: Breakthrough">
      <div class="s7-glow" aria-hidden="true" />

      <div class="scene-content scene-content--center">
        <span class="s7-chapter chapter-label">Chapter 07 — Breakthrough</span>
        <h2 class="s7-title display-title">
          <span class="w">Then</span>&#32;<span class="w">it</span>&#32;<span class="w">clicked.</span>
        </h2>
        <div class="s7-steps">
          <div class="step">
            <span class="sn">01</span>
            <span class="sr">Software Developer Intern</span>
            <span class="sp">Leanbit · Apr 2022</span>
          </div>
          <div class="step">
            <span class="sn">02</span>
            <span class="sr">Web Developer Freelancer</span>
            <span class="sp">Oct 2022 → ongoing</span>
          </div>
          <div class="step">
            <span class="sn">03</span>
            <span class="sr">ML Developer & Full-Stack</span>
            <span class="sp">CP · Jun 2023</span>
          </div>
          <div class="step">
            <span class="sn">04</span>
            <span class="sr">Full-Stack + Project Manager</span>
            <span class="sp">KeySolution · Oct 2023</span>
          </div>
        </div>
        <p class="s7-subtitle scene-sub">
          Persistence. Consistency. Shipped code.
        </p>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════════
         SCENE 8 · EVOLUTION
    ═════════════════════════════════════════════════════════ -->
    <section class="scene scene-evolution" aria-label="Chapter 8: Evolution">
      <div class="scene-content">
        <span class="s8-chapter chapter-label">Chapter 08 — Evolution</span>
        <h2 class="s8-title display-title">
          <span class="w">Frontend</span>&#32;<span class="w">was</span>&#32;<span class="w">just</span><br>
          <span class="w">the</span>&#32;<span class="w">beginning.</span>
        </h2>

        <div class="s8-stack">
          <div class="si si--fe">
            <i class="fa-brands fa-vuejs" aria-hidden="true" />
            <span>Frontend</span>
          </div>
          <span class="sa" aria-hidden="true"><i class="fa-solid fa-arrow-right" /></span>
          <div class="si si--be">
            <i class="fa-solid fa-server" aria-hidden="true" />
            <span>Backend</span>
          </div>
          <span class="sa" aria-hidden="true"><i class="fa-solid fa-arrow-right" /></span>
          <div class="si si--do">
            <i class="fa-brands fa-docker" aria-hidden="true" />
            <span>DevOps</span>
          </div>
          <span class="sa" aria-hidden="true"><i class="fa-solid fa-arrow-right" /></span>
          <div class="si si--iot">
            <i class="fa-solid fa-microchip" aria-hidden="true" />
            <span>IoT</span>
          </div>
          <span class="sa" aria-hidden="true"><i class="fa-solid fa-arrow-right" /></span>
          <div class="si si--mob">
            <i class="fa-solid fa-mobile-screen" aria-hidden="true" />
            <span>Mobile</span>
          </div>
        </div>

        <div class="s8-badge">
          <i class="fa-solid fa-building" aria-hidden="true" />
          <span>Software Engineering Consultant · Capgemini @ TIM · Smart Mobility</span>
        </div>

        <p class="s8-subtitle scene-sub">
          Full-stack across the entire stack.<br>
          From idea to production.
        </p>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════════
         SCENE 9 · PRESENT
    ═════════════════════════════════════════════════════════ -->
    <section class="scene scene-present" aria-label="Chapter 9: Today">
      <div class="scene-content scene-content--center scene-present__inner">
        <span class="s9-chapter chapter-label">Chapter 09 — Today</span>
        <h2 class="s9-title display-title display-title--hero">
          <span class="w">I</span>&#32;<span class="w">build.</span><br>
          <span class="w">I</span>&#32;<span class="w">ship.</span><br>
          <span class="w">I</span>&#32;<span class="w">lead.</span>
        </h2>
        <p class="s9-body scene-sub">
          Full-stack engineer. DevOps practitioner. IoT developer. Tech interviewer.<br>
          Always learning. Always evolving.
        </p>
        <div class="s9-cta">
          <button class="cta-btn cta-btn--primary" @click="navigateToPortfolio">
            View Portfolio
          </button>
          <router-link to="/contact" class="cta-btn cta-btn--outline">
            Get in Touch
          </router-link>
        </div>
        <p class="s9-sig">
          nimakarimi.me · {{ new Date().getFullYear() }}
        </p>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
/* Global: hide system cursor on story page */
body.story-mode,
body.story-mode * {
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
$font-head: 'Saira', sans-serif;
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

.story-wrapper,
.story-wrapper * {
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
  font-family: $font-head;
  font-size: 0.78rem;
  color: $muted;
  letter-spacing: 0.12em;
  text-transform: uppercase;

  @media (max-width: 768px) {
    display: none;
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
  margin-bottom: 24px;
  font-family: $font-body;
}

.display-title {
  font-family: $font-head;
  font-size: clamp(2.8rem, 5.5vw, 6.5rem);
  font-weight: 800;
  line-height: 1.04;
  letter-spacing: -0.025em;
  color: $text;
  margin-bottom: 28px;

  .w {
    display: inline-block;
    will-change: transform, opacity;
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
    font-size: clamp(4rem, 8.5vw, 9.5rem);
    line-height: 0.93;
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
  color: rgba(255, 255, 255, 0.062);
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
  display: flex;
  align-items: flex-start;
  gap: 16px;
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-left: 3px solid $accent;
  border-radius: 10px;
  padding: 18px 22px;
  margin: 28px 0;
  max-width: 500px;
  will-change: opacity, transform;

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

// CSS robot visual — Industrial Robot Arm
.s2-robot {
  position: relative;
  width: 280px;
  height: 280px;
  margin: 0 auto;
  will-change: opacity, transform;

  @media (max-width: 768px) {
    width: 200px;
    height: 200px;
  }
}

.robot-base {
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
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
  animation: robotJ1 4s ease-in-out infinite;
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
  height: 80px;
  background: linear-gradient(to top, rgba($accent, 0.6), rgba($purple, 0.4));
  border-radius: 3px;
  animation: robotSeg1 4s ease-in-out infinite;

  @media (max-width: 768px) {
    height: 55px;
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
  height: 60px;
  background: linear-gradient(to top, rgba($purple, 0.5), rgba($cyan, 0.4));
  border-radius: 3px;
  animation: robotSeg2 4s ease-in-out infinite;

  @media (max-width: 768px) {
    height: 40px;
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
    animation: gripperL 2s ease-in-out infinite;
    transform-origin: top center;
  }
  &.gripper-r {
    right: 3px;
    animation: gripperR 2s ease-in-out infinite;
    transform-origin: top center;
  }
}

.robot-spark {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: $cyan;
  box-shadow: 0 0 8px $cyan;
  animation: sparkFloat 3s ease-in-out infinite;

  &.spark-1 {
    top: 20%;
    left: 60%;
    animation-delay: 0s;
  }
  &.spark-2 {
    top: 40%;
    left: 30%;
    animation-delay: 1s;
  }
  &.spark-3 {
    top: 65%;
    right: 25%;
    animation-delay: 2s;
  }
}

@keyframes robotJ1 {
  0%,
  100% {
    transform: rotate(-5deg);
  }
  50% {
    transform: rotate(5deg);
  }
}

@keyframes robotSeg1 {
  0%,
  100% {
    transform: translateX(-50%) rotate(15deg);
  }
  25% {
    transform: translateX(-50%) rotate(-20deg);
  }
  50% {
    transform: translateX(-50%) rotate(-10deg);
  }
  75% {
    transform: translateX(-50%) rotate(20deg);
  }
}

@keyframes robotSeg2 {
  0%,
  100% {
    transform: translateX(-50%) rotate(-20deg);
  }
  25% {
    transform: translateX(-50%) rotate(15deg);
  }
  50% {
    transform: translateX(-50%) rotate(25deg);
  }
  75% {
    transform: translateX(-50%) rotate(-10deg);
  }
}

@keyframes gripperL {
  0%,
  100% {
    transform: rotate(-8deg);
  }
  50% {
    transform: rotate(4deg);
  }
}

@keyframes gripperR {
  0%,
  100% {
    transform: rotate(8deg);
  }
  50% {
    transform: rotate(-4deg);
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
    color: rgba(255, 255, 255, 0.038);
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
}

.s6-negatives {
  margin-bottom: 48px;

  .display-title {
    font-size: clamp(2.5rem, 5vw, 6rem);
    margin-bottom: 4px;
  }
}

.s6-divider {
  width: 48px;
  height: 3px;
  background: $accent;
  margin-bottom: 32px;
  will-change: transform;
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
}

.scene-present__inner {
  padding-top: 120px;
  padding-bottom: 120px;
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
  padding: 15px 40px;
  border-radius: 100px;
  font-size: 0.92rem;
  text-decoration: none;
  letter-spacing: 0.06em;
  font-family: $font-head;
  text-transform: uppercase;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    background 0.25s ease;
  will-change: opacity, transform;

  &.cta-btn--primary {
    background: $accent;
    color: white;

    &:hover {
      background: lighten($accent, 8%);
      transform: translateY(-3px);
      box-shadow: 0 10px 36px rgba($accent, 0.35);
    }
  }

  &.cta-btn--outline {
    border: 1.5px solid rgba(255, 255, 255, 0.18);
    color: $text;

    &:hover {
      border-color: rgba(255, 255, 255, 0.45);
      transform: translateY(-3px);
    }
  }
}

.s9-sig {
  margin-top: 64px;
  font-size: 0.72rem;
  color: rgba($muted, 0.5);
  letter-spacing: 0.22em;
  text-transform: uppercase;
}
</style>
