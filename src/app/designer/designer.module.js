(function () {


    'use strict';

    /**
     * Word of advice. This was coded by a backend monkey who didn't do frontend for the past 15 years and played with
     * Angular only for a while. The monkey went through a period of sickness after this week, but now looks like he is
     * fully recovered. Despite everything the application works.
     *
     * @TODO: Refactor and data validation.
     *
     * PRs are more than welcome.
     */


    angular
        .module('KrakenDesigner', ['ngRoute'])
        .config(config);

    config.$inject = ['$routeProvider'];


    function config( $routeProvider ) {

        // Known Routes:
        $routeProvider
            .when('/', {
                templateUrl: '/src/app/html/components/dashboard.html',
                controller: 'KrakenDesignerController'
            })
            .when('/service', {
                templateUrl: '/src/app/html/components/form_service_configuration.html',
                controller: 'KrakenDesignerController'
            })
            .when('/endpoints', {
                templateUrl: '/src/app/html/components/form_endpoints.html',
                controller: 'KrakenDesignerController'
            })
            .when('/oauth', {
                templateUrl: '/src/app/html/components/form_oauth.html',
                controller: 'KrakenDesignerController'
            })
            .when('/security', {
                templateUrl: '/src/app/html/components/form_security.html',
                controller: 'KrakenDesignerController'
            })
            .when('/service-discovery', {
                templateUrl: '/src/app/html/components/form_service_discovery.html',
                controller: 'KrakenDesignerController'
            })
             .when('/logging', {
                templateUrl: '/src/app/html/components/form_logging.html',
                controller: 'KrakenDesignerController'
            })
            .otherwise({
                redirectTo: '/'
            });

    }
})();