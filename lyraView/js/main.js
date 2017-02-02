(function(){
var gameTitle = "Lyra Escape";
var primaryCard = $("#primary-card");
var loginForm = $("#login-form");
var loginUsername = $("#login-username");
var loginPassword = $("#login-password");
var gameWidth = 1200;
var gameHeight = 800;
var game;

function loadHomePage() {
    primaryCard.html("");
    document.title = gameTitle + " | Main Menu";
    game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, 'primary-card');
    game.state.add('Boot', Lyra.Boot);
    game.state.add('Preload', Lyra.Preload);
    game.state.add('MainMenu', Lyra.MainMenu);
    game.state.start('Boot');
}


loginForm.submit(function(e) {
    e.preventDefault();

    var method = 'POST',
        url = apiUrl,
        parameters = {
            action : 'login',
            username : loginUsername.val(),
            password : loginPassword.val(),
        };

    $.ajax({
        url: url,
        type: method,
        data: parameters,
        dataType: 'json',
        success: function(response) {
            console.log(response);
            console.log('success');
            if (response.error === "none") {
                loadHomePage();
            }
        },
        error: function(response) {
            console.log(response);
            console.log('failed');
        }
    });
})

})();



// Start the game by creating a Lyra object to hold the phaser game object and define game elements

//var lyra = new LyraState();

// these dimensions define the size of the canvas used in displaying the game
// [TODO] tie this to the allowed window size 
// use this size to display the entire map
//var gamewidth = 64; // given in tiles wide
//var gameheight = 46; // given in tiles high

// use this size to display just a 20x20 grid
// var gamewidth = 20; // given in tiles wide
// var gamewidth = 20; // given in tiles high

//lyra.startGame(EASY_MAP, PLAYER_DATA, gamewidth*32, gameheight*32);

    // var lyra = new Lyra();
    
    // //[TODO] make this data part of the lyra object creation and pass into the game when game started
    // /// don't know how to do that yet.  Just placeholders here.  Data not used.
    // // var mapRef = 'assets/tilemaps/maps/grayRoom.json';
    // // var imageTagList = ['grayTiles', 'background'];
    // // var imageRefList = ['assets/grayTiles.png', 'assets/backgroundGray.png'];
    
    // var mapRef = 'assets/tilemaps/maps/reference_map.json';
    // var imageTagList = ['scifitiles-sheet', 'meta_tiles'];
    // var imageRefList =  ['assets/scifitiles-sheet.png', 'assets/meta_tiles.png'];
    
    // var mapwidth = 64; // given in tiles wide
    // var mapheight = 46; // given in tiles high
    
    // // var mapwidth = 20; // given in tiles wide
    // // var mapheight = 20; // given in tiles high
    
    
    // lyra.startGame(mapRef, imageTagList, imageRefList, mapwidth*32, mapheight*32);