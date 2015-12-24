'use strict';

app.
	controller('RegisterCtrl', function ($scope, $rootScope, $http, AuthService, $state, $localStorage) {
		$rootScope.isLoginPage        = true;
		$rootScope.isLightLoginPage   = true;
		$rootScope.isLockscreenPage   = false;
		$rootScope.isMainPage         = false;
		$rootScope.layoutOptions.horizontalMenu.isVisible = false;

		$scope.credential = {};
		var form = angular.element('#register');

		// default account type
		$scope.credential.type = 'student';

		$scope.register = function () {
			showLoadingBar(70); // Fill progress bar to 70% (just a given value)

			var opts = {
				"closeButton": true,
				"debug": false,
				"positionClass": "toast-top-full-width",
				"onclick": null,
				"showDuration": "300",
				"hideDuration": "1000",
				"timeOut": "5000",
				"extendedTimeOut": "1000",
				"showEasing": "swing",
				"hideEasing": "linear",
				"showMethod": "fadeIn",
				"hideMethod": "fadeOut"
			};

			AuthService.save({
				fullname: $scope.credential.fullname,
				email: $scope.credential.email,
				password: $scope.credential.pwd,
				type: $scope.credential.type
			}, function (res) {
				
				if (res.type) {

					showLoadingBar({
						delay: .5,
						pct: 100,
						finish: function(){

							$localStorage.token = res.token;
							$localStorage.currentUser = res.data;
							$state.go('app.classroom');
						}
					});
				} else {

					// Remove any alert
					$(".errors-container .alert").slideUp('fast');

					$(".errors-container").html('<div class="alert alert-danger">\
						<button type="button" class="close" data-dismiss="alert">\
							<span aria-hidden="true">&times;</span>\
							<span class="sr-only">Close</span>\
						</button>\
						' + resp.data + '\
					</div>');


					$(".errors-container .alert").hide().slideDown();
					$(form).find('#passwd').select();
				};
			}, function () {
				console.log('Something went wrong!');
				window.location.reload();
			});
		}
	})