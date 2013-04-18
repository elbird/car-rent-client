'use strict';

/* Controllers */
function MainCtrl($scope, $location) {
	$scope.navItems = [{
		id : "home",
		name: "Home",
		url: "#/home/",
		active: ""
	}, {
		id: "rent",
		name: "Verleih",
		url: "#/rent/",
		active: ""
	}, {
		id: "admin",
		name: "Admin",
		url: "#/admin/",
		active: ""
	}];

	function setRessources(path) {
		var i,
			result = /^\/(\w+)/.exec(path);
		result = result || "home";
		for (i = 0; i < $scope.navItems.length; i++) {
			if ($scope.navItems[i].id === result[1]) {
				$scope.navItems[i].active = "active";
			} else {
				$scope.navItems[i].active = "";
			}
		}
		switch (result[1]) {
			case "home":
				$scope.template = "partials/home-hero.html";
				break;
			case "admin":
				$scope.template = "partials/admin/admin-content.html";
				break;
			case "rent":
				$scope.template = "partials/rent/rent-content.html";
				break;
		}
	}
	setRessources($location.path());
	$scope.$on("$locationChangeSuccess", function  (e, data) {
		setRessources($location.path());
	});
}



function LocationListCtrl($scope, LocationCar) {
  $scope.locations = LocationCar.Location.query();
  $scope.orderProp = 'zip';
}


/**
 * HOME Section
 */

function HomeCtrl($scope, $location, LocationCar) {

}


/**
 * RENT Section
 */

function RentLocationsCtrl($scope, $location, LocationCar) {

}

function RentLocationsCarsCtrl($scope, $location, LocationCar) {

}

function RentBookingCtrl($scope, $location, LocationCar) {

}

/**
 * ADMIN Section
 */

function AdminLocationDetailCtrl($scope, $routeParams, $dialog, $location, LocationCar) {
  $scope.location = LocationCar.Location.get({locationId: $routeParams.locationId});
  $scope.cars = LocationCar.Car.query({rentallocation_id: $routeParams.locationId});
  $scope.newCar = function () {
  	$location.path("/admin/" + $scope.location.id + "/car/new");
  };
  $scope.deleteCar = function (carId, locationId) {
  	var title = 'Mietauto löschen',
  		msg = 'Wollen Sie das Mietauto wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden!',
  		btns = [{result:'cancel', label: 'Abbrechen'}, {result:'ok', label: 'Löschen', cssClass: 'btn-danger'}];
  	$dialog.messageBox(title, msg, btns)
	    .open()
	    .then(function(result){
	    	if (result === "ok") {
	    		LocationCar.Car.remove({rentallocation_id: locationId, id: carId.split('/')[2]}).$then(function () {
		  			$scope.cars = LocationCar.Car.query({rentallocation_id: $routeParams.locationId});
		  		});
	    	}
	  	});
  };
/*
  $scope.setImage = function(imageUrl) {
    $scope.mainImageUrl = imageUrl;
  }*/
}

function AdminEditCarCtrl($scope, $routeParams, $location, LocationCar) {
	if ($routeParams.carId) {
		$scope.car = LocationCar.Car.get({rentallocation_id: $routeParams.locationId, id: $routeParams.carId});
	} else {
		$scope.car = new LocationCar.Car({rentallocation_id: $routeParams.locationId});
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