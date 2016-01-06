'use strict';

app
	.factory('AuthService', function ($rootScope, $http, $localStorage, ResfulWS, EasyRtcService, baseUrl) {

		function changeUser(user) {
            angular.extend(currentUser, user);
        }

        function urlBase64Decode(str) {
            var output = str.replace('-', '+').replace('_', '/');
            switch (output.length % 4) {
                case 0:
                    break;
                case 2:
                    output += '==';
                    break;
                case 3:
                    output += '=';
                    break;
                default:
                    throw 'Illegal base64url string!';
            }
            return window.atob(output);
        }
 
        function getUserFromToken() {
            var token = $localStorage.token;
            var user = {};
            if (typeof token !== 'undefined') {
                var encoded = token.split('.')[1];
                user = JSON.parse(urlBase64Decode(encoded));
            }
            return user;
        }
 
        var currentUser = getUserFromToken();

        // WebRTC Functions
        var _initRtcApp = function (callback) {

            $rootScope.users = [];

            easyrtc.setPeerListener(EasyRtcService.peerListener);
            easyrtc.setRoomOccupantListener(_roomOccupantListener);
            console.log('establishing...');

            // connect to multipleChanel defined on server.js
            easyrtc.connect("easyrtc.multipleChanel", function (easyrtcid) {

                console.log('rtc login success', easyrtcid);
                $localStorage.currentUser.easyRtcId = easyrtcid;
                $rootScope.currentUser = $localStorage.currentUser;
                callback();
            }, function () {
                console.log('Login failure');
                toastr.error('Something went wrong, please login again.', 'Oops!');
            });

            easyrtc.setStreamAcceptor( function(caller, stream) {
                EasyRtcService.streamAcceptor(caller, stream);
            });
        };

        var _setEasyRtcDefaultOptions = function () {
            easyrtc.enableDebug(true);
            easyrtc.enableDataChannels(true);
            easyrtc.enableVideo(false);
            easyrtc.enableAudio(false);
            easyrtc.enableVideoReceive(true);
            easyrtc.enableAudioReceive(true);
        };

        var _setEasyRtcTeacherOptions = function () {
            easyrtc.enableDebug(true);
            easyrtc.enableDataChannels(true);
            easyrtc.enableVideo(true);
            easyrtc.enableAudio(true);
            easyrtc.enableVideoReceive(true);
            easyrtc.enableAudioReceive(true);
        };

        var _roomOccupantListener = function (roomName, occupants, isPrimary) {

            // do something to add user to list
            console.log('other peer', occupants, EasyRtcService.isCalling);
            if (EasyRtcService.isCalling) {
                easyrtc.sendPeerMessage({ targetRoom: 'default' }, "training", {status: 'start'}, 
                    function(){

                        console.log('sent to new peer')

                    }, 
                    function(errCode, errorText) {
                        console.log("messaging error" + errorText);
                    });
            };

            ResfulWS.api('/user/get-all-user', {rtcUsers: occupants}, function (res) {
                // emit update class member event, chatCtrl will handle this event
                setTimeout(function () {
                    $rootScope.$apply(function () {
                        EasyRtcService.allUsers = res.users;
                        $rootScope.allClassMembers = EasyRtcService.allUsers;
                    }, 0);
                });
                $rootScope.$emit('update-class-member', res);
            });
        };

        return {
            isAuthorized: function (success, error) {

                var data = {};
                if (typeof $localStorage.token !== undefined) {
                    data.token = $localStorage.token;
                }
                $http.post(baseUrl + '/is-authorized', data).success(success).error(error);
            },
            save: function(data, success, error) {
                $http.post(baseUrl + '/signup', data).success(success).error(error)
            },
            signin: function(data, success, error) {
                $http.post(baseUrl + '/authenticate', data).success(success).error(error)
            },
            me: function(success, error) {
                $http.get(baseUrl + '/me').success(success).error(error)
            },
            logout: function(success) {
                changeUser({});
                delete $localStorage.token;
                delete $localStorage.currentUser;
                success();
            },
            initRtc: function(success) {
                _initRtcApp(success);
            },
            setEasyRtcDefaultOptions: function () {
                _setEasyRtcDefaultOptions();
            },
            setEasyRtcTeacherOptions: function () {
                _setEasyRtcTeacherOptions();
            }
        };
	})