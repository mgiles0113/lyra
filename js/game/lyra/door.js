class Door {
    addDoor (game, doorData) {
        this.idx = doorData.idx;
        this.x = doorData.x;
        this.y = doorData.y;
        this.name = doorData.name;
        this.doorstate = game.gameData.doors[doorData.doorstate].imageTagList;
        this.sprite = game.add.sprite(this.x, this.y, game.gameData.doors.imageTagList);
        this.sprite.animations.add(game.gameData.doors["dooropen"].imageTagList, game.gameData.doors["dooropen"].animation, 5, true)
        this.sprite.animations.add(game.gameData.doors["doorclosed"].imageTagList, game.gameData.doors["doorclosed"].animation, 5, true)
        this.sprite.animations.add(game.gameData.doors["dooropenhighlighted"].imageTagList, game.gameData.doors["dooropenhighlighted"].animation, 5, true)
        this.sprite.animations.add(game.gameData.doors["doorclosedhighlighted"].imageTagList, game.gameData.doors["doorclosedhighlighted"].animation, 5, true)
        //this.sprite.frame = game.gameData.doors[this.state].frame;
        // this.sprite.loadTexture(game.gameData.doors.imageTagList,0, true);
        game.physics.arcade.enable(this.sprite);
        this.sprite.body.setSize(game.gameData.doors[doorData.doorstate].width, game.gameData.doors[doorData.doorstate].height);
        //this.sprite.animations.play(this.state);
    }
    
    // create a new sprite based on door state
    openDoor (game) {
        this.doorstate = game.gameData.doors["dooropen"].imageTagList;
        //this.sprite.frame = game.gameData.doors[this.doorstate].frame;
        // this.sprite.loadTexture(game.gameData.doors.imageTagList,0, true);
        // this.sprite.onTextureUpdate;
        this.sprite.animations.play(this.doorstate);
    }

    closedDoor (game) {
        this.doorstate = game.gameData.doors["doorclosed"].imageTagList;
        //this.sprite.frame = game.gameData.doors[this.doorstate].frame;
        // this.sprite.loadTexture(game.gameData.doors.imageTagList,2, true);
        // game.debug.body(this.sprite);
        this.sprite.animations.play(this.doorstate);
    }
    
    openDoorHighlighted (game) {
        this.doorstate = game.gameData.doors["dooropenhighlighted"].imageTagList;
        //this.sprite.frame = game.gameData.doors[this.doorstate].frame;
        // this.sprite.loadTexture(game.gameData.doors.imageTagList,1, true);
        // game.debug.body(this.sprite);
        this.sprite.animations.play(this.doorstate);
    }   

    closedDoorHighlighted (game) {
        this.doorstate = game.gameData.doors["doorclosedhighlighted"].imageTagList;
        //this.sprite.frame = game.gameData.doors[this.doorstate].frame;
        // this.sprite.loadTexture(game.gameData.doors.imageTagList,3, true);
        // game.debug.body(this.sprite);
        this.sprite.animations.play(this.doorstate);
    }

    saveDoor () {
        var doorData = {
            idx : this.idx,
            name: this.name,
            doorstate: this.doorstate,
            x : this.sprite.body.position.x,
            y : this.sprite.body.position.y,
        }
        return (doorData);
    }
}


Door.preloadDoorImages = function(game) {
    // load all the specified door images
    game.load.spritesheet(game.gameData.doors.imageTagList,game.gameData.doors.imageRefList, game.gameData.doors.width, game.gameData.doors.height, game.gameData.doors.frames,0,0);

    // game.load.image(game.gameData.doors["dooropen"].imageTagList,game.gameData.doors["dooropen"].imageRefList);
    // game.load.image(game.gameData.doors["doorclosed"].imageTagList,game.gameData.doors["doorclosed"].imageRefList);
    // game.load.image(game.gameData.doors["dooropenhighlighted"].imageTagList,game.gameData.doors["dooropenhighlighted"].imageRefList);
    // game.load.image(game.gameData.doors["doorclosedhighlighted"].imageTagList,game.gameData.doors["doorclosedhighlighted"].imageRefList);
}

Door.rawData = function(idx, x, y, name, doorstate) {
    var rawDoorData = {
            idx : idx,
            x: x,
            y: y,
            name: name,
            doorstate: doorstate
    }
    return (rawDoorData)
}


class DoorManager {

    constructor (game, doorLocArr) {
        if (game.gameData.doorarray.length < 1) {
            this.doors = [];
            for (var i = 0; i<doorLocArr.length; i++ ) {
                //console.log(doorLocArr[i]);
                this.doors[i] = new Door();
                var doorData = Door.rawData(i,  doorLocArr[i].x, doorLocArr[i].y, doorLocArr[i].name, game.gameData.doors["dooropen"].imageTagList);
                //console.log(doorData);
                this.doors[i].addDoor(game, doorData);
                this.doors[i].sprite.animations.play(this.doors[i].state);
            }
        }
        else {
            // load existing doors into array
            this.doors = [];
            for (var i = 0; i < game.gameData.doorarray.length ; i++) {
                this.doors[game.gameData.doorarray[i].idx] = new Door();
                var doorData = Door.rawData(i,  game.gameData.doorarray[i].x, game.gameData.doorarray[i].y, game.gameData.doorarray[i].name,  game.gameData.doorarray[i].state);
                this.doors[game.gameData.doorarray[i].idx].addDoor(game, doorData);
                this.doors[i].sprite.animations.play(this.doors[i].state);
            }
        }
    }
    
    // switch door states if overlap with the player
    checkPlayerOverlap (game, players) {
        for (var i=0; i < players.length; i++) {
            for (var j=0; j < this.doors.length; j++) {
                if (game.physics.arcade.overlap(players[i].sprite, this.doors[j].sprite)) {
                    switch (this.doors[j].doorstate) {
                        case "dooropen":
                            this.doors[j].openDoorHighlighted(game);
                            break;
                        case "doorclosed":
                            this.doors[j].doorclosedhighlighted(game);
                            break;
                    }   
                }
                else {
                    switch (this.doors[j].doorstate) {
                        case "dooropenhighlighted":
                            this.doors[j].openDoor(game);
                            break;
                        case "doorclosedhighlighted" :
                            this.doors[j].closedDoor(game);
                            break;
                    }
                }
            }
        }
    }
    
    saveDoorManager (game) {
        var savedDoors = [];
        for (var i = 0; i < this.doors.length; i++) {
            savedDoors[i] = this.doors[i].saveDoor(); 
        }
        game.gameData.doorarray = savedDoors;
    }
    
}
