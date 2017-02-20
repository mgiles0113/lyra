class MapBuilder {
    
    placeContainersInRooms(game, roomManager, mapObjSuppressant, mapObjDoors) {
        // add containers by room type
        var containerLocType = [];
        for (var i = 0; i<roomManager.roomIdx.length; i++) {
            var roomDef = game.gameData.roomdef[roomManager.rooms[roomManager.roomIdx[i]].type];
            for (var j = 0; j< roomDef.containers.length; j++) {
                var containerDef = game.gameData.containers[roomDef.containers[j]];

                // generate an array of indices creating a random list of allowed items in the container
                var itemslistArr = this.generateItems(roomDef, containerDef);
                containerLocType.push({x: (roomManager.rooms[roomManager.roomIdx[i]].center_x + containerDef.width/2 + roomDef.containercoord[j][0]), 
                        y: (roomManager.rooms[roomManager.roomIdx[i]].center_y + containerDef.height/2 + roomDef.containercoord[j][1]), name:roomDef.containers[j], itemslist:itemslistArr});
            }
        }
        
        // add escape pods
        for (var i = 0; i<roomManager.escapepodIdx.length; i++) {
            for (var j = 0; j< game.gameData.escapepod.containers.length; j++) {
                containerDef = game.gameData.containers[game.gameData.escapepod.containers[j]];
                containerLocType.push({x: (roomManager.rooms[roomManager.escapepodIdx[i]].center_x + containerDef.width/2 +game.gameData.escapepod.containercoord[j][0]), 
                        y: (roomManager.rooms[roomManager.escapepodIdx[i]].center_y + containerDef.height/2 + game.gameData.escapepod.containercoord[j][1]), name:game.gameData.escapepod.containers[j], itemslist:[]});
            }
        }
        
        // do nothing for now with passages
        // for (var i = 0; i<roomManager.passageIdx.length; i++) {
            
        // }
        
        // do nothing for command center at roomManager.rooms[0]

        // do nothing for docking bay at roomManager.rooms[1]
        
        // add containers to main hall
        for (var j = 0; j< game.gameData.mainhall.containers.length; j++) {
            containerDef = game.gameData.containers[game.gameData.mainhall.containers[j]];
            itemslistArr = this.generateItems(game.gameData.mainhall, game.gameData.containers[game.gameData.mainhall.containers[j]]);
            containerLocType.push({x: roomManager.rooms[2].center_x + containerDef.width/2 + game.gameData.mainhall.containercoord[j][0], 
                    y: roomManager.rooms[2].center_y + containerDef.height/2 + game.gameData.mainhall.containercoord[j][1],name:game.gameData.mainhall.containers[j], itemslist:itemslistArr});
        }
        
        containerLocType = containerLocType.concat(this.addSuppressant(mapObjSuppressant));
        containerLocType = containerLocType.concat(this.addDoors(mapObjDoors));
        
        return containerLocType;
    }
    
    
    generateItems(roomDef, containerDef) {
        // generate an array of indices creating a random list of allowed items in the container
        var itemslistArr = [];
        for (var k = 0; k < containerDef.itemscapacity; k++) {
            var rndNum = getRandomInt(-1, roomDef.item_types_allowed.length - 1);
            if (rndNum >= 0) {
                itemslistArr.push(new ContainerItem(itemslistArr.length, roomDef.item_types_allowed[rndNum]));
            }
        }
        return itemslistArr;
    }
    
    
    addPlayers(game, roomManager) {
        // find the rooms with locations for crew_quarters, dock and commandcenter
        var crewQtr;
        var dock;
        var cc;
        // set bypassPositions to true to use the locArr instead of generating positions
        var bypassPositions = false;
        if (bypassPositions) {
            // hard code positions to make debugging easier
            // player tile coordinates (7, 22), (7, 24), (9, 22), (0,0) ,  (58, 22), (64, 46)
            var playerLocType = [];
            var locArr = [[224, 704],[224, 768],[288, 704],[0, 0],[1856, 704],[2048, 1472]];
            for (var i = 1; i< game.gameData.crew.length; i++) {
                playerLocType.push({
                    idx : i,
                    isSelected: false, 
                    characterIdx: game.gameData.crew[i], 
                    characterType: "crew", 
                    inventory : game.gameData.characters[game.gameData.crew[i]].inventory,
                    status: game.gameData.characters[game.gameData.crew[i]].status,
                    x : locArr[i][0],
                    y : locArr[i][1]
                })
            }
            for (var i = 0; i< game.gameData.bandit.length; i++) {
                playerLocType.push({
                    idx : i + game.gameData.crew.length,
                    isSelected: false, 
                    characterIdx: game.gameData.bandit[i], 
                    characterType: "bandit", 
                    inventory : game.gameData.characters[game.gameData.bandit[i]].inventory,
                    status: game.gameData.characters[game.gameData.bandit[i]].status,
                    x : locArr[i+3][0],
                    y : locArr[i+3][1]
                })
            }
        } else {
                
            for (var i=0; i< roomManager.rooms.length; i++) {
                if (roomManager.rooms[i].type == "crew_quarters")
                    crewQtr = roomManager.rooms[i];
                if (roomManager.rooms[i].type == "dock")
                    dock = roomManager.rooms[i];
                if (roomManager.rooms[i].type == "commandcenter")
                    cc = roomManager.rooms[i];
            }
            
            
            // playerLocType needs the following: 
            //    isSelected : true/false
            //    characterIdx : corresponds to index in gameData character array
            //    characterType : "crew" or "bandit"
            //    inventory : array of names
            //    status : player status (walk, stuck, sleep)
            //    x : x location for character
            //    y : y location
            playerLocType.push({
                    idx : 0,
                    isSelected: false, 
                    characterIdx: game.gameData.crew[0], 
                    characterType: "crew", 
                    inventory : game.gameData.characters[game.gameData.crew[0]].inventory,
                    status: game.gameData.characters[game.gameData.crew[0]].status,
                    x : cc.center_x,
                    y : cc.center_y
            })
            // put remaining crew in quarters
            for (var i = 1; i< game.gameData.crew.length; i++) {
                playerLocType.push({
                    idx : i,
                    isSelected: false, 
                    characterIdx: game.gameData.crew[i], 
                    characterType: "crew", 
                    inventory : game.gameData.characters[game.gameData.crew[i]].inventory,
                    status: game.gameData.characters[game.gameData.crew[i]].status,
                    x : crewQtr.center_x + i*50,
                    y : crewQtr.center_y + i*50
                })
            }
            
            // put bandits on docking bay
            for (var i = 0; i< game.gameData.bandit.length; i++) {
                playerLocType.push({
                    idx : i + game.gameData.crew.length,
                    isSelected: false, 
                    characterIdx: game.gameData.bandit[i], 
                    characterType: "bandit", 
                    inventory : game.gameData.characters[game.gameData.bandit[i]].inventory,
                    status: game.gameData.characters[game.gameData.bandit[i]].status,
                    x : dock.center_x + i*50 + 50,
                    y : dock.center_y + i*49
                })
            }
        }
        playerLocType[0].isSelected = true;
 
        return playerLocType;
    }
    
    // private method to create suppressant container definitions
    addSuppressant(mapObjSuppressant) {
        var containerLocType = [];
        for (var i = 0; i<mapObjSuppressant.length; i++ ) {
            //this.suppresantArr[this.map.map.objects["suppressant"][i].name] = this.map.map.objects["suppressant"][i];
            //Create suppressant items
            var containeritem =  new ContainerItem(0, "suppresant");
            containerLocType[containerLocType.length] = {x:mapObjSuppressant[i].x, y:mapObjSuppressant[i].y, name:"transparent", itemslist: [containeritem]};
        }
        return containerLocType;
    }

    // private method to create door container definitions
    addDoors(mapObjDoors) {
        var containerLocType = [];
        for (var i=0; i<mapObjDoors.length; i++) {
            containerLocType[containerLocType.length] = {x:mapObjDoors[i].x, y:mapObjDoors[i].y, name:"doors", itemslist: []};
        }
        return containerLocType;
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