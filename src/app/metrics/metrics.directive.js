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

            var default_metrics_settings = {
                "sample_rate": 100,
                "reporting_period": 1,
                "exporters": {}

            }

            var NAMESPACE = 'github_com/devopsfaith/krakend-opencensus';

            // Create extra_config namespace with default data and merge with existing content:
            scope.data.extra_config = Object.assign({}, scope.data.extra_config );


            // Easier access for the template:
            scope.config_namespace = NAMESPACE;

            scope.shouldShowSettings = function() {
                if ( 'undefined' === typeof scope.data.extra_config[NAMESPACE] )
                {
                    return false;
                }
            }

            scope.toggleMetricsBackend = function (isEnabled, metric) {

                if ( 'undefined' === typeof scope.data.extra_config[NAMESPACE])
                {
                    scope.data.extra_config[NAMESPACE] = default_metrics_settings;
                }


                if (isEnabled) {
                    scope.data.extra_config[NAMESPACE].exporters[metric] = {};
                }
                else
                {
                    delete scope.data.extra_config[NAMESPACE].exporters[metric];

                    // If this is the last metric delete the whole module to leave config clean:
                    if (!scope.shouldShowSettings())
                    {
                        delete scope.data.extra_config[NAMESPACE];
                        console.log({"GOODBYE ---": scope.data.extra_config});
                    }
                }
            }
        }
    }
});