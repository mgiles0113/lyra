// Start the game by creating a Lyra object to hold the phaser game object and define game elements

var lyra = new LyraState();

//[TODO] make this data part of the lyra object creation and pass into the game when game started
/// don't know how to do that yet.  Just placeholders here.  Data not used.
// var mapRef = 'assets/tilemaps/maps/grayRoom.json';
// var imageTagList = ['grayTiles', 'background'];
// var imageRefList = ['assets/grayTiles.png', 'assets/backgroundGray.png'];

var mapRef = 'assets/tilemaps/maps/reference_map.json';
var imageTagList = ['scifitiles-sheet', 'meta_tiles'];
var imageRefList =  ['assets/scifitiles-sheet.png', 'assets/meta_tiles.png'];

// use this size to display the entire map
var mapwidth = 64; // given in tiles wide
var mapheight = 46; // given in tiles high

// use this size to display just a 20x20 grid
// var mapwidth = 20; // given in tiles wide
// var mapheight = 20; // given in tiles high


lyra.startGame(mapRef, imageTagList, imageRefList, mapwidth*32, mapheight*32);
