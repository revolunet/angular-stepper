'use strict';

angular.module('ngFactoryDocs')

.controller('Example2Ctrl', function($scope) {
  $scope.product = {
    quantity:10
  };
  $scope.config = {
    min: 5,
    max: 15
  };
});
