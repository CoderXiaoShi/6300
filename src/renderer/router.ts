import * as VueRouter from 'vue-router'

const routes = [
  { path: '/', component: () => import('./views/home/index.vue') },
  { path: '/menu', component: () => import('./views/menu/index.vue') }
]

export const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
})