(function() {
    var createAccountSubmit = $("#create-account-submit");

    createAccountSubmit.click(function(e) {
        e.preventDefault();
        var usernameField = $("#create-account-username"),
            passwordField = $("#create-account-password"),
            username = usernameField.val(),
            password = passwordField.val();
        
        if (!username) {
            console.log('No username, form not submitted');
            return;
        }
        if (!password) {
            console.log('No password, form not submitted');
            return;
        }
        
        var method = 'POST',
            resource = 'createAccount',
            url = 'https://cs467-lyra-development-mgiles0113.c9users.io/api/apiController.php',
            parameters = {
                resource : resource,
                un : username,
                pw : password,
            };

        $.ajax({
            url: url,
            type: method,
            data: parameters,
            dataType: 'json',
            success: function(jsonMessage) {
                var responseBody = jsonMessage;
            },
            error: function(jsonMessage) {
                var responseBody = jsonMessage;
            }
        });
    }
})();