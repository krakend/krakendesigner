angular
  .module('KrakenDesigner')
  .directive("apikey", ['InputValidator', 'DefaultConfig', 'Constants', function (InputValidator, DefaultConfig, Constants) {
    return {
      restrict: "E",
      template: '<div ng-include="getTemplate()"></div>',
      scope: {
        data: '=',
        inherit: '=', // Pass an object where the namespace is already declared and will be used as base
        namespace: '='
      },
      link: function (scope, element, attrs) {

        if ('undefined' === typeof scope.data) {
          return;
        }

        var NAMESPACE = scope.namespace;
        var default_middleware_data = {};

        // Copy default values from default_config.service.js when present:
        if ('undefined' !== typeof DefaultConfig.extra_config[NAMESPACE]) {
          default_middleware_data = Object.assign({}, DefaultConfig.extra_config[NAMESPACE]);
        }

        // Create extra_config key and merge with existing content:
        scope.data.extra_config = Object.assign({}, scope.data.extra_config);

        // Inherited configuration passed, use when empty:
        if ('object' == typeof scope.inherit) {
          scope.data.extra_config[NAMESPACE] = angular.copy(Object.assign(default_middleware_data, scope.inherit, scope.data.extra_config[NAMESPACE]));
        }

        // Easier access for the template:
        scope.config_namespace = NAMESPACE;
        scope.validator = InputValidator;
        scope.constants = Constants;



        scope.getTemplate = function () {
          return '/src/app/middlewares/' + attrs.template;
        }

        // Destroy middleware or create it with default data:
        scope.toggleMiddleware = function () {
          if (scope.isMiddlewareEnabled()) {
            delete scope.data.extra_config[NAMESPACE];
          } else {
            if ('undefined' === typeof scope.data.extra_config) {
              scope.data.extra_config = {};
            }
            scope.data.extra_config[NAMESPACE] = default_middleware_data;
          }
        }

        scope.isMiddlewareEnabled = function () {
          return !('undefined' === typeof scope.data.extra_config || 'undefined' === typeof scope.data.extra_config[NAMESPACE]);
        }

        scope.addTermToList = function (term, list) {
          if ('undefined' === typeof term || term.length < 1) {
            return;
          }

          if ('undefined' === typeof scope.data.extra_config[NAMESPACE][list]) {
            scope.data.extra_config[NAMESPACE][list] = [];
          }


          if (scope.data.extra_config[NAMESPACE][list].indexOf(term) === -1) {
            scope.data.extra_config[NAMESPACE][list].push(term);
          }
        }

        scope.deleteIndexFromList = function (index, list) {
          scope.data.extra_config[NAMESPACE][list].splice(index, 1);
        }

        scope.uuidgen = function () {
          return crypto.randomUUID();
        }

        scope.addAPIKey = function (key, roles, description) {

          if (!roles.length) {
            alert("You must assign at least one role to every key");
            return false;
          }

          // Copy the values in the form without reference
          scope.data.extra_config[NAMESPACE].keys.push(
            {
              "key": angular.copy(key),
              "roles": angular.copy(roles),
              "@description": angular.copy(description)
            }
          );
        }

        scope.addRole = function (role) {
          if (role && scope.selected_roles.indexOf(role) === -1) {
            scope.selected_roles.push(role);
          }
        }

        scope.selectRole = function (index) {
          scope.selected_roles.push(scope.roles[index]);
          scope.roles.splice(index, 1);
        }

        scope.deselectRole = function (index) {
          scope.roles.push(scope.selected_roles[index]);
          scope.selected_roles.splice(index, 1);
        }

        scope.initRoles = function () {
          scope.key = scope.uuidgen();
          if ('undefined' === typeof scope.roles) {
            // All roles selected for the new key:
            scope.selected_roles = [];

            // All roles available for choosing:
            scope.roles = [];

            if ('undefined' !== typeof scope.data.extra_config[NAMESPACE] && 'undefined' !== typeof scope.data.extra_config[NAMESPACE].keys) {
              for (i = 0; i < scope.data.extra_config[NAMESPACE].keys.length; i++) {
                if ('undefined' !== typeof scope.data.extra_config[NAMESPACE].keys[i].roles) {
                  roles = scope.data.extra_config[NAMESPACE].keys[i].roles;
                  for (r = 0; r < scope.data.extra_config[NAMESPACE].keys[i].roles.length; r++) {
                    role = scope.data.extra_config[NAMESPACE].keys[i].roles[r];
                    if (scope.roles.indexOf(role) === -1) {
                      scope.roles.push(role);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }]);
