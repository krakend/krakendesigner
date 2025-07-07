<template>
  <div 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">
          KrakenD Configuration Preview
        </h3>
        <div class="flex items-center gap-2">
          <!-- Copy button -->
          <button 
            @click="copyToClipboard"
            class="btn btn-sm btn-outline"
            title="Copy JSON to clipboard"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy
          </button>
          
          <!-- Download button -->
          <button 
            @click="downloadJson"
            class="btn btn-sm btn-primary"
            title="Download JSON file"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download
          </button>
          
          <!-- Close button -->
          <button 
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 p-1"
            title="Close preview"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Modal Body -->
      <div class="p-6 overflow-y-auto max-h-[70vh]">
        <!-- Validation status -->
        <div v-if="!configStore.isValid" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div class="flex">
            <svg class="w-5 h-5 text-red-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 class="text-sm font-medium text-red-800">Configuration has errors:</h4>
              <ul class="mt-2 text-sm text-red-700">
                <li v-for="error in errors" :key="error.path">
                  <strong>{{ error.path }}:</strong> {{ error.message }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div v-else-if="configStore.hasWarnings" class="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <div class="flex">
            <svg class="w-5 h-5 text-yellow-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h4 class="text-sm font-medium text-yellow-800">Configuration has warnings:</h4>
              <ul class="mt-2 text-sm text-yellow-700">
                <li v-for="warning in warnings" :key="warning.path">
                  <strong>{{ warning.path }}:</strong> {{ warning.message }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div v-else class="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-sm font-medium text-green-800">Configuration is valid</span>
          </div>
        </div>
        
        <!-- JSON Preview -->
        <div class="bg-gray-900 rounded-md overflow-hidden">
          <div class="bg-gray-800 px-4 py-2 border-b border-gray-700">
            <span class="text-green-400 text-sm font-mono">krakend.json</span>
          </div>
          <pre class="text-green-400 p-4 overflow-auto text-sm font-mono leading-relaxed">{{ formattedJson }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useConfigStore } from '@/stores/config'

const configStore = useConfigStore()

// Emits
defineEmits<{
  close: []
}>()

// Computed properties
const formattedJson = computed(() => {
  return configStore.exportJSON()
})

const errors = computed(() => {
  return configStore.validationErrors.filter(e => e.severity === 'error')
})

const warnings = computed(() => {
  return configStore.validationErrors.filter(e => e.severity === 'warning')
})

// Methods
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(formattedJson.value)
    // Could add a toast notification here
    alert('JSON copied to clipboard!')
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    alert('Failed to copy to clipboard')
  }
}

const downloadJson = () => {
  const blob = new Blob([formattedJson.value], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'krakend.json'
  a.click()
  URL.revokeObjectURL(url)
}
</script>