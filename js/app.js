'use strict';

/* App Module */

angular.module('carRental', ['adminServices', 'ui.bootstrap']).
config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/admin/', {templateUrl: 'partials/admin/location-list.html', controller: LocationListCtrl})
	.when('/admin/:locationId', {templateUrl: 'partials/admin/location-cars.html', controller: AdminLocationDetailCtrl})
	.when('/admin/:locationId/car/new', {templateUrl: 'partials/admin/car-edit.html', controller: AdminEditCarCtrl})
	.when('/admin/:locationId/car/:carId', {templateUrl: 'partials/admin/car-edit.html', controller: AdminEditCarCtrl})
	.otherwise({redirectTo: '/admin'});
}]);