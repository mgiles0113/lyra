<!DOCTYPE html>
<html>
<head>
    <title>Lyra Escape | Add Account</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css?family=Bahiana|Raleway" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="view/library/bootstrap.min.css" />
    <link rel="stylesheet" type="text/css" href="view/css/main.css" />
    <script src="js/library/jquery-3.1.1.min.js"></script>
    <script src="js/library/bootstrap.min.js"></script>
</head>
<body>
    <div id="interface">
        <div id="primary-card">
            <h2 class="text-center" id="menu-title">Lyra Escape</h2>
            <div id="form-card">
                <form id="add-user-form">
                    <h3 class="text-center" id="add-user-title">Create Account</h3>
                    <div class="form-group">
                        <label for="add-username" id="add-username-label">Username</label>
                        <input type="text" class="form-control" id="add-username" name="add-username" placeholder="username">
                    </div>
                    <div class="form-group">
                        <label for="add-password" id="add-password-label">Password</label>
                        <input type="password" class="form-control" id="add-password" name="add-password" placeholder="password">
                    </div>
                    <select class="form-control" id="language-selection" disabled>
                        <option>English</option>
                    </select>
                    <button type="submit" id="add-user-button" class="btn">Add Now</button>
                    <a href="?page=login">
                        <button type="button" id="create-user-link" class="btn">Back to Login</button>
                    </a>
                </form>
                <div id="status-messages">
                    <p id="status-message"></p>
                </div>
            </div>
        </div>
    </div>
    <script src="js/ENVIRONMENT.js"></script>
    <script src="js/addUser.js"></script>
</body>
</html>