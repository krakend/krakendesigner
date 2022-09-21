angular
    .module('KrakenDesigner')
    .service("DefaultConfig", function () {
        return {
            service: {
                $schema: "https://www.krakend.io/schema/v3.json",
                version: 3,
                name: 'KrakenD - API Gateway',
                extra_config: {},
                timeout: '3000ms',
                cache_ttl: '300s'
            },
            plugins: {
                "plugin/http-server": {
                    "ip-filter":
                    {
                        "allow": false,
                        "client_ip_headers": [
                            "X-Forwarded-For",
                            "X-Real-IP",
                            "X-Appengine-Remote-Addr"
                        ],
                    },
                    "wildcard": {
                        endpoints: {}
                    },
                    "url-rewrite": {
                        "literal": {},
                        "regexp": []
                    },
                    "basic-auth": {
                        "htpasswd_path": "/etc/krakend/.htpasswd",
                        "endpoints": ["*"]
                    },
                    "redis-ratelimit": {
                        "Host": "redis:6379",
                        "Tokenizer": "ip",
                        "Burst": 10,
                        "Rate": 100,
                        "Period": "60s"
                    },
                    "jwk-aggregator": {
                        "port": 9876,
                        "origins": [
                            "https://example-server/jwk.json",
                            "http://example-server/public_keys"
                        ]
                    },
                    "geoip": {
                        "citydb_path": "./GeoLite2-City.mmdb"
                    }
                },
                "plugin/http-client": {},
                "plugin/req-resp-modifier": {
                    "ip-filter":
                    {
                        "allow": false,
                        "client_ip_headers": [
                            "X-Forwarded-For",
                            "X-Real-IP",
                            "X-Appengine-Remote-Addr"
                        ],
                    }
                }
            },
            // Default plugin
            plugin: {
                "pattern": ".so",
                "folder": "/opt/krakend/plugins/"
            },
            // Default middleware config
            extra_config: {
                'telemetry/metrics': {
                    "collection_time": "60s",
                    "proxy_disabled": false,
                    "router_disabled": false,
                    "backend_disabled": false,
                    "endpoint_disabled": false,
                    "listen_address": ":8090"
                },
                'auth/client-credentials': {
                    "endpoint_params": {}
                },
                'security/http': {
                    "allowed_hosts": [],
                    "ssl_proxy_headers": {}
                },
                'telemetry/logging': {
                    "level": "ERROR",
                    "prefix": "[KRAKEND]",
                    "syslog": false,
                    "stdout": true,
                    "format": "default",
                    "syslog_facility": "local3"
                },
                'security/cors': {
                    "allow_origins": [
                        "*"
                    ],
                    "expose_headers": [
                        "Content-Length"
                    ],
                    "max_age": "12h",
                    "allow_methods": [
                        "GET",
                        "HEAD",
                        "POST"
                    ]
                },
                'telemetry/instana': {
                    "AgentHost": "localhost",
                    "AgentPort": 46999,
                    "Service": "krakend"
                },
                'telemetry/ganalytics': {
                    "track_id": "UA-12345678-9",
                    "url": "https://www.google-analytics.com/batch",
                    "buffer_size": 1000,
                    "workers": 5,
                    "timeout": "250ms",
                    "tags": {}
                },
                "backend/amqp/producer": {
                    "exchange": "some-exchange",
                    "durable": true,
                    "delete": false,
                    "exclusive": false,
                    "no_wait": true,
                    "mandatory": true,
                    "immediate": false
                },
                "backend/amqp/consumer": {
                    "name": "queue-1",
                    "exchange": "some-exchange",
                    "durable": true,
                    "delete": false,
                    "exclusive": false,
                    "no_wait": true,
                    "no_local": false,
                    "routing_key": ["#"],
                    "prefetch_count": 10
                },
                "backend/graphql": {
                    "type": "query",
                    "operationName": "addMktPreferencesForUser",
                    "variables": {}
                },
                // // Endpoint level middleware
                'qos/ratelimit/router': {
                    "max_rate": 0,
                    "client_max_rate": 0,
                    "strategy": "ip",
                    "capacity": 0,
                    "client_capacity": 0
                },
                'auth/signer': {
                    "alg": "HS256"
                },
                'auth/validator': {
                    "alg": "HS256"
                },
                'auth/api-keys': {
                    "keys": []
                },
                'qos/circuit-breaker': {
                    "interval": 60,
                    "name": "circuit-breaker-1",
                    "timeout": 10,
                    "max_errors": 1,
                    "log_status_change": true
                },
                'qos/http-cache': {
                    "shared": true
                },
                "documentation/openapi": {
                    "version": "1.0"
                },
                "websocket": {
                    "input_headers": ["*"],
                    "connect_event": true,
                    "disconnect_event": true,
                    "read_buffer_size": 1024,
                    "write_buffer_size": 1024,
                    "message_buffer_size": 256,
                    "max_message_size": 512,
                    "write_wait": "10s",
                    "pong_wait": "60s",
                    "ping_period": "54s",
                    "max_retries": 0,
                    "backoff_strategy": "exponential"
                },
                "modifier/jmespath": {
                    "expr": "people[?age > `20`].[name, age]"
                }
            },
            "plugin/http-server": {
                "static-filesystem": {
                    "prefix": "/media/assets",
                    "path": "/var/www/static"
                }
            }
        };
    });