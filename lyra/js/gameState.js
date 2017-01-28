// Lyra
// used to collect all the components of the game and interface to phaser in one object
// derived from phaser.io example "features test.js"

class Lyra {
    startGame ( mapRef, imageTagList, imageRefList, mapwidth, mapheight) {
        
        this.mapRef = mapRef;

        this.game = new Phaser.Game(mapwidth, mapheight, Phaser.AUTO, 'phaser-example', {preload: this.preload, create: this.create, update: this.update, render: this.render });
        
    }

    preload() {
        // [TODO] how to get this data passed in from the startGame!
        // this.mapRef = 'assets/tilemaps/maps/grayRoom.json';
        // this.imageTagList = ['grayTiles', 'background'];
        // this.imageRefList = ['assets/grayTiles.png', 'assets/backgroundGray.png'];
        // this.mapLayerRef = ['layer2', 'layer1'];
 
        this.mapRef = 'assets/tilemaps/maps/reference_map.json';
        this.imageTagList = ['scifitiles-sheet', 'meta_tiles'];
        this.imageRefList = ['assets/scifitiles-sheet.png', 'assets/meta_tiles.png'];
        // [TODO] build this list off the json map file? ordered by display order, for now walls are last
        this.mapLayerRef = ['escape_pods', 'halls', 'dock', 'workshop', 'engine_room', 'rec_room', 'crew_quarters', 'cafeteria', 'med_bay', 'command_center', 'doors', 'walls']

        // create tilemap and load assets
        Map.loadMap(this.game, this.mapRef, this.imageTagList, this.imageRefList);
        
        preloadLyra(this.game);
        this.slimeCounter = 0;
        this.slimeArr = [];
        this.players = [];
        this.mapLayer = [];
    }


    create() {
        
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
        this.map.map.setCollisionBetween(1, 10000, true, this.mapLayer[(this.mapLayer.length-1)]);
        //this.game.scale.scaleMode = "50%";
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        //Create comm window.
        this.comm = new Comm(this.game);

        // create players
        // [TODO] make this an array of players
        this.players[0] = new Player(this.game, 260, 600, true);
        this.players[1] = new Player(this.game, 360, 800, false);
 
        // setup getting keyboard input
        this.cursors = this.game.input.keyboard.createCursorKeys();

        // try out creating a slime group, currently not used
        this.slimeGroup = this.game.add.group();
        this.slimeGroup.enableBody = true;
 
    }

    update() {
        // create slime spore and start slime growing(?enlarge the image of the slime?)
        // [TODO] ... for now limited to 100 slime objects, fix AI for replicate
        if (this.slimeCounter < 100) {
            if (this.slimeCounter == 0) { 
                this.slimeArr[0] = new Slime(0, this.game);
            }
            else {  
                this.slimeArr[this.slimeCounter] = this.slimeArr[this.slimeCounter-1].replicateSlime(this.slimeCounter, this.game);
            }
            // console.log("created slime #: " + this.slimeCounter);
            // console.log(this.slimeArr[this.slimeCounter]);
            this.slimeCounter += 1;
        }
        // update all slime objects
        // [TODO] call a function in Slime class to update based on age
        // [TODO] make slime items into a group
        for (var i=0; i<this.slimeCounter; i++) {
            this.slimeArr[i].slimesprite.animations.play(this.slimeArr[i].animation);
            for (var j=0; j < this.players.length; j++)
            { 
                if (this.game.physics.arcade.overlap(this.players[j].sprite, this.slimeArr[i].slimesprite)) {
                    this.players[j].stuckInSlimeSignal.dispatch(this.players[j].sprite, this.slimeArr[i].slimesprite);
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
        // [TODO] depending on how players are generated, this may be one or more
        for (var i=0; i < this.players.length; i++)
        { 
            this.players[i].sprite.bringToTop();
            if (this.players[i].isSelected) {
                this.game.camera.follow(this.players[i].sprite, Phaser.Camera.FOLLOW_TOPDOWN_TIGHT);
//                        console.log(this.game.camera);
            }
            this.game.debug.body(this.players[i]);
        }
    }
}