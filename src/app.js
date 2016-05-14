var express = require('express');
var ejs = require('ejs');
var app = express();

app.get('/:prenom', function(req, res){
  res.render('accueil.ejs',{name: req.params.prenom});
});

app.listen(8080);
