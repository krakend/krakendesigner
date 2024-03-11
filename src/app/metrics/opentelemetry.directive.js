angular
.module('KrakenDesigner')
.directive("opentelemetry", function() {
    return {
        restrict : "E",
        templateUrl: '/src/app/metrics/opentelemetry.html',
        scope: {
            data: '=',
            inherit: '='
        },
        link: function(scope, element, attrs) {

            var default_opentelemetry_settings = {
                "trace_sample_rate": 0.25,
                "metric_reporting_period": 1,
                "exporters": {},
                "layers": {
                    "global": {
                        "disable_metrics": false,
                        "disable_traces": false,
                        "disable_propagation": false
                    },
                    "proxy": {
                        "disable_metrics": false,
                        "disable_traces": false
                    },
                    "backend": {
                        "metrics": {
                            "disable_stage": false,
                            "round_trip": false,
                            "read_payload": false,
                            "detailed_connection": false,
                            "static_attributes": []
                        },
                        "traces": {
                            "disable_stage": false,
                            "round_trip": false,
                            "read_payload": false,
                            "detailed_connection": false,
                            "static_attributes": []
                        }
                    }
                },

            }

            var default_exporter_settings = {
                "otlp": {
                    "name": "otlp_exporter",
                    "host": "otlp.yourprovider.net",
                    "port": 4317,
                    "use_http": false,
                    "disable_metrics": false,
                    "disable_traces": false
                },
                "prometheus": {
                    "name": "prometheus_exporter",
                    "port": 9090
                }
            };

            var NAMESPACE = 'telemetry/opentelemetry';

            // Create extra_config namespace with default data and merge with existing content:
            scope.data.extra_config = Object.assign({}, scope.data.extra_config );


            // Easier access for the template:
            scope.config_namespace = NAMESPACE;


            scope.isMiddlewareEnabled = function() {
                return !( 'undefined' === typeof scope.data.extra_config[NAMESPACE] );
            }

            scope.toggleOpenTelemetryMiddleware = function () {
                if ( scope.isMiddlewareEnabled() ) {
                    delete scope.data.extra_config[NAMESPACE];
                } else {
                    scope.data.extra_config[NAMESPACE] = default_opentelemetry_settings;
                }
            }

            scope.addExporter = function (exporter) {
                if ( 'undefined' === typeof scope.data.extra_config[NAMESPACE].exporters ) {
                    scope.data.extra_config[NAMESPACE].exporters = {};
                }

                if ( 'undefined' === typeof scope.data.extra_config[NAMESPACE].exporters[exporter] ) {
                    scope.data.extra_config[NAMESPACE].exporters[exporter] = [];
                }
                scope.data.extra_config[NAMESPACE].exporters[exporter].push(default_exporter_settings[exporter]);
            }

            scope.deleteExporter = function(index,exporter) {
                 scope.data.extra_config[NAMESPACE].exporters[exporter].splice(index, 1);
                 if ( 0 == scope.data.extra_config[NAMESPACE].exporters[exporter].length ) {
                    delete scope.data.extra_config[NAMESPACE].exporters[exporter];
                 }
            }
        }
    }
});