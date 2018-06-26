angular
.module('KrakenDesigner')
.service("DefaultConfig", function () {
    return {
        service: {
            version: 2,
            extra_config: {
                'github_com/devopsfaith/krakend-gologging': {
                    level:  "ERROR",
                    prefix: "[KRAKEND]",
                    syslog: false,
                    stdout: true
                }
            }
        },
        // Default middleware config
        extra_config: {
            'github_com/devopsfaith/krakend-ratelimit/juju/router': {
                "maxRate": 0,
                "clientMaxRate": 0,
                "strategy": "ip"
            }
        }
    };
});