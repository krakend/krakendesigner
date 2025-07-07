import type { DirectiveBinding, VNode } from 'vue'
import { useConfigStore } from '@/stores/config'

interface ValidationElement extends HTMLElement {
  _validationCleanup?: () => void
  _validationWrapper?: HTMLElement
  _validationIcon?: HTMLElement
  _validationMessage?: HTMLElement
}

// Map v-model paths to JSON schema paths
const getJsonPath = (vModelPath: string): string => {
  // Handle common mappings
  const pathMappings: Record<string, string> = {
    'serviceName': 'name',
    'cacheTtl': 'cache_ttl',
    'outputEncoding': 'output_encoding',
    'debugEndpoint': 'debug_endpoint',
    'echoEndpoint': 'echo_endpoint',
    'port': 'port',
    'timeout': 'timeout',
    'version': 'version'
  }
  
  // Handle array paths like 'host.0', 'host.1', etc.
  if (vModelPath.startsWith('host.')) {
    return 'host'
  }
  
  return pathMappings[vModelPath] || vModelPath
}

// Create error icon SVG
const createErrorIcon = (): HTMLElement => {
  const svg = document.createElement('div')
  svg.innerHTML = `
    <svg class="validation-icon validation-icon-error" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
    </svg>
  `
  return svg.firstElementChild as HTMLElement
}

// Create warning icon SVG
const createWarningIcon = (): HTMLElement => {
  const svg = document.createElement('div')
  svg.innerHTML = `
    <svg class="validation-icon validation-icon-warning" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
    </svg>
  `
  return svg.firstElementChild as HTMLElement
}

// Create error message element
const createErrorMessage = (message: string): HTMLElement => {
  const messageEl = document.createElement('div')
  messageEl.className = 'validation-message'
  messageEl.textContent = message
  return messageEl
}

// Update validation UI
const updateValidationUI = (el: ValidationElement, jsonPath: string) => {
  const configStore = useConfigStore()
  const errors = configStore.getFieldErrors(jsonPath)
  
  const hasError = errors.some(e => e.severity === 'error')
  const hasWarning = errors.some(e => e.severity === 'warning')
  
  // Update input classes
  el.classList.remove('form-field-error', 'form-field-warning')
  if (hasError) {
    el.classList.add('form-field-error')
  } else if (hasWarning) {
    el.classList.add('form-field-warning')
  }
  
  // Find or create wrapper container
  let wrapper = el._validationWrapper
  if (!wrapper) {
    // Check if parent already has relative positioning
    const parent = el.parentElement
    if (parent && parent.classList.contains('relative')) {
      wrapper = parent
    } else {
      wrapper = document.createElement('div')
      wrapper.className = 'relative'
      el.parentNode?.insertBefore(wrapper, el)
      wrapper.appendChild(el)
    }
    el._validationWrapper = wrapper
  }
  
  // Remove existing validation elements
  if (el._validationIcon) {
    el._validationIcon.remove()
    el._validationIcon = undefined
  }
  if (el._validationMessage) {
    el._validationMessage.remove()
    el._validationMessage = undefined
  }
  
  // Add validation icon if needed
  if (hasError || hasWarning) {
    const icon = hasError ? createErrorIcon() : createWarningIcon()
    icon.style.position = 'absolute'
    icon.style.right = '12px'
    icon.style.top = '50%'
    icon.style.transform = 'translateY(-50%)'
    icon.style.width = '16px'
    icon.style.height = '16px'
    icon.style.pointerEvents = 'none'
    icon.style.zIndex = '10'
    wrapper.appendChild(icon)
    el._validationIcon = icon
    
    // Add error message
    const errorMessages = errors.filter(e => hasError ? e.severity === 'error' : e.severity === 'warning')
    if (errorMessages.length > 0) {
      const message = createErrorMessage(errorMessages[0].message)
      message.style.fontSize = '12px'
      message.style.marginTop = '4px'
      message.style.color = hasError ? '#ef4444' : '#f59e0b'
      
      // Insert after the wrapper
      wrapper.parentNode?.insertBefore(message, wrapper.nextSibling)
      el._validationMessage = message
    }
  }
}

export const vValidation = {
  mounted(el: ValidationElement, binding: DirectiveBinding) {
    const vModelPath = binding.value || binding.arg
    if (!vModelPath) {
      console.warn('v-validation directive requires a field path')
      return
    }
    
    const jsonPath = getJsonPath(vModelPath)
    const configStore = useConfigStore()
    
    // Initial validation
    updateValidationUI(el, jsonPath)
    
    // Watch for validation changes with more specific trigger
    const unwatch = configStore.$subscribe((mutation, state) => {
      // Update when validation errors change
      updateValidationUI(el, jsonPath)
    }, { deep: true })
    
    // Store cleanup function
    el._validationCleanup = unwatch
  },
  
  updated(el: ValidationElement, binding: DirectiveBinding) {
    const vModelPath = binding.value || binding.arg
    if (vModelPath) {
      const jsonPath = getJsonPath(vModelPath)
      updateValidationUI(el, jsonPath)
    }
  },
  
  unmounted(el: ValidationElement) {
    // Cleanup
    if (el._validationCleanup) {
      el._validationCleanup()
    }
    if (el._validationIcon) {
      el._validationIcon.remove()
    }
    if (el._validationMessage) {
      el._validationMessage.remove()
    }
  }
}