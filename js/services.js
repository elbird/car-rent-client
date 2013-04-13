'use strict';

/* Services */

angular.module('adminServices', ['ngResource'])
.factory('Admin', function($resource){
	var RentalLocation = $resource('/api/rentallocation/:locationId', {
			locationId: '@id'
		}, {
			'query':  {
				method:'GET'
			}
		}),
		RentalCar = $resource('/api/rentallocation/:locationId/rentalcar/:carId', {
			locationId: '@id',
			carId: '@id'
		}, {
			'query':  {
				method:'GET'
			}
		});
  	return { location: RentalLocation, car: RentalCar };
});