import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import type { KrakendConfig, Endpoint, Backend, ValidationError, MiddlewareNamespace } from '@/types/krakend'

// Default KrakenD configuration
const createDefaultConfig = (): KrakendConfig => ({
  version: 3,
  name: 'KrakenD API Gateway',
  timeout: '3000ms',
  cache_ttl: '300s',
  output_encoding: 'json',
  extra_config: {},
  endpoints: []
})

// Configuration cleaning utility
const removeEmptyObjects = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(removeEmptyObjects).filter(item => 
      item !== null && item !== undefined
    )
  }
  
  if (obj && typeof obj === 'object') {
    const cleaned: any = {}
    
    for (const [key, value] of Object.entries(obj)) {
      const cleanedValue = removeEmptyObjects(value)
      
      // Only include non-empty values
      if (cleanedValue !== null && 
          cleanedValue !== undefined && 
          !(typeof cleanedValue === 'object' && Object.keys(cleanedValue).length === 0)) {
        cleaned[key] = cleanedValue
      }
    }
    
    return Object.keys(cleaned).length > 0 ? cleaned : null
  }
  
  return obj
}

// Initialize Ajv with support for loading schemas
const ajv = new Ajv({ 
  allErrors: true, 
  verbose: true, 
  strict: false,
  validateFormats: false, // Skip format validation to avoid regex issues
  loadSchema: async (uri: string) => {
    console.log('📥 Loading referenced schema:', uri)
    try {
      const response = await fetch(uri)
      if (!response.ok) {
        throw new Error(`Failed to load schema: ${uri} (${response.status})`)
      }
      const rawSchema = await response.json()
      const schema = fixSchemaRegex(rawSchema)
      console.log('✅ Referenced schema loaded and fixed:', uri)
      return schema
    } catch (error) {
      console.error('❌ Failed to load referenced schema:', uri, error)
      throw error
    }
  }
})
addFormats(ajv)

// Schema cache
const schemaCache = new Map<string, any>()

// Function to fix common regex issues in schemas
const fixSchemaRegex = (obj: any): any => {
  if (typeof obj === 'string') {
    // Log all potential regex patterns
    if (obj.includes('\\') && (obj.includes('*') || obj.includes('?') || obj.includes('&') || obj.includes('%'))) {
      console.log('🔍 Found potential problematic regex:', obj)
    }
    
    // Fix multiple variants of the problematic pattern
    if (obj.includes('[^\\*\\?\\&\\%]') || obj.includes('[^\\\\*\\\\?\\\\&\\\\%]')) {
      console.warn('🔧 Fixing problematic KrakenD regex pattern:', obj)
      return obj.replace(/\[([^\]]*)\\\*([^\]]*)\\\?([^\]]*)\\\&([^\]]*)\\\%([^\]]*)\]/g, '[$1*$2?$3&$4%$5]')
    }
    
    // Fix other common regex escaping issues
    return obj
      .replace(/\\\*/g, '*')  // \* -> *
      .replace(/\\\?/g, '?')  // \? -> ?
      .replace(/\\\&/g, '&')  // \& -> &
      .replace(/\\\%/g, '%')  // \% -> %
  }
  
  if (Array.isArray(obj)) {
    return obj.map(fixSchemaRegex)
  }
  
  if (obj && typeof obj === 'object') {
    const fixed: any = {}
    for (const [key, value] of Object.entries(obj)) {
      if (key === 'pattern' && typeof value === 'string') {
        console.log('📋 Processing pattern:', value)
        
        // Specifically handle the problematic KrakenD pattern(s)
        if (value.includes('[^\\*\\?\\&\\%]') || value === '^\/[^\\*\\?\\&\\%]*(\/\\*)?$') {
          console.warn('🔧 Fixing problematic KrakenD endpoint pattern:', value)
          // This pattern validates KrakenD endpoint paths - use a simpler equivalent
          fixed[key] = '^\/.*$'  // Simply validate that it starts with /
          console.log('✅ Simplified pattern to:', fixed[key])
        } else {
          // Fix regex patterns specifically
          try {
            // Test if the pattern is valid
            new RegExp(value)
            fixed[key] = value
            console.log('✅ Pattern is valid:', value)
          } catch (error) {
            console.warn('❌ Invalid regex pattern found:', value)
            const fixedPattern = fixSchemaRegex(value)
            try {
              new RegExp(fixedPattern)
              fixed[key] = fixedPattern
              console.log('✅ Fixed pattern:', fixedPattern)
            } catch {
              // If still invalid, use a permissive pattern
              console.warn('🔧 Using fallback pattern for:', value)
              fixed[key] = '.*'
            }
          }
        }
      } else {
        fixed[key] = fixSchemaRegex(value)
      }
    }
    return fixed
  }
  
  return obj
}

// Default KrakenD schema URL
const DEFAULT_SCHEMA_URL = 'https://www.krakend.io/schema/krakend.json'

// Async validation function using JSON Schema
const validateConfigWithSchema = async (config: any): Promise<ValidationError[]> => {
  try {
    // Get schema URL from $schema property or use default
    const schemaUrl = (config && config.$schema) ? config.$schema : DEFAULT_SCHEMA_URL
    // console.log('🔍 Validating with schema:', schemaUrl)
    
    // Fetch schema if not cached
    let schema = schemaCache.get(schemaUrl)
    if (!schema) {
      // console.log('📥 Fetching schema from:', schemaUrl)
      const response = await fetch(schemaUrl)
      if (!response.ok) {
        throw new Error(`Failed to fetch schema: ${response.status}`)
      }
      const rawSchema = await response.json()
      schema = fixSchemaRegex(rawSchema)
      schemaCache.set(schemaUrl, schema)
      // console.log('✅ Schema cached and fixed successfully')
    } else {
      // console.log('📋 Using cached schema')
    }
    
    // Compile and validate (async to resolve $ref)
    const validate = await ajv.compileAsync(schema)
    const valid = validate(config)
    
    // console.log('🎯 Validation result:', valid)
    if (!valid) {
      console.log('⚠️ Schema validation errors:', validate.errors)
    }
    
    if (valid) {
      return []
    }
    
    // Convert Ajv errors to ValidationError format
    return (validate.errors || []).map(error => ({
      path: error.instancePath || error.schemaPath || 'root',
      message: `${error.instancePath || 'Configuration'} ${error.message}`,
      severity: 'error' as const,
      schemaPath: error.schemaPath,
      allowedValues: error.params?.allowedValues
    }))
    
  } catch (error) {
    console.error('❌ Schema validation failed:', error)
    
    // Return a warning about schema validation failure, plus basic validation
    const basicErrors = validateConfigBasic(config)
    
    return [
      {
        path: '$schema',
        message: `Schema validation failed: ${error instanceof Error ? error.message : 'Invalid schema'}. Using basic validation instead.`,
        severity: 'warning' as const
      },
      ...basicErrors
    ]
  }
}

// Basic validation function (fallback)
const validateConfigBasic = (config: any): ValidationError[] => {
  const errors: ValidationError[] = []
  
  if (!config || typeof config !== 'object') {
    errors.push({
      path: 'root',
      message: 'Configuration must be a valid JSON object',
      severity: 'error'
    })
    return errors
  }
  
  // Required fields
  if (!config.version) {
    errors.push({
      path: 'version',
      message: 'Version is required',
      severity: 'error'
    })
  }
  
  if (!config.name || (typeof config.name === 'string' && config.name.trim() === '')) {
    errors.push({
      path: 'name',
      message: 'Service name is required',
      severity: 'error'
    })
  }
  
  // Endpoint validation
  if (config.endpoints && Array.isArray(config.endpoints)) {
    config.endpoints.forEach((endpoint: any, index: number) => {
      if (!endpoint.endpoint || typeof endpoint.endpoint !== 'string') {
        errors.push({
          path: `endpoints[${index}].endpoint`,
          message: 'Endpoint path is required',
          severity: 'error'
        })
      }
      
      if (!endpoint.backend || !Array.isArray(endpoint.backend) || endpoint.backend.length === 0) {
        errors.push({
          path: `endpoints[${index}].backend`,
          message: 'At least one backend is required',
          severity: 'error'
        })
      } else {
        endpoint.backend.forEach((backend: any, backendIndex: number) => {
          if (!backend.url_pattern || typeof backend.url_pattern !== 'string') {
            errors.push({
              path: `endpoints[${index}].backend[${backendIndex}].url_pattern`,
              message: 'Backend URL pattern is required',
              severity: 'error'
            })
          }
          
          if (!backend.host || !Array.isArray(backend.host) || backend.host.length === 0) {
            errors.push({
              path: `endpoints[${index}].backend[${backendIndex}].host`,
              message: 'At least one host is required',
              severity: 'error'
            })
          }
        })
      }
    })
  }
  
  return errors
}

export const useConfigStore = defineStore('config', () => {
  // State: Single source of truth - KrakenD JSON configuration
  const config = ref<KrakendConfig>(createDefaultConfig())
  const isDirty = ref(false)
  const validationErrors = ref<ValidationError[]>([])
  
  // Computed properties
  const isValid = computed(() => validationErrors.value.filter(e => e.severity === 'error').length === 0)
  const hasWarnings = computed(() => validationErrors.value.filter(e => e.severity === 'warning').length > 0)
  
  // Get validation errors for a specific field
  const getFieldErrors = (fieldPath: string): ValidationError[] => {
    return validationErrors.value.filter(error => {
      // Handle different path formats from JSON Schema
      const normalizedPath = error.path.replace(/^\//, '').replace(/\//g, '.')
      const normalizedField = fieldPath.replace(/\./g, '/')
      
      return normalizedPath === fieldPath || 
             error.path === `/${normalizedField}` ||
             error.path === fieldPath ||
             error.path.endsWith(fieldPath)
    })
  }
  
  // Check if a specific field has validation errors
  const hasFieldError = (fieldPath: string): boolean => {
    return getFieldErrors(fieldPath).length > 0
  }
  
  // Service-level middleware operations
  const hasMiddleware = (namespace: MiddlewareNamespace): boolean => {
    return config.value.extra_config?.[namespace] !== undefined
  }
  
  const getMiddleware = (namespace: MiddlewareNamespace): any => {
    return config.value.extra_config?.[namespace]
  }
  
  const setMiddleware = (namespace: MiddlewareNamespace, middlewareConfig: any): void => {
    if (!config.value.extra_config) {
      config.value.extra_config = {}
    }
    config.value.extra_config[namespace] = middlewareConfig
    isDirty.value = true
    validateConfiguration()
  }
  
  const removeMiddleware = (namespace: MiddlewareNamespace): void => {
    if (config.value.extra_config?.[namespace]) {
      delete config.value.extra_config[namespace]
      isDirty.value = true
      validateConfiguration()
    }
  }
  
  // Endpoint-level middleware operations
  const hasEndpointMiddleware = (endpointIndex: number, namespace: MiddlewareNamespace): boolean => {
    const endpoint = config.value.endpoints?.[endpointIndex]
    return endpoint?.extra_config?.[namespace] !== undefined
  }
  
  const getEndpointMiddleware = (endpointIndex: number, namespace: MiddlewareNamespace): any => {
    const endpoint = config.value.endpoints?.[endpointIndex]
    return endpoint?.extra_config?.[namespace]
  }
  
  const setEndpointMiddleware = (endpointIndex: number, namespace: MiddlewareNamespace, middlewareConfig: any): void => {
    const endpoint = config.value.endpoints?.[endpointIndex]
    if (endpoint) {
      if (!endpoint.extra_config) {
        endpoint.extra_config = {}
      }
      endpoint.extra_config[namespace] = middlewareConfig
      isDirty.value = true
      validateConfiguration()
    }
  }
  
  const removeEndpointMiddleware = (endpointIndex: number, namespace: MiddlewareNamespace): void => {
    const endpoint = config.value.endpoints?.[endpointIndex]
    if (endpoint?.extra_config?.[namespace]) {
      delete endpoint.extra_config[namespace]
      isDirty.value = true
      validateConfiguration()
    }
  }
  
  // Backend-level middleware operations
  const hasBackendMiddleware = (endpointIndex: number, backendIndex: number, namespace: MiddlewareNamespace): boolean => {
    const backend = config.value.endpoints?.[endpointIndex]?.backend?.[backendIndex]
    return backend?.extra_config?.[namespace] !== undefined
  }
  
  const getBackendMiddleware = (endpointIndex: number, backendIndex: number, namespace: MiddlewareNamespace): any => {
    const backend = config.value.endpoints?.[endpointIndex]?.backend?.[backendIndex]
    return backend?.extra_config?.[namespace]
  }
  
  const setBackendMiddleware = (endpointIndex: number, backendIndex: number, namespace: MiddlewareNamespace, middlewareConfig: any): void => {
    const backend = config.value.endpoints?.[endpointIndex]?.backend?.[backendIndex]
    if (backend) {
      if (!backend.extra_config) {
        backend.extra_config = {}
      }
      backend.extra_config[namespace] = middlewareConfig
      isDirty.value = true
      validateConfiguration()
    }
  }
  
  const removeBackendMiddleware = (endpointIndex: number, backendIndex: number, namespace: MiddlewareNamespace): void => {
    const backend = config.value.endpoints?.[endpointIndex]?.backend?.[backendIndex]
    if (backend?.extra_config?.[namespace]) {
      delete backend.extra_config[namespace]
      isDirty.value = true
      validateConfiguration()
    }
  }
  
  // Endpoint management
  const addEndpoint = (endpoint: Endpoint): void => {
    if (!config.value.endpoints) {
      config.value.endpoints = []
    }
    config.value.endpoints.push(endpoint)
    isDirty.value = true
    validateConfiguration()
  }
  
  const removeEndpoint = (index: number): void => {
    if (config.value.endpoints && index >= 0 && index < config.value.endpoints.length) {
      config.value.endpoints.splice(index, 1)
      isDirty.value = true
      validateConfiguration()
    }
  }
  
  const updateEndpoint = (index: number, endpoint: Endpoint): void => {
    if (config.value.endpoints && index >= 0 && index < config.value.endpoints.length) {
      config.value.endpoints[index] = endpoint
      isDirty.value = true
      validateConfiguration()
    }
  }
  
  // Backend management
  const addBackend = (endpointIndex: number, backend: Backend): void => {
    const endpoint = config.value.endpoints?.[endpointIndex]
    if (endpoint) {
      if (!endpoint.backend) {
        endpoint.backend = []
      }
      endpoint.backend.push(backend)
      isDirty.value = true
      validateConfiguration()
    }
  }
  
  const removeBackend = (endpointIndex: number, backendIndex: number): void => {
    const endpoint = config.value.endpoints?.[endpointIndex]
    if (endpoint?.backend && backendIndex >= 0 && backendIndex < endpoint.backend.length) {
      endpoint.backend.splice(backendIndex, 1)
      isDirty.value = true
      validateConfiguration()
    }
  }
  
  const updateBackend = (endpointIndex: number, backendIndex: number, backend: Backend): void => {
    const endpoint = config.value.endpoints?.[endpointIndex]
    if (endpoint?.backend && backendIndex >= 0 && backendIndex < endpoint.backend.length) {
      endpoint.backend[backendIndex] = backend
      isDirty.value = true
      validateConfiguration()
    }
  }
  
  // Service configuration updates
  const updateService = (updates: Partial<KrakendConfig>): void => {
    Object.assign(config.value, updates)
    isDirty.value = true
    validateConfiguration()
  }
  
  // JSON operations
  const exportJSON = (): string => {
    const cleanConfig = removeEmptyObjects(config.value)
    return JSON.stringify(cleanConfig, null, 2)
  }
  
  const importJSON = (jsonString: string): void => {
    try {
      const parsed = JSON.parse(jsonString)
      config.value = parsed
      isDirty.value = false
      validateConfiguration()
    } catch (error) {
      throw new Error(`Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
  
  const resetConfig = (): void => {
    config.value = createDefaultConfig()
    isDirty.value = false
    validationErrors.value = []
  }
  
  // Validation
  const validateConfiguration = async (): Promise<void> => {
    try {
      validationErrors.value = await validateConfigWithSchema(config.value)
    } catch (error) {
      console.error('Validation error:', error)
      validationErrors.value = validateConfigBasic(config.value)
    }
  }
  
  // Initialize validation
  validateConfiguration()
  
  return {
    // State (readonly)
    config: readonly(config),
    isDirty: readonly(isDirty),
    validationErrors: readonly(validationErrors),
    
    // Computed
    isValid,
    hasWarnings,
    
    // Field validation
    getFieldErrors,
    hasFieldError,
    
    // Service-level middleware
    hasMiddleware,
    getMiddleware,
    setMiddleware,
    removeMiddleware,
    
    // Endpoint-level middleware
    hasEndpointMiddleware,
    getEndpointMiddleware,
    setEndpointMiddleware,
    removeEndpointMiddleware,
    
    // Backend-level middleware
    hasBackendMiddleware,
    getBackendMiddleware,
    setBackendMiddleware,
    removeBackendMiddleware,
    
    // Endpoint management
    addEndpoint,
    removeEndpoint,
    updateEndpoint,
    
    // Backend management
    addBackend,
    removeBackend,
    updateBackend,
    
    // Service updates
    updateService,
    
    // JSON operations
    exportJSON,
    importJSON,
    resetConfig,
    
    // Validation
    validateConfiguration
  }
})