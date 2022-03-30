angular
  .module('KrakenDesigner')
  .directive("plugin", ['InputValidator', 'DefaultConfig', 'Constants', function (InputValidator, DefaultConfig, Constants) {
    return {
      restrict: "E",
      template: '<div ng-include="getTemplate()"></div>',
      scope: {
        root: '=',  // The configuration root, MUST pass "service" at all times.
        placement: '=', // Where the plugin is injected (endpoint, backend or service).
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
        scope.getObject = function (args) {
          obj = scope.placement;
          for (var i = 0; obj && i < arguments.length; ++i) {
            if ('undefined' === typeof obj[arguments[i]]) {
              return null;
            }
            obj = obj[arguments[i]]
          }
          return obj;
        };

        scope.addTermToList = function(term, list) {
          if ( 'undefined' === typeof term || term.length < 1 ) {
            return;
          }

          if ( 'undefined' === typeof scope.placement.extra_config[TYPE][PLUGIN][list] )
          {
            scope.placement.extra_config[TYPE][PLUGIN][list] = [];
          }


          if ( scope.placement.extra_config[TYPE][PLUGIN][list].indexOf(term) === -1 ) {
            scope.placement.extra_config[TYPE][PLUGIN][list].push(term);
          }
        }

        scope.deleteIndexFromList = function(index,list) {
          scope.placement.extra_config[TYPE][PLUGIN][list].splice(index, 1);
        }

        scope.getDefaultValues = function () {
          default_plugin_values = {};
          // Copy default values from default_config.service.js when present:
          if ('undefined' !== typeof DefaultConfig.plugins[TYPE][PLUGIN]) {
            default_plugin_values = Object.assign({}, DefaultConfig.plugins[TYPE][PLUGIN]);
          }

          return default_plugin_values;
        };

        scope.hasHttpServerPlugin = function () {
          plugins = scope.getObject("extra_config", TYPE, "name");
          return (plugins && -1 !== plugins.indexOf(PLUGIN));
        };

        scope.toggleHttpServerPlugin = function () {
          scope.hasHttpServerPlugin() ? scope.deleteHttpServerPlugin() : scope.addHttpServerPlugin();
        };


        scope.addHttpServerPlugin = function () {
          scope.addPluginEntry();
          // Has extra_config?:
          if ('undefined' === typeof scope.placement.extra_config) {
            scope.placement.extra_config = {};
          }

          // Has plugins of type server?:
          if ('undefined' === typeof scope.placement.extra_config[TYPE]) {
            scope.placement.extra_config[TYPE] = {
              "name": [PLUGIN]
            }
          }

          // Has this plugin in the list
          if (scope.placement.extra_config[TYPE].name.indexOf(PLUGIN) === -1) {
            scope.placement.extra_config[TYPE].name.push(PLUGIN);
          }

          scope.placement.extra_config[TYPE][PLUGIN] = scope.getDefaultValues();
        };

        scope.deleteHttpServerPlugin = function () {
          // Delete plugin from "name" list:
          index = scope.placement.extra_config[TYPE].name.indexOf(PLUGIN);
          if (index > -1) {
            scope.placement.extra_config[TYPE].name.splice(index);
          }
          // Delete plugin configuration:
          delete scope.placement.extra_config[TYPE][PLUGIN];
          // Delete all http-server plugins if it's the last
          if (0 == scope.placement.extra_config[TYPE].name.length) {
            delete scope.placement.extra_config[TYPE];
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

          for ( i=0; i<plugin_patterns.length; i++) {
            if ( null !== config.match(plugin_patterns[i])) {
              return false;
            }
          }

          // No plugins declared anywhere, delete root entry
          delete scope.root.plugin;

          return true;
        };

      }

    }
  }]);
