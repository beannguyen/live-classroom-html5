'use strict';

app
	.controller('LoginCtrl', function($rootScope, $scope, $location, $state, $stateParams, $localStorage, AuthService, ResfulWS) {

		if ($stateParams.loggedout !== undefined) {
			console.log('reload')
			window.location = '/#/login';
		};
		
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
	                    	ResfulWS.api('/user/update-easyrtcid', $localStorage.currentUser, function () {
	                    		if ($rootScope.currentUser !== null) {
									// set default option for student, change this method if user is a teacher
						            if ($rootScope.currentUser.type === 'student') {

						                AuthService.setEasyRtcDefaultOptions();
						            } else {
						                AuthService.setEasyRtcTeacherOptions();
						            }
								};
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