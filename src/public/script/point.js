point = function(game,layer,type,value,player,points){
    //this.hit = false;
    var type = type; // Simple ou Fruit
    var value = value; // 1, ou 50 pour le fruit

    var game = game;
    var layer = layer;
    var type = type;
    var value = value;
    var player = player;

    this.score = 0;

    points.game.add.group();
}
point.prototype = Object.create(Phaser.Sprite.prototype);
point.prototype.constructor = point;

point.prototype.getScore = function(){return this.score}

/*
point.prototype.create = function () {
    var i=0;
    var j=0;
    for (i = 0; i < 31; i++) {
        for (j = 0; j < 24; j++) {
            if (map.getTile(i,j,this.layer,true).index == 136) {
                var Point = this.points.create(i*25,j*25,'star');
            }
        }
    }
};
*/
point.prototype.update = function(){
    this.game.physics.arcade.overlap(this.player,this.points,Scoring,null,this);
}

function Scoring(pacman,Point) {
    console.log("Kill");
    Point.kill(); //Enlever l'étoile
    score += 10;
    console.log(this.score);
    scoreText.text = 'score: '+ this.score;
}
