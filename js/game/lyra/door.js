class Door {
    constructor (idx) {
        this.idx = idx;
    }
    
    addDoor (game, name, x, y) {
    //Test to see if it works.
        for (var i=0; i< game.gameData.doors.length; i++) {
            this.sprite = game.add.tileSprite(x, y, game.gameData.doors[i].width, game.gameData.doors[i].height, game.gameData.doors[i].imageTagList);
        }
        this.name = name;
        this.state = game.gameData.doors[0].imageTagList;
        game.physics.arcade.enable(this.sprite);
        this.sprite.body.setSize(game.gameData.doors[0].width, game.gameData.doors[0].height);
    }
    
    
    // [TODO] improve mapping here to correspond door states to the input
    openDoor (game) {
        this.state = game.gameData.doors[0].imageTagList;
        this.sprite.body.setSize(game.gameData.doors[0].width, game.gameData.doors[0].height);
    }

    closedDoor (game) {
        this.state = game.gameData.doors[1].imageTagList;
        this.sprite.body.setSize(game.gameData.doors[1].width, game.gameData.doors[1].height);
    }
    
    openDoorHighlighted (game) {
        this.state = game.gameData.doors[2].imageTagList;
        this.sprite.body.setSize(game.gameData.doors[2].width, game.gameData.doors[2].height);
    }   

    closedDoorHighlighted (game) {
        this.state = game.gameData.doors[3].imageTagList;
        this.sprite.body.setSize(game.gameData.doors[3].width, game.gameData.doors[3].height);
    }

    saveDoor (offsetX, offsetY) {
        var doorData = {
            idx : this.idx,
            name: this.name,
            state: this.state,
            x : this.sprite.body.position.x + offsetX,
            y : this.sprite.body.position.y + offsetY,
        }
        return (doorData);
    }
}


Door.preloadDoorImages = function(game) {
    // load all the specified door images
    for (var i=0; i< game.gameData.doors.length; i++) {
        game.load.image(game.gameData.doors[i].imageTagList,game.gameData.doors[i].imageRefList)
    }
}


