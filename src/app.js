var express = require('express');
var ejs = require('ejs');
var app = express();

app.get('/', function(req, res){
  res.render('RoyalPac.ejs');
});

app.listen(8080);
