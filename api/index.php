<?php
require('classes/User.php');
require('classes/DatabaseConnection.php');

$jsonResponseBody = array(
    "error" => ""
);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    
    switch ($_POST['entity']) {
        case 'addUser':
            addUser($_POST['username'], $_POST['password'], $_POST['languageChoice']);
            break;
        case 'userPreference':
            saveUserPreferences($_POST['data']);
            break;
        case 'testPost':
            $gameSave = fopen("gameSave.json", "w");
            fwrite($gameSave, json_encode($_POST['data']));
            echo '{ "error" : ' . $_POST['data'] . ' }';
            break;
    }
    if ($_POST['action'] == 'login') {
        login();
    }
} else if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    switch ($_GET['entity']) {
        case 'map':
            getMap($_GET['mapSelection']);
            break;
        case 'language':
            getLanguage();
            break;
        case 'userPreference':
            getUserPreference($_GET['userId']);
            break;
        case 'gameData':
            if ($_GET['action'] == 'list') {
                getGameData('list', 'none', $_GET['userId']);
            } else if ($_GET['action'] == 'game') {
                getGameData('game', $_GET['gameSelected'], 'none');
            }
            break;
        default:
            
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

function getGameData($type, $gameFile, $userId) {
    if ($type == 'game') {
        $mapData = file_get_contents($gameFile . '.json');
        echo json_encode($mapData);
    } else if ($type == 'list') {
        echo $userId;
    }
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
    echo json_encode('{ "error" : "none" }');
}