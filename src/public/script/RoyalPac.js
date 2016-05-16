
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

    //player.body.collideWorldBounds = true;
    //player.body.setSize(23, 23, 0, 0);
    player.animations.add('left', [6, 5, 4], 10, true);
    player.animations.add('right', [9, 8, 7], 10, true);
    player.animations.add('down', [3, 2, 1], 10, true);
    player.animations.add('up', [12, 11, 10], 10, true);

    var m_un = new monster(game,200,300);

    game.add.existing(m_un);
    var pac = new pacman(game,layer,200,200);
    game.add.existing(pac);

    game.physics.arcade.collide(pac, layer);

    game.physics.enable(pac);
    cursors = game.input.keyboard.createCursorKeys();
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

function update() {
  game.physics.arcade.collide(player, layer);


  if (canGo('left',player,layer,map) || canGo('right',player,layer,map) || canGo('up',player,layer,map) || canGo('down',player,layer,map)) {
    console.log("ça paaaasse !");
    console.log("LeftTile = " + map.getTileWorldXY(player.position.x -25, player.position.y, 25, 25, layer).index);
    console.log("RightTile = " + map.getTileWorldXY(player.position.x +25, player.position.y, 25, 25, layer).index);
    console.log("UpTile = " + map.getTileWorldXY(player.position.x, player.position.y -25, 25, 25, layer).index);
    console.log("DownTile = " + map.getTileWorldXY(player.position.x +24, player.position.y +25, 25, 25, layer).index);
}
    var caPasse = canGo('left',player,layer,map) + canGo('right',player,layer,map) + canGo('up',player,layer,map) + canGo('down',player,layer,map);
    if (caPasse) {
        console.log("caPasse = true");
    }
    else {
        console.log("caPasse = false");
    }
  //Actuellement ne fonctionne presque correctement qu'à gauche, les autres directions c'est un peu random
  if (cursors.left.isDown){
      //  Move to the left
      if (canGo('left',player,layer,map)){
        player.body.velocity.x = -300;
        player.body.velocity.y = 0;
        player.animations.play('left');
        pacman.direction = 'left';
      }
  }
  if (cursors.right.isDown){
      //  Move to the right
      if (canGo('right',player,layer,map)){
        player.body.velocity.x = 300;
        player.body.velocity.y = 0;
        player.animations.play('right');
        pacman.direction = 'right';
      }
  }
  if (cursors.up.isDown){
      //  Move up
      if (canGo('up',player,layer,map)){
        player.body.velocity.y = -300;
        player.body.velocity.x = 0;
        player.animations.play('up');
        pacman.direction = 'up';
      }
  }
  if (cursors.down.isDown){
      //  Move down
      if (canGo('down',player,layer,map)){
        player.body.velocity.y = 300;
        player.body.velocity.x = 0;
        player.animations.play('down');
        pacman.direction = 'down';
      }
  }

}

pacman = function(game,layer,x,y){
  Phaser.Sprite.call(this,game,x,y,'pacman');
  this.speed = 150;
  this.x = x;
  this.y = y;
  this.layer = layer;
  this.game = game;

  console.log(this.game);
}
pacman.prototype = Object.create(Phaser.Sprite.prototype);
pacman.prototype.constructor = pacman;

pacman.prototype.create = function(){
  //game.physics.enable(this);
  //game.physics.arcade.collide(this, layer);
  this.animations.add('left', [6, 5, 4], 10, true);
  this.animations.add('right', [9, 8, 7], 10, true);
  this.animations.add('down', [3, 2, 1], 10, true);
  this.animations.add('up', [12, 11, 10], 10, true);
}

pacman.prototype.canGo = function(direction,player, layer, map){
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

pacman.prototype.update = function(){
    this.body.velocity.x = this.speed;
}



monster = function(game,x,y){
  Phaser.Sprite.call(this,game,x,y,'star');
}
//monster herite des methodes et prop de Phaser.Sprite
monster.prototype = Object.create(Phaser.Sprite.prototype);
//monster et le constructeur de la classe monster
//monster est une classe fille de Phaser.Sprite
monster.prototype.constructor = monster;

monster.prototype.create = function(){
  game.physics.enable(this);
  game.physics.arcade.collide(this, layer);
}

monster.prototype.update = function(){
  //console.log("hello");
}

//bat les couilles wallah déconne pas
