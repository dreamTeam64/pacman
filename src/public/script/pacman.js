//constructeur de l'objet Pacman
pacman = function(game,layer,x,y){
  Phaser.Sprite.call(this,game,x,y,'greendy');

  this.speed_x = 0; //vitesse horizontal
  this.speed_y = 0; //vitesse vertical

  //position du pacman
  this.x = x;
  this.y = y;

  //calcul de la vitesse relative selon les axes X et Y
  this.relativeSpeed = 0;

  this.actualMovement = 'right';

  //les objets nécessaire
  this.layer = layer;
  this.game = game;

  //Permet d'éviter les conflits dans les décisions
  this.waitingVerticalMovement = true;
  this.waitingHorizontalMovement = false;

  this.dir =[
  {
    possible:false,
    eval:0,
    movement: "up"
  },
  {
    possible:false,
    eval:0,
    movement: "down"
  },
  {
    possible:false,
    eval:0,
    movement: "right"
  },
  {
    possible:false,
    eval:0,
    movement: "left"
  }];
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

pacman.prototype.playerIsAbove = function(){
  return (this.body.y < player.body.y);
}

pacman.prototype.isPlayerOnRight = function(){
  return (this.body.x < player.body.x);
}

pacman.prototype.chooseWay = function(layer,map){
  var res;

  if (this.playerIsAbove()) {
    if (this.isPlayerOnRight()) {
      if (this.canGo("up",layer,map)) {
        this.moveUp();
      } else if (this.canGo("right",layer,map)) {
        this.moveRight();
      } else if (this.canGo("left",layer,map)) {
        this.moveLeft();
      } else {
        this.moveDown();
      }
    } else {
      if (this.canGo("up",layer,map)) {
        this.moveUp();
      } else if (this.canGo("left",layer,map)) {
        this.moveLeft();
      } else if (this.canGo("right",layer,map)) {
        this.moveRight();
      } else {
        this.moveDown();
      }
    }
  } else { //cas de !PlayerIsAbove()
    if (this.isPlayerOnRight()) {
      if (this.canGo("down",layer,map)) {
        this.moveDown();
      } else if (this.canGo("right",layer,map)) {
        this.moveRight();
      } else if (this.canGo("left",layer,map)) {
        this.moveLeft();
      } else {
        this.moveUp();
      }
    } else { //cas de !isPlayerOnRight()
      if (this.canGo("down",layer,map)) {
        this.moveDown();
      } else if (this.canGo("left",layer,map)) {
        this.moveLeft();
      } else if (this.canGo("right",layer,map)) {
        this.moveRight();
      } else {
        this.moveUp();
      }
    }
  }


}

pacman.prototype.moveUp = function(){
  this.speed_x = 0;//si il doit bouger en vertical on annule la vitesse horizontal
  this.speed_y = -50;
  this.animations.play('up');

  this.waitingVerticalMovement = false;
  this.waitingHorizontalMovement = true;
}

pacman.prototype.moveDown = function(){
  this.speed_x = 0;//si il doit bouger en vertical on annule la vitesse horizontal
  this.speed_y = 50;
  this.animations.play('Down');

  this.waitingVerticalMovement = false;
  this.waitingHorizontalMovement = true;
}

pacman.prototype.moveRight = function(){
  this.speed_y = 0;
  this.speed_x = 50;
  this.animations.play('right');

  this.waitingVerticalMovement = true;
  this.waitingHorizontalMovement = false;
}

pacman.prototype.moveLeft = function(){
  this.speed_y = 0;
  this.speed_x = -50;
  this.animations.play('left');

  this.waitingVerticalMovement = true;
  this.waitingHorizontalMovement = false;
}

pacman.prototype.update = function(){
    //player est une variable global, on peut donc y acceder sans passage par paramètre
    console.log(player.body.x);
    console.log(player.body.y);


    //this.chooseWay(layer,map);
    //Mouvement du pacman en x et y
    this.body.velocity.x = this.speed_x;
    this.body.velocity.y = this.speed_y;

    //formule de notre ami Pyhthagore, pour une fois que tu sert à quelque chose !
    this.relativeSpeed = Math.sqrt(Math.pow(Math.abs(this.body.x - this.x),2) + Math.pow(Math.abs(this.body.y - this.y),2));

    console.log(this.playerIsAbove());
    console.log(this.isPlayerOnRight);

    this.chooseWay(layer,map);

    //mise à jour des coordonnées de l'objet
    this.y = this.body.y;
    this.x = this.body.x;
}
