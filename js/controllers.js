'use strict';

/* Controllers */

function LocationListCtrl($scope, Admin) {
  $scope.locations = Admin.Location.query();
  $scope.orderProp = 'zip';
}

//PhoneListCtrl.$inject = ['$scope', 'Phone'];



function AdminLocationDetailCtrl($scope, $routeParams, $dialog, Admin) {
  $scope.location = Admin.Location.get({locationId: $routeParams.locationId});
  $scope.cars = Admin.Car.query({rentallocation_id: $routeParams.locationId});
  $scope.deleteCar = function (carId, locationId) {
  	var title = 'Mietauto löschen',
  		msg = 'Wollen Sie das Mietauto wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden!',
  		btns = [{result:'cancel', label: 'Abbrechen'}, {result:'ok', label: 'Löschen', cssClass: 'btn-danger'}];
  	$dialog.messageBox(title, msg, btns)
	    .open()
	    .then(function(result){
	    	if (result === "ok") {
	    		Admin.Car.remove({rentallocation_id: locationId, id: carId.split('/')[2]}).$then(function () {
		  			$scope.cars = Admin.Car.query({rentallocation_id: $routeParams.locationId});
		  		});
	    	}
	  	});
  };
/*
  $scope.setImage = function(imageUrl) {
    $scope.mainImageUrl = imageUrl;
  }*/
}

function AdminEditCarCtrl($scope, $routeParams, $location, Admin) {
	if ($routeParams.carId) {
		$scope.car = Admin.Car.get({rentallocation_id: $routeParams.locationId, id: $routeParams.carId});
	} else {
		$scope.car = new Admin.Car({rentallocation_id: $routeParams.locationId});
	}
	$scope.submit = function () {
		function saveRentalCar() {
			if ($routeParams.carId) {
				$scope.car.angularShortId = $routeParams.carId;
			}
			$scope.car.rentallocation_id = $routeParams.locationId;
			$scope.car.$save();
			$location.path('/admin/' + $routeParams.locationId);
		}
		if ($scope.car.$then) {
			$scope.car.$then(saveRentalCar);
		} else {
			saveRentalCar();
		}
	};
	$scope.cancel = function () {
		$location.path('/admin/' + $routeParams.locationId);
	};
}