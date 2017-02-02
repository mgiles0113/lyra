<?php

class DatabaseConnection {
    var $servername;
    var $username;
    var $password;
    var $database;
    var $dbport;
    var $mysqli;

    function connect() {
        require($_SERVER['DOCUMENT_ROOT'] . "/api/SYSTEM_PARAMETERS.php");
        $this->servername = $sys_servername;
        $this->username = $sys_username;
        $this->password = $sys_password;
        $this->database = $sys_database;
        $this->dbport = $sys_dbport;

	$this->mysqli = new mysqli(
            $this->servername,
            $this->username,
            $this->password,
            $this->database,
            $this->dbport
        );

	if ($this->mysqli->connect_errno) {
		echo "Failed to connect to MySQL: (" . $this->mysqli->connect_errno . ") " . $this->mysqli->connect_error;
	}
        
        if ($this->mysqli->connect_error) {
            die("Connection failed: " . $db->connect_error);
        }
        
        return $this->mysqli;
    }
}