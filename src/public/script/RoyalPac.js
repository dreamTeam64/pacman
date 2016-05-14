var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    game.load.tilemap('ClassicMap', '../assets/RoyalPac-mapV2.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', '../assets/TileSet.png');
    game.load.spritesheet('pacman','../assets/pacman.png',35,35,5);
}

var map;
var layer;
var player;

function create() {

    map = game.add.tilemap('ClassicMap');
    map.addTilesetImage('TileSet', 'tiles');
    layer = map.createLayer('Calque de Tile 1');
    layer.resizeWorld();
    player = game.add.sprite(35,game.world.height - 100,'pacman');
}

function update() {

}
