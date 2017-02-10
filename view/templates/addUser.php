<!DOCTYPE html>
<html>
<head>
    <title>Lyra Escape | Add Account</title>
    <link rel="stylesheet" type="text/css" href="view/library/bootstrap.min.css" />
    <link rel="stylesheet" type="text/css" href="view/css/main.css" />
    <script src="js/library/jquery-3.1.1.min.js"></script>
    <script src="js/library/bootstrap.min.js"></script>
</head>
<body>
    <div class="container">
        <div id="primary-card">
            <div class="row">
                <div class="col-md-2"></div>
                <div class="col-md-8">
                    <h1 class="text-center" id="menu-title">Lyra Escape</h1>
                </div>
                <div class="col-md-2"></div>
            </div>
            <div class="row">
                <div class="col-md-3"></div>
                <div class="col-md-6" id="form-card">
                    <h3 class="text-center" id="add-user-title">Create Account</h3>
                    <hr>
                    <form id="add-user-form">
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
                    </form>
                </div>
                <div class="col-md-3"></div>
            </div>
        </div>
    </div>
    <script src="js/ENVIRONMENT.js"></script>
    <script src="js/addUser.js"></script>
</body>
</html>