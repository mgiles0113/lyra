(function() {
    var loginSubmit = $("#login-submit");
    var baseUrl = 'https://cs467-lyra-development-mgiles0113.c9users.io/';
    loginSubmit.click(function(e) {
        e.preventDefault();
        var usernameField = $("#login-username"),
            passwordField = $("#login-password"),
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
            resource = 'login',
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
                if (jsonMessage > 0) {
                    window.location.replace(baseUrl);
                }
            },
            error: function(jsonMessage) {
                console.log(jsonMessage);
            }
        });
    });
})();