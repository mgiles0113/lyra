var addUserForm = $("#add-user-form");
var addUserTitle = $("#add-user-title");
var addUsername = $("#add-username");
var addUsernameLabel = $("#add-username-label");
var addPassword = $("#add-password");
var addPasswordLabel = $("#add-password-label");
var languageSelection = $("#language-selection");
var addUserButton = $("#add-user-button");
var statusMessage = $("#status-message");

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
        addUserTitle.html(jsonLanguage.createAccount[languageChoice]);
        addUsernameLabel.html(jsonLanguage.username[languageChoice]);
        addPasswordLabel.html(jsonLanguage.password[languageChoice]);
        addUserButton.html(jsonLanguage.submit[languageChoice]);
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

addUserForm.submit(function(e) {
    e.preventDefault();
    console.log('submitting');
    var method = 'POST',
        url = apiUrl,
        parameters = {
            entity: 'addUser',
            username : addUsername.val(),
            password : addPassword.val(),
            languageChoice : languageSelection.val()
        };

    $.ajax({
        url: url,
        type: method,
        data: parameters,
        dataType: 'json',
        context: this,
        success: function(response) {
            if (response.error === "none") {
                updateStatusMessage("User created successfully!");
            } else if (response.error === "username already exists") {
                updateStatusMessage("That username already exists! Try again.");
            } else {
                updateStatusMessage("Unknown error, contact technical support.");
            }
        },
        error: function(response) {
            console.log(response);
        }
    });
})