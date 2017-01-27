<!DOCTYPE html>
<html>
<head>
    <title>Login Page</title>
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
                <h3>Login</h3>
                <form>
                    <div class="form-group">
                        <label for="login-username">Username</label>
                        <input type="text" class="form-control" id="login-username" name="login-username" placeholder="Username">
                    </div>
                    <div class="form-group">
                        <label for="login-password">Password</label>
                        <input type="password" class="form-control" id="login-password" name="login-password" placeholder="Password">
                    </div>
                    <button class="btn small-form-btn" type="submit" id="login-submit" >Login</button>
                </form>
            </div>
            <div class="col-md-4"></div>
        </div>
        <div class="row small-form-row">
            <div class="col-md-4"></div>
            <div class="col-md-4">
                <a href="create_account.php">
                    <button class="btn small-form-btn" id="create-account">Need An Account?</button>
                </a>
            </div>
            <div class="col-md-4"></div>
        </div>
    </div>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
    <script src="js/login.js"></script>
</body>
</html>