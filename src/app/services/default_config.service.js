angular
    .module('KrakenDesigner')
    .service("DefaultConfig", function () {
        return {
            service: {
                $schema: "https://www.krakend.io/schema/v3.json",
                version: 3,
                extra_config: {},
                timeout: '3000ms',
                cache_ttl: '300s'
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
                'github_com/devopsfaith/krakend-oauth2-clientcredentials': {
                    "endpoint_params": {}
                },
                'security/http': {
                    "allowed_hosts": [],
                    "ssl_proxy_headers": {}
                },
                'github_com/devopsfaith/krakend-etcd': {
                    "machines": [],
                    "dial_timeout": "5s",
                    "dial_keepalive": "30s",
                    "header_timeout": "1s"
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
<<<<<<< HEAD
                'github_com/devopsfaith/krakend-instana': {
                    "AgentHost": "localhost",
                    "AgentPort": 46999,
                    "Service": "krakend"
                },
                "github.com/devopsfaith/krakend-amqp/produce": {
=======
                "backend/amqp/producer": {
>>>>>>> master
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
            }
        };
    });