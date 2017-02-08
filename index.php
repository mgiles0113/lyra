<?php
header('Access-Control-Allow-Origin: *');

// development options
$authenticationRequired = 1;

if ($_GET['page'] == "createUser") {
    require('view/templates/createUser.php');
} else if ($authenticationRequired && !$_SESSION['authenticated']) {
    // require login screen
    require('view/templates/login.php');
} else {
    // load main menu
}