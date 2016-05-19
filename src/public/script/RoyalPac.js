
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update
});

function preload() {
    game.load.tilemap('ClassicMap', '../assets/RoyalPac-mapV2.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', '../assets/TileSet.png');
    game.load.image('star', '../assets/star.png');
    game.load.spritesheet('pacman','../assets/pacman_test.png',25,25,13);
}

var map;
var layer;
var player;
var pac;
var tiles;
var tileset;
var cursors;
var Point;
var scoreText;
function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //Création Map
    map = game.add.tilemap('ClassicMap', 'tiles');
    map.addTilesetImage('TileSet', 'tiles');
    layer = map.createLayer('Calque de Tile 1');
    layer.resizeWorld();

    map.setCollision(2);
    map.setCollision(1);

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

    pac = new pacman(game,layer,200,200);
    game.add.existing(pac);

    game.physics.arcade.collide(pac, layer);

    game.physics.enable(pac);

    Point = new point (game,layer,'Simple',1);
    //Point=game.add.group();
    game.physics.enable(Point);
    Point.create(game,layer,map);
    Point.enableBody = true;
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

function update() {
  game.physics.arcade.collide(player, layer);
  game.physics.arcade.collide(pac, layer);
  collision = game.physics.arcade.collide(point, pac);
  isStick(player,layer,map);
  Point.update(game,layer,map);

  //Actuellement ne fonctionne presque correctement qu'à gauche, les autres directions c'est un peu random
  if (cursors.left.isDown){
      player.body.velocity.x = -30;
      //  Move to the left
      if (canGo('left',player,layer,map)){
        player.body.velocity.x = -30;
        player.body.velocity.y = 0;
        player.animations.play('left');
        pacman.direction = 'left';
      }
  }
  if (cursors.right.isDown){
      player.body.velocity.x = 30;
      //  Move to the right
      if (canGo('right',player,layer,map)){
        player.body.velocity.x = 30;
        player.body.velocity.y = 0;
        player.animations.play('right');
        pacman.direction = 'right';
      }
  }
  if (cursors.up.isDown){
      player.body.velocity.y = -30;
      //  Move up
      if (canGo('up',player,layer,map)){
        player.body.velocity.y = -30;
        player.body.velocity.x = 0;
        player.animations.play('up');
        pacman.direction = 'up';
      }
  }
  if (cursors.down.isDown){
      player.body.velocity.y = 30;
      //  Move down
      if (canGo('down',player,layer,map)){
        player.body.velocity.y = 30;
        player.body.velocity.x = 0;
        player.animations.play('down');
        pacman.direction = 'down';
      }
  }
}
