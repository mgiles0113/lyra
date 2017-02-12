class Player {
    constructor (game, x, y, idx) {
        this.isSelected = game.gameData.characters[game.gameData.crew[idx]].isSelected;
       
        // create player(s) 
        this.sprite = game.add.sprite(x,y,game.gameData.characters[game.gameData.crew[idx]].name);
        this.sprite.frame = game.gameData.characters[game.gameData.crew[idx]].frame;
        this.sprite.anchor.set(0.5);
       
        //Custom Params for Player.
        this.sprite.customParams = [];
        this.sprite.customParams.inventory = game.gameData.characters[game.gameData.crew[idx]].inventory; //['fuse', 'circuit'];
        this.sprite.customParams.inv_size = game.gameData.characters[game.gameData.crew[idx]].inventory.length;
       
        this.sprite.customParams.status =  game.gameData.characters[game.gameData.crew[idx]].status;
       
        //Init Dest Coords as Sprite's Spawn Coord.
        this.sprite.customParams.dest_x = game.gameData.characters[game.gameData.crew[idx]].dest_x;
        this.sprite.customParams.dest_y = game.gameData.characters[game.gameData.crew[idx]].dest_y;
    
        game.physics.arcade.enable(this.sprite);
    
        this.sprite.body.setSize(game.gameData.characters[game.gameData.crew[idx]].width,game.gameData.characters[game.gameData.crew[idx]].height);
    
        //  We'll set a lower max angular velocity here to keep it from going totally nuts
        this.sprite.body.maxAngular = 500;
    
        //  Apply a drag otherwise the sprite will just spin and never slow down
        this.sprite.body.angularDrag = game.gameData.characters[game.gameData.crew[idx]].angulardrag;
        
        
        this.sprite.body.velocity.x =  game.gameData.characters[game.gameData.crew[idx]].velocityx;
        this.sprite.body.velocity.y = game.gameData.characters[game.gameData.crew[idx]].velocityy;
        
        // set up signal callback function when the overlap occurs between sprite and slime
        this.stuckInSlimeSignal = new Phaser.Signal();
        this.stuckInSlimeSignal.add(function(a,b) {
            // [TODO] refer to function in player object?
            console.log("overlap with slime");
        });
        // this.sprite.body.bounce.x = 0.2;
        // this.sprite.body.bounce.y = 0.2;
    }
    
    validDest(game,destCoords){
        //Grab the coords.
        this.sprite.customParams.dest_x = game.input.mousePointer.x;
		this.sprite.customParams.dest_y = game.input.mousePointer.y;
		
        //Check that is on a floor tile/floor layer
        
    }
    
    togglePlayer(){
        if(this.isSelected == false){
            this.isSelected = true;
            
        }else{
            this.isSelected = false;
        }
    }
    
    //Return inventory
    getInventory(slot){
        if( slot < this.sprite.customParams.inv_size ){
            return this.sprite.customParams.inventory[slot];
        
        }else{
            return 'empty';
            
        }
    }
    
    //Only reacts if it's hitting something.
    collideWall(sprite, walls){
        console.log("I'm hitting something.");
    }
    
    ontheFloor(sprite, floors){
        console.log("I'm on the dance floor.");
    }
    
    lockedOut(sprite,doors){
        console.log("I can't get in!");
    }
    
    updatePlayer (game, cursors, walls, floors, containerManager) {
        
        // Move player object
        game.physics.arcade.collide(this.sprite, walls);
        
        //Restrict Pt & Click to floor tiles
        //game.physics.arcade.overlap(this.sprite, floors);
        
        for(var i=0; i<containerManager.containers.length; i++) {
            if ((containerManager.containers[i].sprite.body.checkCollision.any == true) 
                    &&  (game.physics.arcade.collide(containerManager.containers[i].sprite, this.sprite))) {
                 this.lockedOut(this.sprite,containerManager.containers[i].sprite);
            }
        }
        
        
        // moved to wasd keys
        //if (this.isSelected) {
        
            // this.sprite.body.velocity.x = 0;
            // this.sprite.body.velocity.y = 0;
            
            //Disabling Point and Click
            /*
        	//Grab Dest. Coords From Ptr
        	//Check if the coordinates are valid
			if(game.input.mousePointer.leftButton.isDown){
				
				//Grab Dest Coords
				this.sprite.customParams.dest_x = game.input.mousePointer.x;
				this.sprite.customParams.dest_y = game.input.mousePointer.y;
				
				//Change status
				this.sprite.customParams.status = "walking";

			}
			
			if( (this.sprite.customParams.status == "walking") ){
				game.physics.arcade.moveToXY(this.sprite, this.sprite.customParams.dest_x, this.sprite.customParams.dest_y, 300);
				
				//Stop Sprite when they reach dest
				if( (this.sprite.getBounds().contains(this.sprite.customParams.dest_x, this.sprite.customParams.dest_y) ) ){
					this.sprite.customParams.status = "waiting";
					console.log("I'm here.");
				}
				
				//Stop Sprite at Collision with Wall
				if( (this.sprite.body.blocked.up || this.sprite.body.blocked.down || this.sprite.body.blocked.right || this.sprite.body.blocked.left) ){
				    this.sprite.customParams.status = "waiting";
					console.log("I'm stopping.");
				    
				}
				
			}*/
        
            // if (cursors.left.isDown)
            // {
            //     this.sprite.body.velocity.x = -300;
            //     this.sprite.frame = 0;
            // }
            // else if (cursors.right.isDown)
            // {
            //     this.sprite.body.velocity.x = 300;
            //      this.sprite.frame = 1;
            // }
            // else if(cursors.up.isDown)
            // {
            //     this.sprite.body.velocity.y = -300;
            //      this.sprite.frame = 2;
            // }
            // else if(cursors.down.isDown){
            //     this.sprite.body.velocity.y = 300;
            //      this.sprite.frame = 3;
            // }
        //}
    }
    
    goUp(game) {
        this.sprite.body.velocity.y = -300;
        this.sprite.frame = 2;
    }
    
    goRight(game) {
        this.sprite.body.velocity.x = 300;
        this.sprite.frame = 1;
    }
    goLeft(game) {
        this.sprite.body.velocity.x = -300;
        this.sprite.frame = 0;
    }
    goDown(game) {
        this.sprite.body.velocity.y = 300;
        this.sprite.frame = 3;
    }
   
    stopUp(game) {
        this.sprite.body.velocity.y = 0;
    }
    
    stopRight(game) {
        this.sprite.body.velocity.x = 0;
    }
    stopLeft(game) {
        this.sprite.body.velocity.x = 0;
    }
    stopDown(game) {
        this.sprite.body.velocity.y = 0;
    }
    
    
    cameraFollow(game) {
    	// second parameter creates a 'deadzone' - Moving inside this Rectangle will not cause the camera to move
        game.camera.follow(this.sprite, Phaser.Camera.FOLLOW_TOPDOWN_TIGHT);
    }
    
    savePlayerData(game, idx) {
        game.gameData.characters[game.gameData.crew[idx]].isSelected = this.isSelected;
        game.gameData.characters[game.gameData.crew[idx]].inventory = this.sprite.customParams.inventory;
        game.gameData.characters[game.gameData.crew[idx]].status = this.sprite.customParams.status;
        game.gameData.characters[game.gameData.crew[idx]].dest_x = this.sprite.customParams.dest_x;
        game.gameData.characters[game.gameData.crew[idx]].dest_y = this.sprite.customParams.dest_y;
        game.gameData.characters[game.gameData.crew[idx]].x = this.sprite.body.position.x + game.gameData.characters[game.gameData.crew[idx]].width/2;
        game.gameData.characters[game.gameData.crew[idx]].y = this.sprite.body.position.y + game.gameData.characters[game.gameData.crew[idx]].height/2;
        game.gameData.characters[game.gameData.crew[idx]].velocityx = this.sprite.body.velocity.x;
        game.gameData.characters[game.gameData.crew[idx]].velocityy = this.sprite.body.velocity.y;
        game.gameData.characters[game.gameData.crew[idx]].frame = this.sprite.frame;
        game.gameData.characters[game.gameData.crew[idx]].angularDrag =this.sprite.body.angularDrag;
    }
    
}

// Player.preloadDefaultPlayer = function (game) {
    
//     //Load the items needed: 1st-> Player Name/Key 2nd-> URL to asset
//     for (var i=0; i<game.playerData.players.length; i++) {
//         game.load.spritesheet(game.playerData.players[i].name, game.playerData.players[i].playerRef, game.playerData.height, game.playerData.width, game.playerData.frames);
//     }
        
// }


Player.preloadPlayer = function (game) {
    //Load the items needed: 1st-> Player Name/Key 2nd-> URL to asset
    for (var i=0; i<game.gameData.crew.length; i++) {
        game.load.spritesheet(game.gameData.characters[game.gameData.crew[i]].name, game.gameData.characters[game.gameData.crew[i]].playerRef, game.gameData.characters[game.gameData.crew[i]].height, game.gameData.characters[game.gameData.crew[i]].width, game.gameData.characters[game.gameData.crew[i]].frames);
    }        
}