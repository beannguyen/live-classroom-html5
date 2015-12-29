'use strict';

app.

	controller('ClassroomCtrl', function ($rootScope, $scope, $state, $stateParams) {
		console.log('ClassroomCtrl loaded', $stateParams)

		if ($stateParams.share === 'desktop') {
			// create RTCMultiConnection instant
			var multiConnection = new RTCMultiConnection();
			multiConnection.socketURL = 'http://localhost:8080/';

			$scope.sharingDefaultRoom = multiConnection.token();

			multiConnection.session = {
                audio: 'one-way',
                screen: 'one-way'
            };

            multiConnection.sdpConstraints.mandatory = {
                OfferToReceiveAudio: true,
                OfferToReceiveVideo: false
            };

            var videosContainer = angular.element('#videos-container');
            multiConnection.onstream = function(event) {
            	console.log(event.mediaElement);
                videosContainer.append(event.mediaElement);
            };

            multiConnection.open($scope.sharingDefaultRoom);
		};
	})