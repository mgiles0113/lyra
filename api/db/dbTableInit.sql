CREATE TABLE `User` (
    id int(11) NOT NULL AUTO_INCREMENT,
    username varchar(50) NOT NULL,
    password varchar(50) NOT NULL,
    salt varchar(200) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (username)
) ENGINE=InnoDB;