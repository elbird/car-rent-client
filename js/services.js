'use strict';

/* Services */

angular.module('adminServices', ['ngResource'])
.factory('Admin', function($resource){
	var RentalLocation = $resource('/api/rentallocation/:locationId', {
			locationId: '@locationId'
		}, {
			'query':  {
				method:'GET',
				isArray: true
			}
		}),
		RentalCar = $resource('/api/rentallocation/:rentallocation_id/rentalcar/:id', {
			id: '@angularShortId',
			rentallocation_id: '@rentallocation_id'
		}, {
			'query':  {
				method:'GET',
				isArray: true
			}
		});
  	return { Location: RentalLocation, Car: RentalCar };
});