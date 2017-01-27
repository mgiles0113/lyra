(function(){
var gameTitle = "Lyra Escape";
var primaryCard = $("#primary-card");
var loginForm = $("#login-form");
var loginUsername = $("#login-username");
var loginPassword = $("#login-password");
var phaserExample = $("<div id=\"phaser-example\"></div>");

function loadHomePage() {
    primaryCard.html("")
        .append(phaserExample);
    document.title = gameTitle + " | Main Menu";
    // Start the game by creating a Lyra object to hold the phaser game object and define game elements

    var lyra = new Lyra();
    
    //[TODO] make this data part of the lyra object creation and pass into the game when game started
    /// don't know how to do that yet.  Just placeholders here.  Data not used.
    // var mapRef = 'assets/tilemaps/maps/grayRoom.json';
    // var imageTagList = ['grayTiles', 'background'];
    // var imageRefList = ['assets/grayTiles.png', 'assets/backgroundGray.png'];
    
    var mapRef = 'assets/tilemaps/maps/reference_map.json';
    var imageTagList = ['scifitiles-sheet', 'meta_tiles'];
    var imageRefList =  ['assets/scifitiles-sheet.png', 'assets/meta_tiles.png'];
    
    var mapwidth = 64; // given in tiles wide
    var mapheight = 46; // given in tiles high
    
    // var mapwidth = 20; // given in tiles wide
    // var mapheight = 20; // given in tiles high
    
    
    lyra.startGame(mapRef, imageTagList, imageRefList, mapwidth*32, mapheight*32);
}

loginForm.submit(function(e) {
    e.preventDefault();

    var method = 'POST',
        url = 'https://cs467-lyra-development-mgiles0113.c9users.io/lyraAPI/apiController.php',
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