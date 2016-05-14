var express = require('express');
var ejs = require('ejs');
var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.render('RoyalPac.ejs');
});

app.use(function(req, res, next){
  res.setHeader('Content-Type', 'text/plain');
  res.send(404, 'ERREUR 404 MEC ! (Coded by Eddy Murhpy ...)!');
});



app.listen(8080);
