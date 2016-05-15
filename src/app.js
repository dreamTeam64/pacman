var express = require('express');
var app = express();
var server = require('http').createServer(app);
var ejs = require('ejs');
var path = require ('path');

/*
  les chemins statiques commencent au dossier public
  ie : src="/script/RoyalPac.js" va chercher dans src/public/script/RoyalPac.js
*/
console.log(__dirname); //__dirname = /Users/.../pacman/src
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

app.get('/', function(req, res){
  res.render('RoyalPac.ejs');
});

app.get('/contact', function(req, res){
  res.render('contact.ejs');
});

app.use(function(req, res, next){
  res.render('error.ejs');
});

app.listen(8079);
