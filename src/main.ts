import { createApp } from 'vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import './style.css';
import App from './App.vue';

// Import Flowbite
import 'flowbite';

// Define routes with lazy loading
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('./views/HomeView.vue'),
  },
  {
    path: '/detail',
    name: 'detail',
    component: () => import('./views/DetailView.vue'),
    // Add route validation to ensure transaction_id is present
    beforeEnter: (to, from, next) => {
      if (to.query.transaction_id) {
        next();
      } else {
        next({ name: 'not-found' });
      }
    },
  },
  {
    path: '/404',
    name: 'not-found',
    component: () => import('./views/NotFoundView.vue'),
  },
  {
    // Catch-all route for 404 errors
    path: '/:pathMatch(.*)*',
    redirect: { name: 'not-found' },
  },
];

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Create and mount the app
const app = createApp(App);
app.use(router);
app.mount('#app');
