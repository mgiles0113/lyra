<?php
header('Access-Control-Allow-Origin: *');

// template variables
$game_title = "Lyra Escape";

// development options
$authenticationRequired = 1;

if ($authenticationRequired && !$_SESSION['authenticated']) {
    // require login screen
    require('view/templates/login.php');
} else {
    // load main menu
}
