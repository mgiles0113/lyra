<?php
require('classes/User.php');
require('classes/DatabaseConnection.php');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    
    switch ($_POST['entity']) {
        case 'addUser':
            addUser($_POST['username'], $_POST['password'], $_POST['languageChoice']);
            break;
        case 'userPreference':
            saveUserPreferences($_POST['data']);
            break;
        case 'savedGameFile':
            generateSavedGameFile($_POST['userId'], $_POST['mapSelection']);
            break;
        case 'testPost':
            $gameSave = fopen('json/SavedGames/' . $_POST['saveFile'], "w");
            fwrite($gameSave, json_encode($_POST['data']));
            echo '{ "error" : "none" }';
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
        case 'savedGameFiles':
            getSavedGameFiles($_GET['userId']);
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
function getSavedGameFiles($userId) {
    $user = new User();
    $user->setId($userId);
    $savedGameFiles = $user->getSavedGameFiles();
    $response = '{ "error" : "none", "savedGameCount" : "' . count($savedGameFiles) . '"';
    if (count($savedGameFiles) > 0) {
        $response .= ', "savedGameFiles" : ';
        $response .= json_encode($savedGameFiles);
    }
    echo $response . '}';
}

function generateSavedGameFile($userId, $mapSelection) {
    $user = new User();
    $user->setId($userId);
    $saveFile = $user->generateSavedGameFile();
    $saveFileFp = fopen('json/SavedGames/' . $saveFile, "w");
    $mapData = file_get_contents('json/Maps/' . $mapSelection . '.json');
    fwrite($saveFileFp, json_encode($mapData));
    echo '{ "error" : "none", "saveFile" : "' . $saveFile . '", "mapData" : ' . json_encode($mapData) . '}';
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

function getGameData($type, $gameFile, $userId) {
    if ($type == 'game') {
        $mapData = file_get_contents('json/SavedGames/' . $gameFile);
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