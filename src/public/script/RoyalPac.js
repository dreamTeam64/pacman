
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update
});

function preload() {
    game.load.tilemap('ClassicMap', '../assets/RoyalPac-mapV2.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', '../assets/TileSet.png');
    game.load.image('star', '../assets/star.png');
    game.load.spritesheet('pacman','../assets/pacman_test.png',25,25,13);
}

var map;
var layer;
var player;
var pac;
var tiles;
var tileset;
var cursors;
var Point;

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //Création Map
    map = game.add.tilemap('ClassicMap', 'tiles');
    map.addTilesetImage('TileSet', 'tiles');
    layer = map.createLayer('Calque de Tile 1');
    layer.resizeWorld();

    map.setCollision(2);
    map.setCollision(1);

    game.physics.arcade.collide(player, layer);
    player = game.add.sprite(375,375,'pacman');

    game.physics.enable(player);
    player.body.collideWorldBounds = true;
    // player.scale.setTo(0.95,0.95);
    //player.body.collideWorldBounds = true;
    //player.body.setSize(23, 23, 0, 0);
    player.animations.add('left', [6, 5, 4], 10, true);
    player.animations.add('right', [9, 8, 7], 10, true);
    player.animations.add('down', [3, 2, 1], 10, true);
    player.animations.add('up', [12, 11, 10], 10, true);

    var m_un = new monster(game,200,300);

    game.add.existing(m_un);
    pac = new pacman(game,layer,200,200);
    game.add.existing(pac);

    game.physics.arcade.collide(pac, layer);

    game.physics.enable(pac);

    Point = new point (game,layer,'Simple',1);
    game.physics.enable(Point);
    Point.create(game,layer,map);
    cursors = game.input.keyboard.createCursorKeys();
}

function canGo(direction, player, layer, map){
    //player.body.velocity.x = 0;
    //player.body.velocity.y = 0;
    if (direction == 'down') {
        return((map.getTileWorldXY(player.position.x + 24, player.position.y + 25, 25, 25, layer).index == 136) && (map.getTileWorldXY(player.position.x, player.position.y +25, 25, 25, layer).index == 136)); //down
    }
    if (direction == 'up') {
        return((map.getTileWorldXY(player.position.x + 24, player.position.y - 1, 25, 25, layer).index == 136) && (map.getTileWorldXY(player.position.x, player.position.y - 1, 25, 25, layer).index == 136)); //up
    }
    if (direction == 'right'){
        return((map.getTileWorldXY(player.position.x + 25, player.position.y + 24, 25, 25, layer).index == 136) && (map.getTileWorldXY(player.position.x + 25, player.position.y, 25, 25, layer).index == 136)); //right
    }
    if (direction == 'left') {
        return((map.getTileWorldXY(player.position.x - 1, player.position.y + 24, 25, 25, layer).index == 136) && (map.getTileWorldXY(player.position.x - 1, player.position.y, 25, 25, layer).index == 136)); //left
    }
}

function isStick(player,layer,map){

    var caPasse = canGo('left',player,layer,map) + canGo('right',player,layer,map) + canGo('up',player,layer,map) + canGo('down',player,layer,map);
    if (caPasse) {
        return false;
    }
    else {
        return true;
    }
}

function update() {
  game.physics.arcade.collide(player, layer);
  game.physics.arcade.collide(pac, layer);
  game.physics.arcade.collide(point, pac);
  isStick(player,layer,map);


  //Actuellement ne fonctionne presque correctement qu'à gauche, les autres directions c'est un peu random
  if (cursors.left.isDown){
      player.body.velocity.x = -30;
      //  Move to the left
      if (canGo('left',player,layer,map)){
        player.body.velocity.x = -30;
        player.body.velocity.y = 0;
        player.animations.play('left');
        pacman.direction = 'left';
      }
  }
  if (cursors.right.isDown){
      player.body.velocity.x = 30;
      //  Move to the right
      if (canGo('right',player,layer,map)){
        player.body.velocity.x = 30;
        player.body.velocity.y = 0;
        player.animations.play('right');
        pacman.direction = 'right';
      }
  }
  if (cursors.up.isDown){
      player.body.velocity.y = -30;
      //  Move up
      if (canGo('up',player,layer,map)){
        player.body.velocity.y = -30;
        player.body.velocity.x = 0;
        player.animations.play('up');
        pacman.direction = 'up';
      }
  }
  if (cursors.down.isDown){
      player.body.velocity.y = 30;
      //  Move down
      if (canGo('down',player,layer,map)){
        player.body.velocity.y = 30;
        player.body.velocity.x = 0;
        player.animations.play('down');
        pacman.direction = 'down';
      }
  }
}
/* Le systèmes de points*/

point = function(game,layer,type,value){
    this.hit = false;
    this.type = type; // Simple ou Fruit
    this.value = value; // 1, ou 50 pour le fruit
}
point.prototype = Object.create(Phaser.Sprite.prototype);
point.prototype.constructor = point;

point.prototype.create = function (game,layer,map) {
    var i=0;
    var j=0;
    for (i = 0; i < 25; i++) {
        for (j = 0; i < 25; i++) {
            console.log("coucou; i= "+i+" j= " + j); //Wtf pourquoi le j s'incrémente pas !!! (ノ °益°)ノ ︵ (\﻿ .o.)\ 
            if (map.getTile(i,j,layer).index == 136) {
                console.log("i: "+i+"; j: "+j+"; spawnable !");
                //Phaser.Sprite.call(this,game,i,j,'star');
            }
        }
    }
};
/* LE LABO, PACMANS ET MONSTRES EN PRODUCTION ... ET MEME DES ARBRES ! */

var noeud = {
  donnée: 0,
  droit: null,
  gauche: null,
  pere: null,
}

var arbre = {
  nom: "abre de décision",
  racine: Object.create(noeud),
  getNom: function(){
    console.log(this.nom);
  }
}

//constructeur de l'objet Pacman
pacman = function(game,layer,x,y){
  Phaser.Sprite.call(this,game,x,y,'pacman');
  this.speed_x = 30; //vitesse horizontal
  this.speed_y = 0; //vitesse vertical

  //position du pacman
  this.x = x;
  this.y = y;

  //calcul de la vitesse relative selon les axes X et Y
  this.relativeSpeed = 0;

  //les objets nécessaire
  this.layer = layer;
  this.game = game;

  //Permet d'éviter les conflits dans les décisions
  this.waitingVerticalMovement = true;
  this.waitingHorizontalMovement = false;
}

//pacman hérite de l'objet Phaser.Sprite
pacman.prototype = Object.create(Phaser.Sprite.prototype);
pacman.prototype.constructor = pacman;

//Ne fonctionne pas encore
pacman.prototype.create = function(){
  this.animations.add('left', [6, 5, 4], 10, true);
  this.animations.add('right', [9, 8, 7], 10, true);
  this.animations.add('down', [3, 2, 1], 10, true);
  this.animations.add('up', [12, 11, 10], 10, true);
}

//permet au pacman de vérifier autour de lui les passages
pacman.prototype.canGo = function(direction, layer, map){
  if (direction == 'down') {
      return((map.getTileWorldXY(this.position.x + 24, this.position.y + 25, 25, 25, layer).index == 136) && (map.getTileWorldXY(this.position.x, this.position.y +25, 25, 25, layer).index == 136)); //down
  }
  if (direction == 'up') {
      return((map.getTileWorldXY(this.position.x + 24, this.position.y - 1, 25, 25, layer).index == 136) && (map.getTileWorldXY(this.position.x, this.position.y - 1, 25, 25, layer).index == 136)); //up
  }
  if (direction == 'right'){
      return((map.getTileWorldXY(this.position.x + 25, this.position.y + 24, 25, 25, layer).index == 136) && (map.getTileWorldXY(this.position.x + 25, this.position.y, 25, 25, layer).index == 136)); //right
  }
  if (direction == 'left') {
      return((map.getTileWorldXY(this.position.x - 1, this.position.y + 24, 25, 25, layer).index == 136) && (map.getTileWorldXY(this.position.x - 1, this.position.y, 25, 25, layer).index == 136)); //left
  }
}

pacman.prototype.update = function(){
    //Mouvement du pacman en x et y
    this.body.velocity.x = this.speed_x;
    this.body.velocity.y = this.speed_y;

    //débug des position au temps t
    // console.log(this.body.x);
    // console.log(this.body.y);

    //formule de notre ami Pyhthagore, pour une fois que tu sert à quelque chose !
    this.relativeSpeed = Math.sqrt(Math.pow(Math.abs(this.body.x - this.x),2) + Math.pow(Math.abs(this.body.y - this.y),2));
    // console.log("vitesse relative : "+this.relativeSpeed);

    //petit test de décision
    if (this.canGo("up",layer,map) && this.waitingVerticalMovement) {
      this.speed_x = 0;//si il doit bouger en vertical on annule la vitesse horizontal

      //bidouillage, si x = 125.00001234 alors ca ne passe pas, donc on lui FLOOR ca mère comme ca x = 125 et bim !
    //   console.log(Math.floor(this.body.x));
      this.body.x = Math.floor(this.body.x);
      this.body.y = Math.floor(this.body.y);
      this.speed_y = -30;

      this.waitingVerticalMovement = false;
      this.waitingHorizontalMovement = true;

    }
    if (this.canGo("left",layer,map) && this.waitingHorizontalMovement) {
      this.speed_y = 0;

    //   console.log(Math.floor(this.body.x));
      this.body.x = Math.floor(this.body.x);
      this.body.y = Math.floor(this.body.y);
      this.speed_x = -30;

      this.waitingVerticalMovement = true;
      this.waitingHorizontalMovement = false;

    }

    //mise à jour des coordonnées de l'objet
    this.y = this.body.y;
    this.x = this.body.x;
}

monster = function(game,x,y){
  Phaser.Sprite.call(this,game,x,y,'star');
}
//monster herite des methodes et prop de Phaser.Sprite
monster.prototype = Object.create(Phaser.Sprite.prototype);
//monster et le constructeur de la classe monster
//monster est une classe fille de Phaser.Sprite
monster.prototype.constructor = monster;

monster.prototype.create = function(){
  game.physics.enable(this);
  game.physics.arcade.collide(this, layer);
}

monster.prototype.update = function(){
  //console.log("hello");
}

//bat les couilles wallah déconne pas
