import { createRouter, createWebHistory } from 'vue-router';


import AuthView from '../views/AuthView.vue';
import {auth} from "../firebase.js";
import { onAuthStateChanged } from 'firebase/auth';



const requireAuth = (to, from, next) => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    unsubscribe()
    if (user) {
      next()
    } else {
      next('/auth')
    }
  })
}


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { 
      path: '/',
      name: 'Dashboard',
      component: () => import('../views/DashboardView.vue'),
      beforeEnter: requireAuth


    },

    {
      path: '/auth',
      name: 'Auth',
      component: AuthView
    },
  
    {
      path: '/transaction',
      name: 'Transaction',
      component: () => import('../views/AddTransactions.vue'),
      beforeEnter: requireAuth

    }
  
  ],
})

export default router;
