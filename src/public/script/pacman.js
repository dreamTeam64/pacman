"use strict";

var pacman = function(game,layer,x,y,cursors){
  Phaser.Sprite.call(this,game,x,y,'pacman');
  this.game = game;
  this.layer = layer;
  
  this.x = x;
  this.y = y;

  this.speed_x = 0;
  this.speed_y = 0;

  this.tile_x = null;
  this.tile_y = null;

  this.relativeSpeed = 0;

  this.velocityPlayer = 40;

  game.add.existing(this);
  game.physics.enable(this);

  this.direction = null;

  this.body.collideWorldBounds = true;
  this.animations.add('left', [6, 5, 4], 10, true);
  this.animations.add('right', [9, 8, 7], 10, true);
  this.animations.add('down', [3, 2, 1], 10, true);
  this.animations.add('up', [12, 11, 10], 10, true);
}

//Pacman hérite des prop et methodes de Phaser.Sprite
pacman.prototype = Object.create(Phaser.Sprite.prototype);
pacman.prototype.constructor = pacman;

/**
  layer et map on un scope global donc pas de passage en param
  player vaut 'this' donc au final on passe rien en param ! Ca c'est du code propre !
  return un boolean
**/
pacman.prototype.canGo = function(direction) {
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

/**
  Cette fonction à t-elle une réelle utilité ?
**/
pacman.prototype.isStick = function(){
  // + vaut'il un ET Logique ?
  var caPasse = this.canGo('left') + this.canGo('right') + this.canGo('up') + this.canGo('down');

  if (caPasse) {
      return false;
  }
  else {
      return true;
  }
}

pacman.prototype.moveUp = function(){
  this.body.velocity.y = -this.velocityPlayer;
  //  Move to the left
  if (this.canGo('up')){
    this.body.velocity.y = -this.velocityPlayer;
    this.body.velocity.x = 0;
    this.animations.play('up');
    this.direction = 'up';
  }
}

pacman.prototype.moveDown = function(){
  this.body.velocity.y = this.velocityPlayer;
  //  Move down
  if (this.canGo('down')){
    this.body.velocity.y = this.velocityPlayer;
    this.body.velocity.x = 0;
    this.animations.play('down');
    this.direction = 'down';
  }
}

pacman.prototype.moveRight = function(){
  this.body.velocity.x = this.velocityPlayer;
  //  Move to the right
  if (this.canGo('right')){
    this.body.velocity.x = this.velocityPlayer;
    this.body.velocity.y = 0;
    this.animations.play('right');
    this.direction = 'right';
  }
}

pacman.prototype.moveLeft = function(){
  this.body.velocity.x = -this.velocityPlayer;
  //  Move to the left
  if (this.canGo('left')){
    this.body.velocity.x = -this.velocityPlayer;
    this.body.velocity.y = 0;
    this.animations.play('left');
    this.direction = 'left';
  }
}

pacman.prototype.update = function(){
  game.physics.arcade.collide(this,layer);

  //formule de notre ami Pyhthagore, pour une fois que tu sers à quelque chose !
  this.relativeSpeed = Math.sqrt(Math.pow(Math.abs(this.body.x - this.x),2) + Math.pow(Math.abs(this.body.y - this.y),2));

  //mise à jour des coordonnées de l'objet
  this.y = this.body.y;
  this.x = this.body.x;

  this.tile_x = Math.floor(this.x/25);
  this.tile_y = Math.floor(this.y/25);

  if (cursors.left.isDown){
      this.moveLeft();
  }
  if (cursors.right.isDown){
      this.moveRight();
  }
  if (cursors.up.isDown){
      this.moveUp();
  }
  if (cursors.down.isDown){
      this.moveDown();
  }
}
