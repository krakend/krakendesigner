import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'
import './assets/main.css'

// Import validation directive
import { vValidation } from './directives/validation'

// Import pages/components
import Dashboard from './components/Dashboard.vue'
import ServiceConfig from './components/ServiceConfig.vue'

// Router configuration
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/service',
      name: 'service',
      component: ServiceConfig
    },
    // More routes will be added as we build components
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

// Create app
const app = createApp(App)

// Install plugins
app.use(createPinia())
app.use(router)

// Register global directives
app.directive('validation', vValidation)

// Mount app
app.mount('#app')