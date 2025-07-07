<template>
  <aside class="bg-dark-900 border-r border-dark-700 fixed top-12 left-0 bottom-0 w-64 z-40 overflow-y-auto lg:block">
    <nav>
      <!-- Sidebar Menu -->
      <ul class="list-none m-0 p-0">
        <!-- GitHub Link -->
        <li class="bg-dark-800 text-gray-400 text-xs uppercase font-semibold tracking-wide">
          <a 
            href="https://github.com/krakendio/krakendesigner" 
            target="_blank"
            class="flex items-center px-4 py-2 text-blue-400 hover:text-blue-300 text-sm no-underline"
          >
            <svg class="mr-2 w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Fork on GitHub
          </a>
        </li>

        <!-- Dashboard -->
        <li>
          <RouterLink 
            to="/"
            class="flex items-center px-4 py-3 text-gray-300 text-base no-underline border-b border-dark-700 transition-all duration-200 hover:bg-dark-700 hover:text-gray-100"
            :class="{ 'bg-blue-600 text-white': $route.path === '/' }"
          >
            <svg class="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            Dashboard
          </RouterLink>
        </li>

        <!-- Service Settings -->
        <li>
          <RouterLink 
            to="/service"
            class="flex items-center px-4 py-3 text-gray-300 text-base no-underline border-b border-dark-700 transition-all duration-200 hover:bg-dark-700 hover:text-gray-100"
            :class="{ 'bg-blue-600 text-white': $route.path === '/service' }"
          >
            <svg class="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Service Settings
          </RouterLink>
        </li>

        <!-- Security -->
        <li>
          <RouterLink 
            to="/security"
            class="flex items-center px-4 py-3 text-gray-300 text-base no-underline border-b border-dark-700 transition-all duration-200 hover:bg-dark-700 hover:text-gray-100"
            :class="{ 'bg-blue-600 text-white': $route.path === '/security' }"
          >
            <svg class="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            HTTP Security
          </RouterLink>
        </li>

        <!-- Telemetry -->
        <li>
          <RouterLink 
            to="/logging"
            class="flex items-center px-4 py-3 text-gray-300 text-base no-underline border-b border-dark-700 transition-all duration-200 hover:bg-dark-700 hover:text-gray-100"
            :class="{ 'bg-blue-600 text-white': $route.path === '/logging' }"
          >
            <svg class="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Telemetry and Analytics
          </RouterLink>
        </li>

        <!-- API Keys -->
        <li>
          <RouterLink 
            to="/api-keys"
            class="flex items-center px-4 py-3 text-gray-300 text-base no-underline border-b border-dark-700 transition-all duration-200 hover:bg-dark-700 hover:text-gray-100"
            :class="{ 'bg-blue-600 text-white': $route.path === '/api-keys' }"
          >
            <svg class="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            API Keys
          </RouterLink>
        </li>

        <!-- OpenAPI -->
        <li>
          <RouterLink 
            to="/openapi"
            class="flex items-center px-4 py-3 text-gray-300 text-base no-underline border-b border-dark-700 transition-all duration-200 hover:bg-dark-700 hover:text-gray-100"
            :class="{ 'bg-blue-600 text-white': $route.path === '/openapi' }"
          >
            <svg class="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            OpenAPI
          </RouterLink>
        </li>

        <!-- Endpoints - Expandable -->
        <li class="treeview">
          <a 
            href="#"
            class="flex items-center px-4 py-3 text-gray-300 text-base no-underline border-b border-dark-700 transition-all duration-200 hover:bg-dark-700 hover:text-gray-100 relative"
            @click.prevent="toggleEndpoints"
          >
            <svg class="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Endpoints
            <svg 
              class="ml-auto w-4 h-4 transform transition-transform duration-200"
              :class="{ 'rotate-90': endpointsExpanded }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
          
          <!-- Endpoints submenu -->
          <ul v-show="endpointsExpanded" class="list-none m-0 p-0 bg-dark-800">
            <li>
              <RouterLink
                to="/endpoints"
                class="flex items-center pl-10 py-3 pr-4 text-sm border-b border-dark-600 text-gray-400 no-underline hover:text-white"
              >
                <svg class="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Endpoint
              </RouterLink>
            </li>
            
            <!-- Dynamic endpoint list -->
            <li 
              v-for="(endpoint, index) in configStore.config.endpoints"
              :key="index"
              class="hover:bg-blue-500 hover:text-white"
            >
              <RouterLink
                :to="`/endpoints/${index}`"
                class="flex items-center pl-10 py-3 pr-4 text-sm border-b border-dark-600 text-gray-400 no-underline hover:text-white"
              >
                <span class="badge badge-primary mr-2">
                  {{ endpoint.method || 'GET' }}
                </span>
                <span class="truncate" :title="endpoint.endpoint">
                  {{ endpoint.endpoint || '/untitled' }}
                </span>
              </RouterLink>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useConfigStore } from '@/stores/config'

const configStore = useConfigStore()
const endpointsExpanded = ref(true)

const toggleEndpoints = () => {
  endpointsExpanded.value = !endpointsExpanded.value
}
</script>