import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import './style.css';
import App from './App.vue';

// Import Flowbite
import 'flowbite';

// Import routes
import HomeView from './views/HomeView.vue';
import DetailView from './views/DetailView.vue';

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/detail',
      name: 'detail',
      component: DetailView,
    },
  ],
});

// Create and mount the app
const app = createApp(App);
app.use(router);
app.mount('#app');
