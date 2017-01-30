// Start the game by creating a Lyra object to hold the phaser game object and define game elements

var lyra = new LyraState();

// these dimensions define the size of the canvas used in displaying the game
// [TODO] tie this to the allowed window size 
// use this size to display the entire map
var gamewidth = 64; // given in tiles wide
var gameheight = 46; // given in tiles high

// use this size to display just a 20x20 grid
// var gamewidth = 20; // given in tiles wide
// var gamewidth = 20; // given in tiles high

lyra.startGame(EASY_MAP, PLAYER_DATA, gamewidth*32, gameheight*32);
