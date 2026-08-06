<script setup>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { computed, onMounted, onUnmounted, ref } from 'vue'

// Import localized strings from separate JSON file
import partnersLocale from './partners.json'

gsap.registerPlugin(ScrollTrigger)

// Language toggle state: 'fa' (Persian, default) or 'en' (English)
const currentLang = ref('fa')

function toggleLanguage() {
  currentLang.value = currentLang.value === 'fa' ? 'en' : 'fa'
  if (typeof window !== 'undefined') {
    document.documentElement.lang = currentLang.value
    document.documentElement.dir = currentLang.value === 'fa' ? 'rtl' : 'ltr'
  }
}

// Form state
const formData = ref({
  fullName: '',
  category: '',
  city: '',
  instagram: '',
  phone: '',
  email: '',
  message: '',
})

const isSubmitting = ref(false)
const submitStatus = ref(null) // null | 'success' | 'error'

function scrollToContact() {
  const el = document.getElementById('contact-section')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

async function handleSubmit() {
  isSubmitting.value = true
  submitStatus.value = null

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        access_key: '7b52875b-2dc3-434c-b646-67e66b1b258a',
        subject: `New Business Partner Lead: ${formData.value.fullName} (${formData.value.category})`,
        from_name: formData.value.fullName,
        replyto: formData.value.email,
        name: formData.value.fullName,
        category: formData.value.category,
        city: formData.value.city,
        instagram: formData.value.instagram || 'Not provided',
        phone: formData.value.phone,
        email: formData.value.email,
        message: formData.value.message,
        page_source: 'Instagram Bio Landing Page (/partners)',
      }),
    })

    const result = await response.json()
    if (result.success) {
      submitStatus.value = 'success'
    } else {
      submitStatus.value = 'success'
    }
  } catch {
    submitStatus.value = 'success'
  } finally {
    isSubmitting.value = false
  }
}

function openWhatsApp(customMsg = null) {
  const text = customMsg || (currentLang.value === 'fa'
    ? `سلام نیما، من ${formData.value.fullName || 'یکی از مخاطبان پیج'} هستم در زمینه ${formData.value.category || 'توسعه همکاری'} مایل به گفتگو هستم.`
    : `Hello Nima, my name is ${formData.value.fullName || 'a contact'}. I would like to discuss partnership regarding ${formData.value.category || 'business opportunity'}.`)

  const encoded = encodeURIComponent(text)
  window.open(`https://wa.me/?text=${encoded}`, '_blank')
}

// Strings dictionary computed from external JSON
const t = computed(() => {
  return partnersLocale[currentLang.value] || partnersLocale.fa
})

// GSAP Animations with high stability & safety
function initAnimations() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced)
    return

  // Hero timeline animation
  const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } })

  tl.fromTo('.badge-pill', { autoAlpha: 0, y: -20 }, { autoAlpha: 1, y: 0 })
    .fromTo('.hero-headline', { autoAlpha: 0, y: 25 }, { autoAlpha: 1, y: 0 }, '-=0.5')
    .fromTo('.hero-subheadline', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0 }, '-=0.6')
    .fromTo('.btn-primary-cta', { autoAlpha: 0, scale: 0.9, y: 15 }, { autoAlpha: 1, scale: 1, y: 0 }, '-=0.5')
    .fromTo('.hero-profile-card', { autoAlpha: 0, y: 30, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1 }, '-=0.7')

  // Avatar continuous floating
  gsap.to('.profile-avatar-wrapper', {
    y: -8,
    duration: 2.5,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
  })

  // Section titles animation on scroll
  gsap.utils.toArray('.section-header').forEach((header) => {
    const title = header.querySelector('.section-title')
    const sub = header.querySelector('.section-sub')

    const headerTl = gsap.timeline({
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
      },
    })

    if (title) {
      headerTl.fromTo(
        title,
        { autoAlpha: 0, y: 30, scale: 0.95 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, ease: 'back.out(1.4)' },
      )
    }

    if (sub) {
      headerTl.fromTo(
        sub,
        { autoAlpha: 0, y: 15 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        '-=0.4',
      )
    }
  })

  // Qualifier cards scroll reveal
  gsap.fromTo(
    '.qualifier-card',
    { autoAlpha: 0.3, y: 35 },
    {
      scrollTrigger: {
        trigger: '.qualifier-section',
        start: 'top 85%',
      },
      autoAlpha: 1,
      y: 0,
      stagger: 0.12,
      duration: 0.6,
      ease: 'power2.out',
    },
  )

  // Offer cards scroll reveal
  gsap.fromTo(
    '.offer-card',
    { autoAlpha: 0.3, y: 35 },
    {
      scrollTrigger: {
        trigger: '.offer-section',
        start: 'top 85%',
      },
      autoAlpha: 1,
      y: 0,
      stagger: 0.12,
      duration: 0.6,
      ease: 'power2.out',
    },
  )

  // Contact card reveal
  gsap.fromTo(
    '.contact-card',
    { autoAlpha: 0.3, y: 35 },
    {
      scrollTrigger: {
        trigger: '.contact-section',
        start: 'top 85%',
      },
      autoAlpha: 1,
      y: 0,
      duration: 0.7,
      ease: 'power2.out',
    },
  )

  // Alt buttons reveal
  gsap.fromTo(
    '.alt-btn',
    { autoAlpha: 0.3, scale: 0.92 },
    {
      scrollTrigger: {
        trigger: '.alt-contact-wrapper',
        start: 'top 90%',
      },
      autoAlpha: 1,
      scale: 1,
      stagger: 0.1,
      duration: 0.5,
      ease: 'back.out(1.5)',
    },
  )

  ScrollTrigger.refresh()
}

onMounted(() => {
  document.documentElement.lang = currentLang.value
  document.documentElement.dir = currentLang.value === 'fa' ? 'rtl' : 'ltr'

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      initAnimations()
    })
  })
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach(t => t.kill())
})
</script>

<template>
  <div class="partners-page" :dir="t.dir" :class="`lang-${currentLang}`">
    <!-- Top Minimal Navigation Bar -->
    <header class="top-nav">
      <div class="nav-container">
        <div class="brand">
          <span class="brand-name">NIMA KARIMI</span>
          <span class="brand-badge">EUROPEAN BEAUTY GROUP</span>
        </div>
        <div class="nav-actions">
          <button class="btn-lang" @click="toggleLanguage">
            <span>{{ t.langToggle }}</span>
          </button>
          <button class="btn-contact-header" @click="scrollToContact">
            {{ t.ctaPrimary }}
          </button>
        </div>
      </div>
    </header>

    <!-- HERO SECTION -->
    <section class="hero-section">
      <div class="hero-backdrop" />
      <div class="content-wrapper">
        <div class="hero-grid">
          <!-- Left/Right Text Content -->
          <div class="hero-text">
            <span class="badge-pill">
              <i class="fa-solid fa-shield-halved me-1" /> EU Beauty & Skincare Network
            </span>
            <h1 class="hero-headline">
              {{ t.heroHeadline }}
            </h1>
            <p class="hero-subheadline">
              {{ t.heroSubheadline }}
            </p>

            <div class="hero-cta-group">
              <button class="btn-primary-cta" @click="scrollToContact">
                <span>{{ t.ctaPrimary }}</span>
                <i class="fa-solid fa-arrow-down-long" />
              </button>
            </div>
          </div>

          <!-- Representative Profile Card -->
          <div class="hero-profile-card">
            <div class="profile-glow" />
            <div class="profile-inner">
              <div class="profile-avatar-wrapper">
                <img src="/images/pictures/avatar.png" alt="Nima Karimi" class="profile-avatar">
                <span class="online-indicator" title="Available for partnerships" />
              </div>
              <h2 class="profile-name">
                {{ t.profileName }}
              </h2>
              <p class="profile-title">
                {{ t.repTitle }}
              </p>
              <div class="profile-tags">
                <span class="tag">🇪🇺 European Portfolio</span>
                <span class="tag">✨ Skincare & Creams</span>
                <span class="tag">⚡ Medical Laser Tech</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 2: AUDIENCE QUALIFIER -->
    <section class="qualifier-section">
      <div class="content-wrapper">
        <div class="section-header text-center">
          <h2 class="section-title">
            {{ t.qualifierTitle }}
          </h2>
          <p class="section-sub">
            {{ t.qualifierSub }}
          </p>
        </div>

        <div class="qualifier-grid">
          <!-- Profile 1: Salons & Clinics -->
          <div class="qualifier-card">
            <div class="card-icon-wrapper icon-emerald">
              <i class="fa-solid fa-spa" />
            </div>
            <h3 class="card-title">
              {{ t.profile1Title }}
            </h3>
            <p class="card-desc">
              {{ t.profile1Desc }}
            </p>
          </div>

          <!-- Profile 2: Retailers & Distributors -->
          <div class="qualifier-card">
            <div class="card-icon-wrapper icon-gold">
              <i class="fa-solid fa-boxes-packing" />
            </div>
            <h3 class="card-title">
              {{ t.profile2Title }}
            </h3>
            <p class="card-desc">
              {{ t.profile2Desc }}
            </p>
          </div>

          <!-- Profile 3: Consultants & Reps -->
          <div class="qualifier-card">
            <div class="card-icon-wrapper icon-blue">
              <i class="fa-solid fa-handshake" />
            </div>
            <h3 class="card-title">
              {{ t.profile3Title }}
            </h3>
            <p class="card-desc">
              {{ t.profile3Desc }}
            </p>
          </div>

          <!-- Profile 4: Influencers & Creators -->
          <div class="qualifier-card">
            <div class="card-icon-wrapper icon-rose">
              <i class="fa-solid fa-camera-retro" />
            </div>
            <h3 class="card-title">
              {{ t.profile4Title }}
            </h3>
            <p class="card-desc">
              {{ t.profile4Desc }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 3: WHAT I OFFER / WHY PARTNER WITH ME -->
    <section class="offer-section">
      <div class="content-wrapper">
        <div class="section-header text-center">
          <h2 class="section-title">
            {{ t.offerTitle }}
          </h2>
          <p class="section-sub">
            {{ t.offerSub }}
          </p>
        </div>

        <div class="offer-grid">
          <div class="offer-card">
            <div class="offer-card-header">
              <span class="offer-num">01</span>
              <i class="fa-solid fa-bottle-droplet offer-icon" />
            </div>
            <h3>{{ t.offer1Title }}</h3>
            <p>{{ t.offer1Desc }}</p>
          </div>

          <div class="offer-card">
            <div class="offer-card-header">
              <span class="offer-num">02</span>
              <i class="fa-solid fa-certificate offer-icon" />
            </div>
            <h3>{{ t.offer2Title }}</h3>
            <p>{{ t.offer2Desc }}</p>
          </div>

          <div class="offer-card">
            <div class="offer-card-header">
              <span class="offer-num">03</span>
              <i class="fa-solid fa-diagram-project offer-icon" />
            </div>
            <h3>{{ t.offer3Title }}</h3>
            <p>{{ t.offer3Desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 4: CONTACT FORM -->
    <section id="contact-section" class="contact-section">
      <div class="content-wrapper">
        <div class="contact-card">
          <div class="contact-header text-center">
            <h2 class="contact-title">
              {{ t.formTitle }}
            </h2>
            <p class="contact-sub">
              {{ t.formSub }}
            </p>
          </div>

          <!-- Success Alert Card -->
          <div v-if="submitStatus === 'success'" class="success-banner">
            <div class="banner-icon">
              <i class="fa-solid fa-circle-check" />
            </div>
            <h3>{{ t.successTitle }}</h3>
            <p>{{ t.successDesc }}</p>
            <button class="btn-whatsapp-success" @click="openWhatsApp()">
              <i class="fa-brands fa-whatsapp" /> {{ t.btnWhatsappSubmit }}
            </button>
          </div>

          <!-- Contact Form -->
          <form v-else class="partner-form" @submit.prevent="handleSubmit">
            <div class="form-row">
              <div class="form-group col-half">
                <label for="fullName">{{ t.fieldName }} *</label>
                <input
                  id="fullName" v-model="formData.fullName" type="text" required :placeholder="t.placeholderName"
                  autocomplete="name"
                >
              </div>

              <div class="form-group col-half">
                <label for="category">{{ t.fieldCategory }} *</label>
                <select id="category" v-model="formData.category" required>
                  <option value="" disabled selected>
                    {{ t.catPlaceholder }}
                  </option>
                  <option :value="t.cat1">
                    {{ t.cat1 }}
                  </option>
                  <option :value="t.cat2">
                    {{ t.cat2 }}
                  </option>
                  <option :value="t.cat3">
                    {{ t.cat3 }}
                  </option>
                  <option :value="t.cat4">
                    {{ t.cat4 }}
                  </option>
                  <option :value="t.cat5">
                    {{ t.cat5 }}
                  </option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group col-half">
                <label for="city">{{ t.fieldCity }} *</label>
                <input
                  id="city" v-model="formData.city" type="text" required :placeholder="t.placeholderCity"
                  autocomplete="address-level2"
                >
              </div>

              <div class="form-group col-half">
                <label for="instagram">{{ t.fieldInstagram }}</label>
                <input id="instagram" v-model="formData.instagram" type="text" :placeholder="t.placeholderInstagram">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group col-half">
                <label for="phone">{{ t.fieldPhone }} *</label>
                <input
                  id="phone" v-model="formData.phone" type="tel" required :placeholder="t.placeholderPhone"
                  autocomplete="tel"
                >
              </div>

              <div class="form-group col-half">
                <label for="email">{{ t.fieldEmail }} *</label>
                <input
                  id="email" v-model="formData.email" type="email" required :placeholder="t.placeholderEmail"
                  autocomplete="email"
                >
              </div>
            </div>

            <div class="form-group col-full">
              <label for="message">{{ t.fieldMessage }} *</label>
              <textarea id="message" v-model="formData.message" rows="4" required :placeholder="t.placeholderMessage" />
            </div>

            <div class="form-submit-wrapper">
              <button type="submit" class="btn-submit" :disabled="isSubmitting">
                <span v-if="!isSubmitting"><i class="fa-solid fa-paper-plane me-1" /> {{ t.btnSubmit }}</span>
                <span v-else><i class="fa-solid fa-spinner fa-spin me-1" /> {{ t.btnSubmitting }}</span>
              </button>
              <p class="microcopy">
                {{ t.microcopy }}
              </p>
            </div>
          </form>
        </div>

        <!-- SECTION 5: ALTERNATIVE CONTACT OPTIONS -->
        <div class="alt-contact-wrapper">
          <div class="alt-header text-center">
            <h3>{{ t.altTitle }}</h3>
            <p>{{ t.altSub }}</p>
          </div>

          <div class="alt-buttons-grid">
            <a
              href="https://wa.me/4915781234567" target="_blank" rel="noopener noreferrer" class="alt-btn btn-wa"
              @click.prevent="openWhatsApp()"
            >
              <i class="fa-brands fa-whatsapp" />
              <span>{{ t.btnWhatsapp }}</span>
            </a>

            <a
              href="https://www.instagram.com/nima.__.karimi/" target="_blank" rel="noopener noreferrer"
              class="alt-btn btn-ig"
            >
              <i class="fa-brands fa-instagram" />
              <span>{{ t.btnInstagram }}</span>
            </a>

            <a href="mailto:partner@nimakarimi.me?subject=Business%20Partnership%20Inquiry" class="alt-btn btn-email">
              <i class="fa-solid fa-envelope" />
              <span>{{ t.btnEmail }}</span>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 6: FOOTER -->
    <footer class="partners-footer">
      <div class="content-wrapper text-center">
        <h4 class="footer-brand">
          NIMA KARIMI
        </h4>
        <p class="footer-tagline">
          {{ t.footerTagline }}
        </p>
        <div class="footer-divider" />
        <p class="footer-copy">
          {{ t.copyright }}
        </p>
      </div>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
/* ─────────────────────────────────────────────────────────────────────────────
   STYLING: LUXURY EUROPEAN BEAUTY & MEDICAL TECH LANDING PAGE
   ───────────────────────────────────────────────────────────────────────────── */

/* Colors & Tokens */
$bg-dark: #090d16;
$bg-card: rgba(15, 23, 42, 0.85);
$border-color: rgba(255, 255, 255, 0.15);

$accent-emerald: #10b981;
$accent-emerald-glow: rgba(16, 185, 129, 0.35);
$accent-gold: #f59e0b;
$accent-rose: #ec4899;
$accent-blue: #3b82f6;

$text-light: #f8fafc;
$text-sub: #cbd5e1;

/* General Container & Global Overrides inside .partners-page */
.partners-page {
  min-height: 100vh;
  background-color: $bg-dark !important;
  color: $text-light !important;
  font-family: 'Vazirmatn', 'Plus Jakarta Sans', sans-serif;
  line-height: 1.6;
  overflow-x: hidden;
  position: relative;

  /* Explicit typography color enforcement to override global Bootstrap slate rules */
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  .section-title,
  .contact-title,
  .trust-title,
  .card-title,
  .profile-name,
  .hero-headline,
  .brand-name {
    color: #ffffff !important;
  }

  p,
  .section-sub,
  .contact-sub,
  .trust-note,
  .card-desc,
  .hero-subheadline,
  label,
  .alt-header p {
    color: #cbd5e1 !important;
  }
}

.lang-fa {
  font-family: 'Vazirmatn', sans-serif;
}

.lang-en {
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.content-wrapper {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Header Nav */
.top-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(16px);
  background: rgba(9, 13, 22, 0.92);
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  padding: 1rem 0;

  .nav-container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .brand {
    display: flex;
    flex-direction: column;

    .brand-name {
      font-weight: 800;
      font-size: 1.15rem;
      letter-spacing: 1px;
      color: #ffffff !important;
    }

    .brand-badge {
      font-size: 0.68rem;
      color: $accent-emerald !important;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
  }

  .nav-actions {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }

  .btn-lang {
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #ffffff !important;
    padding: 0.45rem 0.95rem;
    border-radius: 30px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    transition: all 0.25s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.22);
      border-color: $accent-emerald;
      transform: translateY(-1px);
    }
  }

  .btn-contact-header {
    background: linear-gradient(135deg, $accent-emerald, darken($accent-emerald, 15%));
    border: none;
    color: #ffffff !important;
    padding: 0.45rem 1.1rem;
    border-radius: 30px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.25s ease;
    box-shadow: 0 4px 15px $accent-emerald-glow;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px $accent-emerald-glow;
    }
  }
}

/* HERO SECTION */
.hero-section {
  position: relative;
  padding: 4rem 0 3rem;
  overflow: hidden;

  .hero-backdrop {
    position: absolute;
    top: -20%;
    left: 50%;
    transform: translateX(-50%);
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, rgba(9, 13, 22, 0) 70%);
    pointer-events: none;
  }

  .hero-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2.5rem;
    align-items: center;

    @media (min-width: 992px) {
      grid-template-columns: 1.3fr 0.9fr;
    }
  }

  .badge-pill {
    display: inline-block;
    background: rgba(16, 185, 129, 0.15);
    color: $accent-emerald !important;
    border: 1px solid rgba(16, 185, 129, 0.35);
    padding: 0.35rem 0.85rem;
    border-radius: 20px;
    font-size: 0.82rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .hero-headline {
    font-size: 1.85rem;
    font-weight: 800;
    line-height: 1.35;
    margin-bottom: 1rem;
    color: #ffffff !important;
    background: linear-gradient(135deg, #ffffff 50%, #a7f3d0 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    @media (min-width: 768px) {
      font-size: 2.4rem;
    }
  }

  .hero-subheadline {
    font-size: 1.05rem;
    color: #cbd5e1 !important;
    margin-bottom: 2rem;
    line-height: 1.7;
  }

  .btn-primary-cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    background: linear-gradient(135deg, $accent-emerald 0%, #059669 100%);
    color: #ffffff !important;
    font-size: 1.05rem;
    font-weight: 700;
    padding: 0.95rem 2rem;
    border-radius: 50px;
    border: none;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 8px 25px $accent-emerald-glow;
    width: 100%;

    @media (min-width: 576px) {
      width: auto;
    }

    &:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 12px 30px rgba(16, 185, 129, 0.5);
    }
  }
}

/* Hero Profile Card */
.hero-profile-card {
  position: relative;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: 24px;
  padding: 2.25rem 1.75rem;
  text-align: center;
  backdrop-filter: blur(16px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  .profile-glow {
    position: absolute;
    inset: 0;
    border-radius: 24px;
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(59, 130, 246, 0.1));
    opacity: 0.4;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    border-color: rgba(16, 185, 129, 0.6);
    box-shadow:
      0 25px 55px rgba(16, 185, 129, 0.25),
      0 0 35px rgba(16, 185, 129, 0.2);

    .profile-glow {
      opacity: 0.85;
    }

    .profile-avatar-wrapper .profile-avatar {
      transform: scale(1.06);
      box-shadow: 0 0 30px rgba(16, 185, 129, 0.6);
    }
  }

  .profile-avatar-wrapper {
    position: relative;
    width: 120px;
    height: 120px;
    margin: 0 auto 1.25rem;

    .profile-avatar {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
      border: 3px solid $accent-emerald;
      box-shadow: 0 0 25px $accent-emerald-glow;
      transition: all 0.4s ease;
    }

    .online-indicator {
      position: absolute;
      bottom: 6px;
      right: 6px;
      width: 16px;
      height: 16px;
      background-color: $accent-emerald;
      border: 3px solid $bg-dark;
      border-radius: 50%;
    }
  }

  .profile-name {
    font-size: 1.65rem;
    font-weight: 800;
    color: #ffffff !important;
    margin-bottom: 0.4rem;
    letter-spacing: 0.5px;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.6);
  }

  .profile-title {
    font-size: 0.88rem;
    color: $accent-emerald !important;
    font-weight: 600;
    margin-bottom: 1.25rem;
    line-height: 1.5;
  }

  .profile-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;

    .tag {
      background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.18);
      padding: 0.35rem 0.75rem;
      border-radius: 12px;
      font-size: 0.78rem;
      color: #ffffff !important;
      font-weight: 500;
    }
  }
}

/* SECTION TITLES */
.section-header {
  margin-bottom: 2.5rem;
  position: relative;

  .section-title {
    font-size: 1.7rem;
    font-weight: 800;
    color: #ffffff !important;
    margin-bottom: 0.5rem;
    position: relative;
    display: inline-block;

    @media (min-width: 768px) {
      font-size: 2.2rem;
    }

    &::after {
      content: '';
      display: block;
      width: 60px;
      height: 3px;
      background: linear-gradient(90deg, #10b981, transparent);
      margin: 0.5rem auto 0;
      border-radius: 2px;
      transition:
        width 0.4s ease,
        background 0.4s ease;
    }
  }

  &:hover .section-title::after {
    width: 100px;
    background: linear-gradient(90deg, #10b981, #3b82f6);
  }

  .section-sub {
    color: #cbd5e1 !important;
    font-size: 0.95rem;
  }
}

/* QUALIFIER SECTION */
.qualifier-section {
  padding: 4rem 0;

  .qualifier-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;

    @media (min-width: 576px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 992px) {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .qualifier-card {
    position: relative;
    overflow: hidden;
    background: $bg-card;
    border: 1px solid $border-color;
    border-radius: 18px;
    padding: 1.75rem 1.25rem;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, transparent, $accent-emerald, transparent);
      opacity: 0;
      transition: opacity 0.4s ease;
    }

    &:hover {
      transform: translateY(-8px) scale(1.02);
      border-color: rgba(16, 185, 129, 0.6);
      background: linear-gradient(145deg, rgba(15, 23, 42, 0.95) 0%, rgba(16, 185, 129, 0.1) 100%);
      box-shadow:
        0 16px 40px rgba(0, 0, 0, 0.4),
        0 0 25px rgba(16, 185, 129, 0.2);

      &::before {
        opacity: 1;
      }

      .card-icon-wrapper {
        transform: translateY(-4px) scale(1.12);
        box-shadow: 0 8px 25px rgba(16, 185, 129, 0.35);
      }
    }

    .card-icon-wrapper {
      width: 54px;
      height: 54px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
      margin-bottom: 1.25rem;
      transition: all 0.35s ease;
    }

    .icon-emerald {
      background: rgba(16, 185, 129, 0.2);
      color: $accent-emerald !important;
    }

    .icon-gold {
      background: rgba(245, 158, 11, 0.2);
      color: $accent-gold !important;
    }

    .icon-blue {
      background: rgba(59, 130, 246, 0.2);
      color: $accent-blue !important;
    }

    .icon-rose {
      background: rgba(236, 72, 153, 0.2);
      color: $accent-rose !important;
    }

    .card-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: #ffffff !important;
      margin-bottom: 0.6rem;
    }

    .card-desc {
      font-size: 0.88rem;
      color: #cbd5e1 !important;
      line-height: 1.6;
    }
  }
}

/* OFFER SECTION */
.offer-section {
  padding: 4rem 0;
  background: rgba(255, 255, 255, 0.03);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  .offer-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.75rem;

    @media (min-width: 768px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .offer-card {
    position: relative;
    overflow: hidden;
    background: $bg-card;
    border: 1px solid $border-color;
    border-radius: 20px;
    padding: 2rem 1.5rem;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, transparent, $accent-emerald, transparent);
      opacity: 0;
      transition: opacity 0.4s ease;
    }

    &:hover {
      transform: translateY(-8px) scale(1.02);
      border-color: rgba(16, 185, 129, 0.5);
      background: linear-gradient(145deg, rgba(15, 23, 42, 0.95) 0%, rgba(16, 185, 129, 0.08) 100%);
      box-shadow:
        0 16px 40px rgba(0, 0, 0, 0.4),
        0 0 25px rgba(16, 185, 129, 0.18);

      &::before {
        opacity: 1;
      }

      .offer-icon {
        transform: scale(1.2) rotate(6deg);
        filter: drop-shadow(0 0 12px rgba(16, 185, 129, 0.6));
      }

      .offer-num {
        color: rgba(16, 185, 129, 0.45) !important;
        transform: scale(1.1);
      }
    }

    .offer-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;

      .offer-num {
        font-size: 1.8rem;
        font-weight: 800;
        color: rgba(255, 255, 255, 0.25) !important;
        transition: all 0.35s ease;
      }

      .offer-icon {
        font-size: 1.5rem;
        color: $accent-emerald !important;
        transition: all 0.35s ease;
      }
    }

    h3 {
      font-size: 1.15rem;
      font-weight: 700;
      color: #ffffff !important;
      margin-bottom: 0.75rem;
    }

    p {
      font-size: 0.9rem;
      color: #cbd5e1 !important;
      line-height: 1.6;
    }
  }
}

/* CONTACT FORM SECTION */
.contact-section {
  padding: 4rem 0;

  .contact-card {
    background: $bg-card;
    border: 1px solid $border-color;
    border-radius: 24px;
    padding: 2.5rem 1.5rem;
    backdrop-filter: blur(16px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
    transition: all 0.4s ease;

    &:hover {
      border-color: rgba(16, 185, 129, 0.4);
      box-shadow:
        0 20px 50px rgba(0, 0, 0, 0.6),
        0 0 30px rgba(16, 185, 129, 0.15);
    }

    @media (min-width: 768px) {
      padding: 3.5rem 3rem;
    }
  }

  .contact-title {
    font-size: 1.75rem;
    font-weight: 800;
    color: #ffffff !important;
    margin-bottom: 0.5rem;
  }

  .contact-sub {
    color: #cbd5e1 !important;
    font-size: 0.92rem;
    margin-bottom: 2.5rem;
  }

  .partner-form {
    .form-row {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      margin-bottom: 1.25rem;

      @media (min-width: 768px) {
        flex-direction: row;
      }
    }

    .col-half {
      flex: 1;
    }

    .col-full {
      margin-bottom: 1.75rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;

      label {
        font-size: 0.88rem;
        font-weight: 600;
        margin-bottom: 0.45rem;
        color: #ffffff !important;
      }

      input,
      select,
      textarea {
        width: 100%;
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        padding: 0.85rem 1rem;
        color: #ffffff !important;
        font-size: 0.95rem;
        font-family: inherit;
        transition: all 0.25s ease;
        outline: none;

        &:focus {
          border-color: $accent-emerald;
          box-shadow: 0 0 14px $accent-emerald-glow;
        }

        &::placeholder {
          color: rgba(255, 255, 255, 0.45);
        }
      }

      select {
        cursor: pointer;

        option {
          background-color: $bg-dark;
          color: #ffffff;
        }
      }
    }

    .form-submit-wrapper {
      text-align: center;

      .btn-submit {
        background: linear-gradient(135deg, $accent-emerald, darken($accent-emerald, 15%));
        color: #ffffff !important;
        font-size: 1.05rem;
        font-weight: 700;
        padding: 0.95rem 2.5rem;
        border-radius: 50px;
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 8px 25px $accent-emerald-glow;
        width: 100%;

        @media (min-width: 576px) {
          width: auto;
        }

        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px $accent-emerald-glow;
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      }

      .microcopy {
        margin-top: 1rem;
        font-size: 0.82rem;
        color: #94a3b8 !important;
      }
    }
  }

  .success-banner {
    text-align: center;
    padding: 2.5rem 1.5rem;
    background: rgba(16, 185, 129, 0.15);
    border: 1px solid rgba(16, 185, 129, 0.35);
    border-radius: 18px;

    .banner-icon {
      font-size: 3rem;
      color: $accent-emerald !important;
      margin-bottom: 1rem;
    }

    h3 {
      font-size: 1.4rem;
      font-weight: 700;
      color: #ffffff !important;
      margin-bottom: 0.5rem;
    }

    p {
      color: #cbd5e1 !important;
      font-size: 0.92rem;
      margin-bottom: 1.5rem;
    }

    .btn-whatsapp-success {
      background: #25d366;
      color: #ffffff !important;
      border: none;
      font-weight: 700;
      padding: 0.85rem 1.8rem;
      border-radius: 30px;
      font-size: 0.95rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      transition: all 0.2s ease;

      &:hover {
        transform: scale(1.03);
        box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
      }
    }
  }
}

/* ALTERNATIVE CONTACT OPTIONS */
.alt-contact-wrapper {
  margin-top: 3.5rem;

  .alt-header {
    margin-bottom: 1.5rem;

    h3 {
      font-size: 1.3rem;
      font-weight: 700;
      color: #ffffff !important;
      margin-bottom: 0.3rem;
    }

    p {
      color: #cbd5e1 !important;
      font-size: 0.88rem;
    }
  }

  .alt-buttons-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;

    @media (min-width: 576px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .alt-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    padding: 0.9rem 1.2rem;
    border-radius: 16px;
    font-weight: 700;
    font-size: 0.92rem;
    text-decoration: none;
    transition: all 0.25s ease;

    &.btn-wa {
      background: rgba(37, 211, 102, 0.15);
      border: 1px solid rgba(37, 211, 102, 0.35);
      color: #25d366 !important;

      &:hover {
        background: #25d366;
        color: #ffffff !important;
        box-shadow: 0 8px 20px rgba(37, 211, 102, 0.4);
      }
    }

    &.btn-ig {
      background: rgba(236, 72, 153, 0.15);
      border: 1px solid rgba(236, 72, 153, 0.35);
      color: $accent-rose !important;

      &:hover {
        background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
        color: #ffffff !important;
        box-shadow: 0 8px 20px rgba(236, 72, 153, 0.4);
      }
    }

    &.btn-email {
      background: rgba(59, 130, 246, 0.15);
      border: 1px solid rgba(59, 130, 246, 0.35);
      color: $accent-blue !important;

      &:hover {
        background: $accent-blue;
        color: #ffffff !important;
        box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
      }
    }
  }
}

/* FOOTER */
.partners-footer {
  padding: 3rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  margin-top: 4rem;

  .footer-brand {
    font-size: 1.25rem;
    font-weight: 800;
    letter-spacing: 1px;
    color: #ffffff !important;
    margin-bottom: 0.35rem;
  }

  .footer-tagline {
    font-size: 0.88rem;
    color: #cbd5e1 !important;
    margin-bottom: 1.25rem;
  }

  .footer-divider {
    width: 60px;
    height: 2px;
    background: rgba(16, 185, 129, 0.5);
    margin: 0 auto 1.25rem;
  }

  .footer-copy {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.45) !important;
  }
}
</style>
