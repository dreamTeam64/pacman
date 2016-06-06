var pacman = function(game,layer,x,y){
  this.game = game;
  this.layer = layer;

  this.x = x;
  this.y = y;

  this.speed_x = 0;
  this.speed_y = 0;

  this.tile_x = null;
  this.tile_y = null;

  this.relativeSpeed = 0;

  this.velocityPlayer = 30;

  game.add.existing(this);
  game.physics.enable(this);

}

pacman.prototype = Object.create(Phaser.Sprite.prototype);
pacman.prototype.constructor = pacman;

pacman.prototype.canGo = function() {

}

pacman.prototype.isStick = function(){

}

pacman.prototype.moveUp = function(){
  this.speed_x = -this.velocityPlayer;
  //  Move to the left
  if (this.canGo('left',this,this.layer,this.map)){
    this.speed_x = -this.velocityPlayer;
    this.speed_y = 0;
    this.animations.play('left');
    this.direction = 'left';
  }
}

pacman.prototype.moveDown = function(){
  this.speed_y = this.velocityPlayer;
  //  Move down
  if (this.canGo('down',this,this.layer,this.map)){
    this.speed_y = this.velocityPlayer;
    this.speed_x = 0;
    this.animations.play('down');
    this.direction = 'down';
  }
}

pacman.prototype.moveRight = function(){
  this.speed_x = this.velocityPlayer;
  //  Move to the right
  if (thiscanGo('right',this,this.layer,this.map)){
    this.speed_x = this.velocityPlayer;
    this.speed_y = 0;
    this.animations.play('right');
    this.direction = 'right';
  }
}

pacman.prototype.moveLeft = function(){
  this.speed_x = -this.velocityPlayer;
  //  Move to the left
  if (thiscanGo('left',this,this.layer,this.map)){
    this.speed_x = -this.velocityPlayer;
    this.speed_y = 0;
    this.animations.play('left');
    this.direction = 'left';
  }
}

pacman.prototype.update = function(){
  game.physics.arcade.collide(this, this.layer);
  //Mouvement du fantome en x et y
  this.body.velocity.x = this.speed_x;
  this.body.velocity.y = this.speed_y;

  //formule de notre ami Pyhthagore, pour une fois que tu sert à quelque chose !
  this.relativeSpeed = Math.sqrt(Math.pow(Math.abs(this.body.x - this.x),2) + Math.pow(Math.abs(this.body.y - this.y),2));

  //mise à jour des coordonnées de l'objet
  this.y = this.body.y;
  this.x = this.body.x;

  this.tile_x = Math.floor(this.x/25);
  this.tile_y = Math.floor(this.y/25);
}
