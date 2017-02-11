class Container {
    addContainer (game, containerData) {
        this.idx = containerData.idx;
        this.x = containerData.x;
        this.y = containerData.y;
        this.name = containerData.name;
        this.itemscapacity = containerData.itemscapacity;
        this.itemslist = containerData.itemslist;
        this.playerHighlight = containerData.playerHighlight;
        this.containerstate = containerData.containerstate;
        this.sprite = game.add.sprite(this.x, this.y, containerData.containerTag);
        for (var i=0; i<containerData.animationsTags.length; i++) {
            this.sprite.animations.add(game.gameData.containers[this.containerstate].animationTags[i],game.gameData.containers[this.containerstate].animationArr[i],5,true);
        }
        game.physics.arcade.enable(this.sprite);
        this.sprite.body.setSize(game.gameData.containers[this.containerstate].width, game.gameData.containers[this.containerstate].height);
        this.sprite.animations.play(containerData.containerstate);
        this.sprite.immovable = containerData.immovable; this.sprite.body.immovable = containerData.immovablebody; this.sprite.body.moves = containerData.moves;
        this.sprite.body.checkCollision.any = containerData.checkCollision;
    }
    
    findPlayerHighlight(playerid) {
        for (var i = 0; i < this.playerHighlight.length; i++) {
            if (playerid == this.playerHighlight[i]) {
                return i;
            }
        }
        return -1;
    }
    
    
    saveContainer () {
        var containerData = {
            idx : this.idx,
            name: this.name,
            itemscapacity : this.itemscapacity,
            itemslist : this.itemslist,
            containerstate : this.containerstate,
            x : this.sprite.body.position.x,
            y : this.sprite.body.position.y,
            playerHighlight : this.playerHighlight,
            immovable : this.sprite.immovable,
            immovablebody : this.sprite.immovablebody,
            moves : this.sprite.body.moves,
            checkCollision : this.sprite.body.checkCollision.any
        }
        return containerData;
    }
    
    
}

Container.rawData = function(game, idx, x, y, name, itemslist) {
    var rawContainerData = {
        idx : idx,
        x : x,
        y : y,
        name : name,
        itemscapacity : game.gameData.containers[name].itemscapacity,
        itemslist : itemslist,
        containerstate : game.gameData.containers[name].containerstate,
        playerHighlight : [],
        immovable : game.gameData.containers[name].immovable,
        immovablebody : game.gameData.containers[name].immovablebody,
        moves : game.gameData.containers[name].moves,
        checkCollision : game.gameData.containers[name].checkCollision
    }       
    return rawContainerData;
}

Container.preloadContainerImages = function(game) {
    for (var i=0; i< game.gameData.containernames.length; i++) {
        var name = game.gameData.containernames[i];
        game.load.spritesheet(game.gameData.containers[name].imageTag, game.gameData.containers[name].itemRef, game.gameData.containers[name].width,game.gameData.containers[name].height, game.gameData.containers[name].frames, 0,0);
    }
}

class ContainerManager {
    // containerLocType has to be an array of objects containing the locations of container and it's type/name and list of items
    constructor (game, containerLocType) {
        this.containers = [];
        if  (game.gameData.containerarray.length < 1) {
            for (var i = 0; i < containerLocType.length; i++) {
                this.containers[i] = new Container();
                var containerData = Container.rawData(game, i, containerLocType[i].x, containerLocType[i].y, containerLocType[i].name, containerLocType[i].itemslist);
                this.containers[i].addContainer(game, containerData);
            }
        }
        else {
            // load existing containers into array
            for (var i = 0; i < game.gameData.containerarray.length ; i++) {
                this.doors[game.gameData.containerarray[i].idx] = new Container();
                this.doors[game.gameData.containerarray[i].idx].addContainer(game, game.gameData.containerarray[i]);
            }
        }
    }
    
    saveContainerManager (game) {
        var savedContainers = [];
        for (var i = 0; i < this.containers.length; i++) {
            savedContainers[i] = this.containers[i].saveContainer(); 
        }
        game.gameData.containerarray = savedContainers;
    }
    
    
    
}

//     // create a new sprite based on door state
//     openDoor (game, playerid) {
//         var playerIdx = this.findPlayerHighlight(playerid);
//         if (playerIdx >= 0) {
//             // player that removed the highlight removed from list
//             this.playerHighlight.splice(playerIdx, 1);
//         }
//         if (this.playerHighlight.length < 1) {  // only open the door if no one is highlighting
//             this.doorstate = game.gameData.doors["dooropen"].imageTagList;
//             //this.sprite.frame = game.gameData.doors[this.doorstate].frame;
//             // this.sprite.loadTexture(game.gameData.doors.imageTagList,0, true);
//             // this.sprite.onTextureUpdate;
//             this.sprite.animations.play(this.doorstate);
//             // console.log("doorstate: " + this.doorstate );
//             this.sprite.body.checkCollision.any = false;
//         }    
//     }

//     closedDoor (game, playerid) {
//         var playerIdx = this.findPlayerHighlight(playerid);
//         if (playerIdx >= 0) {
//             // player that removed the highlight removed from list
//             this.playerHighlight.splice(playerIdx, 1);
//         }
//         if (this.playerHighlight.length < 1) {  // only close the door if no one is highlighting
//             this.doorstate = game.gameData.doors["doorclosed"].imageTagList;
//             //this.sprite.frame = game.gameData.doors[this.doorstate].frame;
//             // this.sprite.loadTexture(game.gameData.doors.imageTagList,2, true);
//             // game.debug.body(this.sprite);
//             this.sprite.animations.play(this.doorstate);
//             // console.log("doorstate: " + this.doorstate );
//             this.sprite.body.checkCollision.any = true;
//         }
        
//     }
    
//     openDoorHighlighted (game, playerid) {
//         this.doorstate = game.gameData.doors["dooropenhighlighted"].imageTagList;
//         //this.sprite.frame = game.gameData.doors[this.doorstate].frame;
//         // this.sprite.loadTexture(game.gameData.doors.imageTagList,1, true);
//         // game.debug.body(this.sprite);
//         this.sprite.animations.play(this.doorstate);
//         this.sprite.body.checkCollision.any = false;
//         // console.log("doorstate: " + this.doorstate );
        
//         var playerIdx = this.findPlayerHighlight(playerid);
//         // player that caused the highlight added to the highlight list
//         if (playerIdx < 0) {
//             this.playerHighlight.push(playerid);
//         }
//     }   

//     closedDoorHighlighted (game, playerid) {
//         this.doorstate = game.gameData.doors["doorclosedhighlighted"].imageTagList;
//         //this.sprite.frame = game.gameData.doors[this.doorstate].frame;
//         // this.sprite.loadTexture(game.gameData.doors.imageTagList,3, true);
//         // game.debug.body(this.sprite);
//         this.sprite.animations.play(this.doorstate);
//         this.sprite.body.checkCollision.any = true;
//         // console.log("doorstate: " + this.doorstate );
//         // player that caused the highlight added to the highlight list
        
//         var playerIdx = this.findPlayerHighlight(playerid);
//         if (playerIdx < 0) {
//             this.playerHighlight.push(playerid);
//         }
//     }


//     switchDoorState (game) {
//             // this player is causing the highlight
//         switch (this.doorstate) {
//             case game.gameData.doors["dooropenhighlighted"].imageTagList : 
//                 this.doorstate = game.gameData.doors["doorclosedhighlighted"].imageTagList;
//                 this.sprite.body.checkCollision.any = true;
//                 break;
//             case game.gameData.doors["doorclosedhighlighted"].imageTagList:
//                 this.doorstate = game.gameData.doors["dooropenhighlighted"].imageTagList;
//                 this.sprite.body.checkCollision.any = false;
//                 break;
//             }
//         this.sprite.animations.play(this.doorstate);
//     }   







//     // switch door states if overlap with the player
//     checkPlayerOverlap (game, players) {
//         for (var i=0; i < players.length; i++) {
//             for (var j=0; j < this.doors.length; j++) {
//                 if (this.doors[j].doorstate == game.gameData.doors["doorclosed"].imageTagList || this.doors[j].doorstate == game.gameData.doors["doorclosedhighlighted"].imageTagList) {
//                      this.doors[j].sprite.body.setSize(game.gameData.doors[this.doors[j].doorstate].width + 10, game.gameData.doors[this.doors[j].doorstate].height + 10);
//                 }
//                 if ((this.doors[j].findPlayerHighlight(i) < 0) && (game.physics.arcade.overlap(players[i].sprite, this.doors[j].sprite)))
//                 {  // this player is currently not causing the highlight
//                         // console.log("overlap true: player: " + i + " door: " + this.doors[j].name);
//                         switch (this.doors[j].doorstate) {
//                             case "dooropen":
//                                 this.doors[j].openDoorHighlighted(game, i);
//                                 break;
//                             case "doorclosed":
//                                 this.doors[j].closedDoorHighlighted(game, i);
//                                 break;
//                             default:
//                                 break;
//                         } 
//                 }
//                 else if ((this.doors[j].findPlayerHighlight(i) >= 0) && (!game.physics.arcade.overlap(players[i].sprite, this.doors[j].sprite)))
//                 {
//                         switch (this.doors[j].doorstate) {
//                             case "dooropenhighlighted":
//                                 this.doors[j].openDoor(game, i);
//                                 break;
//                             case "doorclosedhighlighted" :
//                                 this.doors[j].closedDoor(game, i);
//                                 break;
//                             default:
//                                 break;
//                         }
//                 }
//                 this.doors[j].sprite.body.setSize(game.gameData.doors[this.doors[j].doorstate].width, game.gameData.doors[this.doors[j].doorstate].height);
//             }
//         }
//     }
    
