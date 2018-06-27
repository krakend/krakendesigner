angular
.module('KrakenDesigner')
.service("InputValidator", function () {
	return {
		isInteger: function(integer) {
			return angular.isNumber(integer)
		},
		isEmpty: function(value) {
			return ( 'undefined' === typeof value || ( 'object' == typeof value && 1 > value.length) || !value )
		},
		isValidTimeUnit: function (time_with_unit) {

			return (
				'undefined' === typeof time_with_unit ||
				'' == time_with_unit ||
				/^\d+(ns|us|µs|ms|s|m|h)$/.test(time_with_unit)
				);
		},
		hasHTTP: function(url) {
			return( /^https?:\/\/.+/i.test(url) )
		}
	};
})