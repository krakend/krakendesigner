angular.module("KrakenDesigner").directive("service", [
  "InputValidator",
  "DefaultConfig",
  "Constants",
  function(InputValidator, DefaultConfig, Constants) {
    return {
      restrict: "E",
      template: '<div ng-include="getTemplate()"></div>',
      scope: {
        data: "="
      },
      link: function(scope, element, attrs) {
        scope.getTemplate = function() {
          return '/src/app/service/' + attrs.template;
        }

        scope.hasTLS = function() {
          if ("undefined" === typeof scope.data.tls) {
            return false;
          }
          return true;
        };

        scope.toggleTLS = function() {
          if (!scope.hasTLS()) {
            scope.data.tls = {
              public_key: "/path/to/cert.pem",
              private_key: "/path/to/key.pem"
            };
          } else {
            delete scope.data.tls;
          }
        };
      }
    };
  }
]);
