class Door {
    addDoor (game, doorData) {
        this.idx = doorData.idx;
        this.x = doorData.x;
        this.y = doorData.y;
        this.name = doorData.name;
        this.playerHighlight = doorData.playerHighlight;
        this.doorstate = doorData.doorstate;
        this.sprite = game.add.sprite(this.x, this.y, game.gameData.doors.imageTagList);
        this.sprite.animations.add(game.gameData.doors["dooropen"].imageTagList, game.gameData.doors["dooropen"].animation, 5, true)
        this.sprite.animations.add(game.gameData.doors["doorclosed"].imageTagList, game.gameData.doors["doorclosed"].animation, 5, true)
        this.sprite.animations.add(game.gameData.doors["dooropenhighlighted"].imageTagList, game.gameData.doors["dooropenhighlighted"].animation, 5, true)
        this.sprite.animations.add(game.gameData.doors["doorclosedhighlighted"].imageTagList, game.gameData.doors["doorclosedhighlighted"].animation, 5, true)
        //this.sprite.frame = game.gameData.doors[this.state].frame;
        // this.sprite.loadTexture(game.gameData.doors.imageTagList,0, true);
        game.physics.arcade.enable(this.sprite);
        this.sprite.body.setSize(game.gameData.doors[doorData.doorstate].width, game.gameData.doors[doorData.doorstate].height);
        this.sprite.animations.play(this.doorstate);
        this.sprite.immovable = true; this.sprite.body.immovable = true; this.sprite.body.moves = false;
        this.sprite.body.checkCollision.any = false;
    }

    findPlayerHighlight(playerid) {
        for (var i = 0; i < this.playerHighlight.length; i++) {
            if (playerid == this.playerHighlight[i]) {
                return i;
            }
        }
        return -1;
    }
    
    // create a new sprite based on door state
    openDoor (game, playerid) {
        var playerIdx = this.findPlayerHighlight(playerid);
        if (playerIdx >= 0) {
            // player that removed the highlight removed from list
            this.playerHighlight.splice(playerIdx, 1);
        }
        if (this.playerHighlight.length < 1) {  // only open the door if no one is highlighting
            this.doorstate = game.gameData.doors["dooropen"].imageTagList;
            //this.sprite.frame = game.gameData.doors[this.doorstate].frame;
            // this.sprite.loadTexture(game.gameData.doors.imageTagList,0, true);
            // this.sprite.onTextureUpdate;
            this.sprite.animations.play(this.doorstate);
            // console.log("doorstate: " + this.doorstate );
            this.sprite.body.checkCollision.any = false;
        }    
    }

    closedDoor (game, playerid) {
        var playerIdx = this.findPlayerHighlight(playerid);
        if (playerIdx >= 0) {
            // player that removed the highlight removed from list
            this.playerHighlight.splice(playerIdx, 1);
        }
        if (this.playerHighlight.length < 1) {  // only close the door if no one is highlighting
            this.doorstate = game.gameData.doors["doorclosed"].imageTagList;
            //this.sprite.frame = game.gameData.doors[this.doorstate].frame;
            // this.sprite.loadTexture(game.gameData.doors.imageTagList,2, true);
            // game.debug.body(this.sprite);
            this.sprite.animations.play(this.doorstate);
            // console.log("doorstate: " + this.doorstate );
            this.sprite.body.checkCollision.any = true;
        }
        
    }
    
    openDoorHighlighted (game, playerid) {
        this.doorstate = game.gameData.doors["dooropenhighlighted"].imageTagList;
        //this.sprite.frame = game.gameData.doors[this.doorstate].frame;
        // this.sprite.loadTexture(game.gameData.doors.imageTagList,1, true);
        // game.debug.body(this.sprite);
        this.sprite.animations.play(this.doorstate);
        this.sprite.body.checkCollision.any = false;
        // console.log("doorstate: " + this.doorstate );
        
        var playerIdx = this.findPlayerHighlight(playerid);
        // player that caused the highlight added to the highlight list
        if (playerIdx < 0) {
            this.playerHighlight.push(playerid);
        }
    }   

    closedDoorHighlighted (game, playerid) {
        this.doorstate = game.gameData.doors["doorclosedhighlighted"].imageTagList;
        //this.sprite.frame = game.gameData.doors[this.doorstate].frame;
        // this.sprite.loadTexture(game.gameData.doors.imageTagList,3, true);
        // game.debug.body(this.sprite);
        this.sprite.animations.play(this.doorstate);
        this.sprite.body.checkCollision.any = true;
        // console.log("doorstate: " + this.doorstate );
        // player that caused the highlight added to the highlight list
        
        var playerIdx = this.findPlayerHighlight(playerid);
        if (playerIdx < 0) {
            this.playerHighlight.push(playerid);
        }
    }


    switchDoorState (game) {
            // this player is causing the highlight
        switch (this.doorstate) {
            case game.gameData.doors["dooropenhighlighted"].imageTagList : 
                this.doorstate = game.gameData.doors["doorclosedhighlighted"].imageTagList;
                this.sprite.body.checkCollision.any = true;
                break;
            case game.gameData.doors["doorclosedhighlighted"].imageTagList:
                this.doorstate = game.gameData.doors["dooropenhighlighted"].imageTagList;
                this.sprite.body.checkCollision.any = false;
                break;
            }
        this.sprite.animations.play(this.doorstate);
    }   



    saveDoor () {
        var doorData = {
            idx : this.idx,
            name: this.name,
            doorstate: this.doorstate,
            x : this.sprite.body.position.x,
            y : this.sprite.body.position.y,
            playerHighlight : this.playerHighlight
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
            doorstate: doorstate,
            playerHighlight: new Array()
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
            }
        }
        else {
            // load existing doors into array
            this.doors = [];
            for (var i = 0; i < game.gameData.doorarray.length ; i++) {
                this.doors[game.gameData.doorarray[i].idx] = new Door();
                this.doors[game.gameData.doorarray[i].idx].addDoor(game, game.gameData.doorarray[i]);
            }
        }
    }
    
    // switch door states if overlap with the player
    checkPlayerOverlap (game, players) {
        for (var i=0; i < players.length; i++) {
            for (var j=0; j < this.doors.length; j++) {
                if (this.doors[j].doorstate == game.gameData.doors["doorclosed"].imageTagList || this.doors[j].doorstate == game.gameData.doors["doorclosedhighlighted"].imageTagList) {
                     this.doors[j].sprite.body.setSize(game.gameData.doors[this.doors[j].doorstate].width + 10, game.gameData.doors[this.doors[j].doorstate].height + 10);
                }
                if ((this.doors[j].findPlayerHighlight(i) < 0) && (game.physics.arcade.overlap(players[i].sprite, this.doors[j].sprite)))
                {  // this player is currently not causing the highlight
                        // console.log("overlap true: player: " + i + " door: " + this.doors[j].name);
                        switch (this.doors[j].doorstate) {
                            case "dooropen":
                                this.doors[j].openDoorHighlighted(game, i);
                                break;
                            case "doorclosed":
                                this.doors[j].closedDoorHighlighted(game, i);
                                break;
                            default:
                                break;
                        } 
                }
                else if ((this.doors[j].findPlayerHighlight(i) >= 0) && (!game.physics.arcade.overlap(players[i].sprite, this.doors[j].sprite)))
                {
                        switch (this.doors[j].doorstate) {
                            case "dooropenhighlighted":
                                this.doors[j].openDoor(game, i);
                                break;
                            case "doorclosedhighlighted" :
                                this.doors[j].closedDoor(game, i);
                                break;
                            default:
                                break;
                        }
                }
                this.doors[j].sprite.body.setSize(game.gameData.doors[this.doors[j].doorstate].width, game.gameData.doors[this.doors[j].doorstate].height);
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
