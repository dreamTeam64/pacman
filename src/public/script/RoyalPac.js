
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
var tiles;
var tileset;
var cursors;

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
    //player.body.setSize(23, 23, 0, 0);
    player.animations.add('left', [6, 5, 4], 10, true);
    player.animations.add('right', [9, 8, 7], 10, true);
    player.animations.add('down', [3, 2, 1], 10, true);
    player.animations.add('up', [12, 11, 10], 10, true);

    var m_un = new monster(game,200,300);
    game.add.existing(m_un);

    cursors = game.input.keyboard.createCursorKeys();
}

function update() {
  game.physics.arcade.collide(player, layer);
  
  //Get Tiles around player 
  var leftTile = map.getTileWorldXY(player.position.x -25, player.position.y, 25, 25, layer).index;
  var rightTile = map.getTileWorldXY(player.position.x +25, player.position.y, 25, 25, layer).index;
  var upTile = map.getTileWorldXY(player.position.x, player.position.y +25, 25, 25, layer).index;
  var downTile = map.getTileWorldXY(player.position.x, player.position.y -25, 25, 25, layer).index;
  var isWall;
  
  if (cursors.left.isDown){
      //  Move to the left
      isWall = (leftTile == 2);
      if (is wall) {
        console.log("it s a wall");
      }
      if (!isWall){
        player.body.velocity.x = -150;
        player.body.velocity.y = 0;
        player.animations.play('left');
      }  
  }
  if (cursors.right.isDown){
      //  Move to the right
      player.body.velocity.x = 150;
      player.body.velocity.y = 0;
      player.animations.play('right');
  }
  if (cursors.up.isDown){
      //  Move up
      player.body.velocity.y = -150;
      player.body.velocity.x = 0;
      player.animations.play('up');
  }
  if (cursors.down.isDown){
      //  Move down
      player.body.velocity.y = 150;
      player.body.velocity.x = 0;
      player.animations.play('down');
  }

}

monster = function(game,x,y){
  Phaser.Sprite.call(this,game,x,y,'star');
}

monster.prototype = Object.create(Phaser.Sprite.prototype);
monster.prototype.constructor = monster;

monster.prototype.create = function(){
  game.physics.enable(this);
  game.physics.arcade.collide(this, layer);
}

monster.prototype.update = function(){
  //console.log("hello");
}

//bat les couilles wallah déconne pas