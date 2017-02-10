class Items {
    addItem (game, name, x, y) {
    //Test to see if it works.
        this.sprite = game.add.sprite(x, y, name);
        this.name = name;
        game.physics.arcade.enable(this.sprite);
        this.sprite.body.setSize(32,32);
        this.sprite.body.setCircle(20); // radius of collision body
        this.sprite.anchor.set(0.5, 0.5); // center collision over image

    }
    
    //Add Item to Comm Window
    addtoComm(game, name, x, y){
        if( name != 'empty')
        var commItem = game.add.button(x, y, name);
        commItem.fixedToCamera = true;
        return commItem;
    }
        
}

// //Loads the item resources
// Items.preloadItems = function (game) {
//     //Load the items needed.
//     //1st-> Item Name/Key
//     //2nd-> URL to asset
//     for (var i=0; i<game.itemData.items.length; i++) {
//         game.load.image(game.itemData.items[i].name, game.itemData.items[i].itemRef);
//     }
// }


Items.ItemImages = function(game) {
    // load all the specified item images
    game.load.image("circuit",game.gameData.items["CIRCUIT"].itemRef);
    game.load.image("fuel_tank",game.gameData.items["FUEL_TANK"].itemRef);
    game.load.image("fuse",game.gameData.items["FUSE"].itemRef);
    game.load.image("suppresant",game.gameData.items["SUPPRESANT"].itemRef);
    game.load.image("wrench",game.gameData.items["WRENCH"].itemRef);
}

Items.rawData = function(idx, x, y, name, doorstate) {
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


class ItemsManager {

    constructor (game, doorLocArr) {
        this.items = [];
        if (game.gameData.doorarray.length < 1) {
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
            }
        }
    }
    
    saveItemManager (game) {
        var savedItems = [];
        for (var i = 0; i < this.items.length; i++) {
            savedItems[i] = this.items[i].saveItem(); 
        }
        game.gameData.itemarray = savedItems;
    }
    
}


