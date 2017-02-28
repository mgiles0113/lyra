class Container {
    addContainer (game, containerData) {
        this.idx = containerData.idx;
        this.x = containerData.x;
        this.y = containerData.y;
        this.name = containerData.name;
        this.itemscapacity = containerData.itemscapacity;
        this.roomMapName = containerData.roomMapName;
        this.itemslist = containerData.itemslist;
        this.repairItems = containerData.repairItems;
        this.itemSprites = [];
        this.playerHighlight = containerData.playerHighlight;
        this.containerstate = containerData.containerstate;
        this.stateIdx = containerData.stateIdx;
        this.sprite = game.add.sprite(this.x, this.y, containerData.name);
        this.textSprite = null;
        for (var i=0; i<game.gameData.containers[this.name].animationTags.length; i++) {
            this.sprite.animations.add(game.gameData.containers[this.name].animationTags[i],game.gameData.containers[this.name].animationArr[i],5,true);
        }
        game.physics.arcade.enable(this.sprite);
        this.sprite.body.setSize(game.gameData.containers[this.name].width, game.gameData.containers[this.name].height);
        this.sprite.immovable = containerData.immovable; this.sprite.body.immovable = containerData.immovablebody; this.sprite.body.moves = containerData.moves;
        //this.sprite.anchor.set(0.5);
    }

    // return inventory
    getInventory(slot) {
        if( slot < this.itemslist.length ){
            return this.itemslist[slot].name;
        }else{
            return 'empty';
        }
    }
    
    findPlayerHighlight(playerid) {
        for (var i = 0; i < this.playerHighlight.length; i++) {
            if (playerid == this.playerHighlight[i]) {
                return i;
            }
        }
        return -1;
    }
    
    removePlayerHighlight(playerid) {
        var playerIdx = this.findPlayerHighlight(playerid);
        if (playerIdx >= 0) {
            // player that removed the highlight removed from list
            this.playerHighlight.splice(playerIdx, 1);
        }
    }
    
    addPlayerHighlight(playerid) {
        var playerIdx = this.findPlayerHighlight(playerid);
        // player that caused the highlight added to the highlight list
        if (playerIdx < 0) {
            this.playerHighlight.push(playerid);
        }
    }
    
    
    // the state is updated if it exists, otherwise nothing changes
    setState (game, newState) {
        for (var i=0; i<game.gameData.containers[this.name].animationTags.length; i++) {
            if (newState == game.gameData.containers[this.name].animationTags[i]) {
                this.stateIdx = i;
                this.containerstate = newState;
                return true;
            }
        }
        return false;
    }
    
    //add item to the item list
    addItemToList(game, name) {
        if (this.itemslist.length < this.itemscapacity) {
            var pos = this.itemslist.length;
            this.itemslist.push(new ContainerItem(pos, name));
            // fix container display
            this.setupContainerImage(game);
        }
        else {
            //[TODO] raise a signal that says this item can't be added
            console.log("the " + this.name +" container is full");
        }
    }
    
    // remove item from the list
    removeItemFromList(game, name) {
        for (var i=0; i< this.itemslist.length; i++) {
            if (this.itemslist[i].name == name) {
                this.hideAllItems();
                this.itemslist.splice(i, 1);
                this.showAllItems(game);
                return (true);
            }
        }
        return false;
    }
    
    
    showEscapePodRepairList(game) {
        var style = { font: 'bold 14pt Arial', fill: 'white', align: 'left', wordWrap: true, wordWrapWidth: 450 };
        var text = game.languageText.repair[game.userPreference.data.languageChoice] + "\n";
        for (var i = 0; i< this.repairItems.length; i++) {
            text = text + game.languageText[this.repairItems[i].name][game.userPreference.data.languageChoice] + "\n";
        }
        this.textSprite = game.add.text(this.sprite.body.center.x-25, this.sprite.body.center.y-60, text, style);
    }
    
    removeEscapePodRepairList(game) {
        if (this.textSprite != undefined) {
            this.textSprite.destroy();
        }
    }
    
    // call this when a player switches the escape pod from openhighlighted to closedhighlighted
    checkEndGameConditions(game) {
        var allItemsFound = 0;
        var lyreFound = false;

        for (var i=0; i<this.itemslist.length; i++) {
            var isFound = false;
            if (this.itemslist[i].name != "lyre") {
                for (var j=0; j<this.repairItems.length-1; j++) {
                    if (this.itemslist[i].name == this.repairItems[j].name ) {
                        isFound = true;
                    }
                }
            }
            else {
                lyreFound = true;
            }
            if (isFound) {
                allItemsFound += 1;
            }
        }

        //[TODO] technically, we should be checking that the correct crew are on board
        // if a bandit is nearby, the game might end in victory anyway since playerHighlight tracks
        // all of the players near the container.
        // Need to pass in the playerManager to make this work correctly
        if (allItemsFound >= 3) {
            // items needed to escape are loaded
            if (lyreFound) {
                if (this.playerHighlight.length >= game.gameData.crew.length) {
                    // lyre and repair items are all on board
                    game.gameData.gameresult = "victory";
                } else {
                    game.gameData.gameresult = "crewstuck";
                }
            } else {
                // lyre not found but all repair items are on board
                game.gameData.gameresult = "escapenolyre";
            }
        } else {
            this.removeEscapePodRepairList(game);
        }
    }

    showItem(game, x, y, idx, scalefactor) {
        this.itemSprites[idx] = this.sprite.addChild(game.add.sprite(x, y, this.itemslist[idx].name));
        this.itemSprites[idx].anchor.set(0.5, 0.5);
        this.itemSprites[idx].scale.setTo(scalefactor);
        game.physics.arcade.enable(this.itemSprites[idx]);
        this.itemSprites[idx].bringToTop();
    }
    
    hideItem(idx) {
        this.itemSprites[idx].destroy();
    }
    
    showAllItems(game) {
        if (this.name == "espresso") {
            this.showItem(game, game.gameData.containers[this.name].width/2-15, game.gameData.containers[this.name].height/2-15, 0, 0.5);
        }
        else {
            var posArr = this.itemPositionOffsetsInContainer(game);
            for (var i=0; i<this.itemslist.length; i++) {
                if (this.itemSprites[i]) {
                    this.hideItem(i);
                }
                if (posArr[i] == undefined || posArr[i].length < 1) {
                    console.log(this);
                }
                this.showItem(game, posArr[i][0], posArr[i][1], i, 0.5);
            }
        }
    }
    
    hideAllItems() {
        if (this.name == "espresso") {
            this.hideItem(0);
        } else {
            for (var i=0; i<this.itemslist.length; i++) {
                if (this.itemSprites[i]) {
                    this.hideItem(i);
                }
            }
        }
    }
    
    // position the items in container if more than one
    // [TODO] handle container rotation
    itemPositionOffsetsInContainer(game) {
        switch (this.itemscapacity) {
            case 1:
                // center on container
                return([[game.gameData.containers[this.name].width/2,game.gameData.containers[this.name].height/2]]);
            case 2:
                if (game.gameData.containers[this.name].width > game.gameData.containers[this.name].height) {
                    return ([[game.gameData.containers[this.name].width/4, game.gameData.containers[this.name].height/2],
                           [3*game.gameData.containers[this.name].width/4, game.gameData.containers[this.name].height/2]])                    
                }
                else {
                    return ([[game.gameData.containers[this.name].width/2, game.gameData.containers[this.name].height/4],
                           [game.gameData.containers[this.name].width/2, 3*game.gameData.containers[this.name].height/4]])                    
                }
            case 4:
                // hard coding for escape pod for now
                return ([[-25, -25],[-25, 25],
                        [25, -25],[25, 25]]);
        }
        return [];
    }
    
    openContainer (game) {
        if ((this.playerHighlight.length < 1) && (this.setState(game, "open"))) {  // only open the container if no one is highlighting
            if (this.name == "escapepod") {
                this.removeEscapePodRepairList(game);
            }
            //console.log(this.containerstate + " " + this.stateIdx);
            this.sprite.loadTexture(game.gameData.containers[this.name].imageTag, game.gameData.containers[this.name].textureArr[this.stateIdx], true);
            this.sprite.body.checkCollision.any = game.gameData.containers[this.name].checkCollision[this.stateIdx];
            this.showAllItems(game);
            
        }    
    }
    
    closedContainer (game) {
        if ((this.playerHighlight.length < 1) && this.setState(game, "closed")) {  // only close the container if no one is highlighting
            if (this.name == "escapepod") {
                this.removeEscapePodRepairList(game);
            }
            this.sprite.loadTexture(game.gameData.containers[this.name].imageTag, game.gameData.containers[this.name].textureArr[this.stateIdx], true);
            //this.sprite.animations.play(this.doorstate);
            this.sprite.body.checkCollision.any = game.gameData.containers[this.name].checkCollision[this.stateIdx];
            this.hideAllItems();
        }
    }
    
    
    openContainerHighlighted (game) {
        if (this.setState(game, "openhighlight"))  {
            this.sprite.animations.play(this.containerstate);
            this.sprite.body.checkCollision.any = game.gameData.containers[this.name].checkCollision[this.stateIdx];
            this.showAllItems(game);
            if (this.name == "escapepod") {
                this.showEscapePodRepairList(game);
            }
         }
    }   
    
    closedContainerHighlighted (game) {
        if (this.setState(game, "closedhighlight"))  {
            if (this.name == "escapepod") {
                this.removeEscapePodRepairList(game);
            }
            this.sprite.animations.play(this.containerstate);
            this.sprite.body.checkCollision.any = game.gameData.containers[this.name].checkCollision[this.stateIdx];
            this.hideAllItems();
            }
    }
    
    playContainerSound(game) {
        if (game.gameData.containers[this.name].sounds != undefined && game.gameData.containers[this.name].sounds[this.stateIdx].length > 0) {
            switch(game.gameData.containers[this.name].sounds[this.stateIdx]) {
                case "doorOpen" :
                    game.sfDoorOpen.play('', 0, 0.1, false, true);
                    break;
                case "doorClose" :
                    game.sfDoorClose.play('', 0, 0.1, false, true);
                    break;
            }
        }
    }
    

    switchContainerState (game) {
        
        switch (this.containerstate) {
            case "openhighlight" : 
                 if (this.setState(game, "closedhighlight")) {
                    if (game.userPreference.data.sound === "true") {
                            this.playContainerSound(game);
                    }
                    this.sprite.body.checkCollision.any = game.gameData.containers[this.name].checkCollision[this.stateIdx];
                    this.hideAllItems();
                    if (this.name == "escapepod") {
                        this.checkEndGameConditions(game);
                    }
                 }
                break;
            case "closedhighlight":
                if (this.setState(game, "openhighlight")) {
                    if (game.userPreference.data.sound === "true") {
                            this.playContainerSound(game);
                    }
                    this.sprite.body.checkCollision.any = game.gameData.containers[this.name].checkCollision[this.stateIdx];
                    this.showAllItems(game);
                    if (this.name == "escapepod") {
                        this.showEscapePodRepairList(game);
                    }
                }
                break;
            }
        this.sprite.animations.play(this.containerstate);
    }  
    
    // call this after loading container to get the images setup
    setupContainerImage (game) {
        switch (this.containerstate) {
            case "open":
                this.sprite.loadTexture(game.gameData.containers[this.name].imageTag, game.gameData.containers[this.name].textureArr[this.stateIdx], true);
                this.sprite.body.checkCollision.any = game.gameData.containers[this.name].checkCollision[this.stateIdx];
                this.showAllItems(game);
                break;
            case "closed":
                this.sprite.loadTexture(game.gameData.containers[this.name].imageTag, game.gameData.containers[this.name].textureArr[this.stateIdx], true);
                this.sprite.body.checkCollision.any = game.gameData.containers[this.name].checkCollision[this.stateIdx];
                break;
            case "openhighlight":
                this.sprite.animations.play(this.containerstate);
                this.sprite.body.checkCollision.any = game.gameData.containers[this.name].checkCollision[this.stateIdx];
                this.showAllItems(game);
                if (this.name == "escapepod") {
                    this.showEscapePodRepairList(game);
                }
                break;
            case "closedhighlight" :
                this.sprite.animations.play(this.containerstate);
                this.sprite.body.checkCollision.any = game.gameData.containers[this.name].checkCollision[this.stateIdx];
                break;
        }
    }
    
    saveContainer () {
        var containerData = {
            idx : this.idx,
            name: this.name,
            itemscapacity : this.itemscapacity,
            itemslist : this.itemslist,
            roomMapName: this.roomMapName,
            repairItems : this.repairItems,
            containerstate : this.containerstate,
            stateIdx : this.stateIdx,
            x : this.sprite.body.position.x,
            y : this.sprite.body.position.y,
            playerHighlight : this.playerHighlight,
            immovable : this.sprite.immovable,
            immovablebody : this.sprite.body.immovablebody,
            moves : this.sprite.body.moves,
            checkCollision : this.sprite.body.checkCollision.any
        }
        return containerData;
    }
    
    
}

Container.rawData = function(game, idx, x, y, name, room, itemslist, itemsNeeded) {
    var rawContainerData = {
        idx : idx,
        x : x,
        y : y,
        name : name,
        stateIdx : game.gameData.containers[name].stateIdx,
        itemscapacity : game.gameData.containers[name].itemscapacity,
        itemslist : itemslist,
        repairItems : itemsNeeded,
        roomMapName: room,
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
    var iterator = Object.keys(game.gameData.containers);
    //for (var i=0; i< game.gameData.containernames.length; i++) {
    for (var i=0; i< iterator.length; i++) {
        //var name = iterator[i];
        game.load.spritesheet(game.gameData.containers[iterator[i]].imageTag, game.gameData.containers[iterator[i]].itemRef, game.gameData.containers[iterator[i]].width,game.gameData.containers[iterator[i]].height, game.gameData.containers[iterator[i]].frames, 0,0);
        game.load.image(game.gameData.containers[iterator[i]].imageTag + "open", game.gameData.containers[iterator[i]].itemRef, game.gameData.containers[iterator[i]].width,game.gameData.containers[iterator[i]].height);
        game.load.image(game.gameData.containers[iterator[i]].imageTag + "closed", game.gameData.containers[iterator[i]].itemRef, game.gameData.containers[iterator[i]].width,game.gameData.containers[iterator[i]].height);
    }
}


// containerLocType is used to define all the containers on the map for initial build
// object contains the following:
// x: position relative to map (center of room + x offset)
// y: position relative to map (center of room + y offset)
// name: name used in EASY.json to identify container
// room: mapname where item is located
// itemslist: list of items (ContainerItem objects)
// repairItems: optional (used for escape pods to list the items required to repair, includes lyre in list) 
class ContainerManager {
    // containerLocType has to be an array of objects containing the locations of container and it's type/name and list of items
    constructor (game, containerLocType) {
        this.containers = [];
        this.containerCount = 0;
        this.containerRoomArray = [];
        // keep track of largest container index for creating and deleting.
        if  (game.gameData.containerarray.length < 1) {
            for (var i = 0; i < containerLocType.length; i++) {
                // make array of container indices located in each room, indexed by room name
                if (this.containerRoomArray[containerLocType[i].room] == undefined) {
                    this.containerRoomArray[containerLocType[i].room] = [];
                }
                this.containerRoomArray[containerLocType[i].room].push(i);
                this.containers[i] = new Container();
                if (containerLocType[i].repairItems != undefined) {
                    var containerData = Container.rawData(game, i, containerLocType[i].x, containerLocType[i].y, containerLocType[i].name, containerLocType[i].room, containerLocType[i].itemslist, containerLocType[i].repairItems);
                } else {
                    var containerData = Container.rawData(game, i, containerLocType[i].x, containerLocType[i].y, containerLocType[i].name, containerLocType[i].room, containerLocType[i].itemslist, []);
                }
                this.containers[i].addContainer(game, containerData);
                this.containers[i].setupContainerImage(game);
            }
            this.containerCount = this.containers.length;
        }
        else {
            // load existing containers into array
            for (var i = 0; i < game.gameData.containerarray.length ; i++) {
                if (this.containerRoomArray[containerarray[i].roomMapName] == undefined) {
                    this.containerRoomArray[containerarray[i].roomMapName] = [];
                }
                this.containerRoomArray[containerarray[i].roomMapName].push(i);
                this.containers[i] = new Container();
                this.containers[i].addContainer(game, game.gameData.containerarray[i]);
                this.containers[i].setupContainerImage(game);
                if (this.containers[i].idx >= this.containerCount) {
                    this.containerCount = this.containers[i].idx + 1;  // count of containers that were created is at least this big
                }
            }
        }
    }
    
    
    // use this to drop an item on the map
    addNewContainer(game, containerLocType) {
        for (var i = 0; i < containerLocType.length; i++) {
            this.containers[this.containers.length] = new Container();
                var containerData = Container.rawData(game, this.containerCount, containerLocType[i].x, containerLocType[i].y, containerLocType[i].name, containerLocType[i].room, containerLocType[i].itemslist);
                this.containers[this.containers.length].addContainer(game, containerData);
                this.containers[this.containers.length].setupContainerImage(game);
                this.containerCount += 1;
        }
    }
    
    // use this if loose item is picked up off the map into player inventory
    removeContainer(containerId) {
        // for now only allow removing containers that are transparent
        if (this.containers[containerId].name == "transparent") {
            this.containers[containerId].sprite.hideAllItems();
            this.containers[containerId].sprite.destroy();
            this.containers.splice(containerId, 1);
        }
    }
    
    
    playerMovedInProximity(game, container, playerid, comm) {
        switch (container.containerstate) {
            case "open":
                console.log('moved in');
                // display container inventory to communicator window
                comm.displayContainerInventory(container.idx);
                comm.activeContainerIndex = container.idx;
                
                container.openContainerHighlighted(game);
                container.addPlayerHighlight(playerid);
                break;
            case "closed":
                container.closedContainerHighlighted(game);
                container.addPlayerHighlight(playerid);
                break;
            case "openhighlight":
                //container.openContainerHighlighted(game);
                container.addPlayerHighlight(playerid);
                break;
            case "closedhighlight":
                //container.closedContainerHighlighted(game);
                container.addPlayerHighlight(playerid);
                break;
        } 
    }
    
    playerMovedOutOfProximity(game, container, playerid, comm) {
        switch (container.containerstate) {
            case "open":
                container.removePlayerHighlight(playerid);
                //container.openContainer(game, playerid);
                break;
            case "closed":
                container.removePlayerHighlight(playerid);
                //container.closedContainer(game, playerid);
                break;
            case "openhighlight":
                container.removePlayerHighlight(playerid);
                container.openContainer(game, playerid);
                
                break;
            case "closedhighlight" :
                container.removePlayerHighlight(playerid);
                container.closedContainer(game, playerid);
                
                break;
            default:
                break;
        }
    }
 
    // switch container states if overlap with the player
    checkPlayerOverlap (game, players, comm) {
        for (var i=0; i < players.length; i++) {
            for (var j=0; j < this.containers.length; j++) {
                // check for overlap or collision
                if (!(this.containers[j].sprite.body.checkCollision.any) ) {
                    if  (game.physics.arcade.overlap(players[i].sprite, this.containers[j].sprite)) {
                        // player moved in proximity
                        this.playerMovedInProximity(game, this.containers[j], i, comm);
                        players[i].playerOverlapContainer(game, this.containers[j]);
                    }
                    else {
                        this.playerMovedOutOfProximity(game, this.containers[j], i, comm);
                    }
                }
                else {
                    if (game.physics.arcade.collide(this.containers[j].sprite, players[i].sprite)) {
                        // player collided
                        this.playerMovedInProximity(game, this.containers[j], i, comm);
                        players[i].playerCollideContainer(game, this.containers[j]);
                        
                        // in case the player needs to do something - currently not defined in player
                        //players[i].lockedOut(players[i].sprite,this.containers[i].sprite);
                    }
                    // if the player is causing the highlight, check for proximity
                    if ((this.containers[j].findPlayerHighlight(i) >= 0) && (!this.calculateProximityAfterCollision(game, this.containers[j], players[i]))) {
                        this.playerMovedOutOfProximity(game, this.containers[j], i, comm);
                        if (comm.activeContainerIndex !== -1) {
                            comm.activeContainerIndex = -1;
                            comm.clearContainerInventory();
                        }
                    }
                }
            }
        }
    }
    
    calculateProximityAfterCollision(game, container, player) {
        var xLwr = container.sprite.body.center.x - game.gameData.containers[container.name].width/2 - 10;
        var xUpr = container.sprite.body.center.x + game.gameData.containers[container.name].width/2 + 10;
        var yLwr = container.sprite.body.center.y - game.gameData.containers[container.name].height/2 - 10;
        var yUpr = container.sprite.body.center.y + game.gameData.containers[container.name].height/2 + 10;

        var pxLwr = player.sprite.body.center.x + game.gameData.characters[player.characterIdx].width/2;
        var pxUpr = player.sprite.body.center.x - game.gameData.characters[player.characterIdx].width/2;
        var pyLwr = player.sprite.body.center.y + game.gameData.characters[player.characterIdx].height/2;
        var pyUpr = player.sprite.body.center.y - game.gameData.characters[player.characterIdx].height/2;

        // find out if player is still close enough
        if (pxLwr > xLwr && pxUpr < xUpr && pyLwr > yLwr && pyUpr < yUpr) {
            return true;    
        }
        return false;
    }
    
    saveContainerManager (game) {
        var savedContainers = [];
        for (var i = 0; i < this.containers.length; i++) {
            savedContainers[i] = this.containers[i].saveContainer(); 
        }
        game.gameData.containerarray = savedContainers;
        //console.log(savedContainers);
    }
}