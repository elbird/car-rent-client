'use strict';

/* App Module */

angular.module('carRental', ['adminServices', 'userServices', 'ui.bootstrap', 'ngCookies', "google-maps"]).
config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/home', {templateUrl: 'partials/home.html', controller: HomeCtrl})
	.when('/rent/', {templateUrl: 'partials/locations.html', controller: RentLocationsCtrl})
	.when('/rent/:locationId', {templateUrl: 'partials/location-cars.html', controller: RentLocationsCarsCtrl})
	.when('/rent/:locationId/car/:carId/book', {templateUrl: 'partials/rent/booking.html', controller: RentBookingCtrl})
	.when('/admin/', {templateUrl: 'partials/locations.html', controller: LocationListCtrl})
	.when('/admin/:locationId', {templateUrl: 'partials/location-cars.html', controller: AdminLocationDetailCtrl})
	.when('/admin/:locationId/car/new', {templateUrl: 'partials/admin/car-edit.html', controller: AdminEditCarCtrl})
	.when('/admin/:locationId/car/:carId', {templateUrl: 'partials/admin/car-edit.html', controller: AdminEditCarCtrl})
	.otherwise({redirectTo: '/home'});
}]);
