
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update
});

console.log(game);

function preload() {
    game.load.tilemap('ClassicMap', '../assets/RoyalPac-mapV2.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', '../assets/TileSet.png');
    game.load.image('star', '../assets/star.png');
    game.load.spritesheet('pacman','../assets/pacman_test.png',25,25,13);
    game.load.spritesheet('greendy','../assets/greendy.png',25,25,4);
    game.load.spritesheet('reddit','../assets/reddit.png',25,25,4);
    game.load.spritesheet('yellowStone','../assets/yellowStone.png',25,25,4);
}

/* Déclaration des variables globales au jeu */
var map;
var layer;
var player;
var fantome;
var tiles;
var tileset;
var cursors;
var points;
var score = 0;
var scoreText;

var blocked = false;
var pathfinder;
var walkables;

function findPathTo(tilex, tiley) {

    pathfinder.setCallbackFunction(function(path) {
        path = path || [];
        for(var i = 0, ilen = path.length; i < ilen; i++) {
            map.putTile(46, path[i].x, path[i].y);
        }
        blocked = false;
    });

    pathfinder.preparePathCalculation([0,0], [tilex,tiley]);
    pathfinder.calculatePath();
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //Création Map
    map = game.add.tilemap('ClassicMap', 'tiles');
    map.addTilesetImage('TileSet', 'tiles');
    layer = map.createLayer('Calque de Tile 1');
    layer.resizeWorld();

    map.setCollision(2);
    map.setCollision(1);

    PlacePoint();

    game.physics.arcade.collide(player, layer);
    player = game.add.sprite(375,375,'pacman');

    game.physics.enable(player);
    player.body.collideWorldBounds = true;
    // player.scale.setTo(0.95,0.95);
    //player.body.collideWorldBounds = true;
    //player.body.setSize(23, 23, 0, 0);
    player.animations.add('left', [6, 5, 4], 10, true);
    player.animations.add('right', [9, 8, 7], 10, true);
    player.animations.add('down', [3, 2, 1], 10, true);
    player.animations.add('up', [12, 11, 10], 10, true);

<<<<<<< HEAD
    //INSTANCE DU PACMAN /// FANTOME DU COUP ????? /// AH BAH NON TAIN LA LOGIQUE DU TYPE
    pac = new pacman(game,layer,200,200);
    game.add.existing(pac);
    game.physics.arcade.collide(pac, layer);
    game.physics.enable(pac);
=======
    //gestion du pathfinder
    walkables = [136];

    pathfinder = game.plugins.add(Phaser.Plugin.PathFinderPlugin);
    pathfinder.setGrid(map.layers[0].data, walkables);


    //INSTANCE DU Fantome
    fantome = new pacman(game,layer,200,200);
    game.add.existing(fantome);
    game.physics.arcade.collide(fantome, layer);
    game.physics.enable(fantome);
>>>>>>> 581245a6333c0b13c4060373ab516ca7330d1757



    cursors = game.input.keyboard.createCursorKeys();

    scoreText = game.add.text(0,0,'score: 0', {fontSize: '24px', fill: '#000'});
}

function canGo(direction, player, layer, map){
    //player.body.velocity.x = 0;
    //player.body.velocity.y = 0;
    if (direction == 'down') {
        return((map.getTileWorldXY(player.position.x + 24, player.position.y + 25, 25, 25, layer).index == 136) && (map.getTileWorldXY(player.position.x, player.position.y +25, 25, 25, layer).index == 136)); //down
    }
    if (direction == 'up') {
        return((map.getTileWorldXY(player.position.x + 24, player.position.y - 1, 25, 25, layer).index == 136) && (map.getTileWorldXY(player.position.x, player.position.y - 1, 25, 25, layer).index == 136)); //up
    }
    if (direction == 'right'){
        return((map.getTileWorldXY(player.position.x + 25, player.position.y + 24, 25, 25, layer).index == 136) && (map.getTileWorldXY(player.position.x + 25, player.position.y, 25, 25, layer).index == 136)); //right
    }
    if (direction == 'left') {
        return((map.getTileWorldXY(player.position.x - 1, player.position.y + 24, 25, 25, layer).index == 136) && (map.getTileWorldXY(player.position.x - 1, player.position.y, 25, 25, layer).index == 136)); //left
    }
}

function isStick(player,layer,map){

    var caPasse = canGo('left',player,layer,map) + canGo('right',player,layer,map) + canGo('up',player,layer,map) + canGo('down',player,layer,map);
    if (caPasse) {
        return false;
    }
    else {
        return true;
    }
}

function PlacePoint(){
    //INSTANCE DES POINTS
    points = game.add.group();
    points.enableBody = true;
    var i=0;
    var j=0;
    for (i = 0; i < 31; i++) {
        for (j = 0; j < 24; j++) {
            if (map.getTile(i,j,layer,true).index == 136) {
                var point = points.create(i*25,j*25,'star');
                points.howLeft++;
            }
        }
    }
}

function Reset(Point)
{
    if (Point.howLeft == 0) {
        PlacePoint();
    }
}

function Scoring(pacman,Point) {
    Point.kill(); //Enlever l'étoile
    score += 10;
    scoreText.text = 'score: '+ score;
    Point.howLeft--;
}

function MovementHandler(){
    if (cursors.left.isDown){
        player.body.velocity.x = -pacman.velocityPlayer;
        //  Move to the left
        if (canGo('left',player,layer,map)){
          player.body.velocity.x = -pacman.velocityPlayer;
          player.body.velocity.y = 0;
          player.animations.play('left');
          pacman.direction = 'left';
        }
    }
    if (cursors.right.isDown){
        player.body.velocity.x = pacman.velocityPlayer;
        //  Move to the right
        if (canGo('right',player,layer,map)){
          player.body.velocity.x = pacman.velocityPlayer;
          player.body.velocity.y = 0;
          player.animations.play('right');
          pacman.direction = 'right';
        }
    }
    if (cursors.up.isDown){
        player.body.velocity.y = -pacman.velocityPlayer;
        //  Move up
        if (canGo('up',player,layer,map)){
          player.body.velocity.y = -pacman.velocityPlayer;
          player.body.velocity.x = 0;
          player.animations.play('up');
          pacman.direction = 'up';
        }
    }
    if (cursors.down.isDown){
        player.body.velocity.y = pacman.velocityPlayer;
        //  Move down
        if (canGo('down',player,layer,map)){
          player.body.velocity.y = pacman.velocityPlayer;
          player.body.velocity.x = 0;
          player.animations.play('down');
          pacman.direction = 'down';
        }
    }
}

function update() {
  console.log(pathfinder);
  game.physics.arcade.collide(player, layer);
  game.physics.arcade.collide(fantome, layer);
  game.physics.arcade.overlap(player, points, function(player,point){
    Scoring(pacman,point);
  }, null, this);

  isStick(player,layer,map);

  MovementHandler();
}
