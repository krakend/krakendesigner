# KrakenD Designer - JSON-Centric Architecture

## 🎯 Core Principle: JSON Configuration as Single Source of Truth

The KrakenD Designer is fundamentally a **visual JSON editor**. Every UI component, form field, and interaction directly maps to specific properties in the KrakenD configuration JSON schema.

## 📋 KrakenD Configuration Structure

```json
{
  "version": 3,
  "name": "My API Gateway",
  "timeout": "3000ms",
  "cache_ttl": "300s",
  "output_encoding": "json",
  "extra_config": {
    "security/cors": { /* CORS configuration */ },
    "telemetry/metrics": { /* Metrics configuration */ },
    "auth/api-keys": { /* API Keys configuration */ }
  },
  "endpoints": [
    {
      "endpoint": "/users/{id}",
      "method": "GET",
      "output_encoding": "json",
      "extra_config": {
        "auth/validator": { /* JWT validation */ },
        "qos/ratelimit/router": { /* Rate limiting */ }
      },
      "backend": [
        {
          "url_pattern": "/user/{id}",
          "host": ["http://users-api:8080"],
          "method": "GET",
          "extra_config": {
            "qos/circuit-breaker": { /* Circuit breaker */ },
            "modifier/jmespath": { /* Data transformation */ }
          }
        }
      ]
    }
  ]
}
```

## 🔄 Bidirectional JSON ↔ UI Mapping

### 1. JSON to UI (Loading Configuration)
When a user imports a JSON file:
```typescript
// Load JSON into store
const loadConfiguration = (jsonConfig: KrakendConfig) => {
  // Direct mapping to reactive state
  serviceConfig.value = jsonConfig
  
  // UI components automatically reflect JSON state
  // CORS component shows: jsonConfig.extra_config["security/cors"]
  // JWT component shows: jsonConfig.endpoints[0].extra_config["auth/validator"]
}
```

### 2. UI to JSON (Real-time Updates)
Every form interaction immediately updates JSON:
```typescript
// User toggles CORS component ON
const enableCORS = (config: CORSConfig) => {
  // Directly updates JSON path
  serviceConfig.value.extra_config["security/cors"] = config
  
  // JSON preview updates immediately
  // Export functionality has latest state
}

// User toggles CORS component OFF  
const disableCORS = () => {
  // Remove from JSON (clean output)
  delete serviceConfig.value.extra_config["security/cors"]
}
```

## 🎨 Component Architecture Pattern

Every component follows this pattern:

### Base Component Interface
```typescript
interface ComponentMapping {
  // JSON path where this component's data lives
  jsonPath: string
  
  // Component state (mirrors JSON structure)
  config: any
  
  // Whether component is enabled (exists in JSON)
  isEnabled: boolean
  
  // Default configuration when enabled
  defaultConfig: any
  
  // Methods
  enable(): void    // Add to JSON with defaults
  disable(): void   // Remove from JSON
  update(config: any): void  // Update JSON path
}
```

### Example: CORS Component
```vue
<template>
  <ConfigBox 
    title="CORS (Cross-Origin Resource Sharing)"
    :enabled="isEnabled"
    @toggle="toggle"
  >
    <div v-if="isEnabled">
      <FormGroup label="Allowed Origins">
        <StringArray 
          v-model="config.allow_origins"
          placeholder="https://example.com"
        />
      </FormGroup>
      
      <FormGroup label="Allowed Methods">
        <CheckboxGroup 
          v-model="config.allow_methods"
          :options="['GET', 'POST', 'PUT', 'DELETE']"
        />
      </FormGroup>
    </div>
  </ConfigBox>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useConfigStore } from '@/stores/config'

// JSON mapping for CORS
const JSON_PATH = 'extra_config["security/cors"]'
const DEFAULT_CONFIG = {
  allow_origins: ['*'],
  allow_methods: ['GET', 'POST'],
  allow_headers: ['Content-Type'],
  expose_headers: [],
  max_age: '12h',
  allow_credentials: false
}

const store = useConfigStore()

// Reactive state mapped to JSON
const isEnabled = computed(() => 
  store.hasMiddleware('security/cors')
)

const config = computed({
  get: () => store.getMiddleware('security/cors') || DEFAULT_CONFIG,
  set: (value) => store.setMiddleware('security/cors', value)
})

const toggle = () => {
  if (isEnabled.value) {
    store.removeMiddleware('security/cors')
  } else {
    store.setMiddleware('security/cors', DEFAULT_CONFIG)
  }
}
</script>
```

## 🏪 State Management (Pinia Store)

The store manages the JSON configuration as reactive state:

```typescript
export const useConfigStore = defineStore('config', () => {
  // Single source of truth: KrakenD JSON configuration
  const config = ref<KrakendConfig>({
    version: 3,
    name: '',
    timeout: '3000ms',
    cache_ttl: '300s',
    output_encoding: 'json',
    extra_config: {},
    endpoints: []
  })

  // Middleware management (service level)
  const hasMiddleware = (namespace: string): boolean => {
    return config.value.extra_config?.[namespace] !== undefined
  }

  const getMiddleware = (namespace: string): any => {
    return config.value.extra_config?.[namespace]
  }

  const setMiddleware = (namespace: string, middlewareConfig: any): void => {
    if (!config.value.extra_config) {
      config.value.extra_config = {}
    }
    config.value.extra_config[namespace] = middlewareConfig
  }

  const removeMiddleware = (namespace: string): void => {
    if (config.value.extra_config?.[namespace]) {
      delete config.value.extra_config[namespace]
    }
  }

  // Endpoint management
  const addEndpoint = (endpoint: Endpoint): void => {
    config.value.endpoints.push(endpoint)
  }

  const removeEndpoint = (index: number): void => {
    config.value.endpoints.splice(index, 1)
  }

  const updateEndpoint = (index: number, endpoint: Endpoint): void => {
    config.value.endpoints[index] = endpoint
  }

  // JSON operations
  const exportJSON = (): string => {
    // Clean empty objects before export
    const cleanConfig = removeEmptyObjects(config.value)
    return JSON.stringify(cleanConfig, null, 2)
  }

  const importJSON = (jsonString: string): void => {
    try {
      const parsed = JSON.parse(jsonString)
      // Validate against KrakenD schema
      validateConfig(parsed)
      config.value = parsed
    } catch (error) {
      throw new Error(`Invalid JSON: ${error.message}`)
    }
  }

  const resetConfig = (): void => {
    config.value = createDefaultConfig()
  }

  return {
    // State
    config: readonly(config),
    
    // Middleware actions
    hasMiddleware,
    getMiddleware,
    setMiddleware,
    removeMiddleware,
    
    // Endpoint actions
    addEndpoint,
    removeEndpoint,
    updateEndpoint,
    
    // JSON operations
    exportJSON,
    importJSON,
    resetConfig
  }
})
```

## 🔍 Real-time JSON Preview

```vue
<template>
  <div class="json-preview">
    <div class="flex justify-between items-center mb-4">
      <h3>Live Configuration Preview</h3>
      <button @click="copyToClipboard" class="btn-secondary">
        Copy JSON
      </button>
    </div>
    
    <pre class="bg-gray-900 text-green-400 p-4 rounded overflow-auto">
      <code>{{ formattedJSON }}</code>
    </pre>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useConfigStore } from '@/stores/config'

const store = useConfigStore()

// Real-time JSON formatting
const formattedJSON = computed(() => {
  return store.exportJSON()
})

const copyToClipboard = () => {
  navigator.clipboard.writeText(formattedJSON.value)
}
</script>
```

## 📝 Namespace Convention

Each middleware/plugin has a unique namespace that maps to JSON paths:

```typescript
// Namespace mapping
const MIDDLEWARE_NAMESPACES = {
  // Security
  'security/cors': 'CORS',
  'security/bot-detector': 'Bot Detector',
  'security/http': 'HTTP Security',
  
  // Authentication  
  'auth/validator': 'JWT Validator',
  'auth/api-keys': 'API Keys',
  'auth/basic': 'Basic Authentication',
  
  // Rate Limiting
  'qos/ratelimit/service': 'Service Rate Limit',
  'qos/ratelimit/router': 'Router Rate Limit',
  'qos/ratelimit/proxy': 'Backend Rate Limit',
  
  // Circuit Breaker
  'qos/circuit-breaker': 'Circuit Breaker',
  
  // Data Transformation
  'modifier/jmespath': 'JMESPath',
  'modifier/response-body-generator': 'Response Generator'
  
  // ... 40+ more middleware namespaces
}
```

## 🧼 Configuration Cleaning

Before export, clean empty objects to produce minimal JSON:

```typescript
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
```

## ✅ Universal Validation System

The application uses a sophisticated validation system that automatically applies JSON schema validation to any form field:

### Vue Directive for Automatic Validation

```typescript
// Usage in any component
<template>
  <input 
    v-model="fieldValue"
    v-validation="'fieldName'"
    class="form-input"
  />
</template>
```

### Validation Implementation

```typescript
interface ValidationError {
  path: string
  message: string
  severity: 'error' | 'warning'
}

// Automatic path mapping from v-model to JSON schema paths
const getJsonPath = (vModelPath: string): string => {
  const pathMappings: Record<string, string> = {
    'serviceName': 'name',
    'cacheTtl': 'cache_ttl',
    'outputEncoding': 'output_encoding',
    'debugEndpoint': 'debug_endpoint',
    'echoEndpoint': 'echo_endpoint'
  }
  
  // Handle array paths like 'host.0', 'host.1', etc.
  if (vModelPath.startsWith('host.')) {
    return 'host'
  }
  
  return pathMappings[vModelPath] || vModelPath
}

// Real-time validation with visual feedback
const updateValidationUI = (el: HTMLElement, jsonPath: string) => {
  const configStore = useConfigStore()
  const errors = configStore.getFieldErrors(jsonPath)
  
  const hasError = errors.some(e => e.severity === 'error')
  const hasWarning = errors.some(e => e.severity === 'warning')
  
  // Apply CSS classes
  el.classList.toggle('form-field-error', hasError)
  el.classList.toggle('form-field-warning', hasWarning && !hasError)
  
  // Add/remove validation icons and messages
  if (hasError || hasWarning) {
    addValidationIcon(el, hasError ? 'error' : 'warning')
    addValidationMessage(el, errors[0].message)
  }
}
```

### JSON Schema Validation with Ajv

```typescript
const validateConfig = (config: KrakendConfig): ValidationError[] => {
  const errors: ValidationError[] = []
  
  // Required fields
  if (!config.version) {
    errors.push({
      path: 'version',
      message: 'Version is required',
      severity: 'error'
    })
  }
  
  // Endpoint validation
  config.endpoints?.forEach((endpoint, index) => {
    if (!endpoint.endpoint) {
      errors.push({
        path: `endpoints[${index}].endpoint`,
        message: 'Endpoint path is required',
        severity: 'error'
      })
    }
    
    if (endpoint.backend?.length === 0) {
      errors.push({
        path: `endpoints[${index}].backend`,
        message: 'At least one backend is required',
        severity: 'error'
      })
    }
  })
  
  return errors
}
```

## 🎯 Key Principles

1. **JSON First**: UI components are views of JSON data, not independent entities
2. **Real-time Sync**: Every UI change immediately updates JSON structure  
3. **Clean Output**: Export only meaningful configuration (no empty objects)
4. **Schema Validation**: Ensure output is always valid KrakenD configuration
5. **Namespace Mapping**: Each component maps to specific JSON paths via namespaces
6. **Bidirectional**: Support both JSON → UI and UI → JSON workflows seamlessly
7. **Universal Validation**: Automatic validation for any form field using Vue directives

## 🚀 Recent Achievements

### ServiceConfig Component with Universal Validation
- **Complete service-level configuration**: name, version, timeout, cache_ttl, output_encoding, port, debug settings
- **Default hosts management**: Array-based host configuration with CRUD operations
- **Universal validation system**: `v-validation` directive automatically applies to any form field
- **Real-time validation feedback**: Icons, background colors, and error messages based on JSON schema
- **Scalable architecture**: Works for current and future components without manual setup

### Technical Innovations
- **Vue directive pattern**: `v-validation="'fieldName'"` for automatic validation
- **Path mapping system**: Automatic conversion from v-model names to JSON schema paths
- **Ajv integration**: Real-time JSON schema validation using KrakenD's official schema
- **Visual feedback system**: Consistent error/warning display across all form fields
- **Schema compliance**: Follows KrakenD's JSON schema validation rules exactly

This architecture ensures that the KrakenD Designer remains true to its core purpose: being a visual editor for KrakenD JSON configuration files with robust validation and user experience.