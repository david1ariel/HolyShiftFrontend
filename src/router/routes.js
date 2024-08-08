const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/LoginPage.vue') },
      { path: '/employees', component: () => import('pages/EmployeesPage.vue') },
      { path: '/scheduling', component: () => import('pages/SchedulingPage.vue') },
      { path: '/settings', component: () => import('pages/SettingsPage.vue') },
      { path: '/my-shifts', component: () => import('pages/MyShiftsPage.vue') },
    ]
  },


  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
