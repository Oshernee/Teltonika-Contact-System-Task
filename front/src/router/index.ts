import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import NotFound from '../views/NotFound.vue'
import LoginPage from '../views/LoginPage.vue'
import AdminManagementPage from '../views/AdminManagementPage.vue'
import CompanieManagementPage from '../views/CompanieManagementPage.vue'
import StructureManagementPage from '../views/StructureManagementPage.vue'
import SingleContactPage from '../views/SingleContactPage.vue'

const routes = [
  {
    path: '/',
    children: [
      {
        path: '',
        component: HomePage,
        alias: ['home', 'contacts'],
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminManagementPage,
  },
  {
    path: '/companies',
    name: 'Companies',
    component: CompanieManagementPage,
  },
  {
    path: '/structures',
    name: 'Structures',
    component: StructureManagementPage,
  },
  {
    path: '/contacts/:id',
    name: 'SingleContact',
    props: true,
    component: SingleContactPage,
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
