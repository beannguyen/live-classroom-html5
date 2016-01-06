'use strict';

app.

	service('$appPermission', function ($rootScope, $localStorage) {
		
		var roles = [
			'teacher',
			'student',
			'anonymous'
		];

		var rules = {
			teacher: {
				videoBroadcast: true,
				audioBroadcast: true,
				screenSharing: true
			},
			student: {
				videoBroadcast: false,
				audioBroadcast: false,
				screenSharing: false
			},
			anonymous: {
				videoBroadcast: false,
				audioBroadcast: false,
				screenSharing: false
			}
		};

		this.instantiate = function()
		{
			return angular.copy( this );
		}

		this.check = function (action) {
			var currentUser = $localStorage.currentUser;

			if (currentUser.type === 'teacher') {

				switch(action) {
					case 'video-broadcast': 
						return rules.teacher.videoBroadcast;
					case 'audio-broadcast':
						return rules.teacher.audioBroadcast;
					case 'screen-sharing':
						return rules.teacher.screenSharing;
					default:
						return false;
				}
			} else if (currentUser.type === 'student') {

				switch(action) {
					case 'video-broadcast': 
						return rules.student.videoBroadcast;
					case 'audio-broadcast':
						return rules.student.audioBroadcast;
					case 'screen-sharing':
						return rules.student.screenSharing;
					default:
						return false;
				}
			} else {
				switch(action) {
					case 'video-broadcast': 
						return rules.anonymous.videoBroadcast;
					case 'audio-broadcast':
						return rules.anonymous.audioBroadcast;
					case 'screen-sharing':
						return rules.anonymous.screenSharing;
					default:
						return false;
				}
			}
		}
	})