'use strict';


/* Controllers */
function MainCtrl($scope, $location, $cookieStore, User) {
	$scope.loginInfo = User.getLoginInfo();

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

	$scope.login = function () {
		$scope.loginInfo = User.login(this.loginEmail, this.loginPassword);
	};

	$scope.logout = function () {
		$scope.loginInfo = User.logout();
	};

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




/**
 * HOME Section
 */

function HomeCtrl($scope, $location, $q, $dialog, User, Booking, LocationCar, CalculatePrice) {
	$scope.loginInfo = User.getLoginInfo();
	$scope.bookings = Booking.query({user_id: $scope.loginInfo.user.id});
	$scope.cars = {};
	$scope.bookings.$then(function () {
		var i, carId, locationId,
			cars = [];
		for (i = 0; i < $scope.bookings.length; i++) {
			if ($scope.bookings[i].rentalcar_id) {
				carId = $scope.bookings[i].rentalcar_id.split('/')[2];
				locationId = $scope.bookings[i].rentalcar_id.split('/')[1];
				cars.push(LocationCar.Car.get({rentallocation_id: locationId, id: carId}));
				$scope.bookings[i].price = CalculatePrice.calculate({id: $scope.bookings[i].id});
			}
		}
		return $q.all(cars);
	}).then(function (cars) {
		var i, carsObj = {};
		for (i = 0; i < cars.length; i++) {
			cars[i].$then(function (car) {
				$scope.cars[car.data.id] = car.data;
			});
		}
	});
	$scope.deleteBooking = function (bookinId) {
  	var title = 'Buchung löschen',
  		msg = 'Wollen Sie dieseBuchung wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden!',
  		btns = [{result:'cancel', label: 'Abbrechen'}, {result:'ok', label: 'Löschen', cssClass: 'btn-danger'}];
  	$dialog.messageBox(title, msg, btns)
	    .open()
	    .then(function(result){
	    	if (result === "ok") {
	    		Booking.remove({user_id: $scope.loginInfo.user.id, id: bookinId.split('/')[2]}).$then(function () {
		  			$scope.bookings = Booking.query({user_id: $scope.loginInfo.user.id});
		  		});
	    	}
	  	});
  };
}


/**
 * RENT Section
 */

function RentLocationsCtrl($scope, $location, LocationCar, User) {
	$scope.module = "rent";
	$scope.loginInfo = User.getLoginInfo(true);
	$scope.locations = LocationCar.Location.query();
  	$scope.orderProp = 'zip';
}

function RentLocationsCarsCtrl($scope, $location, $routeParams, User, LocationCar) {
	$scope.module = "rent";
	$scope.loginInfo = User.getLoginInfo(true);
	$scope.location = LocationCar.Location.get({locationId: $routeParams.locationId});
  	$scope.cars = LocationCar.Car.query({rentallocation_id: $routeParams.locationId});
}

function RentBookingCtrl($scope, $routeParams, $location, Booking, User, LocationCar, CalculatePrice) {
	$scope.module = "rent";
	$scope.loginInfo = User.getLoginInfo(true);
	$scope.car = LocationCar.Car.get({rentallocation_id: $routeParams.locationId, id: $routeParams.carId});
	$scope.location = LocationCar.Location.get({locationId: $routeParams.locationId});
	$scope.price = {result: ""};
	if ($routeParams.bookingId) {
		$scope.booking = Booking.get({user_id: $scope.loginInfo.user.id, id: $routeParams.bookingId});
	} else {
		$scope.booking = new Booking({user_id: $scope.loginInfo.user.id});
	}
	$scope.submit = function () {
		function saveBooking() {
			if ($routeParams.bookingId) {
				$scope.car.angularShortId = $routeParams.bookingId;
			}
			$scope.booking.user_id = $scope.loginInfo.user.id;
			$scope.booking.rentalcar_id = $scope.car.id;
			$scope.booking.$save(function () {
				$location.path('/home');
			}, function (err) {
				console.log(err);
				$scope.formError = true;
			});
		}
		if ($scope.booking.$then) {
			$scope.booking.$then(saveBooking);
		} else {
			saveBooking();
		}
	};
	$scope.cancel = function () {
		$location.path('/rent/' + $routeParams.locationId);
	};
	$scope.calculatePrice = function (days, currency) {
		if (!$scope.booking.days || !$scope.booking.currency || $scope.booking.currency.length !== 3) {
			return;
		}
		$scope.price = CalculatePrice.calculate({
			rentalcar_id: $scope.car.id,
			days: $scope.booking.days,
			currency: $scope.booking.currency
		});
	};
}

/**
 * ADMIN Section
 */

function LocationListCtrl($scope, LocationCar) {
	$scope.module = "admin";
  	$scope.locations = LocationCar.Location.query();
  	$scope.orderProp = 'zip';
}


function AdminLocationDetailCtrl($scope, $routeParams, $dialog, $location, LocationCar) {
  $scope.module = "admin";
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