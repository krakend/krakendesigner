angular.module("KrakenDesigner").directive("emulator", [
	"Constants",
	"$location",
	function(Constants, location) {
		return {
			restrict: "E",
			templateUrl: "/src/app/emulator/emulator.html",
			scope: {
				endpoints: "="
			},
			link: function(scope, element, attrs) {
				scope.constants = Constants;
				scope.selectEndpoint = function(endpoint_index) {
					if ("undefined" !== typeof scope.endpoints[endpoint_index]) {
						scope.input_method =
							scope.endpoints[endpoint_index].method == ""
								? "GET"
								: scope.endpoints[endpoint_index].method;

						scope.input_URL =
							scope.endpoints[endpoint_index].endpoint;

						scope.selected_endpoint = endpoint_index;
					}

				};

				// Get endpoint data from URL ?target=endpoint_index
				if ("undefined" !== location.search().target) {
					endpoint_index = location.search().target;
					scope.selectEndpoint(endpoint_index);
				}

				scope.beautify = function(string) {
					try {
						string = JSON.parse(string);
					} catch (e) {
						// Wasn't a json
					}
					return JSON.stringify(string, null, 4);
				};

				scope.printKrakendOutput = function(r) {
					if ("undefined" !== typeof r.statusCode) {
						scope.$apply(function() {
							scope.output = {
								statusCode: r.statusCode,
								header: scope.beautify(r.header),
								body: scope.beautify(r.body)
								//body:
							};
						});
					}
				};

				scope.runEndpoint = function(
					requestMethod,
					requestURL,
					requestBody,
					requestHeaders
				) {
					var has_undefined_parameters = /(\{[a-z0-9_]+\})+/;

					if ( "undefined" === typeof requestURL || "" === requestURL	) {
						return false;
					}

					if (requestURL.match(has_undefined_parameters)) {
						alert(
							"Please replace all parameters in URL with actual values"
						);
						return false;
					}

					if ("undefined" === typeof requestBody) {
						requestBody = "";
					}
					if ("undefined" === typeof requestHeaders || requestHeaders == "") {
						requestHeaders = "{}";
					}

					if ("undefined" === typeof requestMethod || requestMethod == "") {
						requestMethod = "GET";
					}

					try {
						krakendClient.test(
							requestMethod,
							requestURL,
							requestBody,
							requestHeaders,
							scope.printKrakendOutput
						);
					} catch (e) {
						alert(
							"The KrakenD emulator has died. Reload the page.\n\n" +
								e.message
						);
					}
				};

				scope.deleteOutput = function() {
					delete scope.output;
				};
			}
		};
	}
]);
