class Container {
    addContainer (game, containerData) {
        this.idx = containerData.idx;
        this.x = containerData.x;
        this.y = containerData.y;
        this.name = containerData.name;
        this.itemscapacity = containerData.itemscapacity;
        this.itemslist = containerData.itemslist;
        this.itemSprites = [];
        this.playerHighlight = containerData.playerHighlight;
        this.containerstate = containerData.containerstate;
        this.stateIdx = containerData.stateIdx;
        this.sprite = game.add.sprite(this.x, this.y, containerData.name);
        for (var i=0; i<game.gameData.containers[this.name].animationTags.length; i++) {
            this.sprite.animations.add(game.gameData.containers[this.name].animationTags[i],game.gameData.containers[this.name].animationArr[i],5,true);
        }
        game.physics.arcade.enable(this.sprite);
        this.sprite.body.setSize(game.gameData.containers[this.name].width, game.gameData.containers[this.name].height);
        this.sprite.immovable = containerData.immovable; this.sprite.body.immovable = containerData.immovablebody; this.sprite.body.moves = containerData.moves;
        //this.sprite.anchor.set(0.5);
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
    

    showItem(game, x, y, idx, scalefactor) {
        this.itemSprites[idx] = game.add.sprite(x, y, this.itemslist[idx].name);
        this.itemSprites[idx].anchor.set(0.5, 0.5);
        this.itemSprites[idx].scale.setTo(scalefactor);
        game.physics.arcade.enable(this.itemSprites[idx]);
        this.itemSprites[idx].bringToTop();
    }
    
    hideItem(idx) {
        this.itemSprites[idx].destroy();
    }
    
    showAllItems(game) {
        var posArr = this.itemPositionOffsetsInContainer(game);
        for (var i=0; i<this.itemslist.length; i++) {
            if (this.itemSprites[i]) {
                this.hideItem(i);
            }
            this.showItem(game, posArr[i][0], posArr[i][1], i, 0.5);
        }
    }
    
    hideAllItems() {
        for (var i=0; i<this.itemslist.length; i++) {
            if (this.itemSprites[i]) {
                this.hideItem(i);
            }
        }        
    }
    
    // position the items in container if more than one
    // [TODO] handle container rotation
    itemPositionOffsetsInContainer(game) {
        switch (this.itemscapacity) {
            case 1:
                return ([[this.sprite.body.center.x, this.sprite.body.center.y]]);
            case 2:
                if (game.gameData.containers[this.name].width > game.gameData.containers[this.name].height) {
                    return ([[this.sprite.body.center.x - game.gameData.containers[this.name].width/4, this.sprite.body.center.y],
                           [this.sprite.body.center.x + game.gameData.containers[this.name].width/4, this.sprite.body.center.y]])                    
                }
                else {
                    return ([[this.sprite.body.center.x, this.sprite.body.center.y - game.gameData.containers[this.name].height/4],
                           [this.sprite.body.center.x, this.sprite.body.center.y + game.gameData.containers[this.name].height/4]])                    
                }
        }
        return [];
    }
    
    openContainer (game) {
        if ((this.playerHighlight.length < 1) && (this.setState(game, "open"))) {  // only open the container if no one is highlighting
            //console.log(this.containerstate + " " + this.stateIdx);
            this.sprite.loadTexture(game.gameData.containers[this.name].imageTag, game.gameData.containers[this.name].textureArr[this.stateIdx], true);
            this.sprite.body.checkCollision.any = game.gameData.containers[this.name].checkCollision[this.stateIdx];
            this.showAllItems(game);
        }    
    }
    
    closedContainer (game) {
        if ((this.playerHighlight.length < 1) && this.setState(game, "closed")) {  // only close the container if no one is highlighting
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
         }
    }   
    
    closedContainerHighlighted (game) {
        if (this.setState(game, "closedhighlight"))  {
            this.sprite.animations.play(this.containerstate);
            this.sprite.body.checkCollision.any = game.gameData.containers[this.name].checkCollision[this.stateIdx];
            this.hideAllItems();
         }
    }

    switchContainerState (game) {
        
        switch (this.containerstate) {
            case "openhighlight" : 
                 if (this.setState(game, "closedhighlight")) {
                    if (game.userPreference.data.sound === "true") {
                        game.sfDoorOpen.play('', 0, 0.1, false, true);
                    }
                    this.sprite.body.checkCollision.any = game.gameData.containers[this.name].checkCollision[this.stateIdx];
                    this.hideAllItems();
                 }
                break;
            case "closedhighlight":
                if (this.setState(game, "openhighlight")) {
                    if (game.userPreference.data.sound === "true") {
                        game.sfDoorClose.play('', 0, 0.1, false, true);
                    }
                    this.sprite.body.checkCollision.any = game.gameData.containers[this.name].checkCollision[this.stateIdx];
                    this.showAllItems(game);
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

Container.rawData = function(game, idx, x, y, name, itemslist) {
    var rawContainerData = {
        idx : idx,
        x : x,
        y : y,
        name : name,
        stateIdx : game.gameData.containers[name].stateIdx,
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
        game.load.image(game.gameData.containers[name].imageTag + "open", game.gameData.containers[name].itemRef, game.gameData.containers[name].width,game.gameData.containers[name].height);
        game.load.image(game.gameData.containers[name].imageTag + "closed", game.gameData.containers[name].itemRef, game.gameData.containers[name].width,game.gameData.containers[name].height);
    }
}

class ContainerManager {
    // containerLocType has to be an array of objects containing the locations of container and it's type/name and list of items
    constructor (game, containerLocType) {
        this.containers = [];
        this.containerCount = 0;
        // keep track of largest container index for creating and deleting.
        if  (game.gameData.containerarray.length < 1) {
            for (var i = 0; i < containerLocType.length; i++) {
                this.containers[i] = new Container();
                var containerData = Container.rawData(game, i, containerLocType[i].x, containerLocType[i].y, containerLocType[i].name, containerLocType[i].itemslist);
                this.containers[i].addContainer(game, containerData);
                this.containers[i].setupContainerImage(game);
            }
            this.containerCount = this.containers.length;
        }
        else {
            // load existing containers into array
            for (var i = 0; i < game.gameData.containerarray.length ; i++) {
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
                var containerData = Container.rawData(game, this.containerCount, containerLocType[i].x, containerLocType[i].y, containerLocType[i].name, containerLocType[i].itemslist);
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
    
    
    playerMovedInProximity(game, container, playerid) {
        switch (container.containerstate) {
            case "open":
                console.log('openhighlight');
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
    
    playerMovedOutOfProximity(game, container, playerid) {
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
    checkPlayerOverlap (game, players) {
        for (var i=0; i < players.length; i++) {
            for (var j=0; j < this.containers.length; j++) {
                // check for overlap or collision
                if (!(this.containers[j].sprite.body.checkCollision.any) ) {
                    if  (game.physics.arcade.overlap(players[i].sprite, this.containers[j].sprite)) {
                        // player moved in proximity
                        this.playerMovedInProximity(game, this.containers[j], i);
                    }
                    else {
                        this.playerMovedOutOfProximity(game, this.containers[j], i);
                    }
                }
                else {
                    if (game.physics.arcade.collide(this.containers[j].sprite, players[i].sprite)) {
                        // player collided
                        this.playerMovedInProximity(game, this.containers[j], i);
                        // in case the player needs to do something - currently not defined in player
                        //players[i].lockedOut(players[i].sprite,this.containers[i].sprite);
                    }
                    // if the player is causing the highlight, check for proximity
                    if ((this.containers[j].findPlayerHighlight(i) >= 0) && (!this.calculateProximityAfterCollision(game, this.containers[j], players[i]))) {
                        this.playerMovedOutOfProximity(game, this.containers[j], i);
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

    
