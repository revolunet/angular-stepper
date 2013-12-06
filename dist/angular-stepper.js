/*! angular-stepper - v0.0.1 - 2013-12-06
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
                // update the validation status
                checkValidity();
            };

            // when model change, cast to integer
            ngModelController.$formatters.push(function(value) {
                return parseInt(value, 10);
            });

            // when view change, cast to integer
            ngModelController.$parsers.push(function(value) {
                return parseInt(value, 10);
            });

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

// describe keyword is used to define a test suite (group of tests)
describe('rnStepper directive', function() {

    // declare some global vars to be used in the tests
    var elm,        // our directive jqLite element
        scope;      // the scope where our directive is inserted

    // load the modules we want to test
    beforeEach(module('revolunet.stepper'));

    // before each test
    // creates a fresh scope
    beforeEach(inject(function(_$rootScope_, $compile) {
        scope = _$rootScope_.$new();
        scope.testModel = 42;
    }));

    function compileDirective(tpl) {
        // compile a fresh directive with the given template, or default
        // compile the tpl with the $rootScope created above
        // wrap our directive inside a form to be able to test
        // that our form integration works well (via ngModelController)
        if (!tpl) tpl = '<div rn-stepper ng-model="testModel"></div></form>';
        tpl = '<form name="form">' + tpl + '</tpl>';
        // inject allows you to use AngularJS dependency injection
        // to retrieve and use other services
        inject(function($compile) {
            var form = $compile(tpl)(scope);
            elm = form.find('div');
        });
        scope.$digest();
    }

    describe('initialisation', function() {
        // before each test in this block, generates a fresh directive
        beforeEach(function() {
            compileDirective();
        });
        // a single test example
        it('should produce 2 buttons and a div', function() {
            expect(elm.find('button').length).toEqual(2);
            expect(elm.find('div').length).toEqual(1);
        });
        it('should check validity on init', function() {
            expect(scope.form.$valid).toBeTruthy();
        });
    });
    describe('bounds detection for MIN', function() {
        it('should update form validity initialy', function() {
            scope.testMin = 45;
            compileDirective('<div rn-stepper min="testMin" ng-model="testModel"></div>');
            expect(scope.form.$valid).toBeFalsy();
        });
        it('should expose isOverMin method on the isolated scope', function() {
            compileDirective();
            expect(elm.isolateScope().isOverMin).toBeDefined();
        });
        it('isOverMin method should return false when no min defined', function() {
            compileDirective();
            expect(elm.isolateScope().isOverMin()).toBeFalsy();
        });
        it('isOverMin method should return false when min not reached', function() {
            compileDirective('<div rn-stepper min="40" ng-model="testModel"></div>');
            expect(elm.isolateScope().isOverMin()).toBeFalsy();
        });
        it('isOverMin method should return true when min reached', function() {
            compileDirective('<div rn-stepper min="45" ng-model="testModel"></div>');
            expect(elm.isolateScope().isOverMin()).toBeTruthy();
        });
        it('decrease button should be disabled when min reached.', function() {
            compileDirective('<div rn-stepper min="40" ng-model="testModel"></div>');
            expect(elm.find('button').attr('disabled')).not.toBeDefined();
            scope.testModel = 40;
            scope.$digest();
            expect(elm.find('button').attr('disabled')).toEqual('disabled');
        });
        it('min can be updated dynamically and update button disabled status', function() {
            scope.testMin = 42;
            compileDirective('<div rn-stepper min="testMin" ng-model="testModel"></div>');
            expect(elm.find('button').attr('disabled')).toEqual('disabled');
            scope.testMin = 40;
            scope.$digest();
            expect(elm.find('button').attr('disabled')).not.toBeDefined();
        });
    });
    describe('bounds detection for MAX', function() {
        it('should update form validity initialy', function() {
            scope.testMax = 40;
            compileDirective('<div rn-stepper max="testMax" ng-model="testModel"></div>');
            expect(scope.form.$valid).toBeFalsy();
        });
        it('should expose isOverMax method on the isolated scope', function() {
            compileDirective();
            expect(elm.isolateScope().isOverMax).toBeDefined();
        });
        it('isOverMax method should return false when no max defined', function() {
            compileDirective();
            expect(elm.isolateScope().isOverMax()).toBeFalsy();
        });
        it('isOverMax method should return false when max not reached', function() {
            compileDirective('<div rn-stepper max="50" ng-model="testModel"></div>');
            expect(elm.isolateScope().isOverMax()).toBeFalsy();
        });
        it('isOverMax method should return true when max reached', function() {
            compileDirective('<div rn-stepper max="35" ng-model="testModel"></div>');
            expect(elm.isolateScope().isOverMax()).toBeTruthy();
        });
        it('decrease button should be disabled when max reached.', function() {
            compileDirective('<div rn-stepper max="45" ng-model="testModel"></div>');
            expect(angular.element(elm.find('button')[1]).attr('disabled')).not.toBeDefined();
            scope.testModel = 45;
            scope.$digest();
            expect(angular.element(elm.find('button')[1]).attr('disabled')).toEqual('disabled');
        });
        it('max can be updated dynamically and update button disabled status', function() {
            scope.testMax = 42;
            compileDirective('<div rn-stepper max="testMax" ng-model="testModel"></div>');
            expect(angular.element(elm.find('button')[1]).attr('disabled')).toEqual('disabled');
            scope.testMax = 50;
            scope.$digest();
            expect(angular.element(elm.find('button')[1]).attr('disabled')).not.toBeDefined();
        });
    });
    describe('ngModel integration', function() {
        it('should update form validity when min changes', function() {
            scope.testMin = 40;
            compileDirective('<div rn-stepper min="testMin" ng-model="testModel"></div>');
            expect(scope.form.$valid).toBeTruthy();
            scope.testMin =45;
            scope.$digest();
            expect(scope.form.$valid).toBeFalsy();
        });
        it('should update form validity when max changes', function() {
            scope.testMax = 50;
            compileDirective('<div rn-stepper max="testMax" ng-model="testModel"></div>');
            expect(scope.form.$valid).toBeTruthy();
            scope.testMax =35;
            scope.$digest();
            expect(scope.form.$valid).toBeFalsy();
        });
        it('should update form validity when model changes', function() {
            scope.testMin = 40;
            compileDirective('<div rn-stepper min="testMin" ng-model="testModel"></div>');
            expect(scope.form.$valid).toBeTruthy();
            scope.testModel = 35;
            scope.$digest();
            expect(scope.form.$valid).toBeFalsy();
        });
        // same for MAX
    });
    describe('increment', function() {
        it('should increment model value', function() {
            compileDirective();
            elm.isolateScope().increment();
            expect(scope.testModel).toEqual(43);
        });
        it('should update view', function() {
            compileDirective();
            elm.isolateScope().increment();
            expect(elm.find('div').html()).toEqual('43');
        });
        it('should update form dirty state', function() {
            compileDirective();
            expect(scope.form.$dirty).toBeFalsy();
            elm.isolateScope().increment();
            expect(scope.form.$dirty).toBeTruthy();
        });
    });
    describe('decrement', function() {
        it('should decrement model value', function() {
            compileDirective();
            elm.isolateScope().decrement();
            expect(scope.testModel).toEqual(41);
        });
        it('should update view', function() {
            compileDirective();
            elm.isolateScope().decrement();
            expect(elm.find('div').html()).toEqual('41');
        });
        it('should update form dirty state', function() {
            compileDirective();
            expect(scope.form.$dirty).toBeFalsy();
            elm.isolateScope().decrement();
            expect(scope.form.$dirty).toBeTruthy();
        });
    });
    
});
