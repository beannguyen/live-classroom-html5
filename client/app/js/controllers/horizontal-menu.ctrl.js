'use strict';

app
	.controller('HorizontalMenuCtrl', function($scope, $rootScope, $menuItems, $timeout, $location, $state, EasyRtcService) {
		var $horizontalMenuItems = $menuItems.instantiate();

		$scope.menuItems = $horizontalMenuItems.prepareHorizontalMenu().getAll();

		// Set Active Menu Item
		$horizontalMenuItems.setActive( $location.path() );

		$rootScope.$on('$stateChangeSuccess', function()
		{
			$horizontalMenuItems.setActive($state.current.name);

			$(".navbar.horizontal-menu .navbar-nav .hover").removeClass('hover'); // Close Submenus when item is selected
		});

		// Trigger menu setup
		$timeout(setup_horizontal_menu, 1);

		$scope.startTaining = function () {
			easyrtc.setScreenCapture();
			easyrtc.sendPeerMessage({ targetRoom: 'default' }, "training", {status: 'start'}, 
            	function(){
            		EasyRtcService.isCalling = true;
            		$('#startTrainingBtn').hide();
            		$('#stopTrainingBtn').show();

            		console.log('sent')

            	}, 
            	function(errCode, errorText) {
                console.log("messaging error" + errorText);
            });
		};

		$scope.stopTaning = function () {

			easyrtc.sendPeerMessage({ targetRoom: 'default' }, "training", {status: 'stop'}, 
            	function(){
            		EasyRtcService.isCalling = false;
		    		$('#startTrainingBtn').show();
		    		$('#stopTrainingBtn').hide();
					easyrtc.hangupAll();

            	}, 
            	function(errCode, errorText) {
                console.log("messaging error" + errorText);
            });
		}
	})