<?php
header('Access-Control-Allow-Origin: *');

// development options
$authenticationRequired = 1;

if ($authenticationRequired && !$_SESSION['authenticated']) {
    // require login screen
    require('view/templates/login.php');
} else {
    // load main menu
    
}