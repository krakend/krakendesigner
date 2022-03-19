angular
    .module('KrakenDesigner')
    .service("DefaultConfig", function () {
        return {
            service: {
                $schema: "https://www.krakend.io/schema/v3.json",
                version: 3,
                name: 'My gateway',
                extra_config: {},
                timeout: '3000ms',
                cache_ttl: '300s'
            },
            // Default plugin
            plugin: {
                "pattern":".so",
                "folder": "/opt/krakend/plugins/"
            },
            // Default middleware config
            extra_config: {
                // Service level middleware (github_com)
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
                    "format": "default"
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
                "backend/amqp/producer": {
                    "exchange":       "some-exchange",
                    "durable":        true,
                    "delete":         false,
                    "exclusive":      false,
                    "no_wait":        true,
                    "mandatory": true,
                    "immediate": false
                },
                "backend/amqp/consumer": {
                    "name":           "queue-1",
                    "exchange":       "some-exchange",
                    "durable":        true,
                    "delete":         false,
                    "exclusive":      false,
                    "no_wait":        true,
                    "no_local":       false,
                    "routing_key":    ["#"],
                    "prefetch_count": 10
                },
                "backend/graphql": {
                    "type": "query",
                    "operationName": "addMktPreferencesForUser",
                    "variables":      {}
                },
                // // Endpoint level middleware (github.com)
                'qos/ratelimit/router': {
                    "max_rate": 0,
                    "client_max_rate": 0,
                    "strategy": "ip"
                },
                'auth/signer': {
                    "alg": "HS256"
                },
                'auth/validator': {
                    "alg": "HS256"
                },
                'qos/circuit-breaker': {
                    "interval": 60,
                    "name": "circuit-breaker-1",
                    "timeout": 10,
                    "max_errors": 1,
                    "log_status_change": true
                }
            },
            "plugin/http-server": {
                "krakend-static-live": {
                    "prefix": "/media/assets",
                    "path": "./../../"
                }
            }
        };
    });