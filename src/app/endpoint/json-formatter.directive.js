angular
.module('KrakenDesigner')
.directive('jsonFormatter', function() {
	return {
		restrict: 'A',
		require: 'ngModel',
		scope: true,
		link: function(scope, element, attrs, ngModel) {
			function toObject(input) {
				try {
					var json_object = null;
					if ( '' != input ) {
						json_object = JSON.parse(input);
					}
					delete scope.service.extra_config['krakendesigner'].json_errors;
					return json_object;
				} catch(e) {
					scope.service.extra_config['krakendesigner'].json_valid = true;
					scope.service.extra_config['krakendesigner'].json_errors = e.message;
					return false;
				}
			}
			function toString(data) {
				return JSON.stringify(data, undefined, 2);
			}
			ngModel.$parsers.push(toObject);
			ngModel.$formatters.push(toString);
		}
	};
});