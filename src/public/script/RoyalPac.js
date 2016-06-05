
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update
});

// console.log(game);

function preload() {
    game.load.tilemap('ClassicMap', '../assets/RoyalPac-mapV2.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', '../assets/TileSet.png');
    game.load.image('LittlePoint', '../assets/LittlePoint.png');
    game.load.spritesheet('pacman','../assets/pacman_test.png',25,25,13);
    game.load.spritesheet('greendy','../assets/greendy.png',25,25,4);
    game.load.spritesheet('reddit','../assets/reddit.png',25,25,4);
    game.load.spritesheet('yellowStone','../assets/yellowStone.png',25,25,4);
    game.load.spritesheet('diamond','../assets/diamond.png',25,25,4);
}

/* Déclaration des variables globales au jeu */
var map;
var layer;
var player;
var fantomas;
var flantomas;
var tiles;
var tileset;
var cursors;
var points;
var score = 0;
var scoreText;
var howLeft=1;
var level =1;
var levelText;

var velocityPlayer = 200; //Definit la vitesse du joueur

var blocked = false;
var pathfinder;
var walkables;

var superPoint;
var superPointValue=50;

function initFantomLayerMap(){
  mapF = game.add.tilemap('ClassicMap', 'tiles');
  mapF.addTilesetImage('TileSet', 'tiles');
  layerF = mapF.createLayer('Calque de Tile 1');
  layerF.resizeWorld();
  mapF.setCollision(136);
  mapF.setCollision(1);
}

function initPlayerLayerMap(){
  map = game.add.tilemap('ClassicMap', 'tiles');
  map.addTilesetImage('TileSet', 'tiles');
  layer = map.createLayer('Calque de Tile 1');
  layer.resizeWorld();
  map.setCollision(1);
  map.setCollision(69);
}

function initPlayerProperties(){
  player.body.collideWorldBounds = true;
  player.animations.add('left', [6, 5, 4], 10, true);
  player.animations.add('right', [9, 8, 7], 10, true);
  player.animations.add('down', [3, 2, 1], 10, true);
  player.animations.add('up', [12, 11, 10], 10, true);
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    //Initialisation de la vue pour les fantomes
    initFantomLayerMap();
    //Création Map
    initPlayerLayerMap();

    //Ajout du player et init
    player = game.add.sprite(375,375,'pacman');
    game.physics.enable(player);
    initPlayerProperties();

    //superPoint = game.add.sprite(375,375,'diamond');

    //gestion du pathfinder
    walkables = [136];//définition des tiles où l'on peut marcher
    pathfinder = game.plugins.add(Phaser.Plugin.PathFinderPlugin);//ajout du plugin
    pathfinder.setGrid(map.layers[0].data, walkables);//creation du graphe
    // console.log(pathfinder);

    //INSTANCE DU FANTOME
    fantomas = new fantome(game,layer,200,200);
    flantomas = new fantome(game,layer,25,25);
    PlacePoint();

    cursors = game.input.keyboard.createCursorKeys();

    scoreText = game.add.text(0,0,'score: 0', {fontSize: '24px', fill: '#000'});
    levelText = game.add.text(375,0,'current level: ', {fontSize: '24px', fill: '#111'});
    levelText.text = 'current level: '+ level;
    console.log(fantomas);
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

    superPoint = game.add.group();
    superPoint.enableBody = true;
    points = game.add.group();
    points.enableBody = true;
    var i=0;
    var j=0;
    var GrosPoint;
    do {
        GrosPoint = Math.floor((Math.random() * 25));
    }while ((map.getTile(GrosPoint,GrosPoint,layer,true).index!=136)||(map.getTile(GrosPoint,GrosPoint,layer,true).index==1)||(map.getTile(GrosPoint,GrosPoint,layer,true).index==69));

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
                        howLeft = howLeft+10;
                }
            }
    }

    howLeft=howLeft-1;
}

function Reset(howLeft){ // Todo: Freeze Time + animation of replacing points
    if (howLeft == 0) {
        PlacePoint();
        level++;
        levelText.text = 'current level: '+ level;
    }
}

function Scoring(player,Point) {
    Point.kill(); //Enlever l'étoile
    score += 10;
    scoreText.text = 'score: '+ score;
    howLeft=howLeft-10;
}

function MovementHandler(){
    if (cursors.left.isDown){
        player.body.velocity.x = -velocityPlayer;
        //  Move to the left
        if (canGo('left',player,layer,map)){
          player.body.velocity.x = -velocityPlayer;
          player.body.velocity.y = 0;
          player.animations.play('left');
          player.direction = 'left';
        }
    }
    if (cursors.right.isDown){
        player.body.velocity.x = velocityPlayer;
        //  Move to the right
        if (canGo('right',player,layer,map)){
          player.body.velocity.x = velocityPlayer;
          player.body.velocity.y = 0;
          player.animations.play('right');
          player.direction = 'right';
        }
    }
    if (cursors.up.isDown){
        player.body.velocity.y = -velocityPlayer;
        //  Move up
        if (canGo('up',player,layer,map)){
          player.body.velocity.y = -velocityPlayer;
          player.body.velocity.x = 0;
          player.animations.play('up');
          player.direction = 'up';
        }
    }
    if (cursors.down.isDown){
        player.body.velocity.y = velocityPlayer;
        //  Move down
        if (canGo('down',player,layer,map)){
          player.body.velocity.y = velocityPlayer;
          player.body.velocity.x = 0;
          player.animations.play('down');
          player.direction = 'down';
        }
    }
}

function update() {
  //console.log(pathfinder);
  game.physics.arcade.collide(player, layer);
  game.physics.arcade.collide(fantome, layer);
  //console.log(layerF);
  game.physics.arcade.collide(fantomas, layerF);


  game.physics.arcade.overlap(player, points, function(player,points){
    Scoring(player,points);
  }, null, this);

  //isStick(player,layer,map);

  MovementHandler();
  Reset(howLeft);
}
