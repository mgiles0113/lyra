class Room {
    constructor(roomData) {
        this.type = roomData.type;
        this.name = roomData.name;
        this.displayName = roomData.displayName;
        this.mapName = roomData.mapName;
        this.center_x = roomData.center_x;
        this.center_y = roomData.center_y;
    }
    
}

Room.rawData = function(idx, mapName, type, displayName, center_x, center_y) {
    var roomData = {
        idx : idx,
        mapName : mapName,
        type : type,
        displayName : displayName,
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
        if (game.gameData.roomarray == undefined || game.gameData.roomarray.length < 1) {
            // define the command center
            this.rooms[0] = new Room(Room.rawData(0, "cc", "commandcenter", "Command Center", mapRooms["cc"].x, mapRooms["cc"].y));
            
            // define the docking bay
            this.rooms[1] = new Room(Room.rawData(1, "d", "dockingbay", "Docking Bay", mapRooms["d"].x, mapRooms["d"].y));
            
            // define the main hall
            this.rooms[2] = new Room(Room.rawData(2, "mh", "mainhall", "Main Hall", mapRooms["mh"].x, mapRooms["mh"].y));
            
            // find the generic rooms
            var iterator = mapRooms.keys();
            var mapRoomsArr = []; 
            for (var i = 0; i<iterator.length; i++) {
                if (iterator[i].charAt(0) == "r") {
                    mapRoomsArr.push(mapRooms[iterator[i]]);
                }
            }
            
            // allocate the rooms by defining array of indices into game.gameData.roomdef for rooms that need to be defined
            var roomTypes = this.createRoomDistribution(game.gameData.roomdef, mapRoomsArr.length);
            
            for (var i=0; i <  mapRoomsArr.length; i++) {
                var roomData = Room.rawData(i, mapRoomsArr[i].name,  game.gameData.roomdef[roomTypes[i]].name, 
                                game.gameData.roomdef[roomTypes[i]].displayName, mapRoomsArr[i].x, mapRoomsArr[i].y);
                this.rooms[i+3] =  new Room(roomData);
                this.roomIdx.push(i+3);
            }
            
            // add escape pod rooms and passages to the room array because we may need them later
            
            
        }
        else {
            for (var i=0; i < game.gameData.roomarray.length; i++) {
                this.rooms[i] = new Room(game.gameData.roomarray[i]);
                if (this.rooms[i].mapName.charAt(0) == "r") {
                    this.roomIdx.push(i);
                }
            }
        }
    }
    
    createRoomDistribution(roomdef, arrlen) {
        // there are only roomdef.length rooms defined
        // there are arrlen spaces on the map for rooms
        // distribute all rooms at least once, reuse rooms if needed
        var indexArr = [];
        
        // this loop insures one of each type room
        for (var i=0; i< roomdef.length; i++) {
            indexArr.push(i);
            // this is just in case there are more rooms defined then the allowed on map
            // the more important rooms need to be defined first
            if (indexArr.length >= arrlen) {
                break;
            }
        }
        
        // add additional indices if more rooms on map then room types defined
        while (indexArr.length < arrlen) {
            indexArr.push(getRandomInt(0, roomdef.length));
        }
        
        return (shuffleArr(indexArr));
    }

    
}
