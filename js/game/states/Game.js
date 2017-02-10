Lyra.LyraGame = function() {

};

Lyra.LyraGame.prototype = {
	preload: function() {
	    if (this.game.newGame) {
            this.slimeArr = []; // list of slime objects
            this.players = [];  // list of players created on map
            this.mapLayer = [];  // layers of map tilesets
            this.items = [];  // list of items created on map
            this.ingameItems = []; //all ingame items used
            this.roomArr = [];  // approx center of rooms on map
            this.suppresantArr = [];  // locations on the map where suppresant can be placed
        }
        
        this.ready = false;
		this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 256, 'preloadBar');
		this.preloadBar.anchor.setTo(0.5, 0.5);

		// moved to PreloadLyra
		Map.loadMap(this.game, this.game.gameData.mapRef, this.game.gameData.imageTagList, this.game.gameData.imageRefList);
		
		Door.preloadDoorImages(this.game);
		
		// added as example preload game specific data
        // player assets
        Player.preloadPlayer(this.game);

        //slime assets
        Slime.preloadSlime(this.game);
        
        //comm window assets
        Comm.preloadComm(this.game);
        
        //items assets
        Items.preloadItems(this.game);

   		this.load.onLoadComplete.add(this.onLoadComplete, this);
	},
	create: function() {
		this.preloadBar.cropEnabled = false;
        // setup physics engine
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
    
        this.game.world.scaleMode = 
        // there are other ways to do this, sets a background color for the game          
        this.game.stage.backgroundColor = '#555';

        // // create the map
        this.map = new Map();
        this.map.addMap(this.game, this.game.gameData.imageTagList);

        for (var i=0; i<this.game.gameData.mapLayerRef.length; i++) {
            this.mapLayer[this.game.gameData.mapLayerRef[i]] = this.map.map.createLayer(this.game.gameData.mapLayerRef[i]);
            //this.mapLayer[i].resizeWorld(200,200);
            this.mapLayer[this.game.gameData.mapLayerRef[i]].debugSettings.forceFullRedraw = true;
        }
        
        // this.map.tileSetImages[this.imageTagList[0]].draw(this.mapLayer[this.mapLayer.length - 1],10,10,1);
        // this.mapLayer[this.mapLayer.length - 1].debugSettings.forceFullRedraw = true;
        
        
        // add collision for walls
        // set the second parameter to > gid number in tile map for the tiles we want to collide
        //this.map.map.setCollisionBetween(1, 64*46 , true, this.mapLayer[(this.mapLayer.length-1)], false);
        
        
        //In Player Fn --> Detecting Collision everywhere, but Colliding correctly
        //this.map.setCollisionBetween(1, 100000, true, 'blockedLayer');
        this.map.map.setCollisionByExclusion([],true,this.mapLayer['walls']);
        //this.map.map.setCollision([21],false, this.mapLayer['floors']);
        
        //Set up Collision for Doors
        //this.map.map.setCollisionByExclusion([0], true, this.mapLayer['doors']);
        
        // put a tile on the map
        // @param {Phaser.Tile|number} tile - The index of this tile to set or a Phaser.Tile object.
        // this is just an experiment to show that we can place tiles!
        //this.map.map.putTileWorldXY(63, 150, 150, 32, 32, this.mapLayer[(this.mapLayer.length-1)]);
        
        
        for (var i = 0; i<this.map.map.objects["rooms"].length; i++ ) {
            this.roomArr[this.map.map.objects["rooms"][i].name] = this.map.map.objects["rooms"][i];
        }
        
        for (var i = 0; i< this.game.gameData.crew.length; i++) {
            var xpos = this.game.gameData.characters[this.game.gameData.crew[i]].x;
            var ypos = this.game.gameData.characters[this.game.gameData.crew[i]].y;
            //[TODO] place holder to put players slightly offset on game in cc
            if (xpos == null) {
                xpos = this.roomArr["cc"].x + i*50;
            }
            if (ypos == null) {
                ypos = this.roomArr["cc"].y + i*50;
            }
            //Create players
            this.players[i] = new Player(this.game, xpos, ypos, i);
            
        }
        
        this.doorManager = new DoorManager(this.game, this.map.map.objects["doors"]);
        this.actionManager = new ActionManager();
        
        for (var i = 0; i<this.map.map.objects["suppressant"].length; i++ ) {
            this.suppresantArr[this.map.map.objects["suppressant"][i].name] = this.map.map.objects["suppressant"][i];
            //Create suppressant items
            this.items[i] = new Items();
            this.items[i].addItem(this.game,"suppresant", this.suppresantArr[this.map.map.objects["suppressant"][i].name].x+16, this.suppresantArr[this.map.map.objects["suppressant"][i].name].y+16);
        }
        
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

        
        //Create comm window.
        this.comm = new Comm(this.game);
        
        //Create all in game items.
        this.ingameItems = new Items();

        // setup getting keyboard input
        this.cursors = this.game.input.keyboard.createCursorKeys();
        
        //setup getting mouse input
        this.game.input.mouse.capture = true;
        
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



        // generate slime manager to control the slime
        var slimespore = getRandomInt(1, 7);
        if (slimespore == 7) {
            this.slimeManager = new SlimeManager(this.game, this.roomArr["mh"].x, this.roomArr["mh"].y);
        }
        else {
            this.slimeManager = new SlimeManager(this.game, this.roomArr["r" + slimespore].x, this.roomArr["r" + slimespore].y);
        }
	},
	update: function() {
	    
        /*/ create slime spore and start slime growing(?enlarge the image of the slime?)
        // [TODO] ... for now limited to 100 slime objects, fix AI for replicate */
       this.slimeManager.updateSlimeArr(this.game, this.mapLayer["walls"]);

        /*  comment out checking for slime overlap with players */
        // [TODO] make slime items into a group
        // for (var i=0; i<this.slimeManager.slimeCounter; i++) {
        //     // this.slimeArr[i].slimesprite.animations.play(this.slimeArr[i].animation);
        //     for (var j=0; j < this.players.length; j++)
        //     { 
        //         if (this.game.physics.arcade.overlap(this.players[j].sprite, this.slimeManager.slimeArr[i].slimesprite)) {
        //             this.players[j].stuckInSlimeSignal.dispatch(this.players[j].sprite, this.slimeManager.slimeArr[i].slimesprite);
        //         }
        //     }
        // } 

        //Comm. Window--> Switch btw players
        this.comm.switchPlayer(this.players, this.game);
        
        //Update Comm Window Inventory
        this.comm.displayInventory(this.players[0], this.game, this.ingameItems);

        // check for overlap with doors
        this.doorManager.checkPlayerOverlap (this.game, this.players)

        // update player
        for (var j=0; j < this.players.length; j++)
        { 
            this.players[j].updatePlayer(this.game, this.cursors, this.mapLayer['walls'], this.mapLayer['floors'], this.doorManager);
        }
	},
    render: function() {
        // render information about display screen (copied off phaser example viewport.js)
         viewportText(this.game);
        
        // [TODO] depending on how players are generated, this may be one or more
        for (var i=0; i < this.players.length; i++)
        { 
            this.players[i].sprite.bringToTop();
            if (this.players[i].isSelected) {
                this.players[i].cameraFollow(this.game);
                
            }
            this.game.debug.body(this.players[i]);
        }
    },
   	onLoadComplete: function() {
		this.ready = true;
	},
	saveGame: function() {
	    console.log("Z pressed");
	    
	    this.game.pause;
	    console.log("going to save the gameData");
	    
	    for (var i=0; i < this.players.length; i++) {
	        this.players[i].savePlayerData(this.game, i);
	    }
	    
	    this.slimeManager.saveSlimeManager(this.game);
	    
	    this.doorManager.saveDoorManager(this.game);
	    
        var tp = new TestPost();
        tp.send(JSON.stringify(this.game.gameData));
	    this.game.resume;
	    
	},
    actionRequest: function() {
        // find the selected player
        console.log("ready to take action from keyboard: E");
        var playerIdx = 0;
        for (var i=0; i< this.players.length; i++) {
            if (this.players[i].isSelected) {
                playerIdx = i;
            }
        }
        this.actionManager.updateAction(this.game, playerIdx, this.doorManager);
    },

    upRequest: function() {
        // find the selected player
        console.log("ready to take action from keyboard: W");
        var playerIdx = 0;
        for (var i=0; i< this.players.length; i++) {
            if (this.players[i].isSelected) {
                playerIdx = i;
            }
        }
        this.players[playerIdx].goUp(this.game);
    },
    
    downRequest: function() {
        // find the selected player
        console.log("ready to take action from keyboard: S");
        var playerIdx = 0;
        for (var i=0; i< this.players.length; i++) {
            if (this.players[i].isSelected) {
                playerIdx = i;
            }
        }
        this.players[playerIdx].goDown(this.game);
    },
    
    leftRequest: function() {
        // find the selected player
        console.log("ready to take action from keyboard: A");
        var playerIdx = 0;
        for (var i=0; i< this.players.length; i++) {
            if (this.players[i].isSelected) {
                playerIdx = i;
            }
        }
        this.players[playerIdx].goLeft(this.game);
    },
    
    rightRequest: function() {
        // find the selected player
        console.log("ready to take action from keyboard: D");
        var playerIdx = 0;
        for (var i=0; i< this.players.length; i++) {
            if (this.players[i].isSelected) {
                playerIdx = i;
            }
        }
        this.players[playerIdx].goRight(this.game);
    },

    upStopRequest: function() {
        // find the selected player
        console.log("ready to take action from keyboard: W");
        var playerIdx = 0;
        for (var i=0; i< this.players.length; i++) {
            if (this.players[i].isSelected) {
                playerIdx = i;
            }
        }
        this.players[playerIdx].stopUp(this.game);
    },
    
    downStopRequest: function() {
        // find the selected player
        console.log("ready to take action from keyboard: S");
        var playerIdx = 0;
        for (var i=0; i< this.players.length; i++) {
            if (this.players[i].isSelected) {
                playerIdx = i;
            }
        }
        this.players[playerIdx].stopDown(this.game);
    },
    
    leftStopRequest: function() {
        // find the selected player
        console.log("ready to take action from keyboard: A");
        var playerIdx = 0;
        for (var i=0; i< this.players.length; i++) {
            if (this.players[i].isSelected) {
                playerIdx = i;
            }
        }
        this.players[playerIdx].stopLeft(this.game);
    },
    
    rightStopRequest: function() {
        // find the selected player
        console.log("ready to take action from keyboard: D");
        var playerIdx = 0;
        for (var i=0; i< this.players.length; i++) {
            if (this.players[i].isSelected) {
                playerIdx = i;
            }
        }
        this.players[playerIdx].stopRight(this.game);
    },



}
