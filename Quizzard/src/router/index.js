// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {    
    path: '/quizcreator/:quizID', // ":userId" is a route parametername: 'User',
    name: 'QuizCreatorId',
    component: () => import('../views/QuizCreator.vue')
  },
  {    
    path: '/quizplayer/:quizID', // ":userId" is a route parametername: 'User',
    name: 'QuizPlayerId',
    component: () => import('../views/QuizPlayer.vue')
  },
  {
    path: '/',
    redirect: '/home',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
      },
      {
        path: '/quizcreator',
        name: 'QuizCreator',
        component: () => import('@/views/QuizCreator.vue'),
      },
      {
        path: '/discover',
        name: 'Discover',
        component: () => import('@/views/Discover.vue'),
      },
      {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/loginScreen.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
