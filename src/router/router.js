import { createRouter, createWebHistory } from 'vue-router'
import { useData } from '../composables/data.js'
import RouterView from '../vue/core/RouterView.vue'

export function createAppRouter() {
  const data = useData()
  const sections = data.getSections()
  const homeSection = sections[0] || { id: 'home' }

  /** Create Home */
  const routeList = [
    {
      path: '/',
      name: homeSection.id,
      component: RouterView,
    },
    {
      path: '/instagram-tracker',
      name: 'InstagramTracker',
      component: () => import('../vue/sections/instagram-tracker/InstagramTracker.vue'),
    },
    {
      path: '/cv',
      redirect: () => {
        window.location.href = '/data/CV.pdf'
      },
    },
    {
      path: '/schedule',
      redirect: () => {
        window.location.href = 'https://calendar.app.google/8e8RvMBEsiyAgNsA6'
      },
    },
    {
      path: '/youtube',
      redirect: () => {
        window.location.href = 'https://www.youtube.com/@iamNimaKarimi'
      },
    },
    {
      path: '/yt',
      redirect: '/youtube',
    },
    {
      path: '/github',
      redirect: () => {
        window.location.href = 'https://github.com/nimakarimi97'
      },
    },
    {
      path: '/linkedin',
      redirect: () => {
        window.location.href = 'https://www.linkedin.com/in/nimakarimi97/'
      },
    },
  ]

  /** Create Section Routes */
  for (let i = 1; i < sections.length; i++) {
    const sectionId = sections[i].id

    routeList.push({
      path: `/${sectionId}`,
      name: sectionId,
      component: RouterView,
    })
  }

  /** Wildcard Route */
  routeList.push({
    path: '/:pathMatch(.*)*',
    redirect: '/',
  })

  return createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routeList,
  })
}
