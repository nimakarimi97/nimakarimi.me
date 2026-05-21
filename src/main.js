import { createApp } from 'vue'
import { useData } from './composables/data.js'
import { useLanguage } from './composables/language.js'
import { useNavigation } from './composables/navigation.js'
import { createAppRouter } from './router/router.js'
import App from './vue/core/App.vue'
import './scss/style.scss'

const data = useData()

data.fetchEssentials().then(() => {
  const language = useLanguage()
  language.init(data.getSettings().supportedLanguages)

  const navigation = useNavigation()
  navigation.init(data.getSections(), data.getCategories())

  const router = createAppRouter()
  const app = createApp(App)

  /** @type {WeakMap<Element, IntersectionObserver>} */
  const _revealObservers = new WeakMap()

  app.directive('reveal', {
    mounted(el) {
      el.classList.add('reveal')

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              el.classList.add('revealed')
              observer.unobserve(el)
              _revealObservers.delete(el)
            }
          })
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -60px 0px',
        },
      )

      _revealObservers.set(el, observer)
      observer.observe(el)
    },
    unmounted(el) {
      const observer = _revealObservers.get(el)
      if (observer) {
        observer.disconnect()
        _revealObservers.delete(el)
      }
    },
  })

  app.use(router).mount('#app')
})
