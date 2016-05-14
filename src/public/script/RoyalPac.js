var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update
});

function preload() {
    game.load.tilemap('ClassicMap', '../assets/RoyalPac-mapV2.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', '../assets/TileSet.png');

    game.load.spritesheet('pacman','../assets/pacman.png',35,35);
}

var map;
var layer;
var player;
var tiles;
var tileset;
var cursors;

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#787878';

    map = game.add.tilemap('ClassicMap', 'tiles');

    map.addTilesetImage('TileSet', 'tiles');

    map.setCollisionBetween(1,136);

    layer = map.createLayer('Calque de Tile 1');

    layer.resizeWorld();

    //game.physics.collide(player, layer);
    player = game.add.sprite(200,200,'pacman');

    game.physics.enable(player);

    player.body.collideWorldBounds = true;

    player.animations.add('left', [6, 5, 4], 10, true);
    player.animations.add('right', [9, 8, 7], 10, true);
    player.animations.add('down', [3, 2, 1], 10, true);
    player.animations.add('up', [12, 11, 10], 10, true);

    cursors = game.input.keyboard.createCursorKeys();
}

function update() {
  game.physics.arcade.collide(player, layer);

  if (cursors.left.isDown){
      //  Move to the left
      player.body.velocity.x = -150;
      player.body.velocity.y = 0;
      player.animations.play('left');
  }
  if (cursors.right.isDown){
      //  Move to the left
      player.body.velocity.x = 150;
      player.body.velocity.y = 0;
      player.animations.play('right');
  }
  if (cursors.up.isDown){
      //  Move to the left
      player.body.velocity.y = -150;
      player.body.velocity.x = 0;
      player.animations.play('up');
  }
  if (cursors.down.isDown){
      //  Move to the left
      player.body.velocity.y = 150;
      player.body.velocity.x = 0;
      player.animations.play('down');
  }

}
