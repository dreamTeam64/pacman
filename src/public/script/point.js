point = function(game,layer,type,value){
    this.hit = false;
    this.type = type; // Simple ou Fruit
    this.value = value; // 1, ou 50 pour le fruit
}
point.prototype = Object.create(Phaser.Sprite.prototype);
point.prototype.constructor = point;

point.prototype.create = function (game,layer,map) {
    var i=0;
    var j=0;
    for (i = 0; i < 31; i++) {
        for (j = 0; j < 24; j++) {
            if (map.getTile(i,j,layer,true).index == 136) {
                game.add.sprite(i*25,j*25,'star');
            }
        }
    }
};

function Scoring(pacman, Point) {
    console.log("Kill");
    Point.kill(); //Enlever l'étoile
    score += Point.value;
    scoreText.text = 'score: '+ score;
}

point.prototype.update = function(game,layer,map){
    game.physics.arcade.overlap(pacman,Point,Scoring,null,this);
}
