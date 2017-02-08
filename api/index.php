<?php
require('classes/User.php');
require('classes/DatabaseConnection.php');

$jsonResponseBody = array(
    "error" => ""
);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if ($_POST['entity'] == 'addUser') {
        addUser($_POST['username'], $_POST['password'], $_POST['languageChoice']);
    } else if ($_POST['action'] == 'login') {
	    login();
    } else if ($_POST['entity'] == 'userPreference') {
        saveUserPreferences($_POST['data']);
    } else if ($_POST['entity'] == 'testPost') {
        $gameSave = fopen("gameSave.json", "w");
        fwrite($gameSave, json_encode($_POST['data']));
        echo '{ "error" : ' . $_POST['data'] . ' }';
    }
} else if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if ($_GET['entity'] == 'map') {
        getMap($_GET['mapSelection']);
    } else if ($_GET['entity'] == 'language') {
        getLanguage();
    } else if ($_GET['entity'] == 'userPreference') {
        getUserPreference($_GET['userId']);
    } else if ($_GET['entity'] == 'restore') {
        getGameData($_GET['gameSelected']);
    }
}

function login() {
    session_start();

    $user = new User();
    $user->setUsername($_POST['username']);
    $user->setPassword($_POST['password']);
    $authStatus = $user->authenticated();

    switch ($authStatus) {
        case 1000:
            echo '{ "error" : "none", "userId" : "' . $user->getId() . '"}';
            break;
        case 1002:
            echo '{ "error" : "invalid login" }';
            break;
        case 1003:
            echo '{ "error" : "invalid login" }';
            break;
        default:
    }
}

function addUser($username, $password, $languageChoice) {
    $user = new User();
    $user->setUsername($username);
    $user->setPassword($password);
    $user->setLanguageChoice($languageChoice);
    if ($user->exists()) {
        echo '{ "error" : "username already exists" }';
    } else {
        echo '{ "error" : "none" }';
        $user->saveToDb();
    }
}

function getMap($mapSelection) {
    $mapData = file_get_contents('json/Maps/' . $mapSelection . '.json');
    echo json_encode($mapData);
}

function getGameData($gameSelected) {
    $mapData = file_get_contents($gameSelected . '.json');
    echo json_encode($mapData);
}

function getLanguage() {
    $languageData = file_get_contents('json/text/languages.json');
    echo json_encode($languageData);
}

function getUserPreference($userId) {
    $fileContents = file_get_contents('json/UserPreferences/' . $userId . '.json');
    echo json_encode($fileContents);
}

function saveUserPreferences($preferences) {
    $preferencesFile = fopen("json/UserPreferences/" . $preferences["userId"] . ".json", "w");
    fwrite($preferencesFile, json_encode($preferences));
}