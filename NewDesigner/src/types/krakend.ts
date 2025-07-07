// KrakenD Configuration Types
// Based on KrakenD v2.x configuration schema

export interface KrakendConfig {
  version: number
  name?: string
  timeout?: string
  cache_ttl?: string
  output_encoding?: 'json' | 'xml' | 'no-op' | 'string'
  debug_endpoint?: boolean
  echo_endpoint?: boolean
  port?: number
  host?: string[]
  extra_config?: Record<string, any>
  endpoints?: Endpoint[]
  tls?: TLSConfig
  plugin?: PluginConfig
}

export interface Endpoint {
  endpoint: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS'
  output_encoding?: 'json' | 'xml' | 'no-op' | 'string'
  concurrent_calls?: number
  timeout?: string
  cache_ttl?: string
  headers_to_pass?: string[]
  querystring_params?: string[]
  extra_config?: Record<string, any>
  backend?: Backend[]
}

export interface Backend {
  url_pattern: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS'
  host?: string[]
  encoding?: 'json' | 'xml' | 'no-op' | 'string' | 'rss'
  sd?: 'static' | 'dns'
  disable_host_sanitize?: boolean
  extra_config?: Record<string, any>
  deny?: string[]
  allow?: string[]
  mapping?: Record<string, string>
  group?: string
  target?: string
}

export interface TLSConfig {
  public_key?: string
  private_key?: string
  disabled?: boolean
  min_version?: string
  max_version?: string
  curve_preferences?: number[]
  cipher_suites?: number[]
}

export interface PluginConfig {
  pattern?: string
  folder?: string
}

// Middleware namespace constants
export const MIDDLEWARE_NAMESPACES = {
  // Security
  'security/cors': 'CORS',
  'security/bot-detector': 'Bot Detector', 
  'security/http': 'HTTP Security',
  'security/policies': 'Security Policies',
  
  // Authentication
  'auth/validator': 'JWT Validator',
  'auth/api-keys': 'API Keys',
  'auth/basic': 'Basic Authentication',
  'auth/signer': 'JWT Signer',
  'auth/ntlm': 'NTLM',
  
  // Rate Limiting
  'qos/ratelimit/service': 'Service Rate Limit',
  'qos/ratelimit/router': 'Router Rate Limit', 
  'qos/ratelimit/proxy': 'Backend Rate Limit',
  
  // Circuit Breaker
  'qos/circuit-breaker': 'Circuit Breaker',
  
  // Caching
  'qos/http-cache': 'HTTP Cache',
  
  // Data Transformation
  'modifier/jmespath': 'JMESPath',
  'modifier/response-body-generator': 'Response Generator',
  'modifier/body-generator': 'Body Generator',
  'modifier/martian': 'Martian',
  'modifier/content-replacer': 'Content Replacer',
  
  // Integration
  'backend/graphql': 'GraphQL',
  'backend/grpc': 'gRPC',
  'backend/soap': 'SOAP',
  'backend/websocket': 'WebSocket',
  'backend/amqp/consumer': 'AMQP Consumer',
  'backend/amqp/producer': 'AMQP Producer',
  'backend/pubsub/publisher': 'PubSub Publisher',
  'backend/pubsub/subscriber': 'PubSub Subscriber',
  'backend/lambda': 'AWS Lambda',
  
  // Telemetry
  'telemetry/metrics': 'Metrics',
  'telemetry/logging': 'Logging',
  'telemetry/opencensus': 'OpenCensus',
  'telemetry/opentelemetry': 'OpenTelemetry',
  'telemetry/newrelic': 'New Relic',
  'telemetry/gelf': 'GELF',
  
  // Enterprise
  'plugin/req-resp-modifier': 'Request/Response Modifier',
  'plugin/static-filesystem': 'Static Filesystem',
  'plugin/virtualhost': 'Virtual Host',
  'plugin/ip-filter': 'IP Filter'
} as const

export type MiddlewareNamespace = keyof typeof MIDDLEWARE_NAMESPACES

// Validation error type
export interface ValidationError {
  path: string
  message: string
  severity: 'error' | 'warning'
  schemaPath?: string
  allowedValues?: any[]
  additionalInfo?: any
}

// Component mapping interface
export interface ComponentMapping {
  namespace: MiddlewareNamespace
  jsonPath: string
  title: string
  description?: string
  isEnabled: boolean
  config: any
  defaultConfig: any
  isEnterprise?: boolean
  dependencies?: MiddlewareNamespace[]
}