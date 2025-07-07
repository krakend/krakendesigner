# KrakenD Designer - Modern Rewrite Specifications

## 📋 Application Overview

**Purpose**: Visual JSON editor for KrakenD API Gateway configuration files
**Core Function**: Bidirectional mapping between KrakenD JSON schema and visual UI components
**Current Tech**: AngularJS 1.7 + Bootstrap 3 + AdminLTE 2 + Webpack 4
**New Tech**: Vue 3 + Tailwind CSS + Vite + TypeScript

### 🎯 Fundamental Architecture Principle
Every UI component directly maps to specific JSON paths in the KrakenD configuration schema. The application is essentially a visual JSON editor where:
- **JSON is the single source of truth**
- **UI components are reactive views of JSON data**
- **Every form interaction immediately updates JSON structure**
- **Export functionality outputs clean, valid KrakenD configuration**

## 🎯 Core Requirements

### Functional Requirements

1. **Configuration Management**
   - Create, edit, import, export KrakenD JSON configurations
   - Real-time JSON preview with validation
   - Support for both Community and Enterprise features
   - Configuration cleaning (remove empty objects)

2. **File Operations**
   - Drag-and-drop file loading
   - Local file system access (when supported)
   - Download generated configurations
   - Auto-save functionality (localStorage)

3. **Service Configuration**
   - Basic service settings (name, version, timeouts)
   - HTTP server/client settings
   - TLS configuration
   - Host management and service discovery
   - Debug endpoints

4. **Endpoint Management**
   - Dynamic endpoint creation/deletion
   - HTTP method selection with visual indicators
   - Parameter forwarding configuration
   - Multiple backend support per endpoint
   - Encoding options (JSON, XML, no-op, string)
   - Static response configuration

5. **Middleware System**
   - 42+ middleware components organized by category
   - Namespace-based configuration
   - Toggle enable/disable functionality
   - Default values and validation
   - Enterprise feature detection

6. **Plugin System**
   - HTTP server/client plugins
   - Request/response plugins
   - Conflict resolution for mutually exclusive plugins
   - Dynamic plugin entry management

## 🏗️ Technical Architecture

### Application Structure
```
NewDesigner/
├── src/
│   ├── components/           # Vue components
│   │   ├── common/          # Shared UI components
│   │   ├── forms/           # Form components
│   │   ├── middleware/      # Middleware components
│   │   ├── plugins/         # Plugin components
│   │   └── service/         # Service components
│   ├── stores/              # Pinia state management
│   ├── types/               # TypeScript definitions
│   ├── utils/               # Utility functions
│   ├── assets/              # Static assets
│   └── App.vue              # Root component
├── public/                  # Static files
├── tests/                   # Test files
└── docs/                    # Documentation
```

### State Management (Pinia) - JSON-Centric Store
```typescript
// Main configuration store - manages KrakenD JSON as reactive state
interface ConfigStore {
  // Single source of truth: KrakenD JSON configuration
  config: KrakendConfig
  
  // Metadata
  isDirty: boolean
  validationErrors: ValidationError[]
  
  // JSON namespace operations (core functionality)
  hasMiddleware(namespace: string): boolean
  getMiddleware(namespace: string): any
  setMiddleware(namespace: string, config: any): void
  removeMiddleware(namespace: string): void
  
  // Endpoint operations (manipulate JSON endpoints array)
  addEndpoint(endpoint: Endpoint): void
  removeEndpoint(index: number): void
  updateEndpoint(index: number, endpoint: Endpoint): void
  
  // JSON file operations
  exportJSON(): string  // Clean + stringify JSON
  importJSON(json: string): void  // Parse + validate JSON
  resetConfig(): void
}

// Every component follows this pattern:
interface ComponentMapping {
  jsonPath: string      // Where in JSON this component's data lives
  namespace: string     // KrakenD middleware namespace
  defaultConfig: any    // Default values when enabled
  isEnabled: boolean    // Whether component exists in JSON
}
```

### Component Categories

#### 1. Layout Components
- **AppHeader**: Main navigation with file operations
- **AppSidebar**: Hierarchical navigation menu
- **AppMain**: Content area with routing
- **AppModal**: Reusable modal system

#### 2. Form Components
- **Dashboard**: Welcome page and file operations
- **ServiceConfig**: Service-level configuration
- **EndpointManager**: Endpoint CRUD interface
- **SecurityConfig**: Security settings
- **LoggingConfig**: Telemetry configuration
- **ApiKeyConfig**: API key management
- **OpenApiConfig**: OpenAPI documentation

#### 3. Middleware Components (42 components)
```typescript
// Base middleware component interface
interface MiddlewareComponent {
  namespace: string
  title: string
  description: string
  isEnabled: boolean
  config: any
  defaultConfig: any
  isEnterprise?: boolean
  dependencies?: string[]
}
```

**Categories:**
- **Authentication**: JWT, API Keys, OAuth, Basic Auth, NTLM
- **Security**: CORS, Bot Detection, IP Filter, Security Policies
- **Traffic**: Rate Limiting, Circuit Breaker, HTTP Cache
- **Transformation**: JMESPath, Body Generator, Content Replacer
- **Integration**: GraphQL, gRPC, SOAP, WebSocket, AMQP
- **Observability**: Metrics, Logging, OpenTelemetry, NewRelic
- **Enterprise**: Virtual Host, Static Filesystem, Monetization

#### 4. Plugin Components (8 components)
- IP Filter, URL Rewrite, Wildcard, Basic Auth
- Redis Rate Limit, JWK Aggregator, GeoIP, Content Replacer

#### 5. Service Components (7 components)
- HTTP Server/Client Settings, TLS, Debug Endpoints
- GZIP, Timeouts, Options

### Data Flow Architecture - JSON-Centric

```typescript
// PRIMARY FLOW: User edits configuration
User toggles CORS → setMiddleware('security/cors', config) → JSON updated → UI reflects change

// IMPORT FLOW: User loads existing JSON
File Drop → JSON.parse() → Validate schema → Store.importJSON() → All UI components update

// EXPORT FLOW: User downloads configuration  
Export Button → Store.exportJSON() → Clean empty objects → Download krakend.json

// REAL-TIME PREVIEW: Continuous JSON preview
Any UI change → Store state change → Computed JSON → Live preview updates
```

#### JSON Structure Mapping
```json
{
  "version": 3,                           // ← ServiceConfig component
  "name": "My Gateway",                   // ← ServiceConfig component  
  "timeout": "3000ms",                    // ← ServiceConfig component
  "extra_config": {
    "security/cors": { ... },             // ← CORS component
    "auth/api-keys": { ... },             // ← APIKeys component
    "telemetry/metrics": { ... }          // ← Metrics component
  },
  "endpoints": [                          // ← EndpointManager component
    {
      "endpoint": "/users/{id}",          // ← EndpointForm component
      "method": "GET",                    // ← EndpointForm component
      "extra_config": {
        "auth/validator": { ... },        // ← JWT component (endpoint level)
        "qos/ratelimit/router": { ... }   // ← RateLimit component (endpoint level)
      },
      "backend": [                        // ← BackendConfig component
        {
          "url_pattern": "/user/{id}",    // ← BackendForm component
          "host": ["http://api:8080"],    // ← BackendForm component
          "extra_config": {
            "qos/circuit-breaker": { ... } // ← CircuitBreaker component (backend level)
          }
        }
      ]
    }
  ]
}
```

## 🎨 Design System

### UI Framework: Tailwind CSS + Headless UI
- **Colors**: Semantic color palette matching KrakenD branding
- **Typography**: Clear hierarchy with good readability
- **Spacing**: Consistent spacing system
- **Components**: Reusable design tokens

### Design Tokens
```css
/* Color Palette */
--primary: #2563eb (blue-600)
--secondary: #6b7280 (gray-500)
--success: #059669 (emerald-600)
--warning: #d97706 (amber-600)
--danger: #dc2626 (red-600)

/* Spacing */
--space-xs: 0.25rem
--space-sm: 0.5rem
--space-md: 1rem
--space-lg: 1.5rem
--space-xl: 2rem
```

### Component Patterns

#### Box Pattern
```vue
<template>
  <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
    <div class="px-4 py-3 border-b border-gray-200 bg-gray-50">
      <h3 class="text-base font-medium text-gray-900">{{ title }}</h3>
    </div>
    <div class="p-4">
      <slot />
    </div>
  </div>
</template>
```

#### Form Group Pattern
```vue
<template>
  <div class="space-y-1">
    <label class="block text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    <input 
      v-model="modelValue"
      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      :type="type"
    >
    <p v-if="helpText" class="text-xs text-gray-500">{{ helpText }}</p>
  </div>
</template>
```

## 🔧 Development Workflow

### Build System (Vite)
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [vue(), vuetify()],
  build: {
    target: 'es2015',
    outDir: 'dist',
    sourcemap: true
  },
  server: {
    port: 3000,
    proxy: {
      // No backend needed
    }
  }
})
```

### TypeScript Configuration
- Strict mode enabled
- Path aliases for clean imports
- KrakenD configuration types
- Vue component types

### Testing Strategy
```typescript
// Component testing with Vitest + Vue Test Utils
describe('EndpointManager', () => {
  it('should add new endpoint', () => {
    // Test component behavior
  })
  
  it('should validate endpoint configuration', () => {
    // Test validation logic
  })
})

// Store testing
describe('ConfigStore', () => {
  it('should update service configuration', () => {
    // Test store actions
  })
})
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px (sm)
- **Tablet**: 768px - 1024px (md)
- **Desktop**: > 1024px (lg)

### Mobile-First Approach
- Collapsible sidebar navigation
- Touch-friendly interactive elements
- Optimized form layouts
- Responsive table/grid components

## 🚀 Performance Requirements

### Bundle Size Targets
- **Initial bundle**: < 500KB gzipped
- **Lazy-loaded chunks**: < 100KB each
- **Images/assets**: Optimized and compressed

### Performance Features
- Code splitting by route
- Lazy loading of middleware components
- Virtual scrolling for large lists
- Debounced configuration updates

## 🔐 Security Considerations

### Client-Side Security
- No sensitive data transmission
- Local storage encryption for auto-save
- XSS protection via Vue's template system
- Content Security Policy headers

### Data Privacy
- No external API calls (except documentation links)
- Local-only file operations
- No analytics/tracking

## 📦 Deployment Strategy

### Build Outputs
- **Development**: Hot-reload dev server
- **Production**: Static files for Docker/nginx
- **GitHub Pages**: Hosted demo version

### Docker Integration
```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

## 🧪 Migration Strategy

### Phase 1: Foundation
- Project setup with Vite + Vue 3 + TypeScript
- Basic layout and routing
- Configuration store setup
- Dashboard component

### Phase 2: Core Features
- Service configuration
- Basic endpoint management
- File import/export
- Configuration validation

### Phase 3: Middleware System
- Base middleware component
- 5-10 essential middleware components
- Plugin system foundation

### Phase 4: Complete Feature Parity
- All 42 middleware components
- All 8 plugin components
- All service components
- Advanced features

### Phase 5: Enhancements
- Performance optimizations
- Enhanced UX/UI
- Testing coverage
- Documentation

## ✅ Success Criteria

### Functional Parity
- [ ] All current features reproduced
- [ ] Configuration compatibility maintained
- [ ] File operations working
- [ ] Visual design consistency

### Technical Improvements
- [ ] Modern build system
- [ ] TypeScript implementation
- [ ] Component testing coverage
- [ ] Performance benchmarks met

### User Experience
- [ ] Faster load times
- [ ] Better mobile experience
- [ ] Improved accessibility
- [ ] Enhanced developer experience

---

This specification provides the complete blueprint for modernizing the KrakenD Designer while maintaining its extensive functionality and improving its technical foundation.