<!DOCTYPE html>
<html>
<head>
    <title><?php echo $game_title . " | "; ?>Login</title>
    <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
    <link rel="stylesheet" type="text/css" href="lyraView/css/main.css" />
    <script src="//cdn.jsdelivr.net/phaser/2.6.2/phaser.min.js"></script>
</head>
<body>
    <div class="container" id="primary-card">
        <div class="row">
            <div class="col-md-2"></div>
            <div class="col-md-8">
                <h1 class="text-center" id="menu-title"><?php echo $game_title; ?> </h1>
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
                        <label for="login-username">Username</label>
                        <input type="text" class="form-control" id="login-username" name="login-username" placeholder="username">
                    </div>
                    <div class="form-group">
                        <label for="login-password">Password</label>
                        <input type="password" class="form-control" id="login-password" name="login-password" placeholder="password">
                    </div>
                    <button type="submit" class="btn">Submit</button>
                </form>
            </div>
            <div class="col-md-3"></div>
        </div>
    </div>
    <script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>
    <script src="../lyra/js/utility.js"></script>
    <script src="../lyra/js/map.js"></script>
    <script src="../lyra/js/slime.js"></script>
    <script src="../lyra/js/preloadState.js"></script>
    <script src="../lyra/js/gameState.js"></script>
    <script src="../lyra/js/player.js"></script>
    <script src="../lyra/js/comm.js"></script>
    <script src="lyraView/js/main.js"></script>
</body>
</html>