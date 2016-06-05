var pacman = function(game,layer,x,y){
  this.game = game;
  this.layer = layer,
  this.x = x;
  this.y = y;

  this.velocityPlayer = 30;

}

pacman.prototype = Object.create(Phaser.Sprite.prototype);
pacman.prototype.constructor = pacman;

pacman.prototype.canGo = function() {

}

pacman.prototype.moveUp = function(){
  this.body.velocity.x = -this.velocityPlayer;
  //  Move to the left
  if (this.canGo('left',this,this.layer,this.map)){
    this.body.velocity.x = -this.velocityPlayer;
    this.body.velocity.y = 0;
    this.animations.play('left');
    this.direction = 'left';
  }
}

pacman.prototype.moveDown = function(){
  this.body.velocity.y = this.velocityPlayer;
  //  Move down
  if (this.canGo('down',this,this.layer,this.map)){
    this.body.velocity.y = this.velocityPlayer;
    this.body.velocity.x = 0;
    this.animations.play('down');
    this.direction = 'down';
  }
}

pacman.prototype.moveRight = function(){
  this.body.velocity.x = this.velocityPlayer;
  //  Move to the right
  if (thiscanGo('right',this,this.layer,this.map)){
    this.body.velocity.x = this.velocityPlayer;
    this.body.velocity.y = 0;
    this.animations.play('right');
    this.direction = 'right';
  }
}

pacman.prototype.moveLeft = function(){
  this.body.velocity.x = -this.velocityPlayer;
  //  Move to the left
  if (thiscanGo('left',this,this.layer,this.map)){
    this.body.velocity.x = -this.velocityPlayer;
    this.body.velocity.y = 0;
    this.animations.play('left');
    this.direction = 'left';
  }
}
