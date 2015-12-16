'use strict';

var app = angular.module('live-class', [
	'ngCookies',
	'ui.router',
	'ui.bootstrap',
	'oc.lazyLoad',
	'FBAngular'
]);

app.run(function()
{
	// Page Loading Overlay
	public_vars.$pageLoadingOverlay = jQuery('.page-loading-overlay');

	jQuery(window).load(function()
	{
		public_vars.$pageLoadingOverlay.addClass('loaded');
	})
});