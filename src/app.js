var express = require('express');
var server = require('http').createServer(app);
var ejs = require('ejs');
var app = express();

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/assets/RoyalPac-mapV2.json');
  res.render('RoyalPac.ejs');
});

app.use(function(req, res, next){
  res.setHeader('Content-Type', 'text/plain');
  res.send(404, 'ERREUR 404 MEC ! (Coded by Eddy Murhpy ...)!');
});

app.listen(8080);
