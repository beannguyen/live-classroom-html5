var http = require('http');             	// http server core module
var express = require("express");           // web framework external module
var io      = require("socket.io");         // web socket external module
var easyrtc = require("easyrtc");           // EasyRTC external module
var morgan     = require("morgan");
var bodyParser = require("body-parser");
var jwt        = require("jsonwebtoken");
var mongoose   = require("mongoose");

// Setup and configure Express http server. Expect a subfolder called "client" to be the web root.
var httpApp = express();
httpApp.use(express.static(__dirname + "/client/app/"));
httpApp.use(express.static(__dirname + "/client/assets/"));
httpApp.use(express.static(__dirname + "/client/bower_components/"));

// Start Express http server on port 8080
var webServer = http.createServer(httpApp).listen(8080);

// Include MongoDB Models
var User = require('./models/User');

// Environment Variables
process.env.JWT_SECRET = 'secretjwtblabla';

// Connect to DB
mongoose.connect('mongodb://127.0.0.1/liveclass');

// some configurations for simulating an HTTP request handling in NodeJS by using Express
httpApp.use(bodyParser.urlencoded({ extended: true }));
httpApp.use(bodyParser.json());
httpApp.use(morgan("dev"));
// allow Cross Origin Request Sharing & authenticate
httpApp.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

// Express routes
httpApp.get('/', function(req, res) {
    res.sendFile(__dirname + "/client/index.html");
})

httpApp.post('/authenticate', function(req, res) {

    User.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            if (user) {
               res.json({
                    type: true,
                    data: user,
                    token: user.token
                }); 
            } else {
                res.json({
                    type: false,
                    data: "Incorrect email/password"
                });    
            }
        }
    });
});

/**
 *  Register Account
 */
httpApp.post('/signup', function(req, res) {

    User.findOne({email: req.body.email}, function(err, user) {

        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {

            if (user) {
                res.json({
                    type: false,
                    data: "User already exists!"
                });
            } else {

                var userModel = new User();
                userModel.fullname = req.body.fullname;
                userModel.email = req.body.email;
                userModel.password = req.body.password;
                userModel.type = req.body.type;
                userModel.save(function(err, user) {

                    if (err) {
                        console.log(err);
                    } else {
                        user.token = jwt.sign(user, process.env.JWT_SECRET);
                        user.save(function(err, user1) {

                            if (err) {
                                console.log(err);
                            } else {
                                res.json({
                                    type: true,
                                    data: user1,
                                    token: user1.token
                                });
                            }
                        });
                    }
                })
            }
        }
    });
});

/**
 *  Return current User whenever client request /me
 */
httpApp.get('/me', ensureAuthorized, function(req, res) {
    User.findOne({token: req.token}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            res.json({
                type: true,
                data: user
            });
        }
    });
});

httpApp.post('/validate/check-email', function (req, res) {
    User.findOne({email: req.body.email}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            if (user) {
                res.json({
                    type: false,
                    data: "Email already exists!"
                });
            } else {
                res.json({
                    type: true
                });
            }
        }
    });
});

httpApp.post('/is-authorized', function (req, res) {

    if (req.body.token !== undefined) {
        User.findOne({token: req.body.token}, function(err, user) {
            if (err) {
                res.json({
                    type: false,
                    data: "Error occured: " + err
                });
            } else {
                res.json({
                    type: true,
                    data: user
                });
            }
        });
    } else {
        res.json({
            type: false,
            data: 'Not logged in'
        })
    }
});

httpApp.post('/user/update-easyrtcid', function (req, res) {
    if (req.body.easyRtcId !== undefined) {
        User.findOne({_id: req.body._id}, function (err, user) {
            if (err) {
                console.log('Something went wrong', err);
                res.sendStatus(500);
            } else {
                if (user) {
                    user.easyRtcId = req.body.easyRtcId;
                    user.save(function (err, obj) {
                        if (err) {
                            console.log(err);
                            res.sendStatus(500);
                        } else {
                            if (obj) {
                                res.json({
                                    type: true,
                                    msg: 'Updated easyRtcId';
                                })
                            }
                        }
                    })
                } else {
                    res.json({
                        type: false,
                        msg: 'User not found'
                    })
                }
            }
        })
    } else {
        res.json({
            type: false,
            msg: 'No params recieved';
        })
    }
});

/**
 * request headers are intercepted and the authorization header is extracted. 
 * If a bearer token exists in this header, that token is assigned to req.token 
 * in order to be used throughout the request, and the request can be continued by using next(). 
 * If a token does not exist, you will get a 403 (Forbidden) response. 
 * Let's go back to the handler /me, and use req.token to fetch user data with this token. 
 * Whenever you create a new user, a token is generated and saved in the user model in DB. 
 * Those tokens are unique.
 */
function ensureAuthorized(req, res, next) {
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(401);
    }
};

// Handle uncaughtError
process.on('uncaughtException', function(err) {
    console.log(err);
});

// Start Socket.io so it attaches itself to Express server
var socketServer = io.listen(webServer, {"log level":1});

// Socket Server Listener
socketServer.on('connection', function () {
	console.log('a new user connected');
});

easyrtc.setOption("logLevel", "debug");

// Overriding the default easyrtcAuth listener, only so we can directly access its callback
easyrtc.events.on("easyrtcAuth", function(socket, easyrtcid, msg, socketCallback, callback) {
    easyrtc.events.defaultListeners.easyrtcAuth(socket, easyrtcid, msg, socketCallback, function(err, connectionObj){
        if (err || !msg.msgData || !msg.msgData.credential || !connectionObj) {
            callback(err, connectionObj);
            return;
        }

        connectionObj.setField("credential", msg.msgData.credential, {"isShared":false});

        console.log("["+easyrtcid+"] Credential saved!", connectionObj.getFieldValueSync("credential"));

        callback(err, connectionObj);
    });
});

// To test, lets print the credential to the console for every room join!
easyrtc.events.on("roomJoin", function(connectionObj, roomName, roomParameter, callback) {
    console.log("["+connectionObj.getEasyrtcid()+"] Credential retrieved!", connectionObj.getFieldValueSync("credential"));
    easyrtc.events.defaultListeners.roomJoin(connectionObj, roomName, roomParameter, callback);
});


// Start EasyRTC server
var rtc = easyrtc.listen(httpApp, socketServer, {logLevel:"debug", logDateEnable:true}, function(err, rtcRef) {
    console.log("Initiated");

    rtcRef.events.on("roomCreate", function(appObj, creatorConnectionObj, roomName, roomOptions, callback) {
        console.log("roomCreate fired! Trying to create: " + roomName);

        appObj.events.defaultListeners.roomCreate(appObj, creatorConnectionObj, roomName, roomOptions, callback);
    });

    rtcRef.createApp(
        "easyrtc.multipleChanel",
        null,
        multipleChanelApp
    );
});

// Setting option for specific application
var multipleChanelApp = function(err, appObj) {
    if (err) {
        console.log('The WebRTC server has some error: ', err);
    } else {
        console.log('Created WebRTC App');
    }
};