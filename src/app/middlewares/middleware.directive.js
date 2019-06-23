angular
.module('KrakenDesigner')
.directive("middleware", ['InputValidator', 'DefaultConfig', 'Constants', function(InputValidator,DefaultConfig,Constants) {
  return {
    restrict : "E",
    template: '<div ng-include="getTemplate()"></div>',
    scope: {
      data: '=',
      inherit: '=', // Pass an object where the namespace is already declared and will be used as base
      namespace: '=' // e.g: github_com/devopsfaith/krakend-ratelimit/juju/router
    },
    link: function(scope, element, attrs) {

      if ( 'undefined' === typeof scope.data) {
        return;
      }

      var NAMESPACE = scope.namespace;
      var default_middleware_data = {};

      // Load default values from default_config.service.js when present:
      if ( 'undefined' !== typeof DefaultConfig.extra_config[NAMESPACE]) {
        default_middleware_data = DefaultConfig.extra_config[NAMESPACE];
      }

      // Create extra_config key and merge with existing content:
      scope.data.extra_config = Object.assign({}, scope.data.extra_config );

      // Inherited configuration passed, use when empty:
      if( 'object' == typeof scope.inherit ) {
        NAMESPACE = NAMESPACE.replace('github_com', 'github.com');
        scope.data.extra_config[NAMESPACE] = angular.copy( Object.assign(default_middleware_data, scope.inherit, scope.data.extra_config[NAMESPACE] ) );
      }

      // Easier access for the template:
      scope.config_namespace = NAMESPACE;
      scope.validator = InputValidator;
      scope.constants = Constants;

      scope.getTemplate = function() {
        return '/src/app/middlewares/' + attrs.template;
      }

       // Destroy middleware or create it with default data:
       scope.toggleMiddleware = function () {
        if ( scope.isMiddlewareEnabled() ) {
          delete scope.data.extra_config[NAMESPACE];
        } else {
          scope.data.extra_config[NAMESPACE] = default_middleware_data;
        }
      }

      scope.isMiddlewareEnabled = function() {
        return !( 'undefined' === typeof scope.data.extra_config[NAMESPACE] );
      }

      scope.addKeyPair = function (key, value, in_object = false) {
        if (in_object) {
          scope.data.extra_config[NAMESPACE][in_object][key] = value;
        } else {
         scope.data.extra_config[NAMESPACE][key] = value;
       }
     }

     scope.deleteKey = function (key,  in_object = false) {
      if ( in_object )
      {
        delete scope.data.extra_config[NAMESPACE][in_object][key];
      } else {
        delete scope.data.extra_config[NAMESPACE][key];
      }
    }

    scope.addTermToList = function(term, list) {
      if ( 'undefined' === typeof term || term.length < 1 ) {
        return;
      }

      if ( 'undefined' === typeof scope.data.extra_config[NAMESPACE][list] )
      {
        scope.data.extra_config[NAMESPACE][list] = [];
      }


      if ( scope.data.extra_config[NAMESPACE][list].indexOf(term) === -1 ) {
        scope.data.extra_config[NAMESPACE][list].push(term);
      }
    }

    scope.deleteIndexFromList = function(index,list) {
      scope.data.extra_config[NAMESPACE][list].splice(index, 1);
    }
  }
}
}]);
