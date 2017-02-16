var gameTitle = "Lyra Escape";
var primaryCard = $("#primary-card");
var loginForm = $("#login-form");
var loginTitle = $("#login-title");
var loginUsername = $("#login-username");
var loginUsernameLabel = $("#login-username-label");
var loginPassword = $("#login-password");
var loginPasswordLabel = $("#login-password-label");
var languageSelection = $("#language-selection");
var submitButton = $("#submit-button");

var gameWidth = 1184;
var gameHeight = 672;
var languageChoice = "ENG";
var jsonLanguage;

loadLanguageFile();

function populateLoginPage(languageText) {
    jsonLanguage = JSON.parse(languageText);
    languageSelection.html('');
    for (var i = 0; i < jsonLanguage.language.length; i++) {
        languageSelection.append("<option value='" + jsonLanguage.languageCodes[i] + "'>" + jsonLanguage.language[i] + "</option");
    }
    languageSelection.prop('disabled', false);
    
    languageSelection.change(function() {
        languageChoice = languageSelection.val();
        loginTitle.html(jsonLanguage.identifyYourself[languageChoice]);
        loginUsernameLabel.html(jsonLanguage.username[languageChoice]);
        loginPasswordLabel.html(jsonLanguage.password[languageChoice]);
        submitButton.html(jsonLanguage.submit[languageChoice]);
        document.title = gameTitle + " | " + jsonLanguage.login[languageChoice];
    });
}

function loadGame(userId) {
    primaryCard.html('');
    document.title = gameTitle + " | " + jsonLanguage.mainmenu[languageChoice];
    var game = new Phaser.Game(gameWidth, gameHeight, Phaser.CANVAS, 'primary-card', null, true);
    game.userPreference = new UserPreference();
    game.userPreference.data.userId = userId;
    game.userPreference.ready = false;
    game.userPreference.data.languageChoice = languageChoice;
    game.languageText = jsonLanguage;
    game.state.add('Boot', Lyra.Boot);
    game.state.add('Preload', Lyra.Preload);
    game.state.add('MainMenu', Lyra.MainMenu);
    game.state.add('StoryMenu', Lyra.StoryMenu);
    game.state.add('LyraGame',Lyra.LyraGame);
    game.state.add('EndGame', Lyra.EndGame);
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
            populateLoginPage(response);
        },
        error: function(response) {
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
        context: this,
        success: function(response) {
            if (response.error === "none") {
                loadGame(response.userId);
            } else {
                loadGame('2');
            }
        },
        error: function(response) {
            loadGame('2');
        }
    });
})