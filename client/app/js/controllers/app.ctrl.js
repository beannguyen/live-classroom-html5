'use strict';

app
	.controller('AppCtrl', function ($log, $scope, $rootScope, $state, $stateParams, $appPermission, $location, $layout, $layoutToggles, $pageLoadingBar, $localStorage, Fullscreen, AuthService, ResfulWS) {
		$rootScope.isLoginPage        = false;
		$rootScope.isLightLoginPage   = false;
		$rootScope.isLockscreenPage   = false;
		$rootScope.isMainPage         = true;

		$rootScope.layoutOptions = {
			horizontalMenu: {
				isVisible		: true,
				isFixed			: true,
				minimal			: true,
				clickToExpand	: false,

				isMenuOpenMobile: false
			},
			sidebar: {
				isVisible		: false,
				isCollapsed		: false,
				toggleOthers	: true,
				isFixed			: true,
				isRight			: false,

				isMenuOpenMobile: false,

				userProfile		: true
			},
			chat: {
				isOpen			: true,
			},
			settingsPane: {
				isOpen			: false,
				useAnimation	: true
			},
			container: {
				isBoxed			: false
			},
			skins: {
				sidebarMenu		: '',
				horizontalMenu	: '',
				userInfoNavbar	: ''
			},
			pageTitles: true,
			userInfoNavVisible	: false
		};

		$layout.loadOptionsFromCookies(); // remove this line if you don't want to support cookies that remember layout changes


		$scope.updatePsScrollbars = function()
		{
			var $scrollbars = jQuery(".ps-scrollbar:visible");

			$scrollbars.each(function(i, el)
			{
				if(typeof jQuery(el).data('perfectScrollbar') == 'undefined')
				{
					jQuery(el).perfectScrollbar();
				}
				else
				{
					jQuery(el).perfectScrollbar('update');
				}
			})
		};


		// Define Public Vars
		public_vars.$body = jQuery("body");


		// Init Layout Toggles
		$layoutToggles.initToggles();


		// Other methods
		$scope.setFocusOnSearchField = function()
		{
			public_vars.$body.find('.search-form input[name="s"]').focus();

			setTimeout(function(){ public_vars.$body.find('.search-form input[name="s"]').focus() }, 100 );
		};


		// Watch changes to replace checkboxes
		$scope.$watch(function()
		{
			cbr_replace();
		});

		// Watch sidebar status to remove the psScrollbar
		$rootScope.$watch('layoutOptions.sidebar.isCollapsed', function(newValue, oldValue)
		{
			if(newValue != oldValue)
			{
				if(newValue == true)
				{
					public_vars.$sidebarMenu.find('.sidebar-menu-inner').perfectScrollbar('destroy')
				}
				else
				{
					public_vars.$sidebarMenu.find('.sidebar-menu-inner').perfectScrollbar({wheelPropagation: public_vars.wheelPropagation});
				}
			}
		});


		// Page Loading Progress (remove/comment this line to disable it)
		$pageLoadingBar.init();

		$scope.showLoadingBar = showLoadingBar;
		$scope.hideLoadingBar = hideLoadingBar;


		// Set Scroll to 0 When page is changed
		$rootScope.$on('$stateChangeStart', function()
		{
			var obj = {pos: jQuery(window).scrollTop()};

			TweenLite.to(obj, .25, {pos: 0, ease:Power4.easeOut, onUpdate: function()
			{
				$(window).scrollTop(obj.pos);
			}});
		});


		// Full screen feature added in v1.3
		$scope.isFullscreenSupported = Fullscreen.isSupported();
		$scope.isFullscreen = Fullscreen.isEnabled() ? true : false;

		$scope.goFullscreen = function()
		{
			if (Fullscreen.isEnabled())
				Fullscreen.cancel();
			else
				Fullscreen.all();

			$scope.isFullscreen = Fullscreen.isEnabled() ? true : false;
		};

		$rootScope.currentUser = null;
		// when user reload page
		if (!$rootScope.isLoginPage) {
			if ($rootScope.currentUser == null) {
				// if user already logged in
				if ($localStorage.currentUser != null) {
					$rootScope.currentUser = $localStorage.currentUser;
				}
			}
		};

		if ($rootScope.currentUser != null) {
			// update EasyRtcId and reconnect to app when user reload page
			AuthService.initRtc(function () {

            	// update easyrtcId on database
            	ResfulWS.api('/user/update-easyrtcid', $localStorage.currentUser, function () {
            		console.log('EasyRtcId updated on database');
            		// set default option for student, change this method if user is a teacher
		            if ($rootScope.currentUser.type === 'student') {

		            	console.log('Initial EasyRtc Options for Student');
		                AuthService.setEasyRtcDefaultOptions();
		            } else {
		                AuthService.setEasyRtcTeacherOptions();
		            }
            	}); 
            });
		};

		var $permission = $appPermission.instantiate();
		$scope.checkPermission = function (action) {
			if ($localStorage.currentUser !== undefined)
				return $permission.check(action);
			return false;
		}

		$scope.logout = function() {
            AuthService.logout(function() {
            	easyrtc.disconnect();
                window.location.href = '/#/login?loggedout=true';
            }, function() {
                alert("Failed to logout!");
            });
        };
	});