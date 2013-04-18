'use strict';

/* Services */

angular.module('adminServices', ['ngResource'])
.factory('LocationCar', function($resource){
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


angular.module('userServices', ['ngResource'])
.factory('UserBooking', function($resource){
	var User = $resource('/api/user/:userId', {
			userId: '@userId'
		}),
		Booking = $resource('/api/user/:user_id/booking/:id', {
			id: '@angularShortId',
			rentallocation_id: '@user_id'
		}, {
			'query':  {
				method:'GET',
				isArray: true
			}
		});
  	return { User: User, Car: Booking };
});