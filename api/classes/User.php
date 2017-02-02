<?php

class User {
    var $id;                // sql id (primary key) for this user
    var $username;          // user's username
    var $password;          // user's password
    
    // User constructor
    function __construct() {
        // initialize the id to -1 to indicate not associated with db record
        $this->id = -1;
    }
    
    /**************************************************************************
     * ACCESSOR METHODS
     *************************************************************************/
    // return the user's database id
    function getId() {
        return $this->id;
    }
    // return the user's username
    function getUsername() {
        return $this->username;
    }
    // return the user's password
    function getPassword() {
        return $this->password;
    }
    /**************************************************************************
     * MUTATOR METHODS
     *************************************************************************/
    // set the user's id
    function setId($id) {
        $this->id = $id;
    }
    // set the user's username
    function setUsername($username) {
        $this->username = $username;
    }
    // set the user's password
    function setPassword($password) {
        $this->password = $password;
    }
    
    // save the user to the database or update if the user exists
    function saveToDb() {
        require('DatabaseConnection.php');
        $db = new DatabaseConnection();
        $mysqli = $db->connect();
        
        /* Prepared statement, stage 1: prepare */
        if (!($stmt = $mysqli->prepare("INSERT INTO User(username, password) VALUES (?, ?)"))) {
            echo "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
        }
        
        /* Prepared statement, stage 2: bind and execute */
        if (!$stmt->bind_param("ss", $this->username, $this->password)) {
            echo "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
        }

        if (!$stmt->execute()) {
            echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
        }
        
        $stmt->close();
    }
    // check to see if username and password match database
    // return id of user if successful
    // return -1 if unsuccessful
    function authenticated() {
        require('DatabaseConnection.php');
        $db = new DatabaseConnection();
        $mysqli = $db->connect();
        echo 'hi from auth';
        /* create a prepared statement */
        if ($stmt = $mysqli->prepare("SELECT * FROM User WHERE username=?")) {
        
            /* bind parameters for markers */
            $stmt->bind_param("s", $this->username);

            $id = -1;
            $username = '';
            $password = '';
            $salt = '';
            
		/* execute query */
            $stmt->execute();
            
            /* bind result variables */
            $stmt->bind_result($id, $username, $password, $salt);
            $queryResult = $stmt->fetch();
            
            /* fetch value */
            if (!$queryResult) {
                return 1002;
            } else if($this->password != $password) {
                return 1003;
            } else {
                $this->id = $id;
                $this->username = $username;
                $this->password = $password;
                return 1000;
            }
            $stmt->close();
        }
    }
}
