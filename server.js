

var express = require('express');
var glimpseAgent = require('@glimpse/glimpse-node-agent'),
    glimpseServer = require('@glimpse/glimpse-node-server')

glimpseServer.server.init()
glimpseAgent.agent.init({
    server: glimpseServer.server
});
var _ = require('underscore');
var app = express();
var http = require('http');
var server = require('http').createServer(app);
var accountController = require('./server/controllers/accountController');
var historyController = require('./server/controllers/historyController');
var homeController = require('./server/controllers/homeController');
var pulse = require('./server/controllers/pulseController');
var redis = require("redis");
var pomodoro = require("./server/models/pomodoro");

//setup a redis client based on if the environment is development or production
//var client = redis.createClient();

String.prototype.bool = function() {
  return (/^true$/i).test(this);
};

app.set('view engine', 'ejs');
app.set('view options', { layout: false });
app.use('/public', express.static('public'));
app.use('/public', express.static('bower_components'));
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: process.env.twilioAccountSid }));
app.use(app.router);

accountController.init(app);
historyController.init(app);
homeController.init(app);
pulse.init(app);

server.listen(process.env.PORT || 3000);
setInterval(function() {
  pomodoro.tick();
}, 1000);
