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
			},
			data: {
				auth: true
			}
		}).

		// Dashboards
		state('app.classroom', {
			url: '/classroom',
			templateUrl: appHelper.templatePath('classroom'),
			resolve: {
				resources: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.extra.toastr,
					]);
				}
			}
		}).

		state('login', {
			url: '/login',
			templateUrl: appHelper.templatePath('login-light'),
            resolve: {
				resources: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.forms.jQueryValidate,
					]);
				},
			},
            controller: function ($rootScope) {
            	$rootScope.isLoginPage        = true;
				$rootScope.isLightLoginPage   = true;
				$rootScope.isLockscreenPage   = false;
				$rootScope.isMainPage         = false;
				$rootScope.layoutOptions.horizontalMenu.isVisible = false;
            },
            data: {
            	auth: false
            }
		}).

		state('register', {
			url: '/register',
			templateUrl: appHelper.templatePath('register'),
            resolve: {
				resources: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.forms.jQueryValidate,
					]);
				},
			},
            controller: 'RegisterCtrl',
            data: {
            	auth: false
            }
		})
	}).

	run(function ($rootScope, $state, $localStorage, AuthService) {
		$rootScope.$on('$stateChangeStart', function (event, next) {
	    	
	    	if (next.data.auth) {
	    		
	    		AuthService.isAuthorized(function (res) {
	    			if (res.type == false) {
	    				console.log('Error: ', res.data);
	    				$state.go('login');
	    			} else {
	    				$rootScope.currentUser = $localStorage.currentUser;
	    			}
	    		}, function (res) {
	    			console.log(res);
	    		})
	    	} else {
	    		if ($localStorage.token !== undefined) {
	    			$state.go('app.classroom');
	    		};
	    	}
	  	});
	})