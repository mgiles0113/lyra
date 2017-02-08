<!DOCTYPE html>
<html>
<head>
    <title>Lyra Escape | Create Account</title>
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
                    <h3 class="text-center" id="create-user-title">Create Account</h3>
                    <hr>
                    <form id="create-user-form">
                        <div class="form-group">
                            <label for="create-username" id="create-username-label">Username</label>
                            <input type="text" class="form-control" id="create-username" name="create-username" placeholder="username">
                        </div>
                        <div class="form-group">
                            <label for="create-password" id="create-password-label">Password</label>
                            <input type="password" class="form-control" id="create-password" name="create-password" placeholder="password">
                        </div>
                        <select class="form-control" id="language-selection" disabled>
                            <option>English</option>
                        </select>
                        <button type="submit" id="create-user-button" class="btn">Create Now</button>
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