Lyra.LyraGame = function() {

};

Lyra.LyraGame.prototype = {
	preload: function() {
	    if (this.game.newGame) {
            //this.slimeArr = []; // list of slime objects
            //this.players = [];  // list of players created on map
            this.mapLayer = [];  // layers of map tilesets
            //this.items = [];  // list of items created on map
            this.ingameItems = []; //all ingame items used
            this.roomArr = [];  // approx center of rooms on map
            this.containerLocType = [];
            //this.suppresantArr = [];  // locations on the map where suppresant can be placed
            
            //Map for Pathfinder
            this.game.load.json('pathfinder_map', 'assets/tilemaps/maps/reference_map.json');
            
        }
        
        this.ready = false;
        this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
		this.splash.anchor.setTo(0.5);
		this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 256, 'preloadBar');
		this.preloadBar.anchor.setTo(0.5, 0.5);
        
		// moved to PreloadLyra
		Map.loadMap(this.game, this.game.gameData.mapRef, this.game.gameData.imageTagList, this.game.gameData.imageRefList);
		
		//Door.preloadDoorImages(this.game);
		Container.preloadContainerImages(this.game);
		
		// added as example preload game specific data
        // player assets
        Player.preloadPlayer(this.game);

        //slime assets
        Slime.preloadSlime(this.game);
        
        //comm window assets
        Comm.preloadComm(this.game);
        
        //items assets
        Items.ItemImages(this.game);

   		this.load.onLoadComplete.add(this.onLoadComplete, this);
	},
	create: function() {
		this.preloadBar.cropEnabled = false;
        // setup physics engine
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
    
        //Create comm window.
        this.comm = new Comm(this.game);

        //this.game.world.scaleMode = 
        // there are other ways to do this, sets a background color for the game          
        this.game.stage.backgroundColor = '#555';

        //Create the map
        this.map = new Map();
        this.map.addMap(this.game, this.game.gameData.imageTagList);

        for (var i=0; i<this.game.gameData.mapLayerRef.length; i++) {
            this.mapLayer[this.game.gameData.mapLayerRef[i]] = this.map.map.createLayer(this.game.gameData.mapLayerRef[i]);
            //this.mapLayer[i].resizeWorld(200,200);
            this.mapLayer[this.game.gameData.mapLayerRef[i]].debugSettings.forceFullRedraw = true;
        }
    
        this.mapJSON = this.game.cache.getJSON('pathfinder_map', true).layers[2].data;
        //console.log(this.mapJSON);

        //Setup Pathfinder Engine
        this.pathfinder = new EasyStar.js();
        
        //Get the Walls Map Layer --> 2D Array.
        var map_cols = this.game.gameData.mapwidth/32;
        var map_rows = this.game.gameData.mapheight/32;
        var grid_col = 0;
        var grid_row = 0;
        
        this.grid = [];
        
        for(grid_row = 0; grid_row < map_rows; grid_row++){
            this.grid[grid_row] = [];
            
            for(grid_col = 0; grid_col < map_cols; grid_col++){
                this.grid[grid_row][grid_col] = this.mapJSON[(grid_row *map_cols) + grid_col];
                
            }
        }
        
        this.pathfinder.setGrid(this.grid);
        this.pathfinder.setAcceptableTiles([0]);
        
        //If game slows down too much, change this.
        this.pathfinder.setIterationsPerCalculation(1000);
        
        if (this.game.gameData.timer == undefined) {
            this.game.gameData.timer = new Timer(600);
        } else {
            this.game.gameData.timer = new Timer(this.game.gameData.timer.timeRemaining);
        }
        this.game.gameData.timer.initialize();
        // map.putTile(<tileNumber>, x, y )  <<< this will replace a floor tile!
        
        // this.map.tileSetImages[this.imageTagList[0]].draw(this.mapLayer[this.mapLayer.length - 1],10,10,1);
        // this.mapLayer[this.mapLayer.length - 1].debugSettings.forceFullRedraw = true;
        
        
        // add collision for walls
        // set the second parameter to > gid number in tile map for the tiles we want to collide
        //this.map.map.setCollisionBetween(1, 64*46 , true, this.mapLayer[(this.mapLayer.length-1)], false);
        
        
        //In Player Fn --> Detecting Collision everywhere, but Colliding correctly
        //this.map.setCollisionBetween(1, 100000, true, 'blockedLayer');
        this.map.map.setCollisionByExclusion([],true,this.mapLayer['walls']);
        //this.map.map.setCollision([21],false, this.mapLayer['floors']);
        
        // put a tile on the map
        // @param {Phaser.Tile|number} tile - The index of this tile to set or a Phaser.Tile object.
        // this is just an experiment to show that we can place tiles!
        //this.map.map.putTileWorldXY(63, 150, 150, 32, 32, this.mapLayer[(this.mapLayer.length-1)]);
        

        // replaced by MapBuilder methods
        // for (var i = 0; i<this.map.map.objects["rooms"].length; i++ ) {
        //     this.roomArr[this.map.map.objects["rooms"][i].name] = this.map.map.objects["rooms"][i];
        //     //[TODO] for now put a container in each room
        //     // this is replaced by distributing containers throughout rooms
        //     if (!( (this.map.map.objects["rooms"][i].name == "cc" )
        //             || (this.map.map.objects["rooms"][i].name == "p1")
        //             || (this.map.map.objects["rooms"][i].name == "p2")
        //             || (this.map.map.objects["rooms"][i].name == "p3")
        //             || (this.map.map.objects["rooms"][i].name == "p4")
        //             || (this.map.map.objects["rooms"][i].name == "e1")
        //               )) {
        //         this.containerLocType[this.containerLocType.length] = {x:this.map.map.objects["rooms"][i].x, y:this.map.map.objects["rooms"][i].y, name:"smallbox", itemslist: [new ContainerItem(0, "fuse")]};
        //         this.containerLocType[this.containerLocType.length] = {x:this.map.map.objects["rooms"][i].x - 64, y:this.map.map.objects["rooms"][i].y - 10, name:"largebox", itemslist: [new ContainerItem(0, "wrench"), new ContainerItem(0, "fuel_tank")]};
    
        //     }
        //     if (this.map.map.objects["rooms"][i].name == "e1") { this.containerLocType[this.containerLocType.length] = {x:this.map.map.objects["rooms"][i].x - 64, y:this.map.map.objects["rooms"][i].y -64, name:"escapepod", itemslist: []};}
            
        // }
        
        // [TODO] in progress building map with different rooms
        if (this.game.gameData.roomarray.length < 1) {
            // need to build the map
            this.roomManager = new RoomManager(this.game, this.map.map.objects["rooms"]);
             var mapInitializer = new MapBuilder();
             var containerLocType = mapInitializer.placeContainersInRooms(this.game, this.roomManager, this.map.map.objects["suppressant"], this.map.map.objects["doors"]);
            this.containerManager = new ContainerManager(this.game,  containerLocType);
                // playerManager manages all the players on the map (crew and bandits)
            var playerLocType = mapInitializer.addPlayers(this.game, this.roomManager);
            this.playerManager = new PlayerManager(this.game, playerLocType, this.pathfinder);
        }
        else {
            this.roomManager = new RoomManager(this.game);
             this.containerManager = new ContainerManager(this.game);
             this.playerManager = new PlayerManager(this.game, null, this.pathfinder);
        }
                
        
        // playerLocType needs the following: 
        //    isSelected : true/false
        //    characterIdx : corresponds to index in gameData character array
        //    characterType : "crew" or "bandit"
        //    inventory : array of names
        //    status : player status (walk, stuck, sleep)
        //    x : x location for character
        //    y : y location

        // replaced by MapBuilder methods
        // // if < 1, no crew defined
        // if (this.game.gameData.playerarray.length < 1) {
        //     var playerLocType = [];
        //     for (var i = 0; i< this.game.gameData.crew.length; i++) {
        //         playerLocType.push({
        //             idx : i,
        //             isSelected: false, 
        //             characterIdx: this.game.gameData.crew[i], 
        //             characterType: "crew", 
        //             inventory : this.game.gameData.characters[this.game.gameData.crew[i]].inventory,
        //             status: this.game.gameData.characters[this.game.gameData.crew[i]].status,
        //             x : this.roomArr["cc"].x + i*50,
        //             y : this.roomArr["cc"].y + i*50
        //         })
        //     }
        //     for (var i = 0; i< this.game.gameData.bandit.length; i++) {
        //         playerLocType.push({
        //             idx : i + this.game.gameData.crew.length,
        //             isSelected: false, 
        //             characterIdx: this.game.gameData.bandit[i], 
        //             characterType: "bandit", 
        //             inventory : this.game.gameData.characters[this.game.gameData.bandit[i]].inventory,
        //             status: this.game.gameData.characters[this.game.gameData.bandit[i]].status,
        //             x : this.roomArr["d"].x + i*50 + 50,
        //             y : this.roomArr["d"].y + i*48
        //         })
        //     }

        //     playerLocType[0].isSelected = true;
        // }
        // // playerManager manages all the players on the map (crew and bandits)
        // this.playerManager = new PlayerManager(this.game, playerLocType, this.pathfinder);

        
        this.actionManager = new ActionManager();
        
        // for (var i = 0; i<this.map.map.objects["suppressant"].length; i++ ) {
        //     //this.suppresantArr[this.map.map.objects["suppressant"][i].name] = this.map.map.objects["suppressant"][i];
        //     //Create suppressant items
        //     var containeritem =  new ContainerItem(0, "suppresant");
        //     this.containerLocType[this.containerLocType.length] = {x:this.map.map.objects["suppressant"][i].x, y:this.map.map.objects["suppressant"][i].y, name:"transparent", itemslist: [containeritem]};
        // }
        
        // for (var i=0; i<this.map.map.objects["doors"].length; i++) {
        //     this.containerLocType[this.containerLocType.length] = {x:this.map.map.objects["doors"][i].x, y:this.map.map.objects["doors"][i].y, name:"doors", itemslist: []};
        // }
        
        // // create containers for each of the items
        // this.containerManager = new ContainerManager(this.game,  this.containerLocType);

        
        //var cc = this.map.map.objects["rooms"];
        
        // set world boundaries to size of the current map.   This allows sprites to be followed by the camera
        // viewable area is the size of the game
        this.game.world.setBounds(0, 0, 64*32, 46*32);
        
        // // this appears to work partially for resizing the viewable part of the game (scroll bars vertical, more of map shown horizontal)
        // // worked when the game dimensions (mapwidth, mapheigt) are set to full map size
        this.game.camera.setSize(20*32, 20*32);
        this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;

        // when the game dimensions (mapwidth, mapheigt) are set to some smaller dimension than the map
        // the display is scaled to fit the full size of the defined canvas
        //this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        
        // //Create all in game items.
        // this.ingameItems = new Items();

        // setup getting keyboard input
        this.cursors = this.game.input.keyboard.createCursorKeys();
        
        //setup getting mouse input
        this.game.input.mouse.capture = true;
        
        // options overlay container
        
        this.optionsOverlay = $("<div id='optionsOverlay'></div>");
        this.optionsOverlay.css("width", "100vw");
        this.optionsOverlay.css("height", "100vh");
        this.optionsOverlay.css("backgroundColor", "rgba(0, 0, 0, 0.5)");
        this.optionsOverlay.css("position", "absolute");
        this.optionsOverlay.css("top", "0px");
        this.optionsOverlay.css("visibility", "hidden");
        $("body").append(this.optionsOverlay);
        
        this.overlayVisible = 0;
        $(document).keyup(function(e) {
            if (e.keyCode == 27) { // escape key maps to keycode `27`
                if (this.overlayVisible === 0) {
                    $("#optionsOverlay").css("visibility", "visible");
                    this.overlayVisible = 1;
                } else {
                    $("#optionsOverlay").css("visibility", "hidden");
                    this.overlayVisible = 0;
                }
            }
        });
        
        // setup control of the "z" key
        this.saveKey = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
        this.saveKey.onDown.add(this.saveGame, this);
        
        // setup action on object "e" key
        this.actionKey = this.game.input.keyboard.addKey(Phaser.Keyboard.E);
        this.actionKey.onDown.add(this.actionRequest, this);

        // setup action on object "w" key
        this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.upKey.onDown.add(this.upRequest, this);
        this.upKey.onUp.add(this.upStopRequest, this);

        // setup action on object "a" key
        this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.leftKey.onDown.add(this.leftRequest, this);
        this.leftKey.onUp.add(this.leftStopRequest, this);


        // setup action on object "s" key
        this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.downKey.onDown.add(this.downRequest, this);
        this.downKey.onUp.add(this.downStopRequest, this);


        // setup action on object "d" key
        this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.rightKey.onDown.add(this.rightRequest, this);
        this.rightKey.onUp.add(this.rightStopRequest, this);
        
        //setup point and click
        this.ptclick = this.game.input.mousePointer.leftButton;
        this.ptclick.onDown.add(this.ptclickRequest, this);


        // generate slime manager to control the slime
        // [TODO] move building this array to MapBuilder
        var spawnCoord = [[ this.roomManager.rooms[this.roomManager.mainhallIdx].center_x + 50, this.roomManager.rooms[this.roomManager.mainhallIdx].center_y + 50]];
        for (var j = 0; j < this.roomManager.roomIdx.length ; j++) {
            spawnCoord.push( [ this.roomManager.rooms[this.roomManager.roomIdx[j]].center_x + 50, this.roomManager.rooms[this.roomManager.roomIdx[j]].center_y + 50])
        }
        this.slimeManager = new SlimeManager(this.game, spawnCoord);
	},
	update: function() {
	    if (this.game.gameData.timer.timeUp) {
	        console.log('time up!');
	        this.game.gameData.gameresult = "timeout";
	        this.state.remove();
	        this.state.start('EndGame');
	    }
	    
	    if (this.playerManager.isAnyCrewAwake()) {
	        // there are no awake players
	        console.log("there are no crew members awake");
	        this.game.gameData.gameresult = "crewstuck";
	        this.state.remove();
	        this.state.start('EndGame');
	    }
	    
        /*/ create slime spore and start slime growing(?enlarge the image of the slime?)
        // [TODO] ... for now limited to 100 slime objects, fix AI for replicate */
       //this.slimeManager.updateSlimeArr(this.game, this.mapLayer["walls"], this.containerManager, this.playerManager);
        this.slimeManager.addNewSlime(this.game);
        this.slimeManager.updateSlime(this.game, this.mapLayer["walls"], this.containerManager, this.playerManager)

        //Comm. Window--> Switch btw players
        // [TODO] consider passing this.playerManager and using array of indices "playerManager.crew" to select from playerManager.players
        this.comm.switchPlayer(this.playerManager.players, this.game);
        
        //Update Comm Window Inventory
        //this.comm.displayInventory(this.playerManager.players[0], this.game, this.ingameItems);

        // check for overlap with containers
        this.containerManager.checkPlayerOverlap(this.game, this.playerManager.players);

        // update player - moved to playerManager
        // for (var j=0; j < this.playerManager.players.length; j++)
        // { 
        //     this.playerManager.players[j].updatePlayer(this.game, this.cursors, this.mapLayer['walls'], this.mapLayer['floors']);
        // }
        this.playerManager.updatePlayerArray(this.game, this.cursors, this.mapLayer['walls'], this.mapLayer['floors']);
        
        
	},
    render: function() {
        // render information about display screen (copied off phaser example viewport.js)
         viewportText(this.game);
        
        // [TODO] depending on how players are generated, this may be one or more
        for (var i=0; i < this.playerManager.players.length; i++)
        { 
            this.playerManager.players[i].sprite.bringToTop();
            if (this.playerManager.players[i].isSelected) {
                this.playerManager.players[i].cameraFollow(this.game);
                
            }
            this.game.debug.body(this.playerManager.players[i]);
        }
    },
   	onLoadComplete: function() {
		this.ready = true;
	},
	saveGame: function() {
	    console.log("Z pressed");
	    
	    this.game.pause;
	    console.log("going to save the gameData");
	    
        this.playerManager.savePlayerManager(this.game);

	    this.slimeManager.saveSlimeManager(this.game);
	    
	    this.containerManager.saveContainerManager(this.game);
	    
        var tp = new TestPost();
        tp.send(JSON.stringify(this.game.gameData), this.game.userPreference.data.activeGame);
	    this.game.resume;
	    
	},
	
    actionRequest: function() {
        // find the selected player
        //console.log("ready to take action from keyboard: E");
        var playerIdx = this.playerManager.findSelectedPlayer();
        this.actionManager.updateAction(this.game, playerIdx, this.containerManager);
    },
    
    
    ptclickRequest: function() {
        //find the selected player
        var playerIdx = this.playerManager.findSelectedAwakePlayer();
        
        // if selected player is not awake, findSelectedAwakePlayer returns -1
        if (playerIdx >= 0) {
        //Grab
            this.playerManager.players[playerIdx].ptClick(this.game, this.pathfinder);
        }
    },
    
    
    upRequest: function() {
        // find the selected player
        //console.log("ready to take action from keyboard: W");
        var playerIdx = this.playerManager.findSelectedAwakePlayer();
        // if selected player is not awake, findSelectedAwakePlayer returns -1
        if (playerIdx >= 0) {
            this.playerManager.players[playerIdx].goUp(this.game);
        }
    },
    
    downRequest: function() {
        // find the selected player
        //console.log("ready to take action from keyboard: S");
        var playerIdx = this.playerManager.findSelectedAwakePlayer();
        // if selected player is not awake, findSelectedAwakePlayer returns -1
        if (playerIdx >= 0) {
            this.playerManager.players[playerIdx].goDown(this.game);
        }
    },
    
    leftRequest: function() {
        // find the selected player
        //console.log("ready to take action from keyboard: A");
        var playerIdx = this.playerManager.findSelectedAwakePlayer();
        // if selected player is not awake, findSelectedAwakePlayer returns -1
        if (playerIdx >= 0) {
            this.playerManager.players[playerIdx].goLeft(this.game);
        }
    },
    
    rightRequest: function() {
        // find the selected player
        //console.log("ready to take action from keyboard: D");
        var playerIdx = this.playerManager.findSelectedAwakePlayer();
        // if selected player is not awake, findSelectedAwakePlayer returns -1
        if (playerIdx >= 0) {
            this.playerManager.players[playerIdx].goRight(this.game);
        }
    },

    upStopRequest: function() {
        // find the selected player
        //console.log("ready to take action from keyboard: W");
        var playerIdx = this.playerManager.findSelectedAwakePlayer();
        // if selected player is not awake, findSelectedAwakePlayer returns -1
        if (playerIdx >= 0) {
            this.playerManager.players[playerIdx].stopUp(this.game);
        }
    },
    
    downStopRequest: function() {
        // find the selected player
        //console.log("ready to take action from keyboard: S");
        var playerIdx = this.playerManager.findSelectedAwakePlayer();
        // if selected player is not awake, findSelectedAwakePlayer returns -1
        if (playerIdx >= 0) {
            this.playerManager.players[playerIdx].stopDown(this.game);
        }
    },
    
    leftStopRequest: function() {
        // find the selected player
        //console.log("ready to take action from keyboard: A");
        var playerIdx = this.playerManager.findSelectedAwakePlayer();
        // if selected player is not awake, findSelectedAwakePlayer returns -1
        if (playerIdx >= 0) {
            this.playerManager.players[playerIdx].stopLeft(this.game);
        }
    },
    
    rightStopRequest: function() {
        // find the selected player
        //console.log("ready to take action from keyboard: D");
        var playerIdx = this.playerManager.findSelectedAwakePlayer();
        // if selected player is not awake, findSelectedAwakePlayer returns -1
        if (playerIdx >= 0) {
            this.playerManager.players[playerIdx].stopRight(this.game);
        }
    },

}
