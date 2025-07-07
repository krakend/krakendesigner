import { computed } from 'vue'
import { useConfigStore } from '@/stores/config'

export function useValidation() {
  const configStore = useConfigStore()
  
  // Get validation state for a field
  const getFieldValidation = (fieldPath: string) => {
    const errors = computed(() => configStore.getFieldErrors(fieldPath))
    const hasError = computed(() => errors.value.some(e => e.severity === 'error'))
    const hasWarning = computed(() => errors.value.some(e => e.severity === 'warning'))
    
    const inputClasses = computed(() => ({
      'form-field-error': hasError.value,
      'form-field-warning': hasWarning.value && !hasError.value
    }))
    
    return {
      errors,
      hasError,
      hasWarning,
      inputClasses
    }
  }
  
  return {
    getFieldValidation
  }
}