angular
.module('KrakenDesigner')
.directive("middleware", ['InputValidator', 'DefaultConfig', function(InputValidator,DefaultConfig) {
  return {
    restrict : "E",
    template: '<div ng-include="getTemplate()"></div>',
    scope: {
      data: '=',
      inherit: '=', // Pass an object where the namespace is already declared and will be used as base
      namespace: '=' // e.g: github_com/devopsfaith/krakend-ratelimit/juju/router
    },
    link: function(scope, element, attrs) {


      var NAMESPACE = scope.namespace;
      var default_data = {};

      // Load default values from default_config.service.js when present:
      if (undefined !== DefaultConfig.extra_config[NAMESPACE]) {
        default_data = DefaultConfig.extra_config[NAMESPACE];
      }

      // Create extra_config key and merge with existing content:
      scope.data.extra_config = Object.assign({}, scope.data.extra_config );

      // Inherited configuration passed, use when empty:
      if( 'object' == typeof scope.inherit ) {
        NAMESPACE = NAMESPACE.replace('github_com', 'github.com');
        scope.data.extra_config[NAMESPACE] = angular.copy( Object.assign(default_data, scope.inherit, scope.data.extra_config[NAMESPACE] ) );
      } else {
        scope.data.extra_config[NAMESPACE] = angular.copy( Object.assign(default_data, scope.data.extra_config[NAMESPACE] ) );
      }

      // Easier access for the template:
      scope.config_namespace = NAMESPACE;
      scope.validator = InputValidator;

      scope.getTemplate = function() {
        return '/src/app/middlewares/' + attrs.template;
      }
    }
  }
}]);
