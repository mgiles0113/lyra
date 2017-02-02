class Lyra extends Phaser.State {
    defineState(mapRefData, playerRefData, gamewidth, gameheight) {
        this.mapRef = mapRefData.mapRef;
        this.imageTagList = mapRefData.imageTagList;
        this.imageRefList = mapRefData.imageRefList;
        this.mapLayerRef = mapRefData.mapLayerRef;
        this.mapwidth = mapRefData.mapwidth;
        this.mapheight = mapRefData.mapheight;
        this.slimeCounter = 0;
        this.slimeArr = [];
        this.players = [];
        this.mapLayer = [];
        this.gamewidth = gamewidth;
        this.gameheight = gameheight;
        this.numPlayers = playerRefData.numPlayers;
        this.playerData = [];
        // copy over the players data
        for (var i = 0; i< this.numPlayers; i++) {
            this.playerData[i] = playerRefData.players[i];
        }
    }
 
    preload() {
        // create tilemap and load assets
        Map.loadMap(this.game, this.mapRef, this.imageTagList, this.imageRefList);
        preloadLyra(this.game);
    }


    create() {
        
        console.log(this.someproperty);
        
        // setup physics engine
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
    
        this.game.world.scaleMode = 
        // there are other ways to do this, sets a background color for the game          
        this.game.stage.backgroundColor = '#555';
        
        // // add background image
        // this was to show another way to put in the background, assumes preload of 'background' tag
        //this.game.add.sprite(0, 0, 'background');

        // // create the map
        this.map = new Map();
        this.map.addMap(this.game, this.imageTagList);

        for (var i=0; i<this.mapLayerRef.length; i++) {
            this.mapLayer[i] = this.map.map.createLayer(this.mapLayerRef[i]);
            //this.mapLayer[i].resizeWorld(200,200);
            this.mapLayer[i].debugSettings.forceFullRedraw = true;
        }
        
        // this.map.tileSetImages[this.imageTagList[0]].draw(this.mapLayer[this.mapLayer.length - 1],10,10,1);
        // this.mapLayer[this.mapLayer.length - 1].debugSettings.forceFullRedraw = true;
        
        // add collision for walls
        console.log("setting up collision");
        console.log(this.mapLayerRef[this.mapLayerRef.length-1]);
        // set the second parameter to > gid number in tile map for the tiles we want to collide
        this.map.map.setCollisionBetween(1, 64*46 , true, this.mapLayer[(this.mapLayer.length-1)]);
        
        
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

        // create players
        for (var i = 0; i< this.numPlayers; i++) {
            this.players[i] = new Player(this.game, this.playerData[i].x, this.playerData[i].y, this.playerData[i].isSelected, this.playerData[i].image);
        }

        // setup getting keyboard input
        this.cursors = this.game.input.keyboard.createCursorKeys();
        
        //setup getting mouse input
        this.game.input.mouse.capture = true;

        // try out creating a slime group, currently not used
        this.slimeManager = new SlimeManager(1000, this.game);

    }

    update() {
        /*/ create slime spore and start slime growing(?enlarge the image of the slime?)
        // [TODO] ... for now limited to 100 slime objects, fix AI for replicate */
        
        this.slimeManager.updateSlimeArr(this.game, this.mapLayer[this.mapLayer.length-1]);

        // [TODO] make slime items into a group
        for (var i=0; i<this.slimeManager.slimeCounter; i++) {
            // this.slimeArr[i].slimesprite.animations.play(this.slimeArr[i].animation);
            for (var j=0; j < this.players.length; j++)
            { 
                if (this.game.physics.arcade.overlap(this.players[j].sprite, this.slimeManager.slimeArr[i].slimesprite)) {
                    this.players[j].stuckInSlimeSignal.dispatch(this.players[j].sprite, this.slimeManager.slimeArr[i].slimesprite);
                }
            }
        }
        
        //Comm. Window--> Switch btw players.
        this.comm.switchPlayer(this.players);


        // update player
        for (var j=0; j < this.players.length; j++)
        { 
            this.players[j].updatePlayer(this.game, this.cursors, this.mapLayer[this.mapLayer.length-1]);
        }
    }

    render() {
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
    }
}