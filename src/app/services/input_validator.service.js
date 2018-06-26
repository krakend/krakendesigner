angular
.module('KrakenDesigner')
.service("InputValidator", function () {
    return {
         isInteger: function(integer) {
            return angular.isNumber(integer)
        },
        isEmpty: function(value) {
            return isEmpty(value)
        }
    };
})