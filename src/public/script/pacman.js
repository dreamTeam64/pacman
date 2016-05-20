//constructeur de l'objet Pacman
pacman = function(game,layer,x,y){
  Phaser.Sprite.call(this,game,x,y,'greendy');
  this.speed_x = 30; //vitesse horizontal
  this.speed_y = 0; //vitesse vertical

  //position du pacman
  this.x = x;
  this.y = y;

  //calcul de la vitesse relative selon les axes X et Y
  this.relativeSpeed = 0;

  this.actualMovement = null;

  //les objets nécessaire
  this.layer = layer;
  this.game = game;

  //Permet d'éviter les conflits dans les décisions
  this.waitingVerticalMovement = true;
  this.waitingHorizontalMovement = false;

  //         UP    DOWN  RIGHT LEFT
  this.dir = [false,false,false,false];
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

pacman.prototype.chooseWay = function(layer,map){
  this.canGo('up',layer,map) ? this.dir[0] = true : this.dir[0] = false;
  this.canGo('down',layer,map) ? this.dir[1] = true : this.dir[1] = false;
  this.canGo('right',layer,map) ? this.dir[2] = true : this.dir[2] = false;
  this.canGo('left',layer,map) ? this.dir[3] = true : this.dir[3] = false;
  console.log(this.dir);
}

pacman.prototype.moveUp = function(){
  this.speed_x = 0;//si il doit bouger en vertical on annule la vitesse horizontal

  //bidouillage, si x = 125.00001234 alors ca ne passe pas, donc on lui FLOOR ca mère comme ca x = 125 et bim !
  //console.log(Math.floor(this.body.x));
  this.body.x = Math.floor(this.body.x);
  this.body.y = Math.floor(this.body.y);
  this.speed_y = -30;
  this.animations.play('up');

  this.waitingVerticalMovement = false;
  this.waitingHorizontalMovement = true;
}

pacman.prototype.moveDown = function(){
  this.speed_x = 0;//si il doit bouger en vertical on annule la vitesse horizontal

  //bidouillage, si x = 125.00001234 alors ca ne passe pas, donc on lui FLOOR ca mère comme ca x = 125 et bim !
  //console.log(Math.floor(this.body.x));
  this.body.x = Math.floor(this.body.x);
  this.body.y = Math.floor(this.body.y);
  this.speed_y = 30;
  this.animations.play('Down');

  this.waitingVerticalMovement = false;
  this.waitingHorizontalMovement = true;
}

pacman.prototype.moveRight = function(){
  this.speed_y = 0;

  //   console.log(Math.floor(this.body.x));
  this.body.x = Math.floor(this.body.x);
  this.body.y = Math.floor(this.body.y);
  this.speed_x = 30;
  this.animations.play('right');

  this.waitingVerticalMovement = true;
  this.waitingHorizontalMovement = false;
}

pacman.prototype.moveLeft = function(){
  this.speed_y = 0;

  //   console.log(Math.floor(this.body.x));
  this.body.x = Math.floor(this.body.x);
  this.body.y = Math.floor(this.body.y);
  this.speed_x = -30;
  this.animations.play('left');

  this.waitingVerticalMovement = true;
  this.waitingHorizontalMovement = false;
}

pacman.prototype.update = function(){
    this.chooseWay(layer,map);
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
      this.moveUp();

    }
    if (this.canGo("left",layer,map) && this.waitingHorizontalMovement) {
      this.moveLeft();
    }

    //mise à jour des coordonnées de l'objet
    this.y = this.body.y;
    this.x = this.body.x;
}
