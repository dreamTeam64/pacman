var express = require('express');
var server = require('http').createServer(app);
var ejs = require('ejs');
var app = express();
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

app.use(function(req, res, next){
  res.setHeader('Content-Type', 'text/plain');
  res.send(404, 'ERREUR 404 MEC ! (Coded by Eddy Murhpy ...)!');
});

app.listen(8080);
