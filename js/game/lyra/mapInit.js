class MapBuilder {
    
    placeContainersInRooms(game, roomManager) {
        // add containers by room type
        var containerLocType = [];
        // list of items placed on map - use to choose needed items for escapepod repair
        var itemsList = [];
        // container indices with empty spaces - use to place lyre on map
        var idxEmptyContainerSlot = [];
        for (var i = 0; i<roomManager.roomIdx.length; i++) {
            var roomDef = game.gameData.roomdef[roomManager.rooms[roomManager.roomIdx[i]].type];
            for (var j = 0; j< roomDef.containers.length; j++) {
                var containerDef = game.gameData.containers[roomDef.containers[j]];

                // generate an array of indices creating a random list of allowed items in the container
                var itemslistArr = this.generateItems(roomDef, containerDef);
                itemsList = itemsList.concat(itemslistArr);
                containerLocType.push({x: (roomManager.rooms[roomManager.roomIdx[i]].center_x + containerDef.width/2 + roomDef.containercoord[j][0]), 
                        y: (roomManager.rooms[roomManager.roomIdx[i]].center_y + containerDef.height/2 + roomDef.containercoord[j][1]), name:roomDef.containers[j], itemslist:itemslistArr});
                if (containerLocType[containerLocType.length - 1].itemslist.length < containerDef.itemscapacity ) {
                    idxEmptyContainerSlot.push(containerLocType.length - 1);
                }
            }
        }
        
        // assign the lyre to a container
        containerLocType = this.assignLyre(idxEmptyContainerSlot, containerLocType);
        
        // add escape pods
        var itemsNeeded = [];
        var numItems = 0;
        for (var i = 0; i<roomManager.escapepodIdx.length; i++) {
            for (var j = 0; j< game.gameData.escapepod.containers.length; j++) {
                containerDef = game.gameData.containers[game.gameData.escapepod.containers[j]];

                // require three repair items
                if (containerDef.name == "escapepodhold" && numItems < 3) {
                    itemsNeeded = [itemsList[getRandomInt(0, itemsList.length-1)]];
                } else if (containerDef.name == "escapepodhold" && numItems == 3) {
                    itemsNeeded = ["lyre"];
                }
                numItems += 1;

                containerLocType.push({x: (roomManager.rooms[roomManager.escapepodIdx[i]].center_x + containerDef.width/2 +game.gameData.escapepod.containercoord[j][0]), 
                        y: (roomManager.rooms[roomManager.escapepodIdx[i]].center_y + containerDef.height/2 + game.gameData.escapepod.containercoord[j][1]), name:game.gameData.escapepod.containers[j], itemslist:[], repairItems:itemsNeeded});
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
        
        return containerLocType;
    }
    
    
    generateItems(roomDef, containerDef) {
        // generate an array of indices creating a random list of allowed items in the container
        var itemslistArr = [];
        for (var k = 0; k < containerDef.itemscapacity; k++) {
            var rndNum = getRandomInt(-1, roomDef.item_types_allowed.length - 1);
            if (rndNum >= 0) {
                itemslistArr.push(new ContainerItem(itemslistArr.length-1, roomDef.item_types_allowed[rndNum]));
            }
        }
        return itemslistArr;
    }
    
    assignLyre(idxEmptyContainerSlot, containerLocType) {
        // find all the containers with empty spaces
        if (idxEmptyContainerSlot.length < 1) {
            // replace an item with the lyre
            var rndIdx = getRandomInt(0, idxEmptyContainerSlot.length-1);
            containerLocType[rndIdx].itemslist.pop();
            containerLocType[rndIdx].itemslist.push(new ContainerItem(containerLocType[rndIdx].itemslist.length, "lyre"));
        }
        else {
            var rndIdx = getRandomInt(0, idxEmptyContainerSlot.length-1);
            containerLocType[rndIdx].itemslist.push(new ContainerItem(containerLocType[rndIdx].itemslist.length, "lyre"));
        }
        return (containerLocType);
    }
    
    addPlayers(game, roomManager) {
        // find the rooms with locations for crew_quarters, dock and commandcenter
        var playerLocType = [];
        var crewQtr;
        var dock;
        var cc;
        // set bypassPositions to true to use the locArr instead of generating positions
        var bypassPositions = false;
        if (bypassPositions) {
            // hard code positions to make debugging easier
            // player tile coordinates (7, 22), (7, 24), (9, 22), (0,0) ,  (58, 22), (64, 46)
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
    
    // create suppressant container definitions
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

    // create door container definitions
    addDoors(mapObjDoors) {
        var containerLocType = [];
        for (var i=0; i<mapObjDoors.length; i++) {
            containerLocType[containerLocType.length] = {x:mapObjDoors[i].x, y:mapObjDoors[i].y, name:"doors", itemslist: []};
        }
        return containerLocType;
    }



    // color map floor tiles
    mapRoomFloorUpdate() {
        //this.map.map.layers[idx].name has the name equal to map name for cc, d, mh, r1, r2, r3, r4, r5, r6
        // this.map.map.layers[idx].data has 46 arrays of 64 elements, if not zero then part of the floor for corresponding room
        
    }

}
