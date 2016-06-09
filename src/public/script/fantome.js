"use strict";
/**
*constructeur de l'objet fantome
* @arg {Object} game
* @arg {Object} layer
* @arg {Number} x Définit la pos x à l'instant initial
* @arg {Number} y Définit la pos y à l'instant initial
* @arg {Number} respawnX Définit en X ou respawnera le fantome
* @arg {Number} respawnY Définit en Y ou respawnera le fantome
**/
var fantome = function(game,layer,x,y,respawnX,respawnY){
  Phaser.Sprite.call(this,game,x,y,'greendy');
  this.ate = false; //permet de définir si le fantome et en mode mangeable
  this.velocityPlayer = 30; //Definit la vitesse du joueur

  this.speed_x = 0; //vitesse horizontal
  this.speed_y = 0; //vitesse vertical

  //position du fantome
  this.x = x;
  this.y = y;

  //position du respawn
  this.respawnX = respawnX;
  this.respawnY = respawnY;

  //position des tiles
  this.tile_x = null;
  this.tile_y = null;

  //calcul de la vitesse relative selon les axes X et Y
  this.relativeSpeed = 0;

  //les objets nécessaire
  this.layer = layerF; //layer pour permettre au fantome de bouger dans le chemin creer par le pathfinder
  this.map = mapF; //map relative au fantomes
  this.game = game;

  game.add.existing(this);
  game.physics.enable(this);

  this.pathfinder = pathfinder;
  this.walkables = walkables;
  this.findPath = function(playerX, playerY){

    var fant = this;

    /**
    * @param {Array} path contient tous les checkpoints à passer pour arriver à destination 
    **/
    this.pathfinder.setCallbackFunction(function(path) {
      if(path === null){
        console.log("La destination n'a pu être trouvée");
      } else {
        //tracage du chemin
        for (var i = 0, ilen = path.length; i < ilen; i++) {
          (fant.map).putTile(46, path[i].x, path[i].y);
        }

        var goToX = path[1].x * 25;
        var goToY = path[1].y * 25;

        //le fantome se dirige vers le prochain checkPoint
        if (goToX > fant.x) {
          fant.moveRight();
        } else if (goToX < fant.x){
          fant.moveLeft();
        } else {
          fant.speed_x = 0;
        }

        if (goToY > fant.y) {
          fant.moveDown();
        } else if (goToY < fant.y){
          fant.moveUp();
        } else {
          fant.speed_y = 0;
        }
      }
    });

    this.pathfinder.preparePathCalculation([fant.tile_x,fant.tile_y], [Math.floor(playerX/25),Math.floor(playerY/25)]);
    this.pathfinder.calculatePath();
  }

}

//fantome hérite de l'objet Phaser.Sprite
fantome.prototype = Object.create(Phaser.Sprite.prototype);
fantome.prototype.constructor = fantome;
/**
* permet au fantome de vérifier autour de lui les passages
* @arg {String} direction permet de définir ou l'on veut check le passage
* @arg {Object} map Instance globale de la map
* @arg {Object} layer Instance globale du layer

* @return {boolean} Si le fantome peut passer dans la direction donnée
**/
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

/**
* Verifier si le pacman est en dessous du fantome
**/
fantome.prototype.playerIsAbove = function(){
  return (this.body.y < player.body.y);
}arg

/**
* Verifier si le pacman est à droite du fantome
**/
fantome.prototype.isPlayerOnRight = function(){
  return (this.body.x < player.body.x);
}

/**
* permettre au fantome de bouger en haut
* @param {Number} speed_y Vitesse du fantome selon l'axe y
* @param {Number} speed_x Vitesse du fantome selon l'axe x
* @param {Number} velocityPlayer vitesse absolue du joueur définie au départ
**/
fantome.prototype.moveUp = function(){
  this.speed_x = 0;//si il doit bouger en vertical on annule la vitesse horizontale
  this.speed_y = -this.velocityPlayer; //-50
  this.animations.play('up');
}

/**
* permettre au fantome de bouger en bas
* @param {Number} speed_y Vitesse du fantome selon l'axe y
* @param {Number} speed_x Vitesse du fantome selon l'axe x
* @param {Number} velocityPlayer vitesse absolue du joueur définie au départ
**/
fantome.prototype.moveDown = function(){
  this.speed_x = 0;//si il doit bouger en vertical on annule la vitesse horizontale
  this.speed_y = this.velocityPlayer; // 50
  this.animations.play('Down');
}

/**
* permettre au fantome de bouger à Droite
* @param {Number} speed_y Vitesse du fantome selon l'axe y
* @param {Number} speed_x Vitesse du fantome selon l'axe x
* @param {Number} velocityPlayer vitesse absolue du joueur définie au départ
**/
fantome.prototype.moveRight = function(){
  this.speed_y = 0;
  this.speed_x = this.velocityPlayer;
  this.animations.play('right');
}

/**
* permettre au fantome de bouger à Gauche
* @param {Number} speed_y Vitesse du fantome selon l'axe y
* @param {Number} speed_x Vitesse du fantome selon l'axe x
* @param {Number} velocityPlayer vitesse absolue du joueur définie au départ
**/
fantome.prototype.moveLeft = function(){
  this.speed_y = 0;
  this.speed_x = -this.velocityPlayer;
  this.animations.play('left');
}

/**
*  fonction permettant au fantome de revenir à sa pos Initialisation
*  @param {boolean} ate Etat du fantome
**/
fantome.prototype.BackHome = function () {
    game.add.text(300, 300, '.', { fontSize: '100px', fill: '#bd13be' });
    this.findPath(300, 300);
    this.ate = true;
    if ((this.x == 300)&&(this.y == 375)) {
        game.add.text(300, 300, '.', { fontSize: '100px', fill: '#FFFF00' });
        console.log("Im home bitches !");
        // this.ate = false;
    }
}

fantome.prototype.update = function(){
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

    if (!this.ate) {
        this.findPath(player.body.x, player.body.y);
    } else {
        // setTimeout(function(){ //does not work (╯°□°）╯︵ ┻━┻)
        this.ate = false;
        // console.log("waiting");
        // },500);
    }

    game.physics.arcade.overlap(player, enemies, function(player,enemies){
      this.BackHome();
      setTimeout(function(){
        this.ate = false;
        console.log("waiting");
      },5000);
    }, null, this);

    console.log("this.ate = "+this.ate);
}
