'use strict';

app
	.controller('HorizontalMenuCtrl', function($scope, $rootScope, $menuItems, $timeout, $location, $state) {
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
	})