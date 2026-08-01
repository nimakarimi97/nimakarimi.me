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
      name: 'story',
      component: () => import('../vue/pages/story/StoryPage.vue'),
    },
    {
      path: '/about',
      name: homeSection.id,
      component: RouterView,
    },
    {
      path: '/partners',
      name: 'Partners',
      component: () => import('../vue/pages/partners/PartnersPage.vue'),
    },
    {
      path: '/biz',
      redirect: '/partners',
    },
    {
      path: '/business',
      redirect: '/partners',
    },
    {
      path: '/partner',
      redirect: '/partners',
    },
    {
      path: '/instagram-tracker',
      name: 'InstagramTracker',
      component: () => import('../vue/sections/instagram-tracker/InstagramTracker.vue'),
    },
    {
      path: '/cv',
      redirect: () => {
        window.location.href = '/data/NimaKarimiCV.pdf'
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
    {
      path: '/cosmetic-medical-investment',
      redirect: () => {
        window.location.href
          = 'https://patch-vole-613.notion.site/Cosmetic-Medical-Business-Investment-Opportunities-in-Iran-3998169d6b63803e9c78ed8c058dbe4e'
      },
    },
    {
      path: '/beauty-industry-list',
      redirect: () => {
        window.location.href
          = 'https://patch-vole-613.notion.site/Beauty-Industry-List-3ab8169d6b6380389cc7c7c967ccd640?source=copy_link'
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
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition && to.path !== '/') {
        return savedPosition
      }

      // Desktop (all sections on one page): preserve scroll position
      if (to.path === '/' || window.innerWidth >= 992) {
        return false
      }

      // Mobile/small screens (separate section pages): scroll to top on navigation
      return { top: 0 }
    },
  })
}
