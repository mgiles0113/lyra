class MapBuilder {
    
    defineRooms(mapRoomArray) {
        
        
        
    }
    
    
    addContainers() {
        for (var i = 0; i<this.map.map.objects["rooms"].length; i++ ) {
            this.roomArr[this.map.map.objects["rooms"][i].name] = this.map.map.objects["rooms"][i];
            //[TODO] for now put a container in each room
            // this is replaced by distributing containers throughout rooms
            if (!( (this.map.map.objects["rooms"][i].name == "cc" )
                    || (this.map.map.objects["rooms"][i].name == "p1")
                    || (this.map.map.objects["rooms"][i].name == "p2")
                    || (this.map.map.objects["rooms"][i].name == "p3")
                    || (this.map.map.objects["rooms"][i].name == "p4")
                    || (this.map.map.objects["rooms"][i].name == "e1")
                      )) {
                this.containerLocType[this.containerLocType.length] = {x:this.map.map.objects["rooms"][i].x, y:this.map.map.objects["rooms"][i].y, name:"smallbox", itemslist: [new ContainerItem(0, "fuse")]};
                this.containerLocType[this.containerLocType.length] = {x:this.map.map.objects["rooms"][i].x - 64, y:this.map.map.objects["rooms"][i].y - 10, name:"largebox", itemslist: [new ContainerItem(0, "wrench"), new ContainerItem(0, "fuel_tank")]};
    
            }
            if (this.map.map.objects["rooms"][i].name == "e1") { this.containerLocType[this.containerLocType.length] = {x:this.map.map.objects["rooms"][i].x - 64, y:this.map.map.objects["rooms"][i].y -64, name:"escapepod", itemslist: []};}
        }
        
    }
    
    
    addPlayers(game) {
        // playerLocType needs the following: 
        //    isSelected : true/false
        //    characterIdx : corresponds to index in gameData character array
        //    characterType : "crew" or "bandit"
        //    inventory : array of names
        //    status : player status (walk, stuck, sleep)
        //    x : x location for character
        //    y : y location

        // if < 1, no crew defined
        if (this.game.gameData.playerarray.length < 1) {
            var playerLocType = [];
            for (var i = 0; i< this.game.gameData.crew.length; i++) {
                playerLocType.push({
                    idx : i,
                    isSelected: false, 
                    characterIdx: this.game.gameData.crew[i], 
                    characterType: "crew", 
                    inventory : this.game.gameData.characters[this.game.gameData.crew[i]].inventory,
                    status: this.game.gameData.characters[this.game.gameData.crew[i]].status,
                    x : this.roomArr["cc"].x + i*50,
                    y : this.roomArr["cc"].y + i*50
                })
            }
            for (var i = 0; i< this.game.gameData.bandit.length; i++) {
                playerLocType.push({
                    idx : i + this.game.gameData.crew.length,
                    isSelected: false, 
                    characterIdx: this.game.gameData.bandit[i], 
                    characterType: "bandit", 
                    inventory : this.game.gameData.characters[this.game.gameData.bandit[i]].inventory,
                    status: this.game.gameData.characters[this.game.gameData.bandit[i]].status,
                    x : this.roomArr["d"].x + i*50 + 50,
                    y : this.roomArr["d"].y + i*48
                })
            }

            playerLocType[0].isSelected = true;
        }
        return playerLocType;
    }
    
    // private method to create suppressant container definitions
    addSuppressant() {
        var containerLocType = [];
        for (var i = 0; i<this.map.map.objects["suppressant"].length; i++ ) {
            //this.suppresantArr[this.map.map.objects["suppressant"][i].name] = this.map.map.objects["suppressant"][i];
            //Create suppressant items
            var containeritem =  new ContainerItem(0, "suppresant");
            this.containerLocType[this.containerLocType.length] = {x:this.map.map.objects["suppressant"][i].x, y:this.map.map.objects["suppressant"][i].y, name:"transparent", itemslist: [containeritem]};
        }
        return containerLocType;
    }

    // private method to create door container definitions
    addDoors() {
        var containerLocType = [];
        for (var i=0; i<this.map.map.objects["doors"].length; i++) {
            this.containerLocType[this.containerLocType.length] = {x:this.map.map.objects["doors"][i].x, y:this.map.map.objects["doors"][i].y, name:"doors", itemslist: []};
        }
        return containerLocType;
    }
    
    // private method to create escape pods and populate with list of items needed to fix
    addEscapePods() {
        var containerLocType = [];
        if (this.map.map.objects["rooms"][i].name == "e1") { this.containerLocType[this.containerLocType.length] = {x:this.map.map.objects["rooms"][i].x - 64, y:this.map.map.objects["rooms"][i].y -64, name:"escapepod", itemslist: []};}
    }
    
    buildNewMapContainerDefinitions(game) {
        var containerLocType = [];
        containerLocType.concat(this.addContainers());
        containerLocType.concat(this.addSuppressant());
        containerLocType.concat(this.addDoors());
        containerLocType.concat(this.addEscapePods());
    }
    
    

}




// old version of map init - delete
// var TRIAL_MAP = {
//         // [TODO] how to get this data passed in from the startGame!
//         gameType: "TRIAL_MAP",
//         mapRef: 'assets/tilemaps/maps/grayRoom.json',
//         imageTagList: ['grayTiles', 'background'],
//         imageRefList: ['assets/grayTiles.png', 'assets/backgroundGray.png'],
//         mapLayerRef: ['layer2', 'layer1'],
//         mapwidth: 40*32,
//         mapheight: 40*32,
// }

// var EASY_MANYLAYER_MAP = {
//         gameType: "EASY_MAP",
//         mapRef: 'assets/tilemaps/maps/reference_map.json',
//         imageTagList: ['scifitiles-sheet', 'meta_tiles'],
//         imageRefList: ['assets/lyraImages/scifitiles-sheet.png', 'assets/lyraImages/meta_tiles.png'],
//         // [TODO] build this list off the json map file? ordered by display order, for now walls are last
//         mapLayerRef: ['escape_pods', 'halls', 'dock', 'workshop', 'engine_room', 'rec_room', 'crew_quarters', 'cafeteria', 'med_bay', 'command_center', 'doors', 'walls'],
//         mapwidth: 64*32,
//         mapheight: 46*32,
// }

// var EASY_MAP = {
//         gameType: "EASY_MAP",
//         mapRef: 'assets/tilemaps/maps/reference_map.json',
//         imageTagList: ['scifitiles-sheet', 'meta_tiles'],
//         imageRefList: ['assets/lyraImages/scifitiles-sheet.png', 'assets/lyraImages/meta_tiles.png'],
//         // [TODO] build this list off the json map file? ordered by display order, for now walls are last
//         mapLayerRef: ['floors', 'doors', 'walls'],
//         mapwidth: 64*32,
//         mapheight: 46*32,
// }

// var HARD_MAP = {
//     // for now the same
//         gameType: "HARD_MAP",
//         mapRef: 'assets/tilemaps/maps/reference_map.json',
//         imageTagList: ['scifitiles-sheet', 'meta_tiles'],
//         imageRefList: ['assets/scifitiles-sheet.png', 'assets/meta_tiles.png'],
//         // [TODO] build this list off the json map file? ordered by display order, for now walls are last
//         mapLayerRef: ['escape_pods', 'halls', 'dock', 'workshop', 'engine_room', 'rec_room', 'crew_quarters', 'cafeteria', 'med_bay', 'command_center', 'doors', 'walls'],
//         mapwidth: 64*32,
//         mapheight: 46*32,
// }

// function mapData (typeMap) {
//     switch (typeMap) {
//         case "EASY_MAP":
//             return (EASY_MAP);
//     }
//     return null;
// }