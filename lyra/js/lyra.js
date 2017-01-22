// Lyra
// used to collect all the components of the game and interface to phaser in one object
// derived from phaser.io example "features test.js"

class Lyra {
    startGame (mapwidth, mapheight) {
        this.game = new Phaser.Game(mapwidth, mapheight, Phaser.AUTO, 'phaser-example', { preload: this.preload, create: this.create, update: this.update, render: this.render });
    }

    preload() {
        preloadLyra(this.game);
        this.slimeCounter = 0;
        this.slimeArr = [];
    }


    create() {
        
        // setup physics engine
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
    
    
        // create the map - should move to Map class
        this.map = this.game.add.tilemap('map');
    
        this.map.addTilesetImage('grayTiles');
        this.map.addTilesetImage('greenCircle');
    
        this.map.setCollisionBetween(1, 12);
    
        //  This will set Tile ID 26 (the coin) to call the hitCoin function when collided with
        this.map.setTileIndexCallback(26, this.hitCoin, this);
    
        //  This will set the map location 2, 0 to call the function
        this.map.setTileLocationCallback(2, 0, 1, 1, this.hitCoin, this);

        this.layer = this.map.createLayer('layer2');
        this.layer.resizeWorld();
        this.layer.debugSettings.forceFullRedraw = true;
    
        this.layer3 = this.map.createLayer('layer1');
    
        // create player(s) - should move to Player class
        this.sprite = this.game.add.sprite(260, 100, 'phaser');
        this.sprite.anchor.set(0.5);
    
        this.game.physics.enable(this.sprite);
    
        this.sprite.body.setSize(16, 16, 8, 8);
    
        //  We'll set a lower max angular velocity here to keep it from going totally nuts
        this.sprite.body.maxAngular = 500;
    
        //  Apply a drag otherwise the sprite will just spin and never slow down
        this.sprite.body.angularDrag = 50;
    
        // have the camera follow the player
        this.game.camera.follow(this.sprite);
    
        // setup getting keyboard input
        this.cursors = this.game.input.keyboard.createCursorKeys();

    }


    // left over from example.  We need to figure out how this works.
    hitCoin(sprite, tile) {

        tile.alpha = 0.2;
    
        this.layer.dirty = true;
    
        return false;

    }

    update() {
        // create slime spore and start slime growing
        // [TODO] ... for now limited to 100 slime objects, fix AI for replicate
        if (this.slimeCounter < 100) {
            if (this.slimeCounter == 0) { 
                this.slimeArr[0] = new Slime(0, this.game);
            }
            else {  
                this.slimeArr[this.slimeCounter] = this.slimeArr[this.slimeCounter-1].replicateSlime(this.slimeCounter, this.game);
            }
            console.log("created slime #: " + this.slimeCounter);
            console.log(this.slimeArr[this.slimeCounter]);
            this.slimeCounter += 1;
        }
        // update all slime objects
        // [TODO] call a function in Slime class to update based on age
        for (var i=0; i<this.slimeCounter; i++) {
            this.slimeArr[i].slimesprite.animations.play(this.slimeArr[i].animation);
        }
 
        // update player
        // [TODO] move to player object
        this.game.physics.arcade.collide(this.sprite, this.layer);
    
        this.sprite.body.velocity.x = 0;
        this.sprite.body.velocity.y = 0;
        this.sprite.body.angularVelocity = 0;
    
        if (this.cursors.left.isDown)
        {
            this.sprite.body.angularVelocity = -200;
        }
        else if (this.cursors.right.isDown)
        {
            this.sprite.body.angularVelocity = 200;
        }
    
        if (this.cursors.up.isDown)
        {
            this.game.physics.arcade.velocityFromAngle(this.sprite.angle, 300, this.sprite.body.velocity);
        }

    }

    render() {
        // [TODO] depending on how players are generated, this may be one or more
        this.sprite.bringToTop();
        this.game.debug.body(this.sprite);
    }
    
}