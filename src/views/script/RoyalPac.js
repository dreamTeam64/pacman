var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    game.load.tilemap('ClassicMap', '../../assets/RoyalPac-mapV2.json', null, Phaser.Tilemap.TILED_JSON);

}

var map;

function create() {

    map = game.add.tilemap('ClassicMap');

}

function update() {

}
