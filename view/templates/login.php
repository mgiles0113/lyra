<!DOCTYPE html>
<html>
<head>
    <title>Lyra Escape | Login</title>
    <link href="https://fonts.googleapis.com/css?family=Bahiana|Raleway" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="view/library/bootstrap.min.css" />
    <link rel="stylesheet" type="text/css" href="view/css/main.css" />
    <script src="js/library/phaser.js"></script>
    <script src="js/library/jquery-3.1.1.min.js"></script>
    <script src="js/library/bootstrap.min.js"></script>
    <script src="js/library/easystar-0.2.1.min.js"></script>
</head>
<body>
    <div id="interface">
        <div id="primary-card">
            <h2 class="text-center" id="menu-title">Lyra Escape</h1>
            <div id="form-card">
                <h4 class="text-center" id="login-title">Identify Yourself</h3>
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
                    <a href="?page=addUser">
                        <button type="button" id="create-user-link" class="btn">Need An Account?</button>
                    </a>
                </form>
            </div>
        </div>
        <div id="communicator-card" style="visibility: hidden">
            <div class="communicator-submenu" id="player-selection">
                <h4>Player Control</h4>
                <ul id="comm-players">
                    <li id="p1"></li>
                    <li id="p2"></li>
                    <li id="p3"></li>
                </ul>
            </div>
            <div class="communicator-submenu" id="inventory">
                <h4>Inventory</h4>
                <ul id="comm-inventory">
                    <li id="item1"></li>
                    <li id="item2"></li>
                    <li id="item3"></li>
                    <li id="item4"></li>
                </ul>
            </div>
            <div class="communicator-submenu" id="timer">
                <h4>Oxygen</h4>
                <p><span id="timer-minutes"></span>:<span id="timer-seconds"></span></p>
                <div id="timer-bar"></div>
            </div>
        </div>
        <div id="main-menu-card">
            <div class="container">
                <div class="row">
                    <div class="col-md-3">
                        <button class="main new passive-load passive-options passive-sound-options passive-story passive-language-options" id="new-game-menu-text">New Game</button>
                    </div>
                    <div class="col-md-3">
                        <button class="no-main new no-load no-options no-sound-options no-language-options no-story" id="new-game-easy">Easy Map</button>
                        <a href="#" class="no-main no-new load no-options no-sound-options no-language-options no-story" id="load-game-left-arrow">< prev</a>
                        <a href="#" class="no-main no-new load no-options no-sound-options no-language-options no-story" id="load-game-right-arrow">next ></a>
                    </div>
                    <div class="col-md-3">
                        <button class="no-main new no-load no-options no-sound-options no-language-options no-story" id="new-game-hard">Hard Map</button>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-3">
                        <button class="main passive-new load passive-options passive-sound-options passive-language-options passive-story" id="load-game-menu-text">Load Game</button>
                    </div>
                    <div class="col-md-3">
                         <button class="no-main no-new load no-options no-sound-options no-language-options no-story" id="load-game-slot-1">Load Game Slot 1</button>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-3">
                        <button class="main passive-new passive-load options sound-options language-options passive-story" id="options-menu-text">Options</button>
                    </div>
                    <div class="col-md-3">
                        <button class="no-main no-new no-load options sound-options passive-language-options no-story" id="options-sound-text">Sound</button>
                        <button class="no-main no-new load no-options no-sound-options no-language-options no-story" id="load-game-slot-2">Load Game Slot 2</button>
                    </div>
                    <div class="col-md-3">
                        <button class="no-main no-new no-load no-options sound-options no-language-options no-story" id="options-sound-true">True</button>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-3">
                        <button class="main passive-new passive-load passive-options passive-sound-options passive-language-options story" id="story-menu-text">Story</button>
                    </div>
                    <div class="col-md-3">
                        <button class="no-main no-new no-load options passive-sound-options language-options no-story" id="options-language-text">Language</button>
                        <button class="no-main no-new load no-options no-sound-options no-language-options no-story" id="load-game-slot-3">Load Game Slot 3</button>
                    </div>
                    <div class="col-md-3">
                        <button class="no-main no-new no-load no-options no-sound-options language-options no-story" id="options-language-english">English</button>
                        <button class="no-main no-new no-load no-options sound-options no-language-options no-story" id="options-sound-false">False</button>
                        
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-3"></div>
                    <div class="col-md-3">
                        <button class="no-main no-new load no-options no-sound-options no-language-options no-story" id="load-game-slot-4">Load Game Slot 4</button>
                    </div>
                    <div class="col-md-3">
                        <button class="no-main no-new no-load no-options no-sound-options language-options no-story" id="options-language-pirate">Pirate</button>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-3"></div>
                    <div class="col-md-3">
                        <button class="no-main no-new load no-options no-sound-options no-language-options no-story" id="load-game-slot-5">Load Game Slot 5</button>
                    </div>
                    <div class="col-md-3">
                        <button class="no-main no-new no-load no-options no-sound-options language-options no-story" id="options-language-spanish">Spanish</button>
                    </div>
                </div>
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
    <script src="js/game/lyra/actionManager.js"></script>
    <script src="js/game/lyra/container.js"></script>
    <script src="js/game/lyra/userPreference.js"></script>
    <script src="js/game/lyra/testPost.js"></script>
    <script src="js/game/lyra/timer.js"></script>
    <script src="js/game/states/StoryMenu.js"></script>
	<script src="js/game/states/Preload.js"></script>
	<script src="js/game/states/MainMenu.js"></script>
	<script src="js/game/states/Game.js"></script>
	<script src="js/game/states/EndGame.js"></script>
    <script src="js/ENVIRONMENT.js"></script>
    <script src="js/main.js"></script>
</body>
</html>