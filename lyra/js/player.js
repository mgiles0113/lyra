class Player {
    constructor (game, x, y, selected) {
        this.isSelected = selected;
        // create player(s) - should move to Player class
        this.sprite = game.add.sprite(x, y, 'phaser');
        this.sprite.anchor.set(0.5);
    
        game.physics.arcade.enable(this.sprite);
    
        this.sprite.body.setSize(16, 16, 8, 8);
    
        //  We'll set a lower max angular velocity here to keep it from going totally nuts
        this.sprite.body.maxAngular = 500;
    
        //  Apply a drag otherwise the sprite will just spin and never slow down
        this.sprite.body.angularDrag = 50;
        
        // set up signal callback function when the overlap occurs between sprite and slime
        this.stuckInSlimeSignal = new Phaser.Signal();
        this.stuckInSlimeSignal.add(function(a,b) {
            // [TODO] refer to function in player object?
            console.log("overlap with slime");
        });



        // [TODO] doesn't seem to work
        if (this.isSelected) {
        
            // have the camera follow the player
            game.camera.follow(this.sprite);
        }
    
    }
 
    
    updatePlayer (game, cursors, walls) {
        // update player
        // [TODO] move to player object
        game.physics.arcade.collide(this.sprite, walls);
        if (this.isSelected) {
        
            this.sprite.body.velocity.x = 0;
            this.sprite.body.velocity.y = 0;
            this.sprite.body.angularVelocity = 0;
        
            if (cursors.left.isDown)
            {
                //this.sprite.body.angularVelocity = -200;
                this.sprite.body.velocity.x = -700;
            }
            else if (cursors.right.isDown)
            {
                //this.sprite.body.angularVelocity = 200;
                this.sprite.body.velocity.x = 700;
            }
            else if(cursors.up.isDown)
            {
                //game.physics.arcade.velocityFromAngle(this.sprite.angle, 300, this.sprite.body.velocity);
                this.sprite.body.velocity.y = -700;
            }
            else if(cursors.down.isDown){
                this.sprite.body.velocity.y = 700;
            }

        }
    }
    
    
}

Player.preloadPlayer = function (game) {
        game.load.image('phaser', 'assets/sprites/arrow.png');
}