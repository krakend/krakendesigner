angular
.module('KrakenDesigner')
.directive("metrics", function() {
    return {
        restrict : "E",
        templateUrl: '/src/app/metrics/metrics.html',
        scope: {
            data: '=',
            inherit: '='
        },
        link: function(scope, element, attrs) {

            var default_opencensus_settings = {
             "collection_time": "60s",
             "proxy_disabled": false,
             "router_disabled": false,
             "backend_disabled": false,
             "endpoint_disabled": false,
             "listen_address": ":8090"
         }

         var NAMESPACE = 'github_com/devopsfaith/krakend-metrics';

            // Create extra_config namespace with default data and merge with existing content:
            scope.data.extra_config = Object.assign({}, scope.data.extra_config );


            // Easier access for the template:
            scope.config_namespace = NAMESPACE;

            scope.isMiddlewareEnabled = function() {
                if ( 'undefined' === typeof scope.data.extra_config[NAMESPACE] )
                {
                    return false;
                }
                return true;
            }

            scope.toggleMetricsMiddleware = function (enable) {
                if (enable) {

                    scope.data.extra_config[NAMESPACE] = default_opencensus_settings;
                }
                else
                {
                    delete scope.data.extra_config[NAMESPACE];
                }
            }

            scope.isValidTimeUnit = function (time_with_unit) {

                return (
                    'undefined' === typeof time_with_unit ||
                    '' == time_with_unit ||
                    /^\d+(ns|us|µs|ms|s|m|h)$/.test(time_with_unit)
                    );
            };
        }
    }
});