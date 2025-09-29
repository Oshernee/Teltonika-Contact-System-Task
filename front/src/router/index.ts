import { createRouter, createWebHistory } from 'vue-router'
import { computed } from 'vue'

import HomePage from '@/views/HomePage.vue'
import NotFound from '@/views/NotFound.vue'
import LoginPage from '@/views/LoginPage.vue'
import AdminManagementPage from '@/views/AdminManagementPage.vue'
import CompanieManagementPage from '@/views/CompanieManagementPage.vue'
import StructureManagementPage from '@/views/StructureManagementPage.vue'
import SingleContactPage from '@/views/SingleContactPage.vue'
import RecoveryPage from '@/views/RecoveryPage.vue'
import PasswordResetPage from '@/views/PasswordResetPage.vue'

import { useUserStore } from '@/stores/Auth'

const routes = [
  {
    path: '/',
    children: [
      {
        path: '',
        name: 'Home',
        component: HomePage,
      },
      {
        path: 'contacts',
        name: 'Contacts',
        component: HomePage,
      },
      {
        path: 'home',
        name: 'HomeAlias',
        component: HomePage,
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/password-recovery',
    name: 'PasswordRecovery',
    component: RecoveryPage,
  },
  {
    path: '/confirm-password-reset/:token',
    name: 'ConfirmPasswordReset',
    component: PasswordResetPage,
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
    children: [
      {
        path: 'offices',
        name: 'OfficeStructureDetail',
        component: StructureManagementPage,
      },
      {
        path: 'divisions',
        name: 'DivisionStructureDetail',
        component: StructureManagementPage,
      },
      {
        path: 'departments',
        name: 'DepartmentStructureDetail',
        component: StructureManagementPage,
      },
      {
        path: 'groups',
        name: 'GroupStructureDetail',
        component: StructureManagementPage,
      },
    ],
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

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const isAuthenticated = computed(() => userStore.isLoggedIn())

  const publicRoutes = [
    'Login',
    'PasswordRecovery',
    'Home',
    'HomeAlias',
    'Contacts',
    'SingleContact',
    'ConfirmPasswordReset',
    'NotFound',
  ]

  if (to.name === 'ConfirmPasswordReset' && from.name !== undefined) {
    next({ name: 'Home' })
    return
  }

  if (to.name === 'Login' && isAuthenticated.value) {
    next({ name: 'Home' })
    return
  }

  if (from.name === 'Login' && !publicRoutes.includes(to.name as string)) {
    next({ name: 'Home' })
    return
  }

  if (!isAuthenticated.value && !publicRoutes.includes(to.name as string)) {
    next({ name: 'Login' })
    return
  }

  if (to.name === 'Admin' && isAuthenticated) {
    try {
      const userStore = useUserStore()
      if (userStore.user?.name !== 'Admin') {
        next({ name: 'Home' })
        return
      }
    } catch (error) {
      next({ name: 'Login' })
      return
    }
  }

  next()
})

export default router
