class MapBuilder {
    
    // containerLocType is used to define all the containers on the map
    // object contains the following:
    // x: position relative to map (center of room + x offset)
    // y: position relative to map (center of room + y offset)
    // name: name used in EASY.json to identify container
    // room: mapname where item is located
    // itemslist: list of items (ContainerItem objects)
    // repairItems: optional (used for escape pods to list the items required to repair, includes lyre in list) 
    placeContainersInRooms(game, roomManager, lyrelocator) {
        // add containers by room type
        var containerLocType = [];
        // list of items placed on map - use to choose needed items for escapepod repair
        var itemsList = [];
        // container indices with empty spaces - use to place lyre on map
        var idxEmptyContainerSlot = [];
        for (var i = 0; i<roomManager.roomIdx.length; i++) {
            var roomDef = game.gameData.roomdef[roomManager.rooms[roomManager.roomIdx[i]].type];
            if (roomDef.name == "cafeteria") {
                // add espresso machine - this is so latte doesn't end up in another container
                // for now hard coded to center of cafeteria
                containerLocType.push({
                            x: roomManager.rooms[roomManager.roomIdx[i]].center_x + game.gameData.containers["espresso"].width/2 - 192, 
                            y: roomManager.rooms[roomManager.roomIdx[i]].center_y + game.gameData.containers["espresso"].height/2 - 96,
                            name: "espresso",
                            room: roomManager.rooms[roomManager.roomIdx[i]].mapName, 
                            itemslist: [new ContainerItem(0, "coffeecup", game.gameData.items["coffeecup"].capacity)]
                            });
            }
            for (var j = 0; j< roomDef.containers.length; j++) {
                var containerDef = game.gameData.containers[roomDef.containers[j]];

                // generate an array of indices creating a random list of allowed items in the container
                var itemslistArr = this.generateItems(roomDef, containerDef);
                itemsList = itemsList.concat(itemslistArr);
                containerLocType[containerLocType.length] = {x: (roomManager.rooms[roomManager.roomIdx[i]].center_x + containerDef.width/2 + roomDef.containercoord[j][0]), 
                        y: (roomManager.rooms[roomManager.roomIdx[i]].center_y + containerDef.height/2 + roomDef.containercoord[j][1]), name:roomDef.containers[j], room: roomManager.rooms[roomManager.roomIdx[i]].mapName, itemslist:itemslistArr};
                if (containerLocType[containerLocType.length - 1].itemslist.length < containerDef.itemscapacity ) {
                    idxEmptyContainerSlot.push(containerLocType.length - 1);
                }
            }
        }
        
        // do nothing for now with passages
        // for (var i = 0; i<roomManager.passageIdx.length; i++) {
            
        // }
        
        // do nothing for command center at roomManager.rooms[0]


        
        // add containers to main hall
        for (var j = 0; j< game.gameData.mainhall.containers.length; j++) {
            containerDef = game.gameData.containers[game.gameData.mainhall.containers[j]];
            itemslistArr = this.generateItems(game.gameData.mainhall, game.gameData.containers[game.gameData.mainhall.containers[j]]);
            itemsList = itemsList.concat(itemslistArr);
            containerLocType.push({x: roomManager.rooms[2].center_x + containerDef.width/2 + game.gameData.mainhall.containercoord[j][0], 
                    y: roomManager.rooms[2].center_y + containerDef.height/2 + game.gameData.mainhall.containercoord[j][1],name:game.gameData.mainhall.containers[j], room: roomManager.rooms[roomManager.mainhallIdx].mapName, itemslist:itemslistArr});

        }
        
        // assign the lyre to a container
        containerLocType = this.assignLyre(game, idxEmptyContainerSlot, containerLocType, lyrelocator);
        
        // dock is a bad place for the lyre
        // do nothing for docking bay at roomManager.rooms[1]
        for (var j = 0; j< game.gameData.dock.containers.length; j++) {
            containerDef = game.gameData.containers[game.gameData.dock.containers[j]];
            itemslistArr = this.generateItems(game.gameData.dock, game.gameData.containers[game.gameData.dock.containers[j]]);
            containerLocType.push({x: roomManager.rooms[roomManager.dockIdx].center_x + containerDef.width/2 + game.gameData.dock.containercoord[j][0], 
                    y: roomManager.rooms[roomManager.dockIdx].center_y + containerDef.height/2 + game.gameData.dock.containercoord[j][1],name:game.gameData.dock.containers[j], room: roomManager.rooms[roomManager.dockIdx].mapName, itemslist:itemslistArr});
        }
        
        // add escape pods
        var itemsNeeded = [];
        for (var i = 0; i<roomManager.escapepodIdx.length; i++) {
            for (var j = 0; j< game.gameData.escapepod.containers.length; j++) {
                containerDef = game.gameData.containers[game.gameData.escapepod.containers[j]];

                // require three repair items
                itemsNeeded = this.assignRepairItems(itemsList );

                containerLocType.push({x: (roomManager.rooms[roomManager.escapepodIdx[i]].center_x + containerDef.width/2 +game.gameData.escapepod.containercoord[j][0]), 
                        y: (roomManager.rooms[roomManager.escapepodIdx[i]].center_y + containerDef.height/2 + game.gameData.escapepod.containercoord[j][1]), name:game.gameData.escapepod.containers[j], room: roomManager.rooms[roomManager.escapepodIdx[i]].mapName, itemslist:[], repairItems:itemsNeeded});
            }
        }
        

        
        return containerLocType;
    }
    
    
    generateItems(roomDef, containerDef) {
        // generate an array of indices creating a random list of allowed items in the container
        var itemslistArr = [];
        for (var k = 0; k < containerDef.itemscapacity; k++) {
            var rndEmpty = getRandomInt(0,5);  // 20% chance that container is empty
            if (rndEmpty > 0) {
                var rndNum = getRandomInt(0, roomDef.item_types_allowed.length - 1);
                itemslistArr.push(new ContainerItem(itemslistArr.length, roomDef.item_types_allowed[rndNum]));
            }
        }
        return itemslistArr;
    }

    assignRepairItems(itemsList ) {
        var itemsNeeded = [];    
        for (var i=0; i< 3; i++) {
            itemsNeeded.push(itemsList[getRandomInt(0, itemsList.length-1)]);
        }
        itemsNeeded.push(new ContainerItem(itemsNeeded.length, "lyre"));
        return itemsNeeded;
}

    
    //containerLocType is the array of containers to build
    // idxEmptyContainerSlot is the array of indices into containerLocType with an empty slot
    assignLyre(game, idxEmptyContainerSlot, containerLocType, lyrelocator) {
        // find all the containers with empty spaces
        if (idxEmptyContainerSlot.length < 1) {
            // replace an item with the lyre
            var rndIdx = getRandomInt(0, containerLocType.length-1);
            containerLocType[rndIdx].itemslist.pop();
        }
        else {
            var rndIdx = idxEmptyContainerSlot[getRandomInt(0, idxEmptyContainerSlot.length-1)];
        }
        containerLocType[rndIdx].itemslist.push(new ContainerItem(containerLocType[rndIdx].itemslist.length, "lyre"));
        lyrelocator.initializeLocation (game, containerLocType[rndIdx].x, containerLocType[rndIdx].y);
        //console.log("lyre located at: ");
        //console.log(containerLocType[rndIdx]);
        //console.log(game.gameData.lyreLocation);

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
            for (var i = 0; i< game.gameData.crew.length; i++) {
                playerLocType.push({
                    idx : i,
                    isSelected: false, 
                    characterIdx: game.gameData.crew[i], 
                    characterType: "crew", 
                    status: "awake",
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
                    status: "awake",
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
                    status: game.gameData.characters[game.gameData.crew[0]].status,
                    x : cc.center_x,
                    y : cc.center_y
            })
            // put remaining crew in quarters  [48, -112],[ 112,-112 ]
            // hardcoding to same location as sleep pod
 //           for (var i = 1; i< game.gameData.crew.length; i++) {
                playerLocType.push({
                    idx : 1,
                    isSelected: false, 
                    characterIdx: game.gameData.crew[1], 
                    characterType: "crew", 
                    status: game.gameData.characters[game.gameData.crew[1]].status,
                    x : crewQtr.center_x + 80,
                    y : crewQtr.center_y - 80
                })
                playerLocType.push({
                    idx : 2,
                    isSelected: false, 
                    characterIdx: game.gameData.crew[2], 
                    characterType: "crew", 
                    status: game.gameData.characters[game.gameData.crew[2]].status,
                    x : crewQtr.center_x + 144,
                    y : crewQtr.center_y - 80
                })
  //          }
            
            // put bandits on docking bay
            for (var i = 0; i< game.gameData.banditCount; i++) {
                playerLocType.push({
                    idx : i + game.gameData.crew.length,
                    isSelected: false, 
                    characterIdx: game.gameData.bandit[i], 
                    characterType: "bandit", 
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
    addSuppressant(game, mapObjSuppressant) {
        var containerLocType = [];
        for (var i = 0; i<mapObjSuppressant.length; i++ ) {
            //this.suppresantArr[this.map.map.objects["suppressant"][i].name] = this.map.map.objects["suppressant"][i];
            //Create suppressant items
            var containeritem =  new ContainerItem(0, "suppresant", game.gameData.items["suppresant"].capacity);
            containerLocType[containerLocType.length] = {x:mapObjSuppressant[i].x, y:mapObjSuppressant[i].y, name:"transparent", room: mapObjSuppressant[i].mapName, itemslist: [containeritem]};
        }
        return containerLocType;
    }

    // create door container definitions
    addDoors(mapObjDoors) {
        var containerLocType = [];
        for (var i=0; i<mapObjDoors.length; i++) {
            containerLocType[containerLocType.length] = {x:mapObjDoors[i].x, y:mapObjDoors[i].y, name:"doors", room: mapObjDoors[i].mapName, itemslist: []};
        }
        return containerLocType;
    }



    // color map floor tiles
    mapRoomFloorUpdate(game, map, name, roomManager, floorLayer) {
        //this.map.map.layers[idx].name has the name equal to map name for cc, d, mh, r1, r2, r3, r4, r5, r6
        // this.map.map.layers[idx].data has 46 arrays of 64 elements, if not zero then part of the floor for corresponding room
        var floors = [];
        switch (name) {
            case "cc":
                var floors = game.gameData.commandcenter.floor;
                break;
            case "mh":
                var floors = game.gameData.mainhall.floor;
                break;
            case "d":
                var floors = game.gameData.dock.floor;
                break;
            case "r1":
            case "r2":
            case "r3":
            case "r4":
            case "r5":
            case "r6":
            case "r7":
            case "r8":
            case "r9":
            case "r10":
                for (var i=0; i<roomManager.roomIdx.length; i++) {
                    if (name == roomManager.rooms[roomManager.roomIdx[i]].mapName) {
                        var floors = game.gameData.roomdef[roomManager.rooms[roomManager.roomIdx[i]].type].floor;
                    }
                }
        }
        if (floors.length > 0) {
            // find the data segment
            var dataset = [];
            for (var i = 0; i<map.layers.length; i++) {
                if (map.layers[i].name == name) {
                    dataset = map.layers[i].data;
                }
            }
            // found layer
            if (dataset.length > 0) {
                for (var i = 0; i<dataset.length; i++) {
                    for (var j = 0; j<dataset[i].length; j++) {
                        if (dataset[i][j].index > 0) {
                            map.putTile(floors[getRandomInt(0, floors.length-1)], j, i, floorLayer);
                        }
                    }
                }
            }
        }
        return map;
    }

    colorMapRooms(game, map, roomManager, floorLayer) {
        var arr = ["cc", "mh", "d", "r1", "r2", "r3", "r4", "r5", "r6","r7","r8","r9","r10"];
        for (var i=0; i< arr.length; i++) {
            map = this.mapRoomFloorUpdate(game, map, arr[i], roomManager, floorLayer);
        }
        return map;
    }


    findDoorsLayerIdx(map) {
        for (var i = 0; i<map.layers.length; i++) {
            if (map.layers[i].name == "doors") {
                return (i);
            }
        }
        return -1;
    }


}