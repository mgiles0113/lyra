<?php

$jsonResponseBody = array(
    "error" => ""
);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if ($_POST['resource'] == 'createAccount') {
        createAccount();
    }
    if ($_POST['resource'] == 'login') {
        login();
    }
} else if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    
} else {
    $jsonResponseBody["error"] = "invalid resource requested";
    echo $jsonResponseBody;
}

function createAccount() {
    require('classes/User.php');

    $user = new User();
    $user->setUsername($_POST['un']);
    $user->setPassword($_POST['pw']);
    $user->saveToDb();
}

function login() {
    session_start();
    require('classes/User.php');
    
    $user = new User();
    $user->setUsername($_POST['un']);
    $user->setPassword($_POST['pw']);
    if($user->authenticated() < 0) {
        echo 'user not authenticated';
        die('user not authenticated');
    }
    $_SESSION['authenticated'] = $user->getId();
    echo $user->getId();
}