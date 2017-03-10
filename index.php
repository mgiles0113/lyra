<?php
header('Access-Control-Allow-Origin: *');

// development options
$authenticationRequired = 1;

if ($_GET['page'] == "addUser") {
    require('view/templates/addUser.php');
} else if ($authenticationRequired && !$_SESSION['authenticated'] || $_GET['page'] == "login") {
    // require login screen
    require('view/templates/login.php');
} else {
    // load main menu
}