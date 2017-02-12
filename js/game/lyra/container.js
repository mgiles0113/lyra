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
    }
    
    findPlayerHighlight(playerid) {
        for (var i = 0; i < this.playerHighlight.length; i++) {
            if (playerid == this.playerHighlight[i]) {
                return i;
            }
        }
        return -1;
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
            this.itemslist.push(name);
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
            if (this.name == name) {
                this.hideAllItems();
                this.itemslist.splice(i, 1);
                this.showAllItems(game);
                return (true);
            }
        }
        return false;
    }
    

    showItem(game, x, y, name, scalefactor) {
        this.itemSprites[name] = game.add.sprite(x, y, name);
        this.itemSprites[name].anchor.set(0.5, 0.5);
        this.itemSprites[name].scale.setTo(scalefactor);
        game.physics.arcade.enable(this.itemSprites[name]);
        this.itemSprites[name].bringToTop();
    }
    
    hideItem(name) {
        this.itemSprites[name].destroy();
    }
    
    //[TODO fix positioning the sprites based on how many in the container]
    showAllItems(game) {
        for (var i=0; i<this.itemslist.length; i++) {
            if (this.itemSprites[this.itemslist[i]]) {
                this.hideItem(this.itemslist[i]);
            }    
            this.showItem(game, this.sprite.body.position.x + 16, this.sprite.body.position.y + 16, this.itemslist[i], 0.5);
        }
    }
    
    hideAllItems() {
        for (var i=0; i<this.itemslist.length; i++) {
            if (this.itemSprites[this.itemslist[i]]) {
                this.hideItem(this.itemslist[i]);
            }
        }        
    }
    
    openContainer (game, playerid) {
        var playerIdx = this.findPlayerHighlight(playerid);
        if (playerIdx >= 0) {
            // player that removed the highlight removed from list
            this.playerHighlight.splice(playerIdx, 1);
        }
        if ((this.playerHighlight.length < 1) && (this.setState(game, "open"))) {  // only open the container if no one is highlighting
            //console.log(this.containerstate + " " + this.stateIdx);
            this.sprite.loadTexture(game.gameData.containers[this.name].imageTag, game.gameData.containers[this.name].textureArr[this.stateIdx], true);
            this.sprite.body.checkCollision.any = game.gameData.containers[this.name].checkCollision[this.stateIdx];
            this.showAllItems(game);
        }    
    }
    
    closedContainer (game, playerid) {
        var playerIdx = this.findPlayerHighlight(playerid);
        if (playerIdx >= 0) {
            // player that removed the highlight removed from list
            this.playerHighlight.splice(playerIdx, 1);
        }
        if ((this.playerHighlight.length < 1) && this.setState(game, "closed")) {  // only close the container if no one is highlighting
            this.sprite.loadTexture(game.gameData.containers[this.name].imageTag, game.gameData.containers[this.name].textureArr[this.stateIdx], true);
            //this.sprite.animations.play(this.doorstate);
            this.sprite.body.checkCollision.any = game.gameData.containers[this.name].checkCollision[this.stateIdx];
            this.hideAllItems();
        }
    }
    
    
    openContainerHighlighted (game, playerid) {
        if (this.setState(game, "openhighlight"))  {
            this.sprite.animations.play(this.containerstate);
            this.sprite.body.checkCollision.any = game.gameData.containers[this.name].checkCollision[this.stateIdx];
            this.showAllItems(game);
         }
        var playerIdx = this.findPlayerHighlight(playerid);
        // player that caused the highlight added to the highlight list
        if (playerIdx < 0) {
            this.playerHighlight.push(playerid);
        }
    }   
    
    closedContainerHighlighted (game, playerid) {
        if (this.setState(game, "closedhighlight"))  {
             this.sprite.animations.play(this.containerstate);
             this.sprite.body.checkCollision.any = game.gameData.containers[this.name].checkCollision[this.stateIdx];
            this.hideAllItems();
         }
        // player that caused the highlight added to the highlight list
        var playerIdx = this.findPlayerHighlight(playerid);
        if (playerIdx < 0) {
            this.playerHighlight.push(playerid);
        }
    }

    switchContainerState (game) {
        switch (this.containerstate) {
            case "openhighlight" : 
                 if (this.setState(game, "closedhighlight")) {
                    this.sprite.body.checkCollision.any = game.gameData.containers[this.name].checkCollision[this.stateIdx];
                    this.hideAllItems();
                 }
                break;
            case "closedhighlight":
                if (this.setState(game, "openhighlight")) {
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
    
    // switch container states if overlap with the player
    checkPlayerOverlap (game, players) {
        for (var i=0; i < players.length; i++) {
            for (var j=0; j < this.containers.length; j++) {
                this.containers[j].sprite.body.setSize(game.gameData.containers[this.containers[j].name].width + 10, game.gameData.containers[this.containers[j].name].height + 10);
                if ((this.containers[j].findPlayerHighlight(i) < 0) && (game.physics.arcade.overlap(players[i].sprite, this.containers[j].sprite)))
                {  // this player is currently not causing the highlight
                        // console.log("overlap true: player: " + i + " door: " + this.doors[j].name);
                        switch (this.containers[j].containerstate) {
                            case "open":
                                this.containers[j].openContainerHighlighted(game, i);
                                break;
                            case "closed":
                                this.containers[j].closedContainerHighlighted(game, i);
                                break;
                            default:
                                break;
                        } 
                }
                else if ((this.containers[j].findPlayerHighlight(i) >= 0) && (!game.physics.arcade.overlap(players[i].sprite, this.containers[j].sprite)))
                {
                        switch (this.containers[j].containerstate) {
                            case "openhighlight":
                                this.containers[j].openContainer(game, i);
                                break;
                            case "closedhighlight" :
                                this.containers[j].closedContainer(game, i);
                                break;
                            default:
                                break;
                        }
                }
                this.containers[j].sprite.body.setSize(game.gameData.containers[this.containers[j].name].width, game.gameData.containers[this.containers[j].name].height);
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

    
