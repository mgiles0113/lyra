<?php

$jsonResponseBody = array(
    "error" => ""
);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if ($_POST['action'] == 'login') {
	    login();
    }
} else if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if ($_GET['entity'] == 'map') {
        getMap($_GET['mapSelection']);
    }
}

function getMap($mapSelection) {
    $mapData = file_get_contents('json/Maps/' . $mapSelection . '.json');
    echo json_encode($mapData);
}

function login() {
    session_start();
    require('classes/User.php');

    $user = new User();
    $user->setUsername($_POST['username']);
    $user->setPassword($_POST['password']);
    $authStatus = $user->authenticated();

    switch ($authStatus) {
        case 1000:
            echo '{ "error" : "none" }';
            break;
        case 1002:
            echo '{ "error" : "invalid login" }';
            break;
        case 1003:
            echo '{ "error" : "invalid login" }';
            break;
        default:
    }

    //$_SESSION['authenticated'] = $user->getId();
}
