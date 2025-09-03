import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/students'
      },
      {
        path: 'students',
        name: 'students',
        component: () => import('pages/StudentsPage.vue')
      },
      {
        path: 'classes',
        name: 'classes',
        component: () => import('pages/ClassesPage.vue')
      },
      {
        path: 'classes/:id',
        name: 'class-detail',
        component: () => import('pages/ClassDetailPage.vue'),
        props: true
      }
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
