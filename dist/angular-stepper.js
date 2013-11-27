/*! angular-stepper - v0.0.1 - 2013-11-27
* Copyright (c) Julien Bouquillon [revolunet] 2013; Licensed  */
angular.module('revolunet.stepper', [])

.directive('rnStepper', function() {
    return {
        restrict: 'AE',
        require: 'ngModel',
        scope: {
            min: '=',
            max: '='
        },
        template: '<button ng-disabled="isOverMin()" ng-click="decrement()">-</button>' +
                  '<div></div>' +
                  '<button ng-disabled="isOverMax()" ng-click="increment()">+</button>',
        link: function(scope, iElement, iAttrs, ngModelController) {

            ngModelController.$render = function() {
                iElement.find('div').text(ngModelController.$viewValue);
            };

            function checkValidity() {
                // check if min/max defined to check validity
                var valid = !(scope.isOverMin(true) || scope.isOverMax(true));
                // set our model validity
                // the outOfBounds is an arbitrary key for the error.
                // will be used to generate the CSS class names for the errors
                ngModelController.$setValidity('outOfBounds', valid);
            }

            function updateModel(offset) {
                // update the model, call $parsers pipeline...
                ngModelController.$setViewValue(ngModelController.$viewValue + offset);
                // update the local view
                ngModelController.$render();
                // update the validation status
                checkValidity();
            }

            scope.isOverMin = function(strict) {
                var offset = strict?0:1;
                return (angular.isDefined(scope.min) && (ngModelController.$viewValue - offset) < parseInt(scope.min, 10));
            };
            scope.isOverMax = function(strict) {
                var offset = strict?0:1;
                return (angular.isDefined(scope.max) && (ngModelController.$viewValue + offset) > parseInt(scope.max, 10));
            };


            // update the value when user clicks the buttons
            scope.increment = function() {
                updateModel(+1);
            };
            scope.decrement = function() {
                updateModel(-1);
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
