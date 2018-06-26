angular
.module('KrakenDesigner')
.service("InputValidator", function () {
	return {
		isInteger: function(integer) {
			return angular.isNumber(integer)
		},
		isEmpty: function(value) {
			return isEmpty(value)
		},
		isValidTimeUnit: function (time_with_unit) {

			return (
				'undefined' === typeof time_with_unit ||
				'' == time_with_unit ||
				/^\d+(ns|us|µs|ms|s|m|h)$/.test(time_with_unit)
				);
		}
	};
})