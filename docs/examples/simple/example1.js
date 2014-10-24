'use strict';

angular.module('ngFactoryDocs')

.controller('Example1Ctrl', function($scope) {
  $scope.product = {
    quantity:10
  };
  $scope.config = {
    min: 5,
    max: 15
  };
});
