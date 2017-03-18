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
            this.game.load.json('pathfinder_map', this.game.gameData.mapRef);
            
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
        
        this.game.lyraSound.stop();
        if (this.game.userPreference.data.sound === "true") {
            this.game.lyraSound.play('gameMusic', true, .1);
        }
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
        
        // handle for lyre data
        this.lyrelocator = new LyreLocator();    
        
        // Build map with different rooms if not already defined
        if (this.game.gameData.roomarray.length < 1) {
            // need to build the map

            this.roomManager = new RoomManager(this.game, this.map.map.objects["rooms"]);
            var mapInitializer = new MapBuilder();
            
            // color floor tiles
            // test placing some tiles
            
            this.map.map = mapInitializer.colorMapRooms(this.game, this.map.map, this.roomManager, this.mapLayer['floors']);
            
            var containerLocType = mapInitializer.placeContainersInRooms(this.game, this.roomManager, this.lyrelocator);
            containerLocType = containerLocType.concat(mapInitializer.addSuppressant(this.game, this.map.map.objects["suppressant"]));
            containerLocType = containerLocType.concat(mapInitializer.addDoors(this.map.map.objects["doors"]));
            this.containerManager = new ContainerManager(this.game,  containerLocType, this.lyrelocator);
            
            
            
            
                //Setup Pathfinder Engine Grid
                this.grid = new Grid(this.game);
                this.grid.addContainerCollision(this.game, this.containerManager);
            
            // playerManager manages all the players on the map (crew and bandits)
            // for test purposes, set "bypass = true" variable in .addPlayers (mapInit.js file), this will hard code player locations
            var playerLocType = mapInitializer.addPlayers(this.game, this.roomManager);
            this.playerManager = new PlayerManager(this.game, playerLocType, this.grid.grid, this.containerManager);
        }
        else {  // load previous game
            this.roomManager = new RoomManager(this.game);
            var mapInitializer = new MapBuilder();

            // color floor tiles
            this.map.map = mapInitializer.colorMapRooms(this.game, this.map.map, this.roomManager,  this.mapLayer['floors']);

            this.containerManager = new ContainerManager(this.game, null , this.lyrelocator);
            //Setup Pathfinder Engine Grid
            this.grid = new Grid(this.game);
            this.grid.addContainerCollision(this.game, this.containerManager);

            this.playerManager = new PlayerManager(this.game, null, this.grid.grid, this.containerManager);
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
        this.comm.resetCommunicatorInventory();
        
        // menu options overlay container
        this.menuOverlay = $("<div id='menu-overlay'></div>");
        this.menuOverlay.css('display', 'none')
               .css('position', 'absolute')
               .css('top', '0')
               .css('left', '0')
               .css('backgroundColor', 'rgba(0, 0, 0, .6)')
               .css('textAlign', 'center')
               .css('paddingTop', $(window).height() * .2)
               .css('width', '100%')
               .css('color', 'white')
               .css('height', '100%');
        var optionsList = $("<ul id='options-list'></ul>");
        optionsList.css('listStyle', 'none')
                   .append("<li><button class='menu-overlay-button' id='option-save'>" + this.game.languageText.save[this.game.userPreference.data.languageChoice] + "</button></li>")
                   .append("<li><button class='menu-overlay-button' id='option-toggle-sound'>" + this.game.languageText.togglesound[this.game.userPreference.data.languageChoice] + "</button></li>")
                   .append("<li><button class='menu-overlay-button' id='option-return-to-main-menu'>" + this.game.languageText.returntomainmenu[this.game.userPreference.data.languageChoice] + "</button></li>");
        this.menuOverlay.append("<h1>Options</h1>")
                        .append(optionsList);
        
        $("#container-inventory-title").html(this.game.languageText.containerinventory[this.game.userPreference.data.languageChoice]);
        $("#player-inventory-title").html(this.game.languageText.playerinventory[this.game.userPreference.data.languageChoice]);
        $("#oxygen-title").html(this.game.languageText.oxygen[this.game.userPreference.data.languageChoice]);
        $("#player-equipped-title").html(this.game.languageText.equipped[this.game.userPreference.data.languageChoice]);
        $("#player-selector-title").html(this.game.languageText.playercontrol[this.game.userPreference.data.languageChoice]);
        
        $("body").append(this.menuOverlay);
        var self = this;
        this.menuOverlayButtons = {
            "save" : $("#option-save"),
            "sound" : $("#option-toggle-sound"),
            "exit" : $("#option-return-to-main-menu")
        };
        
        this.menuOverlayButtons.save.click(function() {
            self.saveGame();
        });
        this.menuOverlayButtons.sound.click(function() {
            self.game.userPreference.toggleSound(self.game.lyraSound);
            
            if (self.game.userPreference.data.sound === 'true') {
                self.game.lyraSound.play('gameMusic', true, .1);
            }
        });
        this.menuOverlayButtons.exit.click(function() {
            self.menuOverlay.css('display', 'none');
            self.nextState('MainMenu', '');
        });
        
        // display/hide menu overlay
        this.menu = this.game.input.keyboard.addKey(Phaser.KeyCode.ESC);
        this.menu.onDown.add(this.toggleMenuOverlay, this);
        this.menu2 = this.game.input.keyboard.addKey(Phaser.KeyCode.M);
        this.menu2.onDown.add(this.toggleMenuOverlay, this);
        
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
	nextState: function(newState, gameResult) {
	    // log the game result if requested (no game result for return to main menu)
	    if (gameResult) {
	        this.game.gameData.gameresult = gameResult;    
	    }
	    
	    // remove click events for options overlay
	    this.menuOverlayButtons.save.unbind('click');
	    this.menuOverlayButtons.sound.unbind('click');
	    this.menuOverlayButtons.exit.unbind('click');
	    
	    // stop timer interval
	    clearInterval(this.game.gameData.timer.loopInterval);
	    
	    // clean up communicator for next run of game
	    this.comm.destroyClickEvents();
	    $("#communicator-card").css('visibility', 'hidden');
	    
	    // remove elements from game state
	    this.menuOverlay.remove();
	    this.state.remove();
	    
	    // launch requested state (end game or main menu)
	    this.state.start(newState);
	},
	update: function() {
	    if (this.game.gameData.timer.timeUp) {
	        console.log('time up!');
	        this.nextState('EndGame', 'timeout');
	    }
	    
	    if (this.playerManager.isAnyCrewAwake()) {
	        // there are no awake players
	        console.log("there are no crew members awake");
	        this.nextState('EndGame', 'crewstuck');
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
        this.containerManager.checkPlayerOverlap(this.game, this.playerManager.players, this.comm, this.lyrelocator);

        // loops through player array, updates bandits and players
        this.playerManager.updatePlayerArray(this.game, this.mapLayer['walls'], this.mapLayer['floors'], this.map.map, this.containerManager, this.roomManager, this.lyrelocator);
	},
    render: function() {
        // render information about display screen (copied off phaser example viewport.js)
         //viewportText(this.game);
        
        // [TODO] depending on how players are generated, this may be one or more
        for (var i=0; i < this.playerManager.players.length; i++)
        { 
            if (this.playerManager.players[i].sprite.customParams.status != "sleep") 
            {
                this.playerManager.players[i].sprite.bringToTop();
            }
            if (this.playerManager.players[i].isSelected) {
                this.playerManager.players[i].cameraFollow(this.game);
            }
            this.game.debug.body(this.playerManager.players[i]);
        }
    },
    toggleMenuOverlay: function() {
        if (this.menuOverlay.css('display') === 'none') {
            this.menuOverlay.css('display', 'inherit');
        } else {
            this.menuOverlay.css('display', 'none');
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
	    
        this.playerManager.savePlayerManager(this.game, this.lyrelocator);

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
            this.playerManager.players[playerIdx].ptClick(this.game, this.grid.grid);
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
        this.nextState('EndGame', '');
    },
    
    startEmitter: function() {
        // player can start spraying if not sleeping
        var playerIdx = this.playerManager.findSelectedNotSleepingPlayer();
        if (playerIdx >= 0) {
            this.playerManager.players[playerIdx].startItemEmitter(this.game, this.comm);
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
