angular
.module('KrakenDesigner')
.directive("oauth", function() {
    return {
        restrict : "E",
        templateUrl: '/js/app/designer/security/oauth.html',
        scope: {
            data: '=',
            inherit: '='
        },
        link: function(scope, element, attrs) {

            var default_oauth_settings = {
                "is_disabled": true,
                "endpoint_params": {}
            }

            var NAMESPACE = 'github_com/devopsfaith/krakend-oauth2-clientcredentials';

            // Create extra_config namespace with default data and merge with existing content:
            scope.data.extra_config = Object.assign({}, scope.data.extra_config );

            // Not in root as "version" field does not exist. Setting a children, inherit when possible:
            if ( 'undefined' == typeof scope.data.version || 'object' == typeof scope.inherit ) {
                NAMESPACE = NAMESPACE.replace('github_com', 'github.com');
                scope.data.extra_config[NAMESPACE] = angular.copy( Object.assign(default_oauth_settings, scope.inherit, scope.data.extra_config[NAMESPACE] ) );
            } else {
                scope.data.extra_config[NAMESPACE] = angular.copy( Object.assign(default_oauth_settings, scope.data.extra_config[NAMESPACE] ) );
            }

            // Easier access for the template:
            scope.config_namespace = NAMESPACE;

            scope.addOAuthParameters = function (parameter,value) {
                if (parameter.length > 0) {
                    scope.data.extra_config[NAMESPACE].endpoint_params[parameter] = value;
                }
            };

            scope.deleteOAuthParameters = function (parameter) {
                delete scope.data.extra_config[NAMESPACE].endpoint_params[parameter];
            };



        }
    }
});