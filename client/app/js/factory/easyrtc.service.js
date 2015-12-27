'user strict';

app.factory('EasyRtcService', function ($rootScope, ResfulWS) {

	return {
		/**
		 *	target: object | string
		 *	data: object
		 *	callback: function
		 */
		sendMessage: function (target, data, callback) {
			easyrtc.sendDataWS(target, 
				"message",
				data, 
				function (ackmessage) {

					var msgData = {
						msg: data.msg,
						author: data.from,
						to: target
					};

					// do something before execute callback()
					ResfulWS.api('/chanel/send-message', {data : msgData}, function (res) {
						
						console.log(res);
						callback();
					});
				}
			);
		},

		peerListener : function(who, msgType, content, to, time) {
            console.log('peer listener');

            if (angular.isObject(content)) {
                who = content.from;
                to = content.to;
                time = content.time;
                content = content.msg;            
            }
            
            var message = {
                author: who,
                msg: [content],
                createdAt: time
            };

            $rootScope.$emit('new-message', to, message);
        }
	}
})