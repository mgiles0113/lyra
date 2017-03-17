var primaryCard = $("#primary-card");
primaryCard.css("display", "none");
var gameTitle = "Lyra Escape";
var loginForm = $("#login-form");
var loginTitle = $("#login-title");
var loginUsername = $("#login-username");
var loginUsernameLabel = $("#login-username-label");
var loginPassword = $("#login-password");
var loginPasswordLabel = $("#login-password-label");
var languageSelection = $("#language-selection");
var submitButton = $("#submit-button");
var createAccountButton = $("#create-user-link");
var statusMessage = $("#status-message");
var playercontrol = $("#player-selector-title");
var equipped = $("#player-equipped-title");
var playerinventory = $("#player-inventory-title");
var containerinventory = $("#container-inventory-title");
var oxygen = $("#oxygen-title");

var gameWidth = 1184;
var gameHeight = 640;
var languageChoice = "";
var jsonLanguage;

loadLanguageFile();

function populateLoginPage() {
    primaryCard.css('display', 'inherit');
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
        createAccountButton.html(jsonLanguage.createAccount[languageChoice]);
        document.title = gameTitle + " | " + jsonLanguage.login[languageChoice];
    });
}

function loadGame(userId) {
    primaryCard.html('');
    primaryCard.css('display', 'inherit');
    document.title = gameTitle + " | " + jsonLanguage.mainmenu[languageChoice || "ENG"];
    var game = new Phaser.Game(gameWidth, gameHeight, Phaser.CANVAS, 'primary-card', null, true);
    game.userPreference = new UserPreference();
    game.userPreference.data.userId = userId;
    game.userPreference.ready = false;
    if (languageChoice) {
        game.userPreference.data.languageChoice = languageChoice;
    }
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
            jsonLanguage = JSON.parse(response);
            $.ajax({
                url: apiUrl,
                type: 'GET',
                context: this,
                data: { 
                    "entity" : "authenticated"
                },
                dataType: 'json',
                success: function(response) {
                    if (response.authenticated === "yes") {
                        loadGame(response.userId);
                    } else if (response.authenticated === "no") {
                        populateLoginPage();
                    }
                },
                error: function(response) {
                    console.log('fail');
                }
            });
        },
        error: function(response) {
            console.log(response);
            console.log('fail');
        }
    });
}

function updateStatusMessage(message) {
    console.log('updating status message');
    statusMessage.html('');
    statusMessage.removeClass();
    statusMessage.addClass('status-alert');
    statusMessage.html(message);
    
    setTimeout(function() {
        statusMessage.addClass('status-settle');
    }, 200);
}

loginForm.submit(function(e) {
    e.preventDefault();
    languageChoice = languageSelection.val();
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
                updateStatusMessage("Success!");
                loadGame(response.userId);
            } else {
                console.log(response);
                //updateStatusMessage(response.error);
                updateStatusMessage(jsonLanguage.invalidlogin[languageChoice]);
            }
        },
        error: function(response) {
            loadGame('2');
        }
    });
})