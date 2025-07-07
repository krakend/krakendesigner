<template>
  <div class="service-config">
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-100 mb-2">
        Service Configuration
      </h1>
      <p class="text-gray-300">
        Configure basic service settings for your KrakenD API Gateway
      </p>
    </div>

    <!-- Service Settings Form -->
    <div class="config-box config-box-info">
      <div class="config-box-header">
        <h3 class="config-box-title">Basic Service Settings</h3>
      </div>
      <div class="config-box-body">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Service Name -->
          <div class="form-group">
            <label class="form-label">Service Name</label>
            <input 
              v-model="serviceName"
              v-validation="'serviceName'"
              type="text" 
              class="form-input"
              placeholder="My KrakenD API Gateway"
            >
            <p class="form-help">A descriptive name for your API Gateway service</p>
          </div>

          <!-- Version -->
          <div class="form-group">
            <label class="form-label">Configuration Version</label>
            <select 
              v-model="version" 
              v-validation="'version'"
              class="form-select"
            >
              <option value="3">Version 3 (Recommended)</option>
              <option value="2">Version 2 (Legacy)</option>
            </select>
            <p class="form-help">KrakenD configuration schema version</p>
          </div>

          <!-- Timeout -->
          <div class="form-group">
            <label class="form-label">Default Timeout</label>
            <input 
              v-model="timeout"
              v-validation="'timeout'"
              type="text" 
              class="form-input"
              placeholder="3000ms"
            >
            <p class="form-help">Default timeout for all requests (e.g., 3000ms, 5s)</p>
          </div>

          <!-- Cache TTL -->
          <div class="form-group">
            <label class="form-label">Cache TTL</label>
            <input 
              v-model="cacheTtl"
              v-validation="'cacheTtl'"
              type="text" 
              class="form-input"
              placeholder="300s"
            >
            <p class="form-help">Default cache time-to-live (e.g., 300s, 5m)</p>
          </div>

          <!-- Output Encoding -->
          <div class="form-group">
            <label class="form-label">Default Output Encoding</label>
            <select 
              v-model="outputEncoding" 
              v-validation="'outputEncoding'"
              class="form-select"
            >
              <option value="json">JSON</option>
              <option value="xml">XML</option>
              <option value="no-op">No-op (pass through)</option>
              <option value="string">String</option>
            </select>
            <p class="form-help">Default encoding for API responses</p>
          </div>

          <!-- Port -->
          <div class="form-group">
            <label class="form-label">Port</label>
            <input 
              v-model.number="port"
              v-validation="'port'"
              type="number" 
              class="form-input"
              placeholder="8080"
              min="1"
              max="65535"
            >
            <p class="form-help">Port number for the API Gateway server</p>
          </div>
        </div>

        <!-- Debug Options -->
        <div class="mt-6 pt-6 border-t border-dark-600">
          <h4 class="text-lg font-medium text-gray-100 mb-4">Debug & Development</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex items-center">
              <input 
                v-model="debugEndpoint"
                v-validation="'debugEndpoint'"
                type="checkbox" 
                class="form-checkbox"
                id="debug-endpoint"
              >
              <label for="debug-endpoint" class="ml-2 text-sm text-gray-300">
                Enable debug endpoint
              </label>
            </div>
            
            <div class="flex items-center">
              <input 
                v-model="echoEndpoint"
                v-validation="'echoEndpoint'"
                type="checkbox" 
                class="form-checkbox"
                id="echo-endpoint"
              >
              <label for="echo-endpoint" class="ml-2 text-sm text-gray-300">
                Enable echo endpoint
              </label>
            </div>
          </div>
          <p class="form-help mt-2">
            Debug endpoints are useful for development but should be disabled in production
          </p>
        </div>

        <!-- Hosts Configuration -->
        <div class="mt-6 pt-6 border-t border-dark-600">
          <h4 class="text-lg font-medium text-gray-100 mb-4">Default Hosts Configuration</h4>
          <div class="form-group">
            <label class="form-label">Default Hosts</label>
            <div class="space-y-2">
              <div 
                v-for="(host, index) in hosts" 
                :key="index"
                class="flex items-center gap-2"
              >
                <input 
                  v-model="hosts[index]"
                  v-validation="`host.${index}`"
                  type="text" 
                  class="form-input flex-1"
                  placeholder="https://api.example.com"
                >
                <button 
                  @click="removeHost(index)"
                  class="btn btn-sm btn-danger"
                  type="button"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <button 
                @click="addHost"
                class="btn btn-sm btn-outline"
                type="button"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Host
              </button>
            </div>
            <p class="form-help">
              Default hosts used when backends don't specify their own host. Include schema and port (e.g., https://api.example.com:8080)
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- JSON Preview -->
    <div class="mt-6 config-box">
      <div class="config-box-header">
        <h3 class="config-box-title">Configuration Preview</h3>
      </div>
      <div class="config-box-body">
        <pre class="bg-gray-950 text-green-400 p-4 rounded text-sm font-mono overflow-auto border border-dark-600">{{ previewJson }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useConfigStore } from '@/stores/config'

const configStore = useConfigStore()

// Reactive computed properties that sync with store
const serviceName = computed({
  get: () => configStore.config.name || '',
  set: (value) => configStore.updateService({ name: value || undefined })
})

const version = computed({
  get: () => configStore.config.version || 3,
  set: (value) => configStore.updateService({ version: value })
})

const timeout = computed({
  get: () => configStore.config.timeout || '3000ms',
  set: (value) => configStore.updateService({ timeout: value || undefined })
})

const cacheTtl = computed({
  get: () => configStore.config.cache_ttl || '300s',
  set: (value) => configStore.updateService({ cache_ttl: value || undefined })
})

const outputEncoding = computed({
  get: () => configStore.config.output_encoding || 'json',
  set: (value) => configStore.updateService({ output_encoding: value })
})

const port = computed({
  get: () => configStore.config.port || 8080,
  set: (value) => configStore.updateService({ port: value || undefined })
})

const debugEndpoint = computed({
  get: () => configStore.config.debug_endpoint || false,
  set: (value) => configStore.updateService({ debug_endpoint: value || undefined })
})

const echoEndpoint = computed({
  get: () => configStore.config.echo_endpoint || false,
  set: (value) => configStore.updateService({ echo_endpoint: value || undefined })
})

// For hosts array, we need special handling
const hosts = ref<string[]>([])

// Watch store changes to update local hosts array
const updateHostsFromStore = () => {
  const storeHosts = configStore.config.host || []
  // Ensure we always have at least one input field for editing
  const normalizedHosts = storeHosts.length > 0 ? storeHosts : ['']
  
  // Only update if actually different to avoid infinite loops
  if (JSON.stringify(hosts.value) !== JSON.stringify(normalizedHosts)) {
    hosts.value = [...normalizedHosts]
  }
}

// Initialize hosts from store
updateHostsFromStore()

// Watch for store config changes to update hosts
watch(() => configStore.config.host, updateHostsFromStore, { deep: true })

// Methods for host management
const addHost = () => {
  hosts.value.push('')
  // Don't update store immediately, let the watcher handle it
}

const removeHost = (index: number) => {
  // Always maintain at least one input field for editing
  if (hosts.value.length > 1) {
    hosts.value.splice(index, 1)
  } else {
    // If trying to remove the last host, make it empty
    hosts.value[0] = ''
  }
  // The watcher will handle updating the store
}

const updateHostsInStore = () => {
  const filteredHosts = hosts.value.filter(h => h.trim() !== '')
  // If no hosts, pass undefined to remove the property from config
  const newHosts = filteredHosts.length > 0 ? filteredHosts : undefined
  
  // Only update if different to prevent infinite loops
  const currentHosts = configStore.config.host
  if (JSON.stringify(newHosts) !== JSON.stringify(currentHosts)) {
    configStore.updateService({ host: newHosts })
  }
}

// Watch for individual host changes with debounce
let hostUpdateTimeout: ReturnType<typeof setTimeout> | null = null
watch(hosts, () => {
  if (hostUpdateTimeout) {
    clearTimeout(hostUpdateTimeout)
  }
  hostUpdateTimeout = setTimeout(() => {
    updateHostsInStore()
  }, 100)
}, { deep: true })

// JSON preview
const previewJson = computed(() => {
  const serviceOnly = {
    version: configStore.config.version,
    name: configStore.config.name,
    timeout: configStore.config.timeout,
    cache_ttl: configStore.config.cache_ttl,
    output_encoding: configStore.config.output_encoding,
    port: configStore.config.port,
    debug_endpoint: configStore.config.debug_endpoint,
    echo_endpoint: configStore.config.echo_endpoint,
    host: configStore.config.host
  }
  
  // Remove undefined values
  Object.keys(serviceOnly).forEach(key => {
    if ((serviceOnly as any)[key] === undefined) {
      delete (serviceOnly as any)[key]
    }
  })
  
  return JSON.stringify(serviceOnly, null, 2)
})
</script>