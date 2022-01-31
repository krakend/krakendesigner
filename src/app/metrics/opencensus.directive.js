angular
.module('KrakenDesigner')
.directive("opencensus", function() {
    return {
        restrict : "E",
        templateUrl: '/src/app/metrics/opencensus.html',
        scope: {
            data: '=',
            inherit: '='
        },
        link: function(scope, element, attrs) {

            var default_opencensus_settings = {
                "sample_rate": 100,
                "reporting_period": 1,
                "exporters": {}

            }

            var NAMESPACE = 'telemetry/opencensus';

            // Create extra_config namespace with default data and merge with existing content:
            scope.data.extra_config = Object.assign({}, scope.data.extra_config );


            // Easier access for the template:
            scope.config_namespace = NAMESPACE;


            scope.isMiddlewareEnabled = function() {
                return !( 'undefined' === typeof scope.data.extra_config[NAMESPACE] );
            }

            scope.toggleOpencensusMiddleware = function () {
                if ( scope.isMiddlewareEnabled() ) {
                    delete scope.data.extra_config[NAMESPACE];
                } else {
                    scope.data.extra_config[NAMESPACE] = default_opencensus_settings;
                }
            }

            scope.toggleXRayAuth = function() {
                // Destroy
                if ( 'undefined' !== typeof scope.data.extra_config[NAMESPACE].exporters.xray.access_key_id ) {
                    delete scope.data.extra_config[NAMESPACE].exporters.xray.access_key_id;
                    delete scope.data.extra_config[NAMESPACE].exporters.xray.secret_access_key;
                } else {
                    scope.data.extra_config[NAMESPACE].exporters.xray.access_key_id = '';
                    scope.data.extra_config[NAMESPACE].exporters.xray.secret_access_key = '';
                }
            }

            scope.backendIsEnabled = function(metric) {
                return scope.isMiddlewareEnabled() && 'undefined' !== typeof scope.data.extra_config[NAMESPACE].exporters && 'undefined' !== typeof scope.data.extra_config[NAMESPACE].exporters[metric];
            }

            scope.toggleOpencensusBackend = function (metric) {

                if (scope.backendIsEnabled(metric)) {
                    delete scope.data.extra_config[NAMESPACE].exporters[metric];

                    // If this is the last metric delete the whole module to leave config clean:
                    if (!Object.keys(scope.data.extra_config[NAMESPACE].exporters).length)
                    {
                        delete scope.data.extra_config[NAMESPACE];
                    }
                }
                else
                {
                    scope.data.extra_config[NAMESPACE].exporters[metric] = {};
                }
            }

            scope.addStackDriverLabel = function(key,value) {
                if ( undefined === typeof key || undefined === typeof value  ) {
                    alert("Label name and value must be declared");
                    return false;
                }

                if ( 'undefined' === typeof scope.data.extra_config[NAMESPACE].exporters.stackdriver.default_labels ) {
                    scope.data.extra_config[NAMESPACE].exporters.stackdriver.default_labels = {};
                }

                scope.data.extra_config[NAMESPACE].exporters.stackdriver.default_labels[key] = value;
            }

            scope.deleteStackDriverLabel = function(key) {
                delete scope.data.extra_config[NAMESPACE].exporters.stackdriver.default_labels[key];
            }

            scope.addOcagentHeader = function(key,value) {
                if ( 'undefined' === typeof scope.data.extra_config[NAMESPACE].exporters.ocagent.headers ) {
                    scope.data.extra_config[NAMESPACE].exporters.ocagent.headers = {};
                }

                scope.data.extra_config[NAMESPACE].exporters.ocagent.headers[key] = value;
            }

            scope.deleteOcagentHeader = function(key) {
                delete scope.data.extra_config[NAMESPACE].exporters.ocagent.headers[key];
            }
            
            scope.addDatadogTag = function(tag, is_global = false) {
                tag_type = is_global ? "global_tags" : "tags";

                if ( 'undefined' === typeof tag || tag.length < 1 ) {
                  return;
                }
               
                if ( 'undefined' === typeof scope.data.extra_config[NAMESPACE].exporters.datadog[tag_type] )
                {
                  scope.data.extra_config[NAMESPACE].exporters.datadog[tag_type] = [];
                }
          
          
                if ( scope.data.extra_config[NAMESPACE].exporters.datadog[tag_type].indexOf(tag) === -1 ) {
                  scope.data.extra_config[NAMESPACE].exporters.datadog[tag_type].push(tag);
                }
              }
          
            scope.deleteDatadogTag = function(tag, is_global = false) {
                 tag_type = is_global ? "global_tags" : "tags";
                 scope.data.extra_config[NAMESPACE].exporters.datadog[tag_type].splice(index, 1);
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