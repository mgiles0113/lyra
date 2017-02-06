<!DOCTYPE html>
<html>
<head>
    <title>Lyra Escape | Login</title>
    <link rel="stylesheet" type="text/css" href="view/library/bootstrap.min.css" />
    <link rel="stylesheet" type="text/css" href="view/css/main.css" />
    <script src="js/library/phaser.js"></script>
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
                    <h3 class="text-center" id="login-title">Identify Yourself</h3>
                    <hr>
                    <form id="login-form">
                        <div class="form-group">
                            <label for="login-username" id="login-username-label">Username</label>
                            <input type="text" class="form-control" id="login-username" name="login-username" placeholder="username">
                        </div>
                        <div class="form-group">
                            <label for="login-password" id="login-password-label">Password</label>
                            <input type="password" class="form-control" id="login-password" name="login-password" placeholder="password">
                        </div>
                        <select class="form-control" id="language-selection" disabled>
                            <option>English</option>
                        </select>
                        <button type="submit" id="submit-button" class="btn">Submit</button>
                    </form>
                </div>
                <div class="col-md-3"></div>
            </div>
        </div>
    </div>
    <script src="js/game/states/Boot.js"></script>
    <script src="js/game/lyra/mapInit.js"></script>
    <script src="js/game/lyra/map.js"></script>
    <script src="js/game/lyra/utility.js"></script>
    <script src="js/game/lyra/slime.js"></script>
    <script src="js/game/lyra/player.js"></script>
    <script src="js/game/lyra/comm.js"></script>
    <script src="js/game/lyra/playerInit.js"></script>
    <script src="js/game/lyra/items.js"></script>
    <script src="js/game/lyra/itemsInit.js"></script>
    <script src="js/game/lyra/door.js"></script>
    <script src="js/game/lyra/userPreference.js"></script>
    <script src="js/game/lyra/testPost.js"></script>
	<script src="js/game/states/Preload.js"></script>
	<script src="js/game/states/MainMenu.js"></script>
	<script src="js/game/states/Game.js"></script>
    <script src="js/ENVIRONMENT.js"></script>
    <script src="js/main.js"></script>
</body>
</html>