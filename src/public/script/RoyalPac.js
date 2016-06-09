var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update
});

function preload() {
    game.load.tilemap('ClassicMap', '../assets/RoyalPac-mapV2.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', '../assets/TileSet.png');
    game.load.image('LittlePoint', '../assets/LittlePoint.png');
    game.load.spritesheet('pacman','../assets/pacman_test.png',25,25,13);
    game.load.spritesheet('greendy','../assets/greendy.png',25,25,4);
    game.load.spritesheet('reddit','../assets/reddit.png',25,25,4);
    game.load.spritesheet('yellowStone','../assets/yellowStone.png',25,25,4);
    game.load.spritesheet('diamond','../assets/diamond.png',25,25,4);
    game.load.image('menu', '../assets/PauseMenu/PauseMenu.png', 800 , 600);
}

/* Déclaration des variables globales au jeu */
var w = 800, h = 600; //taille du canvas
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
var life=3;
var lifeText;
var enemies;
// var velocityPlayer = 200; //Definit la vitesse du joueur

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

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    //Initialisation de la vue pour les fantomes
    initFantomLayerMap();
    //Création Map
    initPlayerLayerMap();
    player = new pacman(game,layer,375,375);

    //gestion du pathfinder
    walkables = [136];//définition des tiles où l'on peut marcher
    pathfinder = game.plugins.add(Phaser.Plugin.PathFinderPlugin);//ajout du plugin
    pathfinder.setGrid(map.layers[0].data, walkables);//creation du graphe
    // console.log(pathfinder);

    //INSTANCE DU FANTOME
    enemies = game.add.group();
    fantomas = new fantome(game,layer,200,200,200,200);
    flantomas = new fantome(game,layer,25,25,25,25);
    enemies.add(fantomas);
    enemies.add(flantomas);
    PlacePoint();

    cursors = game.input.keyboard.createCursorKeys();

    scoreText = game.add.text(0,0,'Score: 0', {fontSize: '24px', fill: '#000'});
    levelText = game.add.text(500,0,'Current Level: ', {fontSize: '24px', fill: '#000'});
    levelText.text = 'Current Level: '+ level;
    lifeText = game.add.text(200,0,'Remaining Lives: ', {fontSize: '24px', fill: '#000'});
    lifeText.text = 'Remaining Lives: ' + life;
    PauseMenu();
}


//Ok j'avoue j'ai cc/cp le code du tuto de phaser ahah
function PauseMenu(){
    var pause_label = game.add.text(w -80, 0, 'Pause', { fontSize: '24px', fill: '#000' });
    pause_label.inputEnabled = true;
    pause_label.events.onInputUp.add(function () {
        // When the pause button is pressed, we pause the game
        game.paused = true;

        // Then add the menu
        menu = game.add.sprite(w/2, h/2, 'menu');
        menu.anchor.setTo(0.5, 0.5);

        // And a label to illustrate which menu item was chosen. (This is not necessary)
        choiseLabel = game.add.text(w/2, h -50, 'Click to continue', { fontSize: '50px', fill: '#FFFF00' });
        choiseLabel.anchor.setTo(0.5, 0.5);
    });

    // Add a input listener that can help us return from being paused
    game.input.onDown.add(unpause, self);

    // And finally the method that handels the pause menu
    function unpause(event){
        // Only act if paused
        if(game.paused){

        //Si on ajoute des items dans le menu c'est ca qu'il faut faire

            // Calculate the corners of the menu
            var x1 = w/2 - 0/2, x2 = w/2 + 0/2, //à la place des 0/2 mettre la position des items
                y1 = h/2 - 0/2, y2 = h/2 + 0/2;

            // Check if the click was inside the menu
            if(event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2 ){
            /*
                // The choicemap is an array that will help us see which item was clicked
                var choisemap = ['one', 'two', 'three', 'four', 'five', 'six'];
                // Get menu local coordinates for the click
                var x = event.x - x1,
                    y = event.y - y1;
                // Calculate the choice
                var choise = Math.floor(x / 90) + 3*Math.floor(y / 90);
                // Display the choice
                choiseLabel.text = 'You chose menu item: ' + choisemap[choise];
            */
            }
            else{
                // Remove the menu and the label
                menu.destroy();
                choiseLabel.destroy();

                // Unpause the game
                game.paused = false;
            }
        }
    };
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
    // do {
        GrosPoint = 30; //Math.floor((Math.random() * 25));
    // }while (map.getTile(GrosPoint,GrosPoint,layer,true).index!=136);

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
        velocityPlayer +=100;
    }
}

function Scoring(player,Point) {
    Point.kill(); //Enlever l'étoile
    score += 10;
    scoreText.text = 'Score: '+ score;
    howLeft=howLeft-10;
}

function freezeTime(time) { //time in seconds
    var seconds;
    seconds = time * 1000;
    game.paused = true;
    setTimeout(function(){game.paused = false;},seconds);
}

function Death(player,enemies) {
    // Todo: play animation of death
    //
    life--;
    console.log(enemies.respawnX);
    //enemies.findPath(300,300); //Normalement les fantomes ils respawn pas comme ca ils retournent à leurs base tout seul comme des gaillards
    // enemies.body.y = 300; //OR enemies.respawnX or Y
    if (life>=0) {
        lifeText.text = 'Remaining Lives: ' + life;
        //freezeTime(1);
    }
    else {
        // En faisant ça j'ai eu une putain d'idée (mais on fera ça à la toute fin ahah). L'idée c'est que quand on meurt dans l'écran
        // game over, on revoit la game !!

        //ToDo: Recreate map
        //      The "click to restart" function

        game.add.text(w-725, h -450, 'GAME OVER !', { fontSize: '100px', fill: '#FFFF00' });
        game.add.text(w-600, h -50, 'Click to restart', { fontSize: '50px', fill: '#FFFF00' });
        game.paused = true;
        score = 0;
        scoreText.text = 'Score: ' + score;
        level = 1;
        levelText.text = 'Current Level: ' + level;
        howLeft = 1;
        life = 3;
        lifeText.text = 'Remaining Lives: ' + life;
        game.paused = false;
    }
}

function update() {
  game.physics.arcade.overlap(player, points, function(player,points){
    Scoring(player,points);
  }, null, this);
  game.physics.arcade.overlap(player, enemies, function(player,enemies){
    Death(player,enemies);
  }, null, this);
  Reset(howLeft);
}
