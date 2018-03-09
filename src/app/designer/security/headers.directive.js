angular
.module('KrakenDesigner')
.directive("securityHeaders", function() {
    return {
        restrict : "E",
        templateUrl: '/js/app/designer/security/headers.html',
        scope: {
            data: '=',
            inherit: "="
        },
        link: function(scope, element, attrs) {

            var default_httpsecure_fields = {
                "disable": true,
                "allowed_hosts": [],
                "ssl_proxy_headers": {}
            }

            var HTTPSECURE_NS = 'github_com/devopsfaith/krakend-httpsecure';

            // Create extra_config namespace with default data and merge with existing content:
            scope.data.extra_config = Object.assign({}, scope.data.extra_config );

            // Inherited configuration passed, use when empty:
            if ( 'object' == typeof scope.inherit ) {
                HTTPSECURE_NS = HTTPSECURE_NS.replace('github_com', 'github.com');
                scope.data.extra_config[HTTPSECURE_NS] = angular.copy( Object.assign(default_httpsecure_fields, scope.inherit, scope.data.extra_config[HTTPSECURE_NS] ) );
            } else {
                scope.data.extra_config[HTTPSECURE_NS] = angular.copy( Object.assign(default_httpsecure_fields, scope.data.extra_config[HTTPSECURE_NS] ) );
            }

            // Easier access for the template:
            scope.config_namespace = HTTPSECURE_NS;

            scope.addAllowedHosts = function(term) {
                if ( scope.data.extra_config[HTTPSECURE_NS].allowed_hosts.indexOf(term) === -1 ) {
                    scope.data.extra_config[HTTPSECURE_NS].allowed_hosts.push(term);
                }
            }

            scope.deleteAllowedHosts = function(index) {
                scope.data.extra_config[HTTPSECURE_NS].allowed_hosts.splice(index, 1);
            }

            scope.addSSLHeader = function (header,value) {
                if (header.length > 0 && value.length > 0) {
                    scope.data.extra_config[HTTPSECURE_NS].ssl_proxy_headers[header] = value;
                }
            };

            scope.deleteSSLHeader = function (header) {
                delete scope.data.extra_config[HTTPSECURE_NS].ssl_proxy_headers[header];
            };
        }
    }
});