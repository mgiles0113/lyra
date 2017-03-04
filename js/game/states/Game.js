Lyra.LyraGame = function() {

};

Lyra.LyraGame.prototype = {
	preload: function() {
	    if (this.game.newGame) {
            //this.slimeArr = []; // list of slime objects
            this.mapLayer = [];  // layers of map tilesets
            this.ingameItems = []; //all ingame items used
            this.tile_size = this.game.gameData.tile_size; //tile dimensions
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
        
        if (this.game.gameData.timer == undefined) {
            this.game.gameData.timer = new Timer(600);
        } else {
            this.game.gameData.timer = new Timer(this.game.gameData.timer.timeRemaining);
        }
        this.game.gameData.timer.initialize();
        // map.putTile(<tileNumber>, x, y )  <<< this will replace a floor tile!
        
        // this.map.tileSetImages[this.imageTagList[0]].draw(this.mapLayer[this.mapLayer.length - 1],10,10,1);
        // this.mapLayer[this.mapLayer.length - 1].debugSettings.forceFullRedraw = true;
        
        //this.map.setCollisionBetween(1, 100000, true, 'blockedLayer');
        this.map.map.setCollisionByExclusion([],true,this.mapLayer['walls']);
        
        // put a tile on the map
        // @param {Phaser.Tile|number} tile - The index of this tile to set or a Phaser.Tile object.
        // this is just an experiment to show that we can place tiles!
        //this.map.map.putTileWorldXY(63, 150, 150, 32, 32, this.mapLayer[(this.mapLayer.length-1)]);
        
        // Build map with different rooms if not already defined
        if (this.game.gameData.roomarray.length < 1) {
            // need to build the map
            this.roomManager = new RoomManager(this.game, this.map.map.objects["rooms"]);
            var mapInitializer = new MapBuilder();
            
            // color floor tiles
            // test placing some tiles
            
            this.map.map = mapInitializer.colorMapRooms(this.game, this.map.map, this.roomManager, this.mapLayer['floors']);
            
            var containerLocType = mapInitializer.placeContainersInRooms(this.game, this.roomManager);
            containerLocType = containerLocType.concat(mapInitializer.addSuppressant(this.map.map.objects["suppressant"]));
            containerLocType = containerLocType.concat(mapInitializer.addDoors(this.map.map.objects["doors"]));
            this.containerManager = new ContainerManager(this.game,  containerLocType);
            
                   //Setup Pathfinder Engine
        this.mapJSON = this.game.cache.getJSON('pathfinder_map', true).layers[2].data;
        this.pathfinder = new EasyStar.js();
        
        //Get the Walls Map Layer --> 2D Array of Tiles.
        var map_cols = this.game.gameData.mapwidth/this.tile_size;
        var map_rows = this.game.gameData.mapheight/this.tile_size;
        var grid_col = 0;
        var grid_row = 0;
        
        this.grid = [];
        
        for(grid_row = 0; grid_row < map_rows; grid_row++){
            this.grid[grid_row] = [];
            
            for(grid_col = 0; grid_col < map_cols; grid_col++){
                this.grid[grid_row][grid_col] = this.mapJSON[(grid_row *map_cols) + grid_col];
                
            }
        }
        
        for(var i = 0; i < this.containerManager.containerCount; i++){
            
            if(this.containerManager.containers[i].name == 'smallbox' || this.containerManager.containers[i].name == 'espresso'){
                if(this.containerManager.containers[i].x != undefined && this.containerManager.containers[i].y != undefined){
                       
                    var container_x = this.game.math.roundTo(this.containerManager.containers[i].x/this.tile_size, 0); 
                    var container_y = this.game.math.roundTo(this.containerManager.containers[i].y/this.tile_size, 0);
                
                    //Give Containers a gid of 1.
                    if( container_x != undefined && container_y != undefined){
                    this.grid[container_y][container_x] = 1;
                    }
                }
            }

        }
        
        this.pathfinder.setGrid(this.grid);
        this.pathfinder.setAcceptableTiles([0]);
        this.pathfinder.setIterationsPerCalculation(1000);
            
            // playerManager manages all the players on the map (crew and bandits)
            // for test purposes, set "bypass = true" variable in .addPlayers (mapInit.js file), this will hard code player locations
            var playerLocType = mapInitializer.addPlayers(this.game, this.roomManager);
            this.playerManager = new PlayerManager(this.game, playerLocType, this.pathfinder, this.tile_size);
        }
        else {  // load previous game
            this.roomManager = new RoomManager(this.game);
            var mapInitializer = new MapBuilder();

            // color floor tiles
            this.map.map = mapInitializer.colorMapRooms(this.game, this.map.map, this.roomManager,  this.mapLayer['floors']);

            this.containerManager = new ContainerManager(this.game);
            this.playerManager = new PlayerManager(this.game, null, this.pathfinder, this.tile_size);
        }
        
        this.actionManager = new ActionManager();
        
        // set world boundaries to size of the current map.   This allows sprites to be followed by the camera
        // viewable area is the size of the game
        //this.game.world.setBounds(0, 0, map_cols*32, map_rows*32);
        this.game.world.setBounds(0, 0, this.game.gameData.mapwidth*this.tile_size, this.game.gameData.mapheight*this.tile_size);
        
        // // this appears to work partially for resizing the viewable part of the game (scroll bars vertical, more of map shown horizontal)
        // // worked when the game dimensions (mapwidth, mapheigt) are set to full map size
        this.game.camera.setSize(20*this.tile_size, 20*this.tile_size);
        this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;

        //setup getting mouse input
        this.game.input.mouse.capture = true;
        
        //Create comm window.
        this.comm = new Comm(this.game, this.playerManager, this.containerManager);
        this.comm.displayPlayerInventory(0);
        
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
        
        // setup space bar control
        this.shoot = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
        this.shoot.onDown.add(this.startEmitter, this);
        this.shoot.onUp.add(this.stopEmitter, this);
        
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
        this.slimeManager = new SlimeManager(this.game, this.roomManager.slimeSpawnCoord);

        
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
	    
	    if (this.game.gameData.gameresult != "empty") {
	        this.blastOffEscapePod();
	    }
	    
        /*/ create slime spore and start slime growing(?enlarge the image of the slime?)
        // [TODO] ... for now limited to 100 slime objects, fix AI for replicate */
       //this.slimeManager.updateSlimeArr(this.game, this.mapLayer["walls"], this.containerManager, this.playerManager);
        this.slimeManager.addNewSlime(this.game);
        this.slimeManager.updateSlime(this.game, this.mapLayer["walls"], this.containerManager, this.playerManager)

        // check for overlap with containers
        this.containerManager.checkPlayerOverlap(this.game, this.playerManager.players, this.comm);

        // loops through player array, updates bandits and players
        this.playerManager.updatePlayerArray(this.game, this.mapLayer['walls'], this.mapLayer['floors'], this.map.map, this.containerManager, this.roomManager);
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
	    
	    this.roomManager.saveRooms(this.game);
	    
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
        this.actionManager.updateAction(this.game, playerIdx, this.containerManager, this.comm);
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
    
    blastOffEscapePod: function() {
        console.log(this.game.gameData.gameresult);
        this.state.remove();
        this.state.start('EndGame');
    },
    
    startEmitter: function() {
        // player can start spraying if not sleeping
        var playerIdx = this.playerManager.findSelectedNotSleepingPlayer();
        if (playerIdx >= 0) {
            this.playerManager.players[playerIdx].startItemEmitter(this.game);
        }
    },
    
    stopEmitter: function() {
        // player stops spraying but may be knocked out
        var playerIdx = this.playerManager.findSelectedPlayer();
        if (playerIdx >= 0) {
            this.playerManager.players[playerIdx].stopItemEmitter(this.game);
        }
    }
}
