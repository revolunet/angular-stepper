/*! angular-stepper - v0.0.1 - 2013-11-27
* Copyright (c) Julien Bouquillon [revolunet] 2013; Licensed  */
angular.module('revolunet.stepper')

.directive('rnStepper', function() {
    return {
        restrict: 'AE',
        require: 'ngModel',
        scope: {
            value: '=ngModel',
            min: '=',
            max: '='
        },
        template: '<button ng-disabled="isOverMin()" ng-click="decrement()">-</button>' +
                  '<div>{{ value }}</div>' +
                  '<button ng-disabled="isOverMax()" ng-click="increment()">+</button>',
        link: function(scope, iElement, iAttrs, ngModelController) {
            scope.isOverMin = function(strict) {
                var offset = strict?0:1;
                return (angular.isDefined(scope.min) && (scope.value - offset) < parseInt(scope.min, 10));
            };
            scope.isOverMax = function(strict) {
                var offset = strict?0:1;
                return (angular.isDefined(scope.max) && (scope.value + offset) > parseInt(scope.max, 10));
            };
            function checkValidity() {
                // check if min/max defined to check validity
                var valid = !(scope.isOverMin(true) || scope.isOverMax(true));
                // set our model validity
                // the outOfBounds is an arbitrary key for the error.
                // will be used to generate the CSS class names for the errors
                ngModelController.$setValidity('outOfBounds', valid);
            }
            // check validity when value change
            scope.increment = function() {
                scope.value++;
                checkValidity();
                ngModelController.$setViewValue(scope.value);
            };
            scope.decrement = function() {
                scope.value--;
                checkValidity();
                ngModelController.$setViewValue(scope.value);
            };
            // check validity on start, in case we're directly out of bounds
            checkValidity();
            // watch out min/max and recheck validity when they change
            scope.$watch('min+max', function() {
                checkValidity();
            });
        }
    };
});
