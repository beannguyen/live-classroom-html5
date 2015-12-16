app
	.config(function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, ASSETS) {
		
		$urlRouterProvider.otherwise('/app/classroom');
		$stateProvider.
		// Main Layout Structure
		state('app', {
			abstract: true,
			url: '/app',
			templateUrl: appHelper.templatePath('layout/app-body'),
			controller: function($rootScope){
				$rootScope.isLoginPage        = false;
				$rootScope.isLightLoginPage   = false;
				$rootScope.isLockscreenPage   = false;
				$rootScope.isMainPage         = true;
			}
		}).

		// Dashboards
		state('app.classroom', {
			url: '/classroom',
			templateUrl: appHelper.templatePath('classroom')
		})
	});