angular.module('example1', ['revolunet.stepper'])

.controller('Example1Ctrl', function() {
    $scope.product = {
        quantity:10
    };
    $scope.config = {
        min: 5,
        max: 15
    };
});
