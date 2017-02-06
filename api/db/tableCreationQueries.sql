CREATE TABLE `User` (
    id int(11) NOT NULL AUTO_INCREMENT,
    username varchar(50) NOT NULL,
    password varchar(50) NOT NULL,
    salt varchar(200) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (username)
) ENGINE=InnoDB;

CREATE TABLE `UserPreference` (
    userId int(11) NOT NULL,
    filename varchar(50) NOT NULL,
    PRIMARY KEY (userId, filename)
) ENGINE=InnoDB;

CREATE TABLE `SavedGame` (
    id int(11) NOT NULL AUTO_INCREMENT,
    userID int(11) NOT NULL,
    gameFileName varchar(64) NOT NULL,
    FOREIGN KEY (userID) REFERENCES User (id),
    PRIMARY KEY (id),
    UNIQUE (userID, gameFileName)
) ENGINE=InnoDB;