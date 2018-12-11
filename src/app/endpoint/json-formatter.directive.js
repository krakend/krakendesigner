angular
.module('KrakenDesigner')
.directive('jsonFormatter', function() {
	return {
		restrict: 'A',
		require: 'ngModel',
		scope: {
			syntax_problems: "=syntax"
		},
		link: function(scope, element, attrs, ngModel) {
			function toObject(input) {
				try {
					var json_object = null;
					if ( '' != input ) {
						json_object = JSON.parse(input);
					}
					scope.syntax_problems = false;
					return json_object;
				} catch(e) {
					scope.syntax_problems = e.message;
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