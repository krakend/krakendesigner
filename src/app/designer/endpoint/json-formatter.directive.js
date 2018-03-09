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
					json_object = JSON.parse(input);
					scope.$parent.backend.martian_syntax_validation = true;
					return json_object;
				} catch(e) {
					scope.$parent.backend.martian_syntax_validation = e.message;
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