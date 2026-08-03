<script setup>
import { computed, onMounted } from 'vue'
import { useData } from '../../../composables/data.js'
import SectionTemplate from '../_templates/SectionTemplate.vue'
import SubHeading from '../_templates/SubHeading.vue'
import ContactForm from './ContactForm.vue'
import ContactOptions from './ContactOptions.vue'

/**
 * @property {object} sectionData
 */
const props = defineProps({
  sectionData: Object,
})

const data = useData()

const contactFormEnabled = computed(() => {
  return data.getSettings().contactFormEnabled
})

onMounted(() => {
  ;(function (C, A, L) {
    const p = function (a, ar) {
      a.q.push(ar)
    }
    const d = C.document
    C.Cal = C.Cal || function (...ar) {
      const cal = C.Cal
      if (!cal.loaded) {
        cal.ns = {}
        cal.q = cal.q || []
        d.head.appendChild(d.createElement('script')).src = A
        cal.loaded = true
      }
      if (ar[0] === L) {
        const api = function (...args) {
          p(api, args)
        }
        const namespace = ar[1]
        api.q = api.q || []
        if (typeof namespace === 'string') {
          cal.ns[namespace] = cal.ns[namespace] || api
          p(cal.ns[namespace], ar)
          p(cal, ['initNamespace', namespace])
        } else {
          p(cal, ar)
        }
        return
      }
      p(cal, ar)
    }
  })(window, 'https://app.cal.com/embed/embed.js', 'init')

  window.Cal('init', 'schedule', { origin: 'https://app.cal.com' })
  window.Cal.config = window.Cal.config || {}
  window.Cal.config.forwardQueryParams = true

  window.Cal.ns.schedule('inline', {
    elementOrSelector: '#my-cal-inline-schedule',
    config: { layout: 'month_view', useSlotsViewOnSmallScreen: 'true', theme: 'light' },
    calLink: 'nimakarimi/schedule',
  })

  window.Cal.ns.schedule('ui', {
    theme: 'light',
    cssVarsPerTheme: { light: { 'cal-brand': '#2629e1' }, dark: { 'cal-brand': '#2629e1' } },
    hideEventTypeDetails: false,
    layout: 'month_view',
  })
})
</script>

<template>
  <SectionTemplate :section-data="props.sectionData">
    <div class="contact-layout">
      <div class="contact-left">
        <!-- Form -->
        <ContactForm v-if="contactFormEnabled" />

        <!-- SubHeading -->
        <SubHeading
          v-if="contactFormEnabled"
          :title="props.sectionData.content.locales.subtitle"
          :description="props.sectionData.content.locales.subtitleDescription"
          class="mt-4"
        />

        <!-- Contact Items -->
        <ContactOptions :items="props.sectionData.content.items" :display-as-list="!contactFormEnabled" />
      </div>

      <!-- Cal.com inline scheduler -->
      <div class="contact-right">
        <div id="my-cal-inline-schedule" />
      </div>
    </div>
  </SectionTemplate>
</template>

<style lang="scss" scoped>
.contact-layout {
  display: flex;
  gap: 2rem;
  align-items: flex-start;

  .contact-left {
    flex: 0 0 auto;
    width: 340px;
  }

  .contact-right {
    flex: 1 1 0;
    min-width: 0;
    margin-top: -5rem;

    #my-cal-inline-schedule {
      width: 100%;
      height: 700px;
      overflow: scroll;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;

    .contact-left {
      width: 100%;
    }
  }
}
</style>
