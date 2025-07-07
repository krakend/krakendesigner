<template>
  <div class="dashboard">
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-100 mb-2">
        Welcome to KrakenD Designer
      </h1>
      <p class="text-gray-300">
        Visual configuration builder for KrakenD API Gateway
      </p>
    </div>

    <!-- Browser Support Notification -->
    <div class="w-full mb-6">
      <div v-if="hasFileSystemSupport" class="config-box config-box-info">
        <div class="config-box-body">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg class="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-lg">
                <strong>Great!</strong> Your browser supports all Designer features! You can edit files directly and save changes locally.
                <a href="https://www.krakend.io/docs/configuration/designer/" target="_blank" class="text-blue-600 hover:underline">
                  Learn more
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="config-box config-box-danger">
        <div class="config-box-body">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg class="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-lg">
                <strong>Limited Support:</strong> Your browser has limited support for advanced features. 
                You can still use the editor and download configurations, but direct file editing may not work.
                <a href="https://www.krakend.io/docs/configuration/designer/" target="_blank" class="text-blue-600 hover:underline">
                  Learn more
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Two column layout -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Left Column -->
      <div class="space-y-6">
        <!-- What is KrakenD Designer -->
        <div class="config-box config-box-info">
          <div class="config-box-header">
            <h3 class="config-box-title">What is the KrakenD Designer</h3>
          </div>
          <div class="config-box-body">
            <p class="mb-4">
              The KrakenD Designer is a configuration builder, released as an open-source JavaScript application. 
              It helps you create and edit <code class="bg-dark-700 text-gray-300 px-1 py-0.5 rounded text-sm">krakend.json</code> 
              files to get started with the API Gateway in a visual way.
            </p>
            <p class="mb-4">
              It is a pure static page that <strong>does not send any of your configurations elsewhere nor track its contents.</strong> 
              It's hosted online for convenience, but you can also run it locally.
            </p>
            <p class="mb-4">
              Use this page together with a 
              <a href="https://www.krakend.io/docs/developer/hot-reload/" target="_blank" class="text-blue-600 hover:underline">
                KrakenD Watch
              </a> 
              image to apply the changes in your local server automatically.
            </p>
            <p>
              <a 
                href="https://www.krakend.io/docs/configuration/designer/" 
                target="_blank"
                class="btn btn-primary"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Documentation
              </a>
            </p>
          </div>
        </div>

        <!-- What can I do -->
        <div class="config-box config-box-info">
          <div class="config-box-header">
            <h3 class="config-box-title">What can I do with KrakenD Designer?</h3>
          </div>
          <div class="config-box-body">
            <p class="mb-4">
              The KrakenD Designer generates a single configuration file. It is meant to become familiar with 
              the JSON file and contains <strong>many number of functionalities</strong>.
            </p>
            <p class="mb-4">
              Because the interface might already look overwhelming given the number of features it displays, 
              the most advanced flags and some features are not configurable here. Still, if you import and 
              export files with these hidden attributes, the designer respects them.
            </p>
            <p class="mb-3">The main <strong>limitations</strong> of this tool are:</p>
            <ul class="list-disc list-inside space-y-1 text-gray-300">
              <li>You cannot work with Flexible Configuration (multiple configuration files)</li>
              <li>Use non-JSON formats, like YAML or TOML</li>
              <li>Administer a production gateway. This is meant to be a development tool.</li>
              <li>It does not check the validity of what you type.</li>
            </ul>
          </div>
        </div>

        <!-- Development tools -->
        <div class="config-box config-box-info">
          <div class="config-box-header">
            <h3 class="config-box-title">Development tools</h3>
          </div>
          <div class="config-box-body">
            <p class="mb-4">
              The KrakenD designer outputs valid configurations respecting the schema. But we encourage you to 
              <strong>edit the JSON file by hand</strong> and spend some time understanding its structure. 
              There are a few resources that might help you:
            </p>
            <ul class="list-disc list-inside space-y-2 text-blue-400">
              <li>
                <a href="https://www.krakend.io/docs/configuration/structure/" target="_blank" class="hover:underline">
                  Understanding the configuration file
                </a>
              </li>
              <li>
                <a href="https://www.krakend.io/docs/developer/hot-reload/" target="_blank" class="hover:underline">
                  Hot reloading the configuration
                </a>
              </li>
              <li>
                <a href="https://www.krakend.io/docs/developer/ide-integration/" target="_blank" class="hover:underline">
                  IDE integration
                </a>
              </li>
              <li>
                <a href="https://www.krakend.io/docs/configuration/check/" target="_blank" class="hover:underline">
                  Validating the configuration with <code class="bg-dark-700 text-gray-300 px-1 py-0.5 rounded text-sm">check</code>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="space-y-6">
        <!-- File Operations (only show if browser supports it) -->
        <div v-if="hasFileSystemSupport" class="config-box config-box-info">
          <div class="config-box-header">
            <h3 class="config-box-title">Open and edit a file in your disk</h3>
          </div>
          <div class="config-box-body">
            <div v-if="openedFileName" class="mb-4 p-3 bg-green-900/20 border border-green-600 rounded-md">
              <div class="flex items-start">
                <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 class="font-medium text-green-300">Editing {{ openedFileName }}</h4>
                  <p class="text-sm text-green-400 mt-1">
                    The configuration file has been successfully loaded, and it will be overwritten every time you press Save.
                  </p>
                </div>
              </div>
            </div>
            <p class="mb-4">
              Edit a file directly from your disk, and overwrite it when you press Save. 
              Only the <code class="bg-dark-700 text-gray-300 px-1 py-0.5 rounded text-sm">application/json</code> file type is accepted by the Designer.
            </p>
            <button 
              @click="openLocalFile"
              class="btn btn-primary"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              Open Local File
            </button>
          </div>
        </div>

        <!-- File Upload -->
        <div class="config-box config-box-info">
          <div class="config-box-header">
            <h3 class="config-box-title">Create a new config from an existing file (copy)</h3>
          </div>
          <div class="config-box-body">
            <div v-if="uploadSuccess" class="mb-4 p-3 bg-green-900/20 border border-green-600 rounded-md">
              <div class="flex items-start">
                <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 class="font-medium text-green-300">Configuration loaded</h4>
                  <p class="text-sm text-green-400 mt-1">
                    The configuration file has been successfully loaded in the Designer.
                  </p>
                </div>
              </div>
            </div>
            <p class="mb-4">
              Drag and drop a previous configuration file below to create a copy of its configuration. 
              After reviewing the values press the button to load it into the application. 
              Only <code class="bg-dark-700 text-gray-300 px-1 py-0.5 rounded text-sm">application/json</code> 
              file type is accepted by the Designer.
            </p>
            
            <!-- Drag and drop zone -->
            <div 
              @drop="handleDrop"
              @dragover.prevent
              @dragenter.prevent
              class="border-2 border-dashed border-dark-600 rounded-lg p-8 text-center hover:border-blue-400 transition-colors duration-200"
              :class="{ 'border-blue-400 bg-blue-900/20': isDragging }"
              @dragenter="isDragging = true"
              @dragleave="isDragging = false"
            >
              <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <h3 class="text-lg font-medium text-gray-100 mb-2">
                Drop a <code class="bg-dark-700 text-gray-300 px-1 py-0.5 rounded text-sm">krakend.json</code> to load a copy
              </h3>
              <p class="text-gray-400 mb-4">
                No content uploaded anywhere, your original file remains intact
              </p>
              <button 
                @click="triggerFileUpload"
                class="btn btn-outline"
              >
                Or click to select file
              </button>
            </div>
            
            <!-- Hidden file input -->
            <input 
              ref="fileInput"
              type="file" 
              accept=".json"
              @change="handleFileSelect"
              class="hidden"
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useConfigStore } from '@/stores/config'

const configStore = useConfigStore()

// State
const isDragging = ref(false)
const uploadSuccess = ref(false)
const openedFileName = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

// Computed
const hasFileSystemSupport = computed(() => {
  // Check for File System Access API support
  return 'showOpenFilePicker' in window && 'showSaveFilePicker' in window
})

// Methods
const openLocalFile = async () => {
  try {
    if (hasFileSystemSupport.value) {
      // Use File System Access API
      const [fileHandle] = await (window as any).showOpenFilePicker({
        types: [{
          description: 'JSON files',
          accept: { 'application/json': ['.json'] }
        }]
      })
      const file = await fileHandle.getFile()
      const content = await file.text()
      configStore.importJSON(content)
      openedFileName.value = file.name
    }
  } catch (error) {
    if ((error as any).name !== 'AbortError') {
      console.error('Failed to open file:', error)
      alert('Failed to open file')
    }
  }
}

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    loadFile(file)
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false
  
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    if (file.type === 'application/json' || file.name.endsWith('.json')) {
      loadFile(file)
    } else {
      alert('Please select a JSON file')
    }
  }
}

const loadFile = async (file: File) => {
  try {
    const content = await file.text()
    configStore.importJSON(content)
    uploadSuccess.value = true
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      uploadSuccess.value = false
    }, 5000)
  } catch (error) {
    console.error('Failed to load file:', error)
    alert(`Failed to load file: ${error}`)
  }
}
</script>