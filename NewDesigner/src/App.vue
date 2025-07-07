<template>
  <div class="min-h-screen bg-dark-900">
    <!-- Header -->
    <AppHeader />
    
    <!-- Main Layout -->
    <div class="flex">
      <!-- Sidebar -->
      <AppSidebar :class="{ 'hidden': !sidebarOpen }" class="lg:block" />
      
      <!-- Main Content -->
      <main class="flex-1 lg:ml-64 transition-all duration-300">
        <div class="container mx-auto px-4 py-6">
          <!-- Page Content -->
          <RouterView />
        </div>
      </main>
    </div>
    
    <!-- JSON Preview Modal (when enabled) -->
    <JsonPreviewModal v-if="showJsonPreview" @close="showJsonPreview = false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import AppHeader from './components/layout/AppHeader.vue'
import AppSidebar from './components/layout/AppSidebar.vue'
import JsonPreviewModal from './components/common/JsonPreviewModal.vue'

// Layout state
const sidebarOpen = ref(false)
const showJsonPreview = ref(false)

// Provide methods for child components
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const toggleJsonPreview = () => {
  showJsonPreview.value = !showJsonPreview.value
}

// Make methods available globally for header/sidebar components
;(window as any).toggleSidebar = toggleSidebar
;(window as any).toggleJsonPreview = toggleJsonPreview
</script>

<style scoped>
/* Component-specific styles if needed */
</style>