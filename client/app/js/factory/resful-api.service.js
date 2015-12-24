'use strict';

app.
	factory('ResfulWS', function ($rootScope, $http, baseUrl) {
		
		return {
			api: function (uri, data, callback) {
				$http.post(baseUrl + uri, data).success(callback).error(function () {
					console.log('Resful Webservice has an error');
				})
			}
		}
	})