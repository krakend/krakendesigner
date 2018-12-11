angular.module("KrakenDesigner").directive("emulator", [
	"Constants",
	"$location",
	function(Constants, location) {
		return {
			restrict: "E",
			templateUrl: "/src/app/emulator/emulator.html",
			scope: {
				endpoints: "=",
				output: "="
			},
			link: function(scope, element, attrs) {
				scope.constants = Constants;
				// Get endpoint data from URL ?target=endpoint_index
				if ("undefined" !== location.search().target) {
					var endpoint_index = location.search().target;
					if (
						"undefined" !== typeof scope.endpoints[endpoint_index]
					) {

            scope.input_method =
							scope.endpoints[endpoint_index].method == ""
								? "GET"
								: scope.endpoints[endpoint_index].method;

						scope.input_URL =
							scope.endpoints[endpoint_index].endpoint;
					}
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

					if (
						"undefined" === typeof requestURL ||
						"" === requestURL
					) {
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
					if (
						"undefined" === typeof requestHeaders ||
						requestHeaders == ""
					) {
						requestHeaders = "{}";
					}

					if (
						"undefined" === typeof requestMethod ||
						requestMethod == ""
					) {
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

				scope.addKeyPair = function(key, value, in_object = false) {
					if (in_object) {
						scope.endpoints.extra_config[NAMESPACE][in_object][
							key
						] = value;
					} else {
						scope.endpoints.extra_config[NAMESPACE][key] = value;
					}
				};

				scope.deleteKey = function(key, in_object = false) {
					if (in_object) {
						delete scope.endpoints.extra_config[NAMESPACE][
							in_object
						][key];
					} else {
						delete scope.endpoints.extra_config[NAMESPACE][key];
					}
				};

				scope.addTermToList = function(term, list) {
					if ("undefined" === typeof term || term.length < 1) {
						return;
					}

					if (
						"undefined" ===
						typeof scope.endpoints.extra_config[NAMESPACE][list]
					) {
						scope.endpoints.extra_config[NAMESPACE][list] = [];
					}

					if (
						scope.endpoints.extra_config[NAMESPACE][list].indexOf(
							term
						) === -1
					) {
						scope.endpoints.extra_config[NAMESPACE][list].push(
							term
						);
					}
				};

				scope.deleteIndexFromList = function(index, list) {
					scope.endpoints.extra_config[NAMESPACE][list].splice(
						index,
						1
					);
				};
			}
		};
	}
]);
