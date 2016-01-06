'use strict';

var app = angular.module('live-class', [
	'ngCookies',
	'ui.router',
	'ui.bootstrap',
	'oc.lazyLoad',
	'FBAngular',
	'ngStorage',
    'angularMoment'
]);

app.constant('baseUrl','https://localhost:8080');

app.run(function() {
	// Page Loading Overlay
	public_vars.$pageLoadingOverlay = jQuery('.page-loading-overlay');

	jQuery(window).load(function()
	{
		public_vars.$pageLoadingOverlay.addClass('loaded');
	})
});

app.config(function ($httpProvider) {
	$httpProvider.interceptors.push(['$q', '$location', '$localStorage', function($q, $location, $localStorage) {
            return {
                'request': function (config) {
                    config.headers = config.headers || {};
                    if ($localStorage.token) {
                        config.headers.Authorization = 'Bearer ' + $localStorage.token;
                    }
                    return config;
                },
                'responseError': function(response) {
                    if(response.status === 401 || response.status === 403) {
                        $location.path('/#/login');
                    }
                    return $q.reject(response);
                }
            };
        }]);
    });