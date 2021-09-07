angular
    .module('KrakenDesigner')
    .service("DefaultConfig", function () {
        return {
            service: {
                version: 2,
                extra_config: {},
                timeout: '3000ms',
                cache_ttl: '300s'
            },
            // Default middleware config
            extra_config: {
                // Service level middleware (github_com)
                'github_com/devopsfaith/krakend-metrics': {
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
                'github_com/devopsfaith/krakend-httpsecure': {
                    "allowed_hosts": [],
                    "ssl_proxy_headers": {}
                },
                'github_com/devopsfaith/krakend-etcd': {
                    "machines": [],
                    "dial_timeout": "5s",
                    "dial_keepalive": "30s",
                    "header_timeout": "1s"
                },
                'github_com/devopsfaith/krakend-gologging': {
                    "level": "ERROR",
                    "prefix": "[KRAKEND]",
                    "syslog": false,
                    "stdout": true,
                    "format": "default"
                },
                'github_com/devopsfaith/krakend-cors': {
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
                "github.com/devopsfaith/krakend-amqp/produce": {
                    "exchange":       "some-exchange",
                    "durable":        true,
                    "delete":         false,
                    "exclusive":      false,
                    "no_wait":        true,
                    "mandatory": true,
                    "immediate": false
                },
                "github.com/devopsfaith/krakend-amqp/consume": {
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
                // // Endpoint level middleware (github.com)
                'github.com/devopsfaith/krakend-ratelimit/juju/router': {
                    "maxRate": 0,
                    "clientMaxRate": 0,
                    "strategy": "ip"
                },
                'github.com/devopsfaith/krakend-jose/signer': {
                    "alg": "HS256"
                },
                'github.com/devopsfaith/krakend-jose/validator': {
                    "alg": "HS256"
                },
                'github.com/devopsfaith/krakend-circuitbreaker/gobreaker': {
                    "interval": 60,
                    "name": "circuit-breaker-1",
                    "timeout": 10,
                    "maxErrors": 1,
                    "logStatusChange": true
                }
            }
        };
    });