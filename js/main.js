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
    game = new Phaser.Game(gameWidth, gameHeight, Phaser.CANVAS, 'primary-card');
    
    // change this to a language parameter retrieved from the database
    // current choices are "ENG", "PRT", "ESP"
    game.languageChoice = "PRT";
    
    loadLanguageFile();
}

function loadStates(languageText) {
    game.languageText = JSON.parse(languageText);
    game.state.add('Boot', Lyra.Boot);
    game.state.add('Preload', Lyra.Preload);
    game.state.add('MainMenu', Lyra.MainMenu);
    //game.state.add('PreloadLyra', Lyra.PreloadLyra);
    game.state.add('LyraGame',Lyra.LyraGame);
    //game.state.add('OptionsMenu', Lyra.OptionsMenu);
    game.state.start('Boot');
}

function loadLanguageFile(game) {
    $.ajax({
        url: apiUrl,
        type: 'GET',
        context: this,
        data: { 
            "entity" : "language",
            "language" : "language"
        },
        dataType: 'json',
        success: function(response) {
            console.log(response);
            loadStates(response);
        },
        error: function(response) {
            console.log(response);
            
        }
    });
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
            } else {
                loadHomePage();
            }
        },
        error: function(response) {
            console.log(response);
            console.log('failed');
            loadHomePage();
        }
    });
})

})();
