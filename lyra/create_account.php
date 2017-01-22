<!DOCTYPE html>
<html>
<head>
    <title>Create Account</title>
    <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
    <link rel="stylesheet" type="text/css" href="css/main.css">
</head>
<body>
    <div class="container">
        <div class="row small-form-row">
            <h1>Lyra V1 Prototype</h1>
            <hr>
        </div>
        <div class="row small-form-row">
            <div class="col-md-4"></div>
            <div class="col-md-4" id="login-card">
                <h3>Create Account Form</h3>
                <form>
                    <div class="form-group">
                        <label for="create-account-username">Username</label>
                        <input type="text" class="form-control" id="create-account-username" name="create-account-username" placeholder="Username">
                    </div>
                    <div class="form-group">
                        <label for="create-account-password">Password</label>
                        <input type="password" class="form-control" id="create-account-password" name="create-account-password" placeholder="Password">
                    </div>
                    <button class="btn small-form-btn" type="submit" id="create-account-submit" >Create Account</button>
                </form>
            </div>
            <div class="col-md-4">
                <p id="status-messages"></p>
            </div>
        </div>
        <div class="row small-form-row">
            <div class="col-md-4"></div>
            <div class="col-md-4">
                <a href="login.php">
                    <button class="btn small-form-btn" id="back-to-login">Back To Login Page</button>
                </a>
            </div>
            <div class="col-md-4"></div>
        </div>
    </div>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
    <script src="js/classes/AJAXMessage.js"></script>
    <script src="js/create_account.js"></script>
</body>
</html>