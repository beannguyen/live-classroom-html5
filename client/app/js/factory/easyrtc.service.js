'user strict';

app.factory('EasyRtcService', function ($rootScope, ResfulWS) {

	return {
		isCalling: false,
		allUsers: [],
		performCall: function(otherEasyrtcid, callback) {
		    easyrtc.hangupAll();
		    var acceptedCB = function(accepted, easyrtcid) {
		        if( !accepted ) {
		            easyrtc.showError("CALL-REJECTED", "Sorry, your call to " + easyrtc.idToName(easyrtcid) + " was rejected");
		            enable('otherClients');
		        }
		        this.isCalling = true;
		        callback();
		    };

		    var successCB = function() {
		    	console.log('calling success')
		    };
		    var failureCB = function() {
		    	console.log('calling failure')
		    };
		    easyrtc.call(otherEasyrtcid, successCB, failureCB, acceptedCB);
		},
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

		startDesktopSharing : function (target, data, callback) {
			console.log('sending screen-capture message')
			easyrtc.sendDataWS(target,
				'screen-capture',
				data,
				function (message) {
					callback();
				}
			);
		},

		peerListener : function(who, msgType, content, to, time) {
            console.log('peer listener', msgType);

            if (msgType === 'message') { // instant message
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
            } else if (msgType === 'training') { // screen capture alert
            	if (content.status === 'start') {
            		if (!this.isCalling) {
            			$('#watchScreen').attr('data-target', who);
            			$('#watchScreen').removeClass('hide');
            		};
            	} else {
            		$('#watchScreen').attr('data-target', '');
            		$('#watchScreen').text('Connect stream');
            		$('#watchScreen').prop('disabled', false);
            		$('#chat .videos > video').attr('src', '');
            		$('#watchScreen').addClass('hide');
            	}
            }
        },
        streamAcceptor: function (caller, stream) {
        	var video = document.getElementById('videos-container');
		    easyrtc.setVideoObjectSrc(video, stream);
		    console.log("saw video from " + caller);
        }
	}
})