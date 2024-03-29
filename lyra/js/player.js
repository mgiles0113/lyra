class Player {
    constructor (game, x, y, selected, player) {
        this.isSelected = selected;
       
        // create player(s) 
        // [TODO] consider passing the labels and images used in preload as playerInit data
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
       this.sprite.customParams = [];
       this.sprite.customParams.inventory = [];
       this.sprite.customParams.inv_space = 4;
       
       this.sprite.customParams.status = "waiting";
       
       //Init Dest Coords as Sprite's Spawn Coord.
       this.sprite.customParams.dest_x = null;
       this.sprite.customParams.dest_y = null;
    
        game.physics.arcade.enable(this.sprite);
    
        this.sprite.body.setSize(32,32);
    
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

    }
    
    
    togglePlayer(){
        if(this.isSelected == false){
            this.isSelected = true;
            
        }else{
            this.isSelected = false;
        }
    }
    
    updatePlayer (game, cursors, walls) {
        // Move player object
        game.physics.arcade.collide(this.sprite, walls);
        
        if (this.isSelected) {
        
            this.sprite.body.velocity.x = 0;
            this.sprite.body.velocity.y = 0;
            
        	//Grab Dest. Coords From Ptr
			if(game.input.mousePointer.leftButton.isDown){
				
				//Grab Dest Coords
				this.sprite.customParams.dest_x = game.input.mousePointer.x;
				this.sprite.customParams.dest_y = game.input.mousePointer.y;
				
				//Change status
				this.sprite.customParams.status = "walking";

			}
			
			if( (this.sprite.customParams.status == "walking") ){
				game.physics.arcade.moveToXY(this.sprite, this.sprite.customParams.dest_x, this.sprite.customParams.dest_y, 700);
				
				if( (this.sprite.getBounds().contains(this.sprite.customParams.dest_x, this.sprite.customParams.dest_y) ) ){
					this.sprite.customParams.status = "waiting";
				}
				
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
    
    cameraFollow(game) {
    	// second parameter creates a 'deadzone' - Moving inside this Rectangle will not cause the camera to move
        game.camera.follow(this.sprite, Phaser.Camera.FOLLOW_TOPDOWN_TIGHT);
    }
    
}

Player.preloadPlayer = function (game) {
        game.load.spritesheet('red_player', 'assets/sprites/player_1.png', 32, 32, 4);
        game.load.spritesheet('green_player', 'assets/sprites/player_2.png', 32, 32, 4);
        game.load.spritesheet('blue_player', 'assets/sprites/player_3.png', 32, 32, 4);
        
}

/*
Player.loadPlayer = function(game, numPlayers, playerData){
	for(var i=0; i<numPlayers; i++){
			game.load.spritesheet(playerData.players[i].name, playerData.players[i].imgRef, playerData.height, playerData.width, playerData.frames);
		
	}
}*/

