class Player {
    constructor (game, x, y, selected, player) {
        this.isSelected = selected;
       
        // create player(s) 
        if( player == 1){
        	this.sprite = game.add.sprite(x, y, 'red_player');
        	
        }else if(player == 2){
        	this.sprite = game.add.sprite(x,y, 'green_player');
        	
        }else{
        	this.sprite = game.add.sprite(x,y, 'blue_player');
        	
        }
        
        this.sprite.frame = 1;
        this.sprite.anchor.set(0.5);
       
       //Custom Params for Player.
       this.sprite.customParams.inventory = [];
       this.sprite.customParams.state = "waiting";
    
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
            game.camera.follow(this.sprite, Phaser.Camera.FOLLOW_TOPDOWN_TIGHT);
            //console.log(game.camera);
            //game.camera.focusOn(this.sprite);
        }
    
    }
    
    
    togglePlayer(){
        if(this.isSelected == false){
            this.isSelected = true;
            
        }else{
            this.isSelected = false;
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
        
        
			if(game.input.mousePointer.leftButton.isDown){
				// 
				//this.sprite.x = game.input.mousePointer.x;
				//this.sprite.y = game.input.mousePointer.y;
				console.log("It's working!!!");
			}
        
            if (cursors.left.isDown)
            {
                this.sprite.body.velocity.x = -700;
                this.sprite.frame = 0;
            }
            else if (cursors.right.isDown)
            {
                this.sprite.body.velocity.x = 700;
                 this.sprite.frame = 1;
            }
            else if(cursors.up.isDown)
            {
                this.sprite.body.velocity.y = -700;
                 this.sprite.frame = 2;
            }
            else if(cursors.down.isDown){
                this.sprite.body.velocity.y = 700;
                 this.sprite.frame = 3;
            }

        }
    }
    
    
}

Player.preloadPlayer = function (game) {
        game.load.spritesheet('red_player', 'assets/sprites/player_1.png', 60, 60, 4);
        game.load.spritesheet('green_player', 'assets/sprites/player_2.png', 60, 60, 4);
        game.load.spritesheet('blue_player', 'assets/sprites/player_3.png', 60, 60, 4);
        
}