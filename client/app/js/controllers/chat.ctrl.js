'use strict';

app
	.controller('ChatCtrl', function($rootScope, $scope, $element) {
		var $chat = jQuery($element),
			$chat_conv = $chat.find('.chat-conversation');

		$rootScope.allClassMembers = [];

		$chat.find('.chat-inner').perfectScrollbar(); // perfect scrollbar for chat container


		// Chat Conversation Window (sample)
		$chat.on('click', '.chat-group a', function(ev)
		{
			ev.preventDefault();

			$chat_conv.toggleClass('is-open');

			if($chat_conv.is(':visible'))
			{
				$chat.find('.chat-inner').perfectScrollbar('update');
				$chat_conv.find('textarea').autosize();
			}
		});

		$chat_conv.on('click', '.conversation-close', function(ev)
		{
			ev.preventDefault();

			$chat_conv.removeClass('is-open');
		});

		$rootScope.$on('update-class-member', function (event, data) {
			setTimeout(function () {
				$scope.$apply(function () {
					$rootScope.allClassMembers = data.users;
					console.log($rootScope.allClassMembers);
				}, 0);
			});
		})
	})