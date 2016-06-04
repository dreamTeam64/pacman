point = function(game,layer){
  this.game = game; //objet du jeu
  this.layer = layer; //layer vu par le joueur

  this.score = 0; //initialisation du score
  this.scoreText = null; //initialiser de l'objet texte

  points.game.add.group(); //creation du groupe de point

  //fonction permettant de placer les points lors d'un nouveau niveau
  this.PlacePoint = function(){
    //creation des superPoint
    superPoint = game.add.group(); //superpoint est une variable globale
    superPoint.enableBody = true;

    //creation des points
    points = game.add.group();
    points.enableBody = true;

    var i=0;
    var j=0;
    var GrosPoint;

    //placement de grosPoint avec repartition aléatoire sur la map
    do {
        GrosPoint = Math.floor((Math.random() * 25)); //nombre random entre 0 et 24
    } while ((map.getTile(GrosPoint,GrosPoint,layer,true).index!=136)||(map.getTile(GrosPoint,GrosPoint,layer,true).index==1)||(map.getTile(GrosPoint,GrosPoint,layer,true).index==69));

    for (i = 0; i < 31; i++) {
      for (j = 0; j < 24; j++) {
          if ((GrosPoint==i*25)&&(GrosPoint==j*25)) { // Placer le super point
              superPoint.create(i*25,j*25,'diamond');
              j++;
          }
          if ((i*25==player.position.x) && (j*25==player.position.y)) { //Pas d'étoiles sur le pacman
              j++;
          }
          if (map.getTile(i,j,layer,true).index == 136) {
                  var point = points.create(i*25,j*25,'LittlePoint');
                  this.howLeft += 10;
          }
      }
    }
    this.howLeft -= 1;
  }

  this.reset = function(){
    if (this.howLeft == 0) {
        this.PlacePoint();
        level++;
        levelText.text = 'current level: '+ level;
    }
  }

  this.scoring = function(){
    this.Point.kill();
    this.score += 10;
    scoreText.text = 'score: '+ score;
    this.howLeft -= 10;
  }

}
