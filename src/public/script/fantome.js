//constructeur de l'objet fantome
fantome = function(game,layer,x,y){
  Phaser.Sprite.call(this,game,x,y,'greendy');
  this.layer = layer;
  this.game = game;

  this.velocityPlayer = 30; //Definit la vitesse du joueur

  this.speed_x = 0; //vitesse horizontal
  this.speed_y = 0; //vitesse vertical

  //position du fantome
  this.x = x;
  this.y = y;

  //calcul de la vitesse relative selon les axes X et Y
  this.relativeSpeed = 0;

  //les objets nécessaire
  this.layer = layer;
  this.game = game;

  //pathfinder
  this.actualTile = null;

  map.setCollision(136);
  //this.scale.setTo(0.5,0.5);

  //this.animations.add('left', [6, 5, 4], 10, true);
  //this.animations.add('right', [9, 8, 7], 10, true);
  //this.animations.add('down', [3, 2, 1], 10, true);
  //this.animations.add('up', [12, 11, 10], 10, true);

  //Permet d'éviter les conflits dans les décisions
}

//fantome hérite de l'objet Phaser.Sprite
fantome.prototype = Object.create(Phaser.Sprite.prototype);
fantome.prototype.constructor = fantome;

//permet au fantome de vérifier autour de lui les passages
fantome.prototype.canGo = function(direction, layer, map){
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

fantome.prototype.playerIsAbove = function(){
  return (this.body.y < player.body.y);
}

fantome.prototype.isPlayerOnRight = function(){
  return (this.body.x < player.body.x);
}

fantome.prototype.chooseWay = function(layer,map){
    var res;
    //console.log(this.canGo("up",layer,map));
    //console.log(this.canGo("down",layer,map));
    if (this.canGo("up",layer,map)) {
        this.moveUp();
    }
    // if (this.canGo("down",layer,map)) {
    //     this.moveDown();
    // }
    if (this.playerIsAbove()) {
        if (this.isPlayerOnRight()) {
            //A droite
            if (this.canGo("up",layer,map)) {
                this.moveUp();
            }
            if (this.canGo("right",layer,map)) {
                this.moveRight();
            }
        } else {
            //A gauche
                if (this.canGo("up",layer,map)) {
                    this.moveUp();
                }
                if (this.canGo("left",layer,map)) {
                    this.moveLeft();
                }
            }
    } else
    { //cas de !PlayerIsAbove()
        if (this.isPlayerOnRight()) {
            if (this.canGo("down",layer,map)) {
                this.moveDown();
            }
            if (this.canGo("right",layer,map)) {
                this.moveRight();
            }
            } else { //cas de !isPlayerOnRight()
                if (this.canGo("down",layer,map)) {
                    this.moveDown();
                }
                if (this.canGo("left",layer,map)) {
                    this.moveLeft();
                }
            }
        }
}

fantome.prototype.moveUp = function(){
  this.speed_x = 0;//si il doit bouger en vertical on annule la vitesse horizontale
  this.speed_y = -this.velocityPlayer; //-50
  this.animations.play('up');
}

fantome.prototype.moveDown = function(){
  this.speed_x = 0;//si il doit bouger en vertical on annule la vitesse horizontale
  this.speed_y = this.velocityPlayer; // 50
  this.animations.play('Down');
}

fantome.prototype.moveRight = function(){
  this.speed_y = 0;
  this.speed_x = this.velocityPlayer;
  this.animations.play('right');
}

fantome.prototype.moveLeft = function(){
  this.speed_y = 0;
  this.speed_x = -this.velocityPlayer;
  this.animations.play('left');
}

fantome.prototype.update = function(){

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

    console.log(this.relativeSpeed);

}
