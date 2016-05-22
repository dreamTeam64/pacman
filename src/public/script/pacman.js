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

  //         UP    DOWN  RIGHT LEFT
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

pacman.prototype.chooseWay = function(layer,map){
  this.canGo('up',layer,map) ? this.dir[0].possible = true : this.dir[0].possible = false;
  this.canGo('down',layer,map) ? this.dir[1].possible = true : this.dir[1].possible = false;
  this.canGo('right',layer,map) ? this.dir[2].possible = true : this.dir[2].possible = false;
  this.canGo('left',layer,map) ? this.dir[3].possible = true : this.dir[3].possible = false;

  //reset des valeurs
  for (var i = 0; i < this.dir.length; i++) {
    this.dir[i].eval = 0;
  }

  //definition des priorités
  ((this.body.x - player.body.x) > 0) ? this.dir[0].eval = 1 : this.dir[1].eval = 1;
  ((this.body.y - player.body.y) > 0) ? this.dir[2].eval = 1 : this.dir[3].eval = 1;
  console.log(this.dir);

  //return final choice
  var indice;
  var res;

  indice = 0;

  for (var i = 0; i < this.dir.length; i++) {
    if ((this.dir[i].possible == true) && (this.actualMovement != this.dir[i].movement)) {
      indice = i;
      if (this.dir[i].eval == 1) {
        res = i;
        break;
      }
    }
  }

  res = indice;
  console.log(res);
  switch (res) {
    case 0:
      this.moveUp();
      this.actualMovement = "up";
      break;

    case 1:
      this.moveDown();
      this.actualMovement = "down";
      break;

    case 2:
      this.moveRight();
      this.actualMovement = "right";
      break;

    case 3:
      this.moveLeft();
      this.actualMovement = "left";
      break;

    default:
      this.moveUp();
      this.actualMovement = "up";
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

    this.chooseWay(layer,map);

    //mise à jour des coordonnées de l'objet
    this.y = this.body.y;
    this.x = this.body.x;
}
