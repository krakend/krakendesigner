angular
.module('KrakenDesigner')
.directive("securityHeaders", function() {
    return {
        restrict : "E",
        templateUrl: '/src/app/security/headers.html',
        scope: {
            data: '=',
            inherit: "="
        },
        link: function(scope, element, attrs) {

            var default_httpsecure_fields = {
                "allowed_hosts": [],
                "ssl_proxy_headers": {}
            }

            var NAMESPACE = 'github_com/devopsfaith/krakend-httpsecure';

            // Create extra_config namespace with default data and merge with existing content:
            scope.data.extra_config = Object.assign({}, scope.data.extra_config );

            // Inherited configuration passed, use when empty:
            if ( 'object' == typeof scope.inherit ) {
                NAMESPACE = NAMESPACE.replace('github_com', 'github.com');
                scope.data.extra_config[NAMESPACE] = angular.copy( Object.assign(default_httpsecure_fields, scope.inherit, scope.data.extra_config[NAMESPACE] ) );
            } else {
                scope.data.extra_config[NAMESPACE] = angular.copy( Object.assign(default_httpsecure_fields, scope.data.extra_config[NAMESPACE] ) );
            }

            // Easier access for the template:
            scope.config_namespace = NAMESPACE;

            scope.addAllowedHosts = function(term) {
                if ( scope.data.extra_config[NAMESPACE].allowed_hosts.indexOf(term) === -1 ) {
                    scope.data.extra_config[NAMESPACE].allowed_hosts.push(term);
                }
            }

            scope.deleteAllowedHosts = function(index) {
                scope.data.extra_config[NAMESPACE].allowed_hosts.splice(index, 1);
            }

            scope.addSSLHeader = function (header,value) {
                if (header.length > 0 && value.length > 0) {
                    scope.data.extra_config[NAMESPACE].ssl_proxy_headers[header] = value;
                }
            };

            scope.deleteSSLHeader = function (header) {
                delete scope.data.extra_config[NAMESPACE].ssl_proxy_headers[header];
            };

            scope.isMiddlewareEnabled = function() {
                if ( 'undefined' === typeof scope.data.extra_config[NAMESPACE] )
                {
                    return false;
                }
                return true;
            }

            // Destroy middleware or create it with default data:
            scope.toggleMiddleware = function () {
                if ( scope.isMiddlewareEnabled() ) {
                    delete scope.data.extra_config[NAMESPACE];
                } else {
                    scope.data.extra_config[NAMESPACE] = default_httpsecure_fields;
                }
            }
        }
    }
});