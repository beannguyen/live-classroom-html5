'use strict';

app
	.controller('FooterChatCtrl', function($rootScope, $scope, $element, EasyRtcService) {
		$scope.isConversationVisible = false;
		$scope.chatText = '';
		$scope.publicRoomMessages = [];

		$scope.toggleChatConversation = function()
		{
			$scope.isConversationVisible = ! $scope.isConversationVisible;

			if($scope.isConversationVisible)
			{
				setTimeout(function()
				{
					var $el = $element.find('.ps-scrollbar');

					if($el.hasClass('ps-scroll-down'))
					{
						$el.scrollTop($el.prop('scrollHeight'));
					}

					$el.perfectScrollbar({
						wheelPropagation: false
					});

					$element.find('.form-control').focus();

				}, 300);
			}
		}

		$scope.sendMessageToPublishRoom = function () {
			if ($scope.chatText !== '') {
				EasyRtcService.sendMessage({ targetRoom: 'default' },
		        	{ msg: $scope.chatText, from: $rootScope.currentUser, to: {targetRoom: 'default'}, time: moment() },
		        	function () {
		        		EasyRtcService.peerListener("You", "message", $scope.chatText, {targetRoom: 'default'}, moment());
		        		$scope.chatText = '';
		        	}
		        );
			};
		};

		// when peerListener receive new message to public room
		$rootScope.$on('new-message', function (event, target, message) {
			console.log('NewMessage Event receive new data: ', target, message);
			if (typeof target === 'object') {
				if (target.targetRoom === 'default') {
					
					// when user receive a message
		            setTimeout(function() {
		                $scope.$apply(function () {

		                	console.log('length', $scope.publicRoomMessages.length);
		                	if ($scope.publicRoomMessages.length > 0) {
		                		var lastIndex = $scope.publicRoomMessages.length -1;
		                		if (message.author == 'You') {
		                			if ($scope.publicRoomMessages[lastIndex].author === 'You') {
		                				$scope.publicRoomMessages[lastIndex].msg.push(message.msg[0]);
		                				return true;
		                			};
		                		} else {
		                			console.log(message.author, $scope.publicRoomMessages[lastIndex].author);
		                			if (message.author._id === $scope.publicRoomMessages[lastIndex].author._id) {
		                				$scope.publicRoomMessages[lastIndex].msg.push(message.msg[0]);
		                				return true;
		                			};
		                		};
		                	};

		                    $scope.publicRoomMessages.push(message);
		                    console.log($scope.publicRoomMessages);
		                }, 0);            
		            });
				};
			};
		});
	});