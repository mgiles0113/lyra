<?php
session_start();

if (!isset($_SESSION['authenticated'])) { 
    header("Location: /lyra/login.php");
    die();
} else {
    header("Location: /lyra/home.php");
}