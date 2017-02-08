var createUserForm = $("#create-user-form");
var createUserTitle = $("#create-user-title");
var createUsername = $("#create-username");
var createUsernameLabel = $("#create-username-label");
var createPassword = $("#create-password");
var createPasswordLabel = $("#create-password-label");
var languageSelection = $("#language-selection");
var createUserButton = $("#create-user-button");

var jsonLanguage;
var languageChoice;

loadLanguageFile();

function populateLanguageText(languageText) {
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
    });
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
            populateLanguageText(response);
        },
        error: function(response) {
        }
    });
}

createUserForm.submit(function(e) {
    e.preventDefault();

    var method = 'POST',
        url = apiUrl,
        parameters = {
            entity: 'createUser',
            username : createUsername.val(),
            password : createPassword.val(),
            languageChoice : ''
        };

    $.ajax({
        url: url,
        type: method,
        data: parameters,
        dataType: 'json',
        context: this,
        success: function(response) {
            console.log(response);
        },
        error: function(response) {
            console.log(response);
        }
    });
})