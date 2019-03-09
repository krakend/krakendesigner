angular
    .module('KrakenDesigner')
    .service("DefaultConfig", function () {
        return {
            service: {
                version: 2,
                extra_config: {}
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
                    "allow_methods": [
                        "GET",
                        "HEAD",
                        "POST"
                    ]
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
                }
            }
        };
    });