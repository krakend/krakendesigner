angular
  .module('KrakenDesigner')
  .directive("plugin", ['InputValidator', 'DefaultConfig', 'Constants', function (InputValidator, DefaultConfig, Constants) {
    return {
      restrict: "E",
      template: '<div ng-include="getTemplate()"></div>',
      scope: {
        root: '=',  // The configuration root object, MUST pass "service" at all times.
        placement: '=', // The object where the plugin is injected (endpoint, backend or service).
        plugin: '=', // e.g: krakend-ipfilter
        type: '=' // e.g: plugin/http-server
      },
      link: function (scope, element, attrs) {
        if ('undefined' === typeof scope.root) {
          return;
        }

        var PLUGIN = scope.plugin;
        var TYPE = scope.type;


        // Easier access for the template:
        scope.plugin_type = TYPE;
        scope.plugin_name = PLUGIN;
        scope.data = scope.placement;
        scope.validator = InputValidator;
        scope.constants = Constants;

        scope.getTemplate = function () {
          return '/src/app/plugins/' + attrs.template;
        }

        // Gets an object relative to the configuration placement.
        // First element is the object to search
        scope.getObject = function (args) {
          obj = arguments[0];
          for (var i = 1; obj && i < arguments.length; ++i) {
            if ('undefined' === typeof obj[arguments[i]]) {
              return null;
            }
            obj = obj[arguments[i]];
          }
          return obj;
        };

        // First element is the object to set
        scope.setObject = function (args) {
          obj = arguments[0];
          for (var i = 1; obj && i < arguments.length; ++i) {
            // Last two elements are the final key + value
            if (i >= arguments.length - 2) {
              obj[arguments[i]] = arguments[i + 1];
              break;
            }
            else {
              if ('undefined' === typeof obj[arguments[i]]) {
                obj[arguments[i]] = {};
              }
              obj = obj[arguments[i]];
            }
          }
        };

        scope.addTermToList = function (term, container, list) {
          if ('undefined' === typeof term || term.length < 1) {
            return;
          }

          if ('undefined' === typeof container[list]) {
            container[list] = [];
          }

          if (container[list].indexOf(term) === -1) {
            container[list].push(term);
          }
        }

        scope.deleteTermFromList = function (term, container, list) {

          if ("undefined" !== typeof container[list]) {
            index = container[list].indexOf(term);
            if (-1 !== index) {
              container[list].splice(index, 1);
            }

            // Delete the container[list] when empty
            if (0 == container[list].length) {
              delete container[list];
            }
          }
        };

        scope.getDefaultValues = function () {
          default_plugin_values = {};
          // Copy default values from default_config.service.js when present:
          if ('undefined' !== typeof DefaultConfig.plugins[TYPE][PLUGIN]) {
            default_plugin_values = Object.assign({}, DefaultConfig.plugins[TYPE][PLUGIN]);
          }

          return default_plugin_values;
        };

        scope.hasHttpServerPlugin = function () {
          plugins = scope.getObject(scope.placement, "extra_config", TYPE, "name");
          return (plugins && -1 !== plugins.indexOf(PLUGIN));
        };

        scope.toggleHttpServerPlugin = function () {
          scope.hasHttpServerPlugin() ? scope.deleteHttpServerPlugin(scope.placement) : scope.addHttpServerPlugin(scope.placement);
        };


        scope.addHttpClientPlugin = function (backend_index) {
          scope.addPluginEntry();
          // Set the plugin in the first Backend.
          scope.setObject(
            scope.placement, "backend", backend_index, "extra_config", "plugin/http-client", "name", PLUGIN
          );
        };

        // Adds an HTTP server in endpoint or service context (placement)
        scope.addHttpServerPlugin = function (where) {
          scope.addPluginEntry();
          // Has extra_config?:
          if ('undefined' === typeof where.extra_config) {
            where.extra_config = {};
          }

          // Has plugins of type server?:
          if ('undefined' === typeof where.extra_config[TYPE]) {
            where.extra_config[TYPE] = {
              "name": [PLUGIN]
            }
          }

          // Has this plugin in the list
          if (where.extra_config[TYPE].name.indexOf(PLUGIN) === -1) {
            where.extra_config[TYPE].name.push(PLUGIN);
          }

          where.extra_config[TYPE][PLUGIN] = scope.getDefaultValues();
        };

        scope.deleteHttpServerPlugin = function (where) {

          // Delete plugin from "name" list:
          index = where.extra_config[TYPE].name.indexOf(PLUGIN);
          if (index > -1) {
            where.extra_config[TYPE].name.splice(index);
          }
          // Delete plugin configuration:
          delete where.extra_config[TYPE][PLUGIN];

          // Delete all http-server plugins if it's the last
          if (0 == where.extra_config[TYPE].name.length) {
            delete where.extra_config[TYPE];
          }

          scope.deletePluginEntryWhenSafe();
        };

        scope.addPluginEntry = function () {
          if ('undefined' === typeof scope.root.plugin) {
            scope.root.plugin = DefaultConfig.plugin;
          }
        };

        scope.deletePluginEntryWhenSafe = function () {
          config = JSON.stringify(scope.root);
          plugin_patterns = [
            "plugin/http-server",
            "plugin/http-client",
            "plugin/req-resp-modifier"
          ]

          for (i = 0; i < plugin_patterns.length; i++) {
            if (null !== config.match(plugin_patterns[i])) {
              return false;
            }
          }

          // No plugins declared anywhere, delete root entry
          delete scope.root.plugin;

          return true;
        };

        scope.hasWildcard = function () {
          return (
            null !== scope.getObject(scope.root, "extra_config", "plugin/http-server", "krakend-wildcard", "endpoints", scope.placement.endpoint)
          );
        }

        scope.getEndpointIndex = function (endpoint_name) {
          for (i = 0; scope.root.endpoints && i < scope.root.endpoints.length; i++) {
            if (endpoint_name == scope.root.endpoints[i].endpoint) {
              return i;
            }
          }

          return false;
        };
        scope.toggleWildcard = function () {
          WILDCARD_HEADER = 'X-Krakend-Wildcard';

          if (scope.hasWildcard()) {
            delete scope.root.extra_config['plugin/http-server']['krakend-wildcard'].endpoints[scope.placement.endpoint];
            endpoint_index = scope.getEndpointIndex(scope.placement.endpoint);
            if (false !== endpoint_index) {
              scope.deleteTermFromList(WILDCARD_HEADER, scope.root.endpoints[endpoint_index], "input_headers");
            }

            // Remove http client plugin
            if (scope.getObject(scope.placement, "backend", 0, "extra_config", "plugin/http-client")) {
              delete scope.placement.backend[0].extra_config['plugin/http-client'];
            }

            // Delete last wildcard
            if (0 === Object.keys(scope.root.extra_config['plugin/http-server']['krakend-wildcard'].endpoints).length) {
              scope.deleteHttpServerPlugin(scope.root);
            }

          } else {
            scope.addHttpServerPlugin(scope.root);
            scope.addHttpClientPlugin(0);
            scope.setObject(scope.root, "extra_config", 'plugin/http-server', 'krakend-wildcard', "endpoints", scope.placement.endpoint, [scope.placement.endpoint]);
            endpoint_index = scope.getEndpointIndex(scope.placement.endpoint);
            if (false !== endpoint_index) {
              scope.addTermToList(WILDCARD_HEADER, scope.root.endpoints[endpoint_index], "input_headers");
            }
          }
        };
      }

    }
  }]);
