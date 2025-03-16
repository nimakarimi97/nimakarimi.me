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
      path: '/cv',
      redirect: () => {
        window.location.href = '/data/CV.pdf'
      },
    },
    {
      path: '/schedule',
      redirect: () => {
        window.location.href = 'https://calendar.app.google/CYhCbh1HjT4NtN816'
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
