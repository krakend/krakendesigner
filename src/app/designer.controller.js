angular.module('KrakenDesigner').controller('KrakenDesignerController', function ($scope, $rootScope, $location, DataService) {

    // Default initial values set in any configuration generation:
    $rootScope.service = DataService.configuration;

    $rootScope.save = function () {
        if ('undefined' === typeof $rootScope.service.endpoints || $rootScope.service.endpoints.length < 1) {
            alert("At least you need to define an endpoint");
            return false;
        }
        $rootScope.setDefaultData();

        var date = new Date().getTime();
        downloadDocument(date + "-krakend.json", angular.toJson($rootScope.service, true)); // Beautify
        $rootScope.saved_once = true;
    };

    $rootScope.loadFile = function () {
        try {
            var loaded_json = JSON.parse($scope.service_configuration);
            DataService.configuration = loaded_json;
            $rootScope.service = DataService.configuration;
            $rootScope.dropzone_loaded = true;
        } catch (e) {
            alert("Failed to parse the selected JSON file.\n\n" + e.message);
        }
    };

    $rootScope.setDefaultData = function () {
        if ( typeof $rootScope.service.extra_config['krakendesigner']['endpoint_defaults'] === 'undefined') {
            return false;
        }

        for( var i=0; i<$rootScope.service.endpoints.length; i++) {
            if ( typeof $rootScope.service.endpoints[i].extra_config['github.com/devopsfaith/krakend-ratelimit/juju/router'] === 'undefined' )
                $rootScope.service.endpoints[i].extra_config['github.com/devopsfaith/krakend-ratelimit/juju/router']
            = $rootScope.service.extra_config['krakendesigner']['endpoint_defaults']['github.com/devopsfaith/krakend-ratelimit/juju/router']

        }
    };


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

    $rootScope.deleteEtcdMachine = function (index) {

        var array = $scope.service.extra_config['github_com/devopsfaith/krakend-etcd'].machines;
        array.splice(index, 1);
    };



    $rootScope.addHost = function (host, sd_type) {

        if ('static' === sd_type && ! /^https?:\/\/.+/i.test(host)) {
            alert('Please include de protocol http in the URL');
            return false;
        }

        if (typeof $rootScope.service.sd_providers === "undefined") {
            $rootScope.service.sd_providers = {};
        }

        if (typeof $rootScope.service.sd_providers.hosts === "undefined") {
            $rootScope.service.sd_providers.hosts = [];
        }

        // Avoid duplicates:
        for (var i=0; i < $rootScope.service.sd_providers.hosts.length; i++) {
         if ( $rootScope.service.sd_providers.hosts[i].sd === sd_type &&
            $rootScope.service.sd_providers.hosts[i].host === host ) {
            return false;
    }
}

$rootScope.service.sd_providers.hosts.push({ "sd": sd_type, "host": host });

};

$rootScope.addEtcdMachine = function () {
    var sd_container = '#addEtcdMachine';
    var sd = $(sd_container).val();

    if (/^https?:\/\/.+/i.test(sd)) {

        if (typeof $rootScope.service.extra_config['github_com/devopsfaith/krakend-etcd'].machines === "undefined") {
            $rootScope.service.extra_config['github_com/devopsfaith/krakend-etcd'].machines = [];
        }

        $rootScope.addTermToArray(sd, "$rootScope.service.extra_config['github_com/devopsfaith/krakend-etcd'].machines");
    }
};




$rootScope.deleteWhitelist = function (white, backend_index, endpoint_index) {
    $rootScope.service.endpoints[endpoint_index].backend[backend_index].whitelist.splice(white - 1, 1);
};

$rootScope.deleteBlacklist = function (black, backend_index, endpoint_index) {
    $rootScope.service.endpoints[endpoint_index].backend[backend_index].blacklist.splice(black - 1, 1);
};


$rootScope.addWhitelist = function (endpoint_index, backend_index) {

    var container_name_with_value = '#wl' + endpoint_index + backend_index;

        // Create object if it doesn't exist yet
        if ('undefined' === typeof $rootScope.service.endpoints[endpoint_index].backend[backend_index].whitelist) {
            $rootScope.service.endpoints[endpoint_index].backend[backend_index].whitelist = [];
        }

        $rootScope.addTermToArray(
            $(container_name_with_value).val(),
            $rootScope.service.endpoints[endpoint_index].backend[backend_index].whitelist
            );

    };


    $rootScope.addBlacklist = function (endpoint_index, backend_index) {

        var container_name_with_value = '#bl' + endpoint_index + backend_index;

        // Create object if it doesn't exist yet
        if ('undefined' === typeof $rootScope.service.endpoints[endpoint_index].backend[backend_index].blacklist) {
            $rootScope.service.endpoints[endpoint_index].backend[backend_index].blacklist = [];
        }

        $rootScope.addTermToArray(
            $(container_name_with_value).val(),
            $rootScope.service.endpoints[endpoint_index].backend[backend_index].blacklist
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

    $rootScope.addEndpoint = function () {

        if ( typeof $rootScope.service.sd_providers==="undefined" || typeof $rootScope.service.sd_providers.hosts === "undefined" || 1 < $rootScope.service.length) {
            alert("You need to add at least one host in the Service Configuration or Service Discovery panels.");
            return false;
        }

        if (typeof $rootScope.service.endpoints === "undefined") {
            $rootScope.service.endpoints = [];
        }
        $rootScope.service.endpoints.push({"endpoint": "/", "method": "GET"});
    };

    // Valid endpoints start with Slash and do not contain /__debug[/]
    $rootScope.isValidEndpoint = function (endpoint) {
        return !(/^[^\/]|\/__debug(\/.*)?$|\/favicon\.ico/i.test(endpoint));
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

        var num_backends = ( 'undefined' === typeof $rootScope.service.endpoints[endpoint_index].backend ? 0 : $rootScope.service.endpoints[endpoint_index].backend.length );
        if (num_backends > 1) {
            if (old_value == 'GET' && confirm(message)) {
                $rootScope.service.endpoints[endpoint_index].backend.splice(1, 10000);
            } else {
                // Angular already updated the value, revert:
                $rootScope.service.endpoints[endpoint_index].method = 'GET';
            }
        }
    };


    $rootScope.addBackendQuery = function (endpoint_index) {

        if (typeof $rootScope.service.endpoints[endpoint_index].backend === "undefined") {
            $rootScope.service.endpoints[endpoint_index].backend = [];
        }

        $rootScope.service.endpoints[endpoint_index].backend.push({"url_pattern": "/"});
    };

    $rootScope.toggleCaching = function($event, endpoint_index, backend_index) {
        if ( $event.target.checked ) {
            // Create the key that enables caching:
            $rootScope.service.endpoints[endpoint_index].backend[backend_index].extra_config['github.com/devopsfaith/krakend-httpcache'] = {};
        } else {
            delete $rootScope.service.endpoints[endpoint_index].backend[backend_index].extra_config['github.com/devopsfaith/krakend-httpcache'];
        }
    }

    $rootScope.deleteBackendQuery = function (endpoint_index, backend_index, message) {
        if (confirm(message)) {
            $rootScope.service.endpoints[endpoint_index].backend.splice(backend_index, 1);
        }
    };

    $rootScope.addQuerystring = function (endpoint_index) {

        if (typeof $rootScope.service.endpoints[endpoint_index].querystring_params === "undefined") {
            $rootScope.service.endpoints[endpoint_index].querystring_params = [];
        }

        var term = document.getElementById('addQuerystring_' + endpoint_index).value;
        if (term.length > 0 && $rootScope.service.endpoints[endpoint_index].querystring_params.indexOf(term) === -1) {
            $rootScope.service.endpoints[endpoint_index].querystring_params.push(term);
        }
    };


    $rootScope.deleteQuerystring = function (query_index, endpoint_index) {
        $rootScope.service.endpoints[endpoint_index].querystring_params.splice(query_index, 1);
    };


    $rootScope.addHeaderPassing = function (endpoint_index, header) {
        if (typeof $rootScope.service.endpoints[endpoint_index].headers_to_pass === "undefined") {
            $rootScope.service.endpoints[endpoint_index].headers_to_pass = [];
        }

        $rootScope.addTermToArray( header, $rootScope.service.endpoints[endpoint_index].headers_to_pass );
    };

    $rootScope.deleteHeaderPassing = function (endpoint_index, header_index) {
        $rootScope.service.endpoints[endpoint_index].headers_to_pass.splice(header_index,1);
    };

})
.factory("DataService", function ($http) {
    var service = {
        configuration: {
            version: 2,
            extra_config: {
                'github_com/devopsfaith/krakend-gologging': {
                    level:  "ERROR",
                    prefix: "[KRAKEND]",
                    syslog: false,
                    stdout: true
                }
            }
        }
    };

    return service;
});

function downloadDocument(name, content) {
    saveAs(new Blob([content], {type: "text/plain;charset=UTF-8"}), name);
}

// Avoid losing the configuration:
window.onbeforeunload = function () {
    return "Leaving now implies losing the changes configured so far. Are you sure?";
}