'use strict';

/* Controllers */

function LocationListCtrl($scope, Admin) {
  $scope.loc = Admin.location.query();
  $scope.orderProp = 'zip';
}

//PhoneListCtrl.$inject = ['$scope', 'Phone'];



function AdminLocationDetailCtrl($scope, $routeParams, Admin) {
  $scope.loc = Admin.location.get({locationId: $routeParams.locationId});
  $scope.cars = Admin.car.query({locationId: $routeParams.locationId});
/*
  $scope.setImage = function(imageUrl) {
    $scope.mainImageUrl = imageUrl;
  }*/
}

function AdminCreateCarCtrl($scope, $routeParams, Admin) {
}


function AdminEditCarCtrl(AdminEditCarCtrl) {
	
}