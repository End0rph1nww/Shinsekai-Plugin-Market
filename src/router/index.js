import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const SubmitPlugin = () => import('../views/SubmitPlugin.vue')
const DeveloperGuide = () => import('../views/DeveloperGuide.vue')
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/docs/plugin',
    name: 'DeveloperGuide',
    component: DeveloperGuide
  },
  {
    path: '/submit',
    name: 'SubmitPlugin',
    component: SubmitPlugin
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
