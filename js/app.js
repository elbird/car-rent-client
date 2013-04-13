'use strict';

/* App Module */

angular.module('carRental', ['adminServices']).
config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/admin/', {templateUrl: 'partials/admin/location-list.html', controller: LocationListCtrl})
	.when('/admin/:locationId', {templateUrl: 'partials/admin/location-cars.html', controller: AdminLocationDetailCtrl})
	.when('/admin/:locationId/new', {templateUrl: 'partials/admin/car-new.html', controller: AdminCreateCarCtrl})
	.when('/admin/:locationId/:carId', {templateUrl: 'partials/admin/car-edit.html', controller: AdminEditCarCtrl})
	.otherwise({redirectTo: '/admin'});
}]);