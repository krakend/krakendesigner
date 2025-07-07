<template>
  <header class="bg-dark-800 border-b border-dark-700 p-0 relative z-50 h-12">
    <div class="flex items-center h-full">
      <!-- Logo -->
      <a href="#" class="flex items-center px-4 py-3 text-white no-underline bg-dark-700 h-12">
        <img 
          src="https://www.krakend.io/images/logo-krakend.svg" 
          width="120" 
          height="24" 
          alt="KrakenD API Gateway" 
          class="mr-2"
        >
        <span class="text-sm font-medium">Designer</span>
      </a>

      <!-- Mobile menu button -->
      <button 
        type="button" 
        class="bg-transparent border border-dark-600 text-gray-300 p-2 rounded m-2 hover:bg-dark-700 lg:hidden"
        @click="toggleSidebar"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <!-- Navigation title -->
      <div class="flex items-center px-4">
        <h1 class="text-white text-lg font-medium">
          {{ configStore.config.name || 'Untitled Configuration' }}
        </h1>
      </div>

      <!-- Toolbar buttons -->
      <div class="ml-auto flex items-center gap-2 px-4">
        <button 
          class="btn btn-sm btn-outline"
          @click="openFile"
          title="Open local file (Ctrl+O)"
        >
          <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          Open
        </button>
        
        <!-- Save button - only show if file is opened with File System Access API -->
        <button 
          v-if="openedFileHandle"
          class="btn btn-sm btn-success"
          @click="saveFile"
          title="Save to opened file (Ctrl+S)"
        >
          <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Save {{ openedFileName }}
        </button>
        
        <button 
          class="btn btn-sm btn-outline"
          @click="downloadConfig"
          title="Download config (Ctrl+D)"
        >
          <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download
        </button>
        
        <button 
          class="btn btn-sm btn-primary"
          @click="viewJson"
          title="View JSON config (Ctrl+E)"
        >
          <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          View JSON
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useConfigStore } from '@/stores/config'

const configStore = useConfigStore()

// File handle state for File System Access API
const openedFileHandle = ref<any>(null)
const openedFileName = ref('')

// Check if browser supports File System Access API
const hasFileSystemSupport = computed(() => {
  return 'showOpenFilePicker' in window && 'showSaveFilePicker' in window
})

// File operations
const openFile = async () => {
  try {
    if (hasFileSystemSupport.value) {
      // Use File System Access API for better UX
      const [fileHandle] = await (window as any).showOpenFilePicker({
        types: [{
          description: 'JSON files',
          accept: { 'application/json': ['.json'] }
        }]
      })
      const file = await fileHandle.getFile()
      const content = await file.text()
      configStore.importJSON(content)
      
      // Store file handle for saving later
      openedFileHandle.value = fileHandle
      openedFileName.value = file.name
    } else {
      // Fallback to traditional file input
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.json'
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = (event) => {
            try {
              const content = event.target?.result as string
              configStore.importJSON(content)
              openedFileName.value = file.name
              // No file handle available with traditional input
              openedFileHandle.value = null
            } catch (error) {
              alert(`Failed to load file: ${error}`)
            }
          }
          reader.readAsText(file)
        }
      }
      input.click()
    }
  } catch (error) {
    if ((error as any).name !== 'AbortError') {
      console.error('Failed to open file:', error)
      alert('Failed to open file')
    }
  }
}

// Save to the opened file using File System Access API
const saveFile = async () => {
  try {
    if (openedFileHandle.value) {
      const writable = await openedFileHandle.value.createWritable()
      const json = configStore.exportJSON()
      await writable.write(json)
      await writable.close()
      
      // Show success feedback
      alert(`File saved successfully: ${openedFileName.value}`)
    }
  } catch (error) {
    console.error('Failed to save file:', error)
    alert(`Failed to save file: ${error}`)
  }
}

const downloadConfig = () => {
  const json = configStore.exportJSON()
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'krakend.json'
  a.click()
  URL.revokeObjectURL(url)
}

const viewJson = () => {
  // Toggle JSON preview modal
  if (typeof window !== 'undefined' && (window as any).toggleJsonPreview) {
    (window as any).toggleJsonPreview()
  }
}

const toggleSidebar = () => {
  // Toggle sidebar on mobile
  if (typeof window !== 'undefined' && (window as any).toggleSidebar) {
    (window as any).toggleSidebar()
  }
}

// Keyboard shortcuts
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'o':
          e.preventDefault()
          openFile()
          break
        case 's':
          e.preventDefault()
          if (openedFileHandle.value) {
            saveFile()
          } else {
            downloadConfig() // Fallback to download if no file handle
          }
          break
        case 'd':
          e.preventDefault()
          downloadConfig()
          break
        case 'e':
          e.preventDefault()
          viewJson()
          break
      }
    }
  })
}
</script>