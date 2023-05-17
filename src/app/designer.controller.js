var FileSaver = require('file-saver');

angular
    .module('KrakenDesigner')
    .controller('KrakenDesignerController', function ($window, $scope, $rootScope, $location, DefaultConfig, Constants, FileHandleService) {
        $rootScope.window = $window;

        if ('undefined' === typeof $rootScope.service) {
            // Default initial values set in any configuration generation:
            $rootScope.service = DefaultConfig.service;
        }

        if (typeof $rootScope.sd_providers === "undefined") {
            $rootScope.sd_providers = {};
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

        $rootScope.setObject = function (args) {

            obj = $rootScope;
            for (var i = 0; obj && i < arguments.length; ++i) {
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

        $rootScope.getOpenedFile = function () {
            if (FileHandleService.fileHandle) {
                return FileHandleService.fileHandle.name
            }
            return false;
        }

        $rootScope.open = async function () {
            try {
                const [fileHandle] = await window.showOpenFilePicker({
                    types: [
                        {
                            description: 'JSON Files',
                            accept: { 'application/json': ['.json'] },
                        },
                    ],
                });

                FileHandleService.fileHandle = fileHandle;

                if (!fileHandle.name.toLowerCase().endsWith('.json')) {
                    throw 'Please select a file with a .json extension.';
                }

                const file = await fileHandle.getFile();
                const contents = await readFileAsync(file);


                $scope.$apply(() => {
                    $scope.service_configuration = contents;
                    $rootScope.loadFile();
                });

                document.getElementById('save-file').classList.remove('hidden');
            } catch (error) {
                if (error.name !== 'AbortError') {
                    alert('Error while opening the file:' + error);
                    console.error('Error opening the file:', error);
                }
            }
        };


        function cleanServiceForSaving (service) {
            // Delete empty extra config:
            extra_config = $rootScope.getObject("service", "extra_config");
            if (extra_config && 0 === Object.keys(extra_config).length) {
                delete service.extra_config;
            }

            // Delete empty endpoint extra config:
            endpoints = $rootScope.getObject("service", "endpoints");
            if (endpoints) {
                for (i = 0; i < endpoints.length; i++) {
                    endpoint_extra_config = $rootScope.getObject("service", "endpoints", i, "extra_config");
                    if (endpoint_extra_config && 0 === Object.keys(endpoint_extra_config).length) {
                        delete service.endpoints[i].extra_config;
                    }

                    backends = $rootScope.getObject("service", "endpoints", i, "backend");
                    for (b = 0; backends && b < backends.length; b++) {
                        backend_extra_config = $rootScope.getObject("service", "endpoints", i, "backend", b, "extra_config");
                        if (backend_extra_config && 0 === Object.keys(backend_extra_config).length) {
                            delete service.endpoints[i].backend[b].extra_config;
                        }
                    }
                }
            }
        }

        $rootScope.save = async function () {
            if (!FileHandleService.fileHandle) {
                //alert('No file selected');
                return;
            }

            try {
                $rootScope.fixCipherSuitesType('auth/signer', false);
                $rootScope.fixCipherSuitesType('auth/validator', false);

                // Make a copy of the service and clean it, do not modify rootScope!
                save = angular.copy($rootScope.service);
                cleanServiceForSaving(save);
                save_contents = angular.toJson(save, true);

                const writableStream = await FileHandleService.fileHandle.createWritable();
                await writableStream.write(save_contents);
                await writableStream.close();
                alert("File saved on disk!");
                console.log("File saved on disk: " + $rootScope.getOpenedFile());
            } catch (e) {
                alert('Failed to save the file locally:\n\n' + e.message);
            }
        };

        document.addEventListener("keydown", function (event) {
            if (event.ctrlKey && event.key === 'd') {
                event.preventDefault();
                $rootScope.download();
                return;
            }

            if (!($rootScope.hasLocalSaveSupport())) return;

            if (event.ctrlKey && event.key === 'o') {
                event.preventDefault();
                $rootScope.open();
            }
            if (event.ctrlKey && event.key === 's') {
                event.preventDefault();
                $rootScope.save();
            }
        });

        function readFileAsync (file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    resolve(reader.result);
                };
                reader.onerror = reject;
                reader.readAsText(file);
            });
        }

        $rootScope.hasLocalSaveSupport = function () {
            return window.showOpenFilePicker && window.showSaveFilePicker;
        }

        $rootScope.download = function () {
            $rootScope.fixCipherSuitesType('auth/signer', false);
            $rootScope.fixCipherSuitesType('auth/validator', false);

            // Make a copy of the service and clean it, do not modify rootScope!
            save = angular.copy($rootScope.service);
            cleanServiceForSaving(save)

            var date = new Date().getTime();
            downloadDocument("krakend.json", angular.toJson(save, true)); // Beautify
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

                $rootScope.fixCipherSuitesType('auth/validator', true);
                $rootScope.fixCipherSuitesType('auth/signer', true);
                $rootScope.loadSDOptions();

            } catch (e) {
                alert("Failed to parse the selected JSON file.\n\n" + e.message);
                return false;
            }

            return true;
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

        // Looks in the configuration for EE functionality:
        $rootScope.isEnterprise = function () {
            $rootScope.modules_in_use = [];
            service_components = ['documentation/openapi', 'auth/api-keys', 'telemetry/instana', 'telemetry/newrelic', 'telemetry/ganalytics'];
            endpoint_components = ['documentation/openapi', 'websocket', 'modifier/jmespath', 'security/policies'];
            backend_components = ['auth/ntlm','backend/http/client','backend/soap', 'modifier/jmespath', 'security/policies'];
            http_server_plugins = ['ip-filter', 'jwk-aggregator', 'krakend-afero', 'basic-auth', 'geoip', 'static-filesystem', 'redis-ratelimit', 'url-rewrite', 'virtualhost', 'wildcard'];
            http_client_plugins = ['wildcard', 'krakend-afero', 'static-filesystem', 'no-redirect', 'http-proxy'];
            req_resp_plugins = ['ip-filter', 'response-schema-validator', 'content-replacer'];
            individual_flags = [
                ['extra_config', 'router', 'disable_gzip']
            ]

            for (i = 0; i < individual_flags.length; i++) {
                if ($rootScope.getObject("service", ...individual_flags[i])) {
                    // Save as module path1.path2.path3
                    $rootScope.modules_in_use.push(individual_flags[i].join('.'))
                }

            }

            if ($rootScope.getObject("service", "extra_config")) {
                for (i = 0; i < service_components.length; i++) {
                    if ($rootScope.getObject("service", "extra_config", service_components[i])) {
                        $rootScope.modules_in_use.push(service_components[i]);
                    };
                }


                for (i = 0; i < http_server_plugins.length; i++) {
                    if ($rootScope.getObject("service", "extra_config", "plugin/http-server", http_server_plugins[i])) {
                        $rootScope.modules_in_use.push(http_server_plugins[i]);
                    };
                }

                if ($rootScope.getObject("service", "extra_config", "telemetry/opencensus", "exporters", "newrelic")) {
                    $rootScope.modules_in_use.push("newrelic");
                }
            }

            endpoints = $rootScope.getObject("service", "endpoints");
            for (e = 0; endpoints && e < endpoints.length; e++) {
                for (i = 0; i < endpoint_components.length; i++) {
                    if ($rootScope.getObject("service", "endpoints", e, "extra_config", endpoint_components[i])) {
                        $rootScope.modules_in_use.push(endpoint_components[i]);
                    };
                }

                for (i = 0; i < http_server_plugins.length; i++) {
                    if ($rootScope.getObject("service", "endpoints", e, "extra_config", "plugin/http-server", http_server_plugins[i])) {
                        $rootScope.modules_in_use.push(http_server_plugins[i]);
                    };
                }

                for (i = 0; i < req_resp_plugins.length; i++) {
                    if ($rootScope.getObject("service", "endpoints", e, "extra_config", "plugin/req-resp-modifier", req_resp_plugins[i])) {
                        $rootScope.modules_in_use.push(req_resp_plugins[i]);
                    };
                }

                if ($rootScope.hasWildcard($rootScope.getObject("service", "endpoints", e, "endpoint"))) {
                    $rootScope.modules_in_use.push('wildcard');
                }

                backends = $rootScope.getObject("service", "endpoints", e, "backend");
                for (b = 0; backends && b < backends.length; b++) {
                    client_plugin = $rootScope.getObject("service", "endpoints", e, "backend", b, "extra_config", "plugin/http-client", "name");
                    for (i = 0; i < client_plugin && http_client_plugins.length; i++) {
                        if (client_plugin == http_client_plugins[i]) {
                            $rootScope.modules_in_use.push(http_client_plugins[i]);
                        };
                    }

                    for (i = 0; i < backend_components.length; i++) {
                        if ($rootScope.getObject("service", "endpoints", e, "backend", b, "extra_config", backend_components[i])) {
                            $rootScope.modules_in_use.push(backend_components[i]);
                        };
                    }

                    for (i = 0; i < req_resp_plugins.length; i++) {
                        if ($rootScope.getObject("service", "endpoints", e, "backend", b, "extra_config", "plugin/req-resp-modifier", req_resp_plugins[i])) {
                            $rootScope.modules_in_use.push(req_resp_plugins[i]);
                        };
                    }
                }
            }

            return ($rootScope.modules_in_use.length > 0);

        };

        $rootScope.hasServiceExtraConfig = function (namespace) {
            return !(
                'undefined' === typeof $rootScope.service.extra_config ||
                'undefined' === typeof $rootScope.service.extra_config[namespace]
            );
        }

        $rootScope.addPluginEntry = function () {
            if ('undefined' === typeof $rootScope.service.plugin) {
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
                        if ($rootScope.getObject(endpoints[e], "extra_config", 'plugin/req-resp-modifier')) {
                            return false;
                        }
                        // Has backends with plugins
                        if (backends = $rootScope.getObject(endpoints[e], "backend")) {
                            for (var b = 0; b < backends.length; b++) {
                                if ($rootScope.getObject(backends[b], "extra_config", 'plugin/http-client') ||
                                    $rootScope.getObject(backends[b], "extra_config", 'plugin/req-resp-modifier')) {
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

        $rootScope.hasPluginOfThisType = function (name) {
            plugins = $rootScope.getObject("service", "extra_config", "plugin/http-server", "name");
            return (plugins && -1 !== plugins.indexOf(name));
        }

        $rootScope.addHttpClientPlugin = function (name, endpoint_index, backend_index) {
            $rootScope.addPluginEntry();
            $rootScope.setObject(
                "service", "endpoints", endpoint_index, "backend", backend_index, "extra_config", "plugin/http-client", "name", name
            );
        };

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
            }

            $rootScope.deletePluginEntryWhenSafe();
        };

        $rootScope.hasWildcard = function (endpoint) {
            return endpoint.endsWith("/*");
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

            //var needs_sd = ["dns", "etcd"].includes(sd_type);
            $rootScope.sd_providers.hosts.push({
                "sd": sd_type,
                "host": host,
                "disable_host_sanitize": disable_host_sanitize
            });

            $rootScope.addTermToArray(sd_type, $rootScope.sd_providers.providers);

            // Add the freshly added Host to backends with no hosts yet
            endpoints = $rootScope.getObject("service", "endpoints");
            for (i = 0; endpoints && i < endpoints.length; i++) {
                backends = $rootScope.getObject("service", "endpoints", i, "backend");
                for (b = 0; backends && b < backends.length; b++) {
                    backend = $rootScope.getObject("service", "endpoints", i, "backend", b, "host");
                    if (null === backend) {
                        $rootScope.syncHostsInBackend(i, b, false, host, disable_host_sanitize);
                    }
                }
            }

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

            if (typeof $rootScope.service.endpoints === "undefined") {
                $rootScope.service.endpoints = [];
            }

            $rootScope.service.endpoints.push({
                "endpoint": $rootScope.randomEndpointName(),
                "method": "GET",
                "output_encoding": (typeof $rootScope.service.output_encoding === 'undefined' ? "json" : $rootScope.service.output_encoding)
            });


            $rootScope.addBackendQuery($rootScope.service.endpoints.length - 1);
        };

        // Valid endpoints start with Slash and do not contain /__debug[/] or /__health
        $rootScope.isValidEndpoint = function (endpoint) {
            // Invalid:
            //  /invalid*
            //  /invalid:endpoint
            //  /invalid/endpoint*
            //  invalid
            //  favicon.icon
            //  /*
            //  /
            //  /invalid/?/./*
            //  /invalid/*/endpoint
            //  /invalid/**
            //  /invalid/*/endpoint/*
            //  /__health/lolo
            //  /__health
            //  /__debug/lolo
            //  /__debug/*
            //  /__debug
            //  /__echo/lolo
            //  /__echo

            // Valid:
            //  /
            //  /valid/endpoint/{or}/whatever
            //  /valid/endpoint/{or}/whatever/*
            //  /valid.json
            //  /hey/yo
            //  /hey/yo/*
            //  /hey/{yo}/*
            //  /_valid
            //  /v1/__debug


            return (
                // JSON schema validation
                /^\/[^:\*\?\&\%]*(\/\*)?$/.test(endpoint) &&
                // Avoid user frustration:
                !(/^\/__(debug|echo)\/+|^\/__health\/*$|^\/favicon\.ico$/i.test(endpoint))
            );
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

            sd = $rootScope.getObject("sd_providers", "providers", 0);
            $rootScope.service.endpoints[endpoint_index].backend.push({
                "url_pattern": "/",
                "encoding": $rootScope.service.endpoints[endpoint_index].output_encoding,
                "sd": (null == sd ? 'static' : sd), // Select first provider defined or 'static'
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

        $rootScope.deleteBackendQuery = function (endpoint_index, backend_index, message) {
            if ($rootScope.service.endpoints[endpoint_index].backend.length < 2) {
                alert("You cannot delete the last backend. You must have at least one.");
                return false;
            }

            if (confirm(message)) {
                $rootScope.service.endpoints[endpoint_index].backend.splice(backend_index, 1);
            }
        };



        $rootScope.toggleStaticResponse = function (endpoint_index) {
            if ($rootScope.getObject("service", "endpoints", endpoint_index, "extra_config", "proxy", "static")) {
                $rootScope.deleteStaticResponse(endpoint_index);
            } else {
                $rootScope.addDefaultStaticResponse(endpoint_index);
            }
        }

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

            if (header) {
                $rootScope.addTermToArray(header, $rootScope.service.endpoints[endpoint_index].input_headers);
            }
        };

        $rootScope.deleteHeaderPassing = function (endpoint_index, header_index) {
            $rootScope.service.endpoints[endpoint_index].input_headers.splice(header_index, 1);
            if (0 === $rootScope.service.endpoints[endpoint_index].input_headers.length) {
                delete $rootScope.service.endpoints[endpoint_index].input_headers;
            }
        };

        $rootScope.getAPIKeyRoles = function () {
            keys = $rootScope.getObject("service", "extra_config", "auth/api-keys", "keys");
            if (keys && keys.length > 0) {
                roles = [];
                for (i = 0; i < keys.length; i++) {
                    for (r = 0; r < keys[i].roles.length; r++) {
                        if (-1 == roles.indexOf(keys[i].roles[r])) {
                            roles.push(keys[i].roles[r]);
                        }
                    }
                }
                return (roles.length > 0 ? roles : false);
            }
            return false;
        };

        $rootScope.addAPIKeyRole = function (endpoint_index, role) {

            api_keys = $rootScope.getObject("service", "endpoints", endpoint_index, "extra_config", "auth/api-keys", "roles");
            if (null == api_keys) {
                $rootScope.setObject("service", "endpoints", endpoint_index, "extra_config", "auth/api-keys", "roles", []);
                api_keys = $rootScope.getObject("service", "endpoints", endpoint_index, "extra_config", "auth/api-keys", "roles");
            }
            if (-1 == api_keys.indexOf(role)) {
                api_keys.push(role);
            }
        };

        $rootScope.deleteAPIKeyRole = function (endpoint_index, role_index) {
            $rootScope.service.endpoints[endpoint_index].extra_config["auth/api-keys"].roles.splice(role_index - 1, 1);
            if ($rootScope.service.endpoints[endpoint_index].extra_config["auth/api-keys"].roles.length < 1) {
                delete $rootScope.service.endpoints[endpoint_index].extra_config["auth/api-keys"];
            }
        };

        $rootScope.randomEndpointName = function () {
            dict = {
                nouns: ["account", "act", "actor", "adjustment", "advertisement", "afternoon", "agreement", "air", "airport", "ambulance", "amount", "amusement", "animal", "answer", "apparatus", "apple", "approval", "argument", "army", "art", "attack", "attempt", "attention", "attraction", "australia", "authority", "back", "balance", "balloon", "banana", "base", "battery", "beach", "beard", "bed", "behavior", "belgium", "belief", "birth", "bit", "bite", "blood", "blow", "body", "boy", "branch", "brass", "bread", "breakfast", "breath", "brother", "brother", "building", "burn", "burst", "business", "butter", "camera", "candle", "canvas", "car", "caravan", "care", "carpet", "cartoon", "cause", "chalk", "chance", "change", "church", "cloth", "coal", "color", "comfort", "committee", "company", "comparison", "competition", "condition", "connection", "control", "cook", "copper", "copy", "cork", "cough", "country", "cover", "crack", "crayon", "credit", "crime", "crowd", "crush", "cry", "current", "curve", "damage", "danger", "daughter", "day", "death", "debt", "decision", "degree", "denmark", "design", "desire", "destruction", "detail", "development", "diamond", "digestion", "dinner", "direction", "discovery", "discussion", "disease", "disgust", "distance", "distribution", "division", "doctor", "dog", "doubt", "dream", "dress", "drink", "driving", "dust", "earth", "easter", "edge", "education", "effect", "egg", "eggplant", "egypt", "elephant", "end", "energy", "engine", "england", "error", "evening", "event", "example", "exchange", "existence", "expansion", "experience", "expert", "eye", "fact", "fall", "family", "father", "fear", "feeling", "fiction", "field", "fight", "finland", "fire", "fish", "flag", "flame", "flight", "flower", "flower", "fold", "food", "football", "force", "forest", "form", "fountain", "france", "friend", "front", "fruit", "furniture", "garage", "garden", "gas", "ghost", "girl", "glass", "gold", "government", "grain", "grass", "greece", "grip", "group", "growth", "guide", "guitar", "hair", "hamburger", "harbor", "harmony", "hate", "hearing", "heat", "helicopter", "helmet", "help", "history", "hole", "holiday", "honey", "hope", "horse", "hospital", "hour", "house", "humor", "hydrogen", "ice", "idea", "impulse", "increase", "industry", "ink", "insect", "instrument", "insurance", "interest", "invention", "iron", "iron", "island", "jackal", "jelly", "jewellery", "join", "jordan", "journey", "judge", "juice", "jump", "kangaroo", "kick", "king", "kiss", "kitchen", "kite", "knife", "knowledge", "lamp", "land", "language", "laugh", "lawyer", "lead", "learning", "leather", "letter", "level", "library", "lift", "light", "lighter", "limit", "linen", "lion", "liquid", "list", "lizard", "lock", "london", "look", "loss", "love", "low", "lunch", "machine", "magazine", "magician", "man", "manager", "manchester", "mark", "market", "mass", "match", "meal", "measure", "meat", "meeting", "memory", "metal", "microphone", "middle", "milk", "mind", "mine", "minute", "mist", "money", "monkey", "month", "morning", "mother", "motion", "motorcycle", "mountain", "move", "music", "nail", "name", "napkin", "nation", "need", "needle", "nest", "news", "nigeria", "night", "night", "noise", "note", "notebook", "number", "observation", "ocean", "offer", "oil", "operation", "opinion", "orange", "order", "organization", "ornament", "owner", "oxygen", "oyster", "page", "pain", "paint", "painting", "paper", "parrot", "part", "paste", "payment", "peace", "pencil", "person", "piano", "pillow", "pizza", "place", "planet", "plant", "plastic", "play", "pleasure", "point", "poison", "polish", "porter", "portugal", "position", "potato", "powder", "power", "price", "print", "process", "produce", "profit", "property", "prose", "protest", "pull", "punishment", "purpose", "push", "quality", "queen", "question", "quill", "rain", "rain", "rainbow", "raincoat", "range", "rate", "ray", "reaction", "reading", "reason", "record", "refrigerator", "regret", "relation", "religion", "representative", "request", "respect", "rest", "restaurant", "reward", "rhythm", "rice", "river", "road", "rocket", "roll", "room", "rose", "rub", "rule", "run", "russia", "salt", "sand", "sandwich", "scale", "school", "science", "scooter", "sea", "seat", "secretary", "selection", "self", "sense", "servant", "sex", "shade", "shake", "shampoo", "shock", "shoe", "side", "sign", "silk", "silver", "sister", "size", "sky", "sleep", "slip", "slope", "smash", "smell", "smile", "smoke", "sneeze", "snow", "soap", "soccer", "society", "son", "song", "sort", "sound", "soup", "space", "spoon", "stage", "start", "statement", "steam", "steel", "step", "stitch", "stone", "stop", "story", "stretch", "structure", "substance", "sugar", "sugar", "suggestion", "summer", "support", "surprise", "sweden", "swim", "system", "talk", "taste", "tax", "teacher", "teaching", "telephone", "television", "tendency", "tent", "test", "thailan", "theory", "thing", "thought", "thunder", "time", "tin", "tomato", "toothbrush", "top", "touch", "trade", "traffic", "train", "transport", "trick", "trouble", "truck", "turn", "twist", "umbrella", "unit", "use", "value", "van", "vase", "vegetable", "verse", "vessel", "view", "voice", "vulture", "walk", "wall", "war", "wash", "waste", "water", "wave", "wax", "way", "weather", "week", "weight", "whale", "wind", "window", "wine", "winter", "wire", "woman", "wood", "wool", "word", "work", "wound", "writing", "xylophone", "yacht", "yak", "year", "zebra", "zoo"],
                adj: ["abundant", "accurate", "addicted", "adorable", "adventurous", "afraid", "aggressive", "alcoholic", "alert", "aloof", "ambitious", "ancient", "angry", "animated", "annoying", "anxious", "arrogant", "ashamed", "attractive", "auspicious", "awesome", "awful", "abactinal", "abandoned", "abashed", "abatable", "abatic", "abaxial", "abbatial", "abbreviated", "abducent", "abducting", "aberrant", "abeyant", "abhorrent", "abiding", "abient", "bad", "bashful", "beautiful", "belligerent", "beneficial", "best", "big", "bitter", "bizarre", "black", "blue", "boring", "brainy", "bright", "broad", "broken", "busy", "barren", "barricaded", "barytic", "basal", "basaltic", "baseborn", "based", "baseless", "basic", "bathyal", "battleful", "battlemented", "batty", "batwing", "bias", "calm", "capable", "careful", "careless", "caring", "cautious", "charming", "cheap", "cheerful", "chubby", "clean", "clever", "clumsy", "cold", "colorful", "comfortable", "concerned", "confused", "crowded", "cruel", "curious", "curly", "cute", "damaged", "dangerous", "dark", "deep", "defective", "delicate", "delicious", "depressed", "determined", "different", "dirty", "disgusting", "dry", "dusty", "daft", "daily", "dainty", "damn", "damning", "damp", "dampish", "darkling", "darned", "dauntless", "daylong", "early", "educated", "efficient", "elderly", "elegant", "embarrassed", "empty", "encouraging", "enthusiastic", "excellent", "exciting", "expensive", "fabulous", "fair", "faithful", "famous", "fancy", "fantastic", "fast", "fearful", "fearless", "fertile", "filthy", "foolish", "forgetful", "friendly", "funny", "gentle", "glamorous", "glorious", "gorgeous", "graceful", "grateful", "great", "greedy", "green", "handsome", "happy", "harsh", "healthy", "heavy", "helpful", "hilarious", "historical", "horrible", "hot", "huge", "humorous", "hungry", "ignorant", "illegal", "imaginary", "impolite", "important", "impossible", "innocent", "intelligent", "interesting", "jealous", "jolly", "juicy", "juvenile", "kind", "large", "legal", "light", "literate", "little", "lively", "lonely", "loud", "lovely", "lucky", "macho", "magical", "magnificent", "massive", "mature", "mean", "messy", "modern", "narrow", "nasty", "naughty", "nervous", "new", "noisy", "nutritious", "obedient", "obese", "obnoxious", "old", "overconfident", "peaceful", "pink", "polite", "poor", "powerful", "precious", "pretty", "proud", "quick", "quiet", "rapid", "rare", "red", "remarkable", "responsible", "rich", "romantic", "royal", "rude", "scintillating", "secretive", "selfish", "serious", "sharp", "shiny", "shocking", "short", "shy", "silly", "sincere", "skinny", "slim", "slow", "small", "soft", "spicy", "spiritual", "splendid", "strong", "successful", "sweet", "talented", "tall", "tense", "terrible", "terrific", "thick", "thin", "tiny", "tactful", "tailor-made", "take-charge", "tangible", "tasteful", "tasty", "teachable", "teeming", "tempean", "temperate", "tenable", "tenacious", "tender", "tender-hearted", "terrific", "testimonial", "thankful", "thankworthy", "therapeutic", "thorough", "thoughtful", "ugly", "unique", "untidy", "upset", "victorious", "violent", "vulgar", "warm", "weak", "wealthy", "wide", "wise", "witty", "wonderful", "worried", "young", "youthful", "zealous"],
                randNoun: function () { return this.nouns[Math.floor(Math.random() * this.nouns.length)] },
                randAdjective: function () { return this.adj[Math.floor(Math.random() * this.adj.length)] }
            }
            noun = dict.randNoun();
            return "/v1/" + dict.randAdjective() + '-' + noun + '/' + "{id_" + noun + "}";
        }

    });

function downloadDocument (name, content) {
    FileSaver.saveAs(new Blob([content]), name, { type: "text/plain;charset=UTF-8", autoBom: false });
}

// Avoid losing the configuration:
window.onbeforeunload = function () {
    return "Leaving now implies losing the changes configured if you didn't save. Are you sure?";
}
