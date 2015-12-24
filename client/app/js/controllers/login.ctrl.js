'use strict';

app
	.controller('LoginCtrl', function($rootScope, $scope, $location, $state, $localStorage, AuthService, ResfulWS) {
		
		$scope.credential = {};
		
		$scope.login = function () {

			showLoadingBar(70);
			AuthService.signin($scope.credential,
				function (res) {
					if (res.type == false) {
	                    console.log('Authenticate failue', res.data);
	                    angular.element('.errors-container .alert-danger').text(res.data).removeClass('hide');  
	                } else {
	                    $localStorage.token = res.data.token;
	                    $localStorage.currentUser = res.data;
	                    AuthService.initRtc(function () {

	                    	// update easyrtcId on database
	                    	ResfulWS.api('/update-easyrtcid', $localStorage.currentUser, function () {
	                    		console.log('EasyRtcId updated on database');
	                    		$state.go('app.classroom');
	                    	}); 
	                    });
	                }
				},
				function () {
					console.log('Request failue');
				})
		};
	});