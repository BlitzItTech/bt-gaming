// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    // route level code-splitting
    // this generates a separate chunk (Home-[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('@/views/Home.vue'),
  },
  // {
  //   path: '*',
  //   name: 'nowhere',
  //   component: () => import('@/views/Nowhere.vue')
  // },
  {
    path: '/dnc',
    name: 'dnc',
    component: () => import('@/views/DNC.vue')
  },
  {
    path: '/scoreboard',
    name: 'scoreboard',
    component: () => import('@/views/ScoreBoard.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
