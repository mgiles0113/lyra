class Room {
    constructor(roomData) {
        this.type = roomData.type;
        this.mapName = roomData.mapName;
        this.center_x = roomData.center_x;
        this.center_y = roomData.center_y;
    }
    
    saveRoom() {
        var savedRoom = {
            type: this.type,
            name: this.name,
            mapName: this.mapName,
            center_x: this.center_x,
            center_y: this.center_y
        };
        return savedRoom;
    }
    
    
}

Room.rawData = function(idx, mapName, type, center_x, center_y) {
    var roomData = {
        idx : idx,
        mapName : mapName,
        type : type,
        center_x : center_x,
        center_y : center_y
    };
    return roomData;
}

class RoomManager {
    constructor(game, mapRooms) {
        this.rooms = [];
        // array of indices into the randomly distributed rooms
        this.roomIdx = [];
        // array of indices into the passages
        this.passageIdx = []; 
        // array of indices into the escape pods
        this.escapepodIdx = [];
        // find the rooms corresponding to these types
        this.commandcenterIdx = 0;
        this.slimeSpawnCoord = [];
        this.dockIdx = 1;
        this.mainhallIdx = 2;
        var genericRoomCount = 0;
        if (game.gameData.roomarray == undefined || game.gameData.roomarray.length < 1) {
            // define the command center, main hall and docking bay
            for (var i = 0; i<mapRooms.length; i++) {
                if (mapRooms[i].name == "cc") {
                    this.rooms[0] = new Room(Room.rawData(0, mapRooms[i].name, "commandcenter", mapRooms[i].x, mapRooms[i].y));
                }
                if (mapRooms[i].name == "d") {
                    this.rooms[1] = new Room(Room.rawData(1, mapRooms[i].name, "dock", mapRooms[i].x, mapRooms[i].y));
                }
                if (mapRooms[i].name == "mh") {
                    this.rooms[2] = new Room(Room.rawData(2, mapRooms[i].name, "mainhall", mapRooms[i].x, mapRooms[i].y));
                    this.slimeSpawnCoord.push([this.rooms[2].center_x + 50, this.rooms[2].center_y + 50]);
                }
                if (mapRooms[i].name.charAt(0) == "r") {
                    genericRoomCount += 1;
                }
            }

            // get indices into room def corresponding to each room in map (random allocation to map)
            // roomTypes is array of indices guaranteed to be length of genericRoomCount
            var roomTypes = this.createRoomDistribution(game.gameData.roomdef, genericRoomCount);

            // allocate the generic rooms, assign escapepod and passage rooms
            for (var i = 0; i<mapRooms.length; i++) {
                if (mapRooms[i].name.charAt(0) == "r") {
                    var roomData = Room.rawData(i, mapRooms[i].name,  roomTypes[this.roomIdx.length].name, 
                                mapRooms[i].x, mapRooms[i].y);
                    this.roomIdx.push(this.rooms.length);
                    this.rooms[this.rooms.length] =  new Room(roomData);
                    this.slimeSpawnCoord.push([this.rooms[this.rooms.length-1].center_x + 50, this.rooms[this.rooms.length-1].center_y + 50]);
                }
                if (mapRooms[i].name.charAt(0) == "e") {
                    var roomData = Room.rawData(i, mapRooms[i].name,  "escapepod", 
                                 mapRooms[i].x,  mapRooms[i].y);
                    this.escapepodIdx.push(this.rooms.length);       
                    this.rooms[this.rooms.length] =  new Room(roomData);

                }
                if (mapRooms[i].name.charAt(0) == "p") {
                    var roomData = Room.rawData(i, mapRooms[i].name,  "passage", 
                                 mapRooms[i].x,  mapRooms[i].y);
                    this.passageIdx.push(this.rooms.length);       
                    this.rooms[this.rooms.length] =  new Room(roomData);
                }
            }
        }
        else {
            for (var i=0; i < game.gameData.roomarray.length; i++) {
                // expecting "cc" to be index 0, "d" to be index 1, "mh" to be index 2
                this.rooms[i] = new Room(game.gameData.roomarray[i]);
                if (this.rooms[i].mapName.charAt(0) == "r") {
                    this.roomIdx.push(i);
                    this.slimeSpawnCoord.push([this.rooms[i].center_x + 50, this.rooms[i].center_y + 50]);
                }
                if (this.rooms[i].mapName.charAt(0) == "e") {
                    this.escapepodIdx.push(i);
                }
                if (this.rooms[i].mapName.charAt(0) == "p") {
                    this.passageIdx.push(i);
                }
                if (this.rooms[i].mapName.charAt(0) == "c") {
                    this.commandcenterIdx = i;
                }
                if (this.rooms[i].mapName.charAt(0) == "d") {
                    this.dockIdx = i;
                }
                if (this.rooms[i].mapName.charAt(0) == "m") {
                    this.mainhallIdx = i;
                    this.slimeSpawnCoord.push([this.rooms[i].center_x + 50, this.rooms[i].center_y + 50]);
                }
            }
        }
    }
    
    createRoomDistribution(roomdef, arrlen) {
        // there are only roomdef.length rooms defined
        // there are arrlen spaces on the map for rooms
        // distribute all rooms at least once, reuse rooms if needed
        var indexArr = [];
        
        var iterator = Object.keys(roomdef);
        
        // this loop insures one of each type room
        for (var i=0; i< iterator.length; i++) {
            indexArr.push(roomdef[iterator[i]]);
            // this is just in case there are more rooms defined then the allowed on map
            // the more important rooms need to be defined first
            if (indexArr.length >= arrlen) {
                break;
            }
        }
        
        // add additional indices if more rooms on map then room types defined
        while (indexArr.length < arrlen) {
            indexArr.push(roomdef[iterator[getRandomInt(0, iterator.length)]]);
        }
        
        return (shuffleArr(indexArr));
    }

   saveRooms(game) {
        var savedRoomsArr = []
        for (var i=0; i<this.rooms.length; i++) {
            savedRoomsArr[i] = this.rooms[i].saveRoom();
        }
        game.gameData.roomarray = savedRoomsArr;
    }
    
}
