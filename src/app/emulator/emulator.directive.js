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
							scope.endpoints[endpoint_index].method;
						scope.input_URL =
							scope.endpoints[endpoint_index].endpoint;
					}
				}

				scope.printKrakendOutput = function(r) {
					scope.$apply(function() {
						scope.output = {
							statusCode: r.statusCode,
							header: JSON.stringify(r.header, null, 4),
							body: JSON.stringify(JSON.parse(r.body), null, 4)
							//body:
						};
					});
					console.log(
						"KrakenD endpoint status: " + scope.output.statusCode
					);
				};

				scope.runEndpoint = function(
					requestMethod,
					requestURL,
					requestBody,
					requestHeaders
				) {
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

					krakendClient.test(
						requestMethod,
						requestURL,
						requestBody,
						requestHeaders,
						scope.printKrakendOutput
					);
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
