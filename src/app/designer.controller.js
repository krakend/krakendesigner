var FileSaver = require('file-saver');

angular
    .module('KrakenDesigner')
    .controller('KrakenDesignerController', function ($scope, $rootScope, $location, DefaultConfig, Constants) {


        if ('undefined' === typeof $rootScope.service) {
            // Default initial values set in any configuration generation:
            $rootScope.service = DefaultConfig.service;
        }

        $rootScope.constants = Constants;
        $rootScope.selected_endpoint = ('undefined' === typeof ($location.search()).target ? false : ($location.search()).target);

        // Returns the object or null when unset.
        // e.g.: firstEndpoint = $rootScope.getObject("service", "endpoints", 0);
        $rootScope.getObject = function (args) {
            obj = $rootScope;
            for (var i = 0; obj && i < arguments.length; ++i) {
                if ('undefined' === typeof obj[arguments[i]]) {
                    return null;
                }
                obj = obj[arguments[i]]
            }
            return obj;
        };

        $rootScope.save = function () {
            if ('undefined' === typeof $rootScope.service.endpoints || $rootScope.service.endpoints.length < 1) {
                alert("At least you need to define an endpoint");
                return false;
            }

            $rootScope.fixCipherSuitesType('auth/signer', false);
            $rootScope.fixCipherSuitesType('auth/validator', false);

            var date = new Date().getTime();
            downloadDocument(date + "-krakend.json", angular.toJson($rootScope.service, true)); // Beautify
            $rootScope.saved_once = true;
        };

        $rootScope.loadFile = function () {
            try {
                var loaded_json = JSON.parse($scope.service_configuration);
                if ("undefined" !== typeof loaded_json.version && 3 != loaded_json.version) {
                    alert("This version of KrakenDesigner only supports configuration files with 'version: 3'. For syntax 'version: 2' please get a local copy of KrakenDesigner from https://github.com/devopsfaith/krakendesigner/commit/153bbedec8a0a90d3f0f95c303c71464ad9b40e9")
                    return false;
                }

                DefaultConfig.service = loaded_json;
                $rootScope.service = DefaultConfig.service;
                $rootScope.dropzone_loaded = true;
                $rootScope.sd_providers = {};
            } catch (e) {
                alert("Failed to parse the selected JSON file.\n\n" + e.message);
            }

            $rootScope.fixCipherSuitesType('auth/validator', true);
            $rootScope.fixCipherSuitesType('auth/signer', true);
            $rootScope.loadSDOptions();
        };

        // The krakend-jose cipher_suites need to be stored as integer but Angular treats multiselect as strings:
        $rootScope.fixCipherSuitesType = function (ns, convertToString) {
            if ('undefined' !== typeof $rootScope.service && 'undefined' !== typeof $rootScope.service.endpoints) {
                for (var e = 0; e < $rootScope.service.endpoints.length; e++) {
                    if ('undefined' !== typeof $rootScope.service.endpoints[e].extra_config &&
                        'undefined' !== typeof $rootScope.service.endpoints[e].extra_config[ns] &&
                        'undefined' !== typeof $rootScope.service.endpoints[e].extra_config[ns].cipher_suites) {

                        for (var s = 0; s < $rootScope.service.endpoints[e].extra_config[ns].cipher_suites.length; s++) {
                            if (convertToString) {
                                $rootScope.service.endpoints[e].extra_config[ns].cipher_suites[s] = '' + $rootScope.service.endpoints[e].extra_config[ns].cipher_suites[s];
                            } else {
                                // Convert to integer
                                $rootScope.service.endpoints[e].extra_config[ns].cipher_suites[s] = parseInt($rootScope.service.endpoints[e].extra_config[ns].cipher_suites[s]);
                            }
                        }
                    }
                }
            }
        }

        // Load Service Discovery options
        $rootScope.loadSDOptions = function () {
            var sd_type = 'static';
            var disable_host_sanitize = false;
            // Default static hosts:
            if ('undefined' !== typeof $rootScope.service.host) {
                for (var h = 0; h < $rootScope.service.endpoints.length; h++) {
                    {
                        $rootScope.addHost($rootScope.service.host[h], sd_type, disable_host_sanitize);
                    }
                }
            }

            // Hosts from endpoints
            if ('undefined' !== typeof $rootScope.service.endpoints) {
                for (var e = 0; e < $rootScope.service.endpoints.length; e++) {
                    if ('undefined' !== typeof $rootScope.service.endpoints[e].backend) {
                        for (var b = 0; b < $rootScope.service.endpoints[e].backend.length; b++) {
                            var current_backend = $rootScope.service.endpoints[e].backend[b];
                            if ('undefined' !== typeof current_backend.host) {
                                for (var h = 0; h < current_backend.host.length; h++) {
                                    var current_host = current_backend.host[h];
                                    if ('undefined' !== typeof current_backend.sd) {
                                        sd_type = current_backend.sd;
                                    }
                                    else {
                                        // Expected protocols:  http(s) or amqp
                                        sd_type = (/amqp:\/\//.test(current_host) ? 'amqp' : 'static')
                                    }
                                    if ('undefined' !== typeof current_backend.disable_host_sanitize) {
                                        disable_host_sanitize = current_backend.disable_host_sanitize;
                                    }
                                    else {
                                        disable_host_sanitize = false;
                                    }
                                    $rootScope.addHost(current_host, sd_type, disable_host_sanitize);
                                }

                            }
                        }
                    }
                }


            }
        }

        $rootScope.hasServiceExtraConfig = function (namespace) {
            return !(
                'undefined' === typeof $rootScope.service.extra_config ||
                'undefined' === typeof $rootScope.service.extra_config[namespace]
            );
        }

        $rootScope.addPluginEntry = function () {
            if (undefined === $rootScope.service.plugin) {
                $rootScope.service.plugin = DefaultConfig.plugin;
            }
        }

        // Deletes the plugin entry if there are no other elements using it.
        $rootScope.deletePluginEntryWhenSafe = function () {
            // Has plugin entry
            if ($rootScope.getObject("service", "plugin")) {
                // Has server plugins
                if ($rootScope.getObject("service", "extra_config", "plugin/http-server")) {
                    return false;
                }

                // Has endpoints with plugins:
                if (endpoints = $rootScope.getObject("service", "endpoints")) {
                    for (var e = 0; e < endpoints.length; e++) {
                        if ($rootScope.getObject(endpoints[e], "extra_config", 'plugin/request-modifier') ||
                            $rootScope.getObject(endpoints[e], "extra_config", 'plugin/response-modifier')) {
                            return false;
                        }
                        // Has backends with plugins
                        if (backends = $rootScope.getObject(endpoints[e], "backend")) {
                            for (var b = 0; b < backends.length; b++) {
                                if ($rootScope.getObject(backends[b], "extra_config", 'plugin/http-client') ||
                                    $rootScope.getObject(backends[b], "extra_config", 'plugin/request-modifier') ||
                                    $rootScope.getObject(backends[b], "extra_config", 'plugin/response-modifier')) {
                                    return false;
                                }
                            }
                        }
                    }
                }
                // No plugins found elsewhere
                delete $rootScope.service.plugin;
            }

            return true;
        };

        $rootScope.hasHttpServerPlugin = function (name) {
            plugins = $rootScope.getObject("service", "extra_config", "plugin/http-server", "name");
            return (plugins && -1 !== plugins.indexOf(name));
        }

        $rootScope.addHttpServerPlugin = function (name) {

            $rootScope.addPluginEntry();

            // Has extra_config?:
            if ('undefined' === typeof $rootScope.service.extra_config) {
                $rootScope.service.extra_config = {};
            }

            // Has plugins of type server?:
            if (!$rootScope.hasServiceExtraConfig('plugin/http-server')) {
                $rootScope.service.extra_config['plugin/http-server'] = {
                    "name": [name]
                }
            }

            // Has this plugin in the list
            if ($rootScope.service.extra_config['plugin/http-server'].name.indexOf(name) === -1) {
                $rootScope.service.extra_config['plugin/http-server'].name.push(name);
            }

            // Add the configuration key of the plugin (other values might exist)
            if ('undefined' === typeof $rootScope.service.extra_config['plugin/http-server'][name]) {
                if ('undefined' === typeof DefaultConfig['plugin/http-server'][name]) {
                    // No defaults exist
                    $rootScope.service.extra_config['plugin/http-server'][name] = {};
                } else {
                    // Default values for the plugin
                    $rootScope.service.extra_config['plugin/http-server'][name] = DefaultConfig['plugin/http-server'][name];
                }
            }
        };

        // Unused yet
        // $rootScope.togglePluginServer = function (name) {
        //     if ($rootScope.hasHttpServerPlugin(name)) {
        //         $rootScope.deleteHttpServerPlugin(name);
        //     } else {
        //         $rootScope.addHttpServerPlugin(name);
        //     }
        // }



        $rootScope.deleteHttpServerPlugin = function (name) {
            // Delete plugin from "name" list:
            index = $rootScope.service.extra_config['plugin/http-server'].name.indexOf(name);
            if (index > -1) {
                $rootScope.service.extra_config['plugin/http-server'].name.splice(index);
            }
            // Delete plugin configuration:
            delete $rootScope.service.extra_config['plugin/http-server'][name];
            // Delete all http-server plugins if it's the last
            if (0 == $rootScope.service.extra_config['plugin/http-server'].name.length) {
                delete $rootScope.service.extra_config['plugin/http-server'];
                $rootScope.deletePluginEntryWhenSafe();
            }

            // TODO: Scan configuration for other types of plugin, and if none, remove the "plugins" entry
        }

        $rootScope.hasWildcard = function (endpoint) {
            return (
                $rootScope.hasHttpServerPlugin('wildcard') &&
                null !== $rootScope.getObject("service", "extra_config", "plugin/http-server", "wildcard", endpoint)
            );
        }

        $rootScope.toggleWildcard = function (endpoint, endpoint_index) {
            WILDCARD_HEADER = 'X-Krakend-Wildcard';

            if ($rootScope.hasWildcard(endpoint)) {
                delete $rootScope.service.extra_config['plugin/http-server']['wildcard'][endpoint]

                // Remove special header
                if ( $rootScope.getObject("service","endpoints",endpoint_index, "input_headers") ) {
                    header_idx = $rootScope.service.endpoints[endpoint_index].input_headers.indexOf(WILDCARD_HEADER);
                    if (-1 !== header_idx) {
                        $rootScope.deleteHeaderPassing(endpoint_index, header_idx);
                    }
                }

                // Delete last wildcard
                if (0 === Object.keys($rootScope.service.extra_config['plugin/http-server']['wildcard']).length) {
                    $rootScope.deleteHttpServerPlugin('wildcard');
                }

            } else {
                $rootScope.addHttpServerPlugin('wildcard');
                $rootScope.service.extra_config['plugin/http-server']['wildcard'][endpoint] = [endpoint];
                $rootScope.addHeaderPassing(endpoint_index, WILDCARD_HEADER);

            }
        }

        // Destroy middleware or create it with default data:
        $rootScope.toggleMiddleware = function (namespace) {
            if ($rootScope.hasServiceExtraConfig(namespace)) {
                delete $rootScope.service.extra_config[namespace]
            } else {
                if (undefined !== DefaultConfig.extra_config[namespace]) {
                    $rootScope.service.extra_config[namespace] = DefaultConfig.extra_config[namespace];
                } else {
                    $rootScope.service.extra_config[namespace] = {};
                }
            }
        }

        /**
         * Pushes the value of the given container to an array with the given name or object, only if it doesn't exist.
         * @param container_name_with_value
         * @param array
         * @returns {*}
         */
        $rootScope.addTermToArray = function (term, array) {

            if ('string' == typeof array) {
                array = eval(array);
            }

            if (typeof array === "undefined") {
                return false;
            }

            if (array.indexOf(term) !== -1) {
                return false;
            }

            array.push(term);
        };

        $rootScope.deleteIndexFromArray = function (index, array_qualified_name) {

            var array = eval(array_qualified_name);
            array.splice(index, 1);
        };

        $rootScope.deleteHost = function (index) {
            var sd = $rootScope.sd_providers.hosts[index].sd;
            $rootScope.deleteIndexFromArray(index, '$scope.sd_providers.hosts');

            // Remove the provider when all its hosts were deleted:
            var remaining_hosts_in_provider = 0;
            for (i = 0; i < $rootScope.sd_providers.hosts.length; i++) {
                if ($rootScope.sd_providers.hosts[i].sd == sd) {
                    remaining_hosts_in_provider++;
                }
            }

            if (remaining_hosts_in_provider == 0) {
                var remove = $rootScope.sd_providers.providers.indexOf(sd);
                $rootScope.sd_providers.providers.splice(remove, 1);
            }

        }
        $rootScope.addHost = function (host, sd_type, disable_host_sanitize) {

            if ('undefined' === typeof host) {
                return false;
            }

            if ('undefined' === typeof disable_host_sanitize) {
                disable_host_sanitize = false;
            }

            if ('undefined' === typeof sd_type) {
                sd_type = 'static';
            }

            if (typeof $rootScope.sd_providers === "undefined") {
                $rootScope.sd_providers = {};
            }

            if (typeof $rootScope.sd_providers.hosts === "undefined") {
                $rootScope.sd_providers.hosts = [];
            }

            if (typeof $rootScope.sd_providers.providers === "undefined") {
                $rootScope.sd_providers.providers = [];
            }

            // Avoid duplicates:
            for (var i = 0; i < $rootScope.sd_providers.hosts.length; i++) {
                if ($rootScope.sd_providers.hosts[i].host === host && $rootScope.sd_providers.hosts[i].sd === sd_type) {
                    return false;
                }
            }

            //var needs_sd = ["dns","etcd"].includes(sd_type);
            $rootScope.sd_providers.hosts.push({
                "sd": sd_type,
                "host": host,
                "disable_host_sanitize": disable_host_sanitize
            });

            $rootScope.addTermToArray(sd_type, $rootScope.sd_providers.providers);
        };

        $rootScope.deleteWhitelist = function (white, backend_index, endpoint_index) {
            $rootScope.service.endpoints[endpoint_index].backend[backend_index].allow.splice(white - 1, 1);
        };

        $rootScope.deleteBlacklist = function (black, backend_index, endpoint_index) {
            $rootScope.service.endpoints[endpoint_index].backend[backend_index].deny.splice(black - 1, 1);
        };


        $rootScope.addWhitelist = function (endpoint_index, backend_index) {

            var container_name_with_value = '#wl' + endpoint_index + backend_index;

            // Create object if it doesn't exist yet
            if ('undefined' === typeof $rootScope.service.endpoints[endpoint_index].backend[backend_index].allow) {
                $rootScope.service.endpoints[endpoint_index].backend[backend_index].allow = [];
            }

            $rootScope.addTermToArray(
                $(container_name_with_value).val(),
                $rootScope.service.endpoints[endpoint_index].backend[backend_index].allow
            );

        };


        $rootScope.addBlacklist = function (endpoint_index, backend_index) {

            var container_name_with_value = '#bl' + endpoint_index + backend_index;

            // Create object if it doesn't exist yet
            if ('undefined' === typeof $rootScope.service.endpoints[endpoint_index].backend[backend_index].deny) {
                $rootScope.service.endpoints[endpoint_index].backend[backend_index].deny = [];
            }

            $rootScope.addTermToArray(
                $(container_name_with_value).val(),
                $rootScope.service.endpoints[endpoint_index].backend[backend_index].deny
            );

        };

        $rootScope.addTransformation = function (endpoint_index, backend_index) {

            var target = $('#tr_target' + endpoint_index + backend_index).val();
            var origin = $('#tr_origin' + endpoint_index + backend_index).val();

            if (typeof $rootScope.service.endpoints[endpoint_index].backend[backend_index].mapping === "undefined") {
                $rootScope.service.endpoints[endpoint_index].backend[backend_index].mapping = {};
            }
            $rootScope.service.endpoints[endpoint_index].backend[backend_index].mapping[origin] = target;
        };

        $rootScope.deleteTransformation = function (origin, endpoint_index, backend_index) {
            delete $rootScope.service.endpoints[endpoint_index].backend[backend_index].mapping[origin];
        };

        $rootScope.addFlatmap = function (endpoint_index, backend_index, type, origin, destination) {
            if (typeof $rootScope.service.endpoints[endpoint_index].backend[backend_index].extra_config['proxy'] === "undefined") {
                $rootScope.service.endpoints[endpoint_index].backend[backend_index].extra_config['proxy'] = {};
            }

            if (typeof $rootScope.service.endpoints[endpoint_index].backend[backend_index].extra_config['proxy'].flatmap_filter === "undefined") {
                $rootScope.service.endpoints[endpoint_index].backend[backend_index].extra_config['proxy'] = {
                    "flatmap_filter": []
                };
            }

            var args = [];
            args.push(origin);

            if (type === 'move' || type === 'append') {
                args.push(destination);
            }

            $rootScope.service.endpoints[endpoint_index].backend[backend_index].extra_config['proxy'].flatmap_filter.push(
                {
                    "type": type,
                    "args": args
                }
            );
        };

        $rootScope.deleteFlatmap = function (index, endpoint_index, backend_index) {
            $rootScope.service.endpoints[endpoint_index].backend[backend_index].extra_config['proxy'].flatmap_filter.splice(index, 1);

            if ($rootScope.service.endpoints[endpoint_index].backend[backend_index].extra_config['proxy'].flatmap_filter.length == 0) {
                delete $rootScope.service.endpoints[endpoint_index].backend[backend_index].extra_config['proxy'].flatmap_filter;
            }

            if (0 === Object.keys($rootScope.service.endpoints[endpoint_index].backend[backend_index].extra_config['proxy']).length) {
                delete $rootScope.service.endpoints[endpoint_index].backend[backend_index].extra_config['proxy']
            }

        };

        $rootScope.addEndpoint = function () {

            if (typeof $rootScope.sd_providers === "undefined" || typeof $rootScope.sd_providers.hosts === "undefined" || 1 < $rootScope.service.length) {
                alert("You need to add at least one host in the Service Configuration or Service Discovery panels.");
                return false;
            }

            if (typeof $rootScope.service.endpoints === "undefined") {
                $rootScope.service.endpoints = [];
            }

            $rootScope.service.endpoints.push({
                "endpoint": "/v1/new-endpoint",
                "method": "GET",
                "output_encoding": (typeof $rootScope.service.output_encoding === undefined ? "json" : $rootScope.service.output_encoding)
            });
        };

        // Valid endpoints start with Slash and do not contain /__debug[/] or /__health
        $rootScope.isValidEndpoint = function (endpoint) {
            return !(/^[^\/]|\/__debug(\/.*)?$|\/__health$|\/favicon\.ico/i.test(endpoint));
        };

        $rootScope.isValidTimeUnit = function (time_with_unit) {

            return (
                'undefined' === typeof time_with_unit ||
                '' == time_with_unit ||
                /^\d+(ns|us|µs|ms|s|m|h)$/.test(time_with_unit)
            );
        };

        $rootScope.isInteger = function (integer) {
            return (
                'undefined' === typeof integer ||
                '' == integer ||
                /^\d+$/.test(integer)
            );
        };


        $rootScope.deleteEndpoint = function (endpoint_index, message) {
            if (confirm(message)) {
                $rootScope.service.endpoints.splice(endpoint_index, 1);
            }
        };

        $rootScope.updateNonGETBackends = function (endpoint_index, old_value, message) {

            var num_backends = ('undefined' === typeof $rootScope.service.endpoints[endpoint_index].backend ? 0 : $rootScope.service.endpoints[endpoint_index].backend.length);
            if (num_backends > 1) {
                if (old_value == 'GET' && confirm(message)) {
                    $rootScope.service.endpoints[endpoint_index].backend.splice(1, 10000);
                } else {
                    // Angular already updated the value, revert:
                    $rootScope.service.endpoints[endpoint_index].method = 'GET';
                }
            }
        };

        /**
         * The setNoOpEncoding is called when the backend or the endpoint change their encoding.
         * It deletes all backend configuration and adds a backend with no-op.
         */
        $rootScope.setNoOpEncoding = function (endpoint_index, new_value, old_value, backend_index) {
            var message = "Selecting the No-Operation means that this endpoint will proxy all content to a *single backend* where no response manipulation is desired.\n\nThe no-op option will be automatically set for both the backend and the endpoint. Existing backend settings for this endpoint will be discarded.\n\n Do you want to proceed?";
            var num_backends = ('undefined' === typeof $rootScope.service.endpoints[endpoint_index].backend ? 0 : $rootScope.service.endpoints[endpoint_index].backend.length);

            // Endpoint encoding and backend encoding must match to 'no-op':
            if (new_value == 'no-op' && num_backends > 0) {

                if (confirm(message)) {
                    // Delete all backend queries and add just one, inheriting encoding:
                    delete $rootScope.service.endpoints[endpoint_index].backend
                    $rootScope.service.endpoints[endpoint_index].output_encoding = 'no-op';
                    $rootScope.addBackendQuery(endpoint_index);

                    // Delete also static_response
                    if ('undefined' !== typeof $rootScope.service.endpoints[endpoint_index].extra_config['proxy']) {
                        delete $rootScope.service.endpoints[endpoint_index].extra_config['proxy'];
                    }

                } else { // Angular already updated the values, revert endpoint or backend:

                    if (null === backend_index) {
                        // Backend encoding
                        $rootScope.service.endpoints[endpoint_index].output_encoding = old_value;
                    }
                    else {
                        $rootScope.service.endpoints[endpoint_index].backend[backend_index].encoding = old_value;
                    }
                }
            }
        };



        $rootScope.addBackendQuery = function (endpoint_index) {

            if (typeof $rootScope.service.endpoints[endpoint_index].backend === "undefined") {
                $rootScope.service.endpoints[endpoint_index].backend = [];
            }

            $rootScope.service.endpoints[endpoint_index].backend.push({
                "url_pattern": "/",
                "encoding": $rootScope.service.endpoints[endpoint_index].output_encoding,
                "sd": $rootScope.sd_providers.providers[0], // Select first provider defined
                "method": (typeof $rootScope.service.endpoints[endpoint_index].method === undefined ? "GET" : $rootScope.service.endpoints[endpoint_index].method)
            });
        };

        $rootScope.syncHostsInBackend = function (endpoint_index, backend_index, checked, host, disable_host_sanitize) {

            if ('undefined' === typeof $rootScope.service.endpoints[endpoint_index].backend[backend_index].host) {
                $rootScope.service.endpoints[endpoint_index].backend[backend_index].host = [];
            }

            if (checked) {
                $rootScope.service.endpoints[endpoint_index].backend[backend_index].host.push(host);
                $rootScope.service.endpoints[endpoint_index].backend[backend_index].disable_host_sanitize = disable_host_sanitize;
            } else {
                var to_delete = $rootScope.service.endpoints[endpoint_index].backend[backend_index].host.indexOf(host);
                $rootScope.service.endpoints[endpoint_index].backend[backend_index].host.splice(to_delete, 1);

                // Remove host if it's the last key (and use any global value instead):
                if (0 === $rootScope.service.endpoints[endpoint_index].backend[backend_index].host.length) {
                    $rootScope.deleteHostsInBackend(endpoint_index, backend_index);
                }
            }
        };

        $rootScope.deleteHostsInBackend = function (endpoint_index, backend_index) {
            if ('undefined' !== typeof $rootScope.service.endpoints[endpoint_index].backend[backend_index].host) {
                delete $rootScope.service.endpoints[endpoint_index].backend[backend_index].host;
            }
        };

        $rootScope.OneOfHostsInBackend = function (endpoint_index, backend_index, host) {
            return (
                'undefined' !== typeof $rootScope.service.endpoints[endpoint_index].backend[backend_index].host
                && $rootScope.service.endpoints[endpoint_index].backend[backend_index].host.includes(host)
            );
        };

        $rootScope.toggleCaching = function ($event, endpoint_index, backend_index) {
            if ($event.target.checked) {
                // Create the key that enables caching:
                $rootScope.service.endpoints[endpoint_index].backend[backend_index].extra_config['qos/http-cache'] = {};
            } else {
                delete $rootScope.service.endpoints[endpoint_index].backend[backend_index].extra_config['qos/http-cache'];
            }
        };

        $rootScope.deleteBackendQuery = function (endpoint_index, backend_index, message) {
            if (confirm(message)) {
                $rootScope.service.endpoints[endpoint_index].backend.splice(backend_index, 1);
            }
        };


        $rootScope.addDefaultStaticResponse = function (endpoint_index) {
            if ('undefined' === typeof $rootScope.service.endpoints[endpoint_index].extra_config) {
                $rootScope.service.endpoints[endpoint_index].extra_config = {};
            }

            if (typeof $rootScope.service.endpoints[endpoint_index].extra_config['proxy'] == "undefined") {
                $rootScope.service.endpoints[endpoint_index].extra_config['proxy'] = {};
            }

            $rootScope.service.endpoints[endpoint_index].extra_config['proxy']['static'] = {
                "data": {
                    "new_field_a": 123,
                    "new_field_b": ["arr1", "arr2"],
                    "new_field_c": { "obj": "obj1" }
                },
                "strategy": "incomplete"
            }
        };

        $rootScope.deleteStaticResponse = function (endpoint_index) {
            delete $rootScope.service.endpoints[endpoint_index].extra_config['proxy']['static'];
            // Last key
            if (Object.keys($rootScope.service.endpoints[endpoint_index].extra_config['proxy']).length == 0) {
                delete $rootScope.service.endpoints[endpoint_index].extra_config['proxy'];
            }
        };


        $rootScope.addQuerystring = function (endpoint_index) {

            if (typeof $rootScope.service.endpoints[endpoint_index].input_query_strings === "undefined") {
                $rootScope.service.endpoints[endpoint_index].input_query_strings = [];
            }

            var term = document.getElementById('addQuerystring_' + endpoint_index).value;
            if (term.length > 0 && $rootScope.service.endpoints[endpoint_index].input_query_strings.indexOf(term) === -1) {
                $rootScope.service.endpoints[endpoint_index].input_query_strings.push(term);
            }
        };


        $rootScope.deleteQuerystring = function (query_index, endpoint_index) {
            $rootScope.service.endpoints[endpoint_index].input_query_strings.splice(query_index, 1);
        };


        $rootScope.addHeaderPassing = function (endpoint_index, header) {
            if (typeof $rootScope.service.endpoints[endpoint_index].input_headers === "undefined") {
                $rootScope.service.endpoints[endpoint_index].input_headers = [];
            }

            $rootScope.addTermToArray(header, $rootScope.service.endpoints[endpoint_index].input_headers);
        };

        $rootScope.deleteHeaderPassing = function (endpoint_index, header_index) {
            $rootScope.service.endpoints[endpoint_index].input_headers.splice(header_index, 1);
            if (0 === $rootScope.service.endpoints[endpoint_index].input_headers.length) {
                delete $rootScope.service.endpoints[endpoint_index].input_headers;
            }
        };

    });

function downloadDocument (name, content) {
    FileSaver.saveAs(new Blob([content], { type: "text/plain;charset=UTF-8" }), name);
}

// Avoid losing the configuration:
window.onbeforeunload = function () {
    return "Leaving now implies losing the changes configured if you didn't save. Are you sure?";
}
