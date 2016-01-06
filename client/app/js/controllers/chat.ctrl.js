'use strict';

app
	.controller('ChatCtrl', function($rootScope, $scope, $element, EasyRtcService) {
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

		// this event still not working on firefox
		$rootScope.$on('update-class-member', function (event, data) {
			
			console.log('update-member fired')
			setTimeout(function () {
                $rootScope.$apply(function () {
                    $rootScope.allClassMembers = data.users;
                    console.log($rootScope.allClassMembers)
                }, 0);
            });
		});

		$scope.watchScreen = function () {
			var teacherId = $('#watchScreen').attr('data-target');
			console.log(teacherId);
			EasyRtcService.performCall(teacherId, function () {
				$('#watchScreen').text('Connected...');
				$('#watchScreen').prop('disabled', true);
			});
		}
	})