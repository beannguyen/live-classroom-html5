'use strict';

app
	.controller('ChatCtrl', function($scope, $element) {
		var $chat = jQuery($element),
			$chat_conv = $chat.find('.chat-conversation');

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
	})