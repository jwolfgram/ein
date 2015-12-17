var express = require('express'),
app = express(),
path = require('path'),
port = '8080',
request = require('request'),
bodyParser = require('body-parser');

app.use(function(req, res, next) {
  console.log('User requested url: ' + req.url); //We will log all requests to the server
  next();
});

app.get('/game/:gameID/:userID', function(req, res) {
  res.send('User: ' + req.params.userID);
  console.log(req.params.userID);
  res.location('game');
});

app.use('/', express.static('public')); //ROUTE the /web

app.listen(port);
console.log(port + ' is the port your webserver is running on.');