var pacman = function(game,layer,x,y){
  this.game = game;
  this.layer = layer,
  this.x = x;
  this.y = y;

  this.velocityPlayer = 30;

}

pacman.prototype = Object.create(Phaser.Sprite.prototype);
pacman.prototype.constructor = pacman;

pacman.prototype.moveUp = function(){

}

pacman.prototype.moveDown = function(){
  this.body.velocity.x = -this.velocityPlayer;
  //  Move to the left
  if (canGo('left',player,layer,map)){
    this.body.velocity.x = -this.velocityPlayer;
    this.body.velocity.y = 0;
    this.animations.play('left');
    this.direction = 'left';
  }
}

pacman.prototype.moveRight = function(){

}

pacman.prototype.moveLeft = function(){

}
