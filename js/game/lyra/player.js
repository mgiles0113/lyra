class Player {
    addPlayer(game, x, y, playerData) {
        this.game = game;
        this.idx = playerData.idx;
        this.isSelected = playerData.isSelected;
        this.characterType = playerData.characterType;
        this.characterIdx = playerData.characterIdx;
        this.name = playerData.name;
        this.itemsCapacity = 4;
        this.knockoutcount = playerData.knockoutcount;

        // create player(s) 
        this.sprite = game.add.sprite(x,y,playerData.name);
        this.sprite.frame = playerData.frame;
        this.sprite.anchor.set(0.5);

        //Custom Params for Player.
        this.sprite.customParams = [];
        this.sprite.customParams.inventory = playerData.inventory; //['fuse', 'circuit'];
        this.sprite.customParams.inv_size = playerData.inventory.length;
        this.sprite.customParams.walking = playerData.walking;
        // using this to indicate to PlayerManager that the path is available to start updates for bandit AI
        this.sprite.customParams.pathfound = playerData.pathfound;
        this.sprite.customParams.equipped = playerData.equipped;
        this.sprite.customParams.speed = 200;
        if (playerData.characterType == "bandit") {
            // slow bandits down
           this.sprite.customParams.speed = 200; 
           //this.sprite.scale.setTo(0.95);
        }

        //PathFinder for Pt&Click
        this.sprite.customParams.path = playerData.path;
        this.sprite.customParams.next_pt_x = null;
        this.sprite.customParams.next_pt_y = null;
       
        this.sprite.customParams.status =  playerData.status;
       
        //Init Dest Coords as Sprite's Spawn Coord.
        this.sprite.customParams.dest_x = playerData.dest_x;
        this.sprite.customParams.dest_y = playerData.dest_y;
        this.sprite.customParams.dist_dest = 0;
    
        // custom params for bandit AI
        this.sprite.customParams.containerList = playerData.containerList;
        this.sprite.customParams.currentRoom = playerData.currentRoom;

        game.physics.arcade.enable(this.sprite);
    
        //Set smaller so player doesn't get stuck.
        this.sprite.body.setSize(game.gameData.characters[ playerData.characterIdx].width - 4,game.gameData.characters[ playerData.characterIdx].height - 4);
        
        //  We'll set a lower max angular velocity here to keep it from going totally nuts
        this.sprite.body.maxAngular = 500;
    
        //  Apply a drag otherwise the sprite will just spin and never slow down
        this.sprite.body.angularDrag =  playerData.angulardrag;
        
        this.sprite.body.velocity.x =   playerData.velocityx;
        this.sprite.body.velocity.y = playerData.velocityy;
        
        // set up signal callback function when the overlap occurs between sprite and slime
        this.stuckInSlimeSignal = new Phaser.Signal();
        this.stuckInSlimeSignal.add(function(a,b) {
            // [TODO] refer to function in player object?
            //console.log("overlap with slime");

            this.sprite.body.velocity.x = 0;
            this.sprite.body.velocity.y = 0;
            
            this.sprite.customParams.status = "stuck";
			this.sprite.customParams.walking = false;
			//Added to help with animations
			this.sprite.customParams.direction = null;
			this.sprite.animations.stop();
			    
        }, this);
        
       // add emitter
       this.makeItemEmitter(game);
       
       //add animations to the player
       this.sprite.animations.add('down',[0,1,2], 10, true);
       this.sprite.animations.add('up',[3,4,5], 10, true);
       this.sprite.animations.add('left',[9,10,11], 10, true);
       this.sprite.animations.add('right',[6,7,8], 10, true);
       this.sprite.animations.add('down_lyre',[12,13,14], 10, true);
       this.sprite.animations.add('up_lyre',[15,16,17], 10, true);
       this.sprite.animations.add('left_lyre',[21,22,23], 10, true);
       this.sprite.animations.add('right_lyre',[18,19,20], 10, true);
       this.textSprite = null;
    }

    // print data to screen for first bandit
    addBanditAIText(game, text) {
        if (this.idx == 3) {
            var style = { font: 'bold 14pt Arial', fill: 'white', align: 'left', wordWrap: true, wordWrapWidth: 450 };
            if (this.textSprite != null) {
                this.textSprite.destroy();
            }
            this.textSprite = game.add.text(50, 50, text, style);
            this.textSprite.fixedToCamera = true;
        }
    }


    equipItem(slot) {
        if (this.sprite.customParams.equipped.length > 0) {
            var swapItem = this.sprite.customParams.equipped[0];
            this.sprite.customParams.equipped[0] = this.sprite.customParams.inventory[slot];
            this.sprite.customParams.inventory[slot] = swapItem;
            return true;
        } else {
            this.sprite.customParams.equipped[0] = this.sprite.customParams.inventory[slot];
            this.sprite.customParams.inventory.splice(slot, 1);
        }
        
        return false;
    }

    unequipItem() {
        if (this.sprite.customParams.inventory.length < this.itemsCapacity) {
            this.addItemToList(this.sprite.customParams.equipped[0]);
            this.sprite.customParams.equipped.splice(0, 1);
        } else {
            console.log('No room in player inventory. Make some room and try again.')
        }
    }

    // add item to the item list
    addItemToList(item) {
        if (this.sprite.customParams.inventory.length < this.itemsCapacity) {
            this.sprite.customParams.inventory.push(item);
        } else {
            //[TODO] raise a signal that says this item can't be added
            //console.log("the " + this.name +" inventory is full");
        }
    }
    
    transferItemFromPlayerToPlayer(srcPlayer, srcItemIndex, destPlayer) {
        
    }
    
    // remove item from the list
    removeItemFromList(itemIndex) {
        var item = '';
        if (item = this.sprite.customParams.inventory.splice(itemIndex, 1)) {
            return item[0];
        } else {
            return false;
        }
    }
    
    togglePlayer(){
        if(this.isSelected == false){
            this.isSelected = true;
            
        }else{
            this.isSelected = false;
        }
    }

    // return inventory
    getInventory(slot) {
        if (slot < this.sprite.customParams.inventory.length) {
            return this.sprite.customParams.inventory[slot];
        } else {
            return 'empty';
        }
    }
    
    // use this method for crew updates each update cycle
    updateCrew(game, walls, floors, map, containerManager) {
        
        // uncomment this to see the connected doors and containers for the room this player is in
        // if (this.isSelected) {
        //     this.playerAI(game, map, containerManager);
        // }
        
        this.updatePlayer (game, walls, floors, map);
    }
    
    // use this method for bandit updates each update cycle
    updateBandit(game, walls, floors, map, containerManager) {
        if (this.sprite.customParams.walking == true) {
            this.updatePlayer (game, walls, floors);
        }
    }
    
    // generic update to move to destination
    updatePlayer (game, walls, floors) {
        
        // Move player object
        game.physics.arcade.collide(this.sprite, walls);
        
		if( (this.sprite.customParams.walking == true) && (this.sprite.customParams.path.length != 0) 
		     && this.sprite.customParams.next_pt_x != null && this.sprite.customParams.next_pt_y != null ){
	        
	        //Move Sprite to Next Pt.	    
		    game.physics.arcade.moveToXY(this.sprite, this.sprite.customParams.next_pt_x, this.sprite.customParams.next_pt_y, this.sprite.customParams.speed);
		    
            //Check if sprite has reached the next point.
            this.sprite.customParams.dist_dest = game.physics.arcade.distanceToXY(this.sprite, this.sprite.customParams.next_pt_x, this.sprite.customParams.next_pt_y);
	
            //Move to Destination By Grabbing the Next Point.
			if( this.sprite.customParams.dist_dest < 2){
			    
			    //Get Next Point
			    this.getNextPt(game);
			    this.getAnimations(game);
			    
			    //Stop if end of path.
			    if(this.sprite.customParams.walking == false){
			        this.sprite.frame = 0;
			        
			        //Stop Sprite
		            this.sprite.body.velocity.x = 0;
				    this.sprite.body.velocity.y = 0;
				
				    //Stop Animation
				    this.sprite.animations.stop();

			    }
			    
			    			        

		        

			}
			
			//If player overlaps slime, stop immed.
			if( this.sprite.customParams.status == "stuck" || this.sprite.customParams.status == "knockout"){
			     //Clear Path
			     this.sprite.customParams.path = [];
			     this.sprite.customParams.next_pt_x = this.sprite.body.x;
			     this.sprite.customParams.next_pt_y = this.sprite.body.y;
			     
			    //Stop Sprite
		        this.sprite.body.velocity.x = 0;
				this.sprite.body.velocity.y = 0;
				
				//Stop Walking.
				this.sprite.customParams.walking = false;
				
				//Stop Animation
				this.sprite.animations.stop();
			    
			}
		}
		
		
    }
    
    getAnimations(game){
        var angle_rads = game.math.angleBetween(this.sprite.x, this.sprite.y, this.sprite.customParams.next_pt_x, this.sprite.customParams.next_pt_y);
        var angle = game.math.radToDeg(angle_rads);
        
        if(angle != 0){
            //Left
            if( (angle > 135 && angle <= 180) || (angle >= -180 && angle <= -135) ){
                
                if(game.gameData.lyreLocation.playerIdx == this.characterIdx){
                    this.sprite.animations.play('left_lyre');
                }else{
                    this.sprite.animations.play('left');
                }
        
            //Up    
            }else if(angle > -135 && angle <= -45){
                
                if(game.gameData.lyreLocation.playerIdx == this.characterIdx){
                    this.sprite.animations.play('up_lyre');
                }else{
                    this.sprite.animations.play('up');
                }
        
            //Right  
            }else if(angle > -45 && angle <= 45){
                if(game.gameData.lyreLocation.playerIdx == this.characterIdx){
                    this.sprite.animations.play('right_lyre');
                }else{
                    this.sprite.animations.play('right');
                }
        
            //Down    
            }else if( this.sprite.customParams.directioangle > 45 && angle <= 135){
                if(game.gameData.lyreLocation.playerIdx == this.characterIdx){
                    this.sprite.animations.play('down_lyre');
                }else{
                    this.sprite.animations.play('down');
                }
            }
        }
     
    }
    
    
    setupPathFinder(game, grid) {
        this.grid = grid;
        this.pathfinder = new EasyStar.js(); 
        this.pathfinder.setGrid(grid);
        this.pathfinder.setAcceptableTiles([0]);
        this.pathfinder.setIterationsPerCalculation(1000);

    }
    
    destroyAndResetPathfinder(game) {
        if (this.pathfinder) {
            delete this.pathfinder;
        }
        this.pathfinder = new EasyStar.js(); 
        this.pathfinder.setGrid(this.grid);
        this.pathfinder.setAcceptableTiles([0]);
        this.pathfinder.setIterationsPerCalculation(1000);
    }
    
    ptClick(game){
            //Get Sprite Origin Coords.
            this.sprite.customParams.src_x = game.math.snapToFloor(this.sprite.x, this.sprite.width);
            this.sprite.customParams.src_y = game.math.snapToFloor(this.sprite.y, this.sprite.height);

            //Get Sprite Dest Coords
            this.sprite.customParams.dest_x = game.math.snapToFloor(game.input.activePointer.worldX, this.sprite.width);
            this.sprite.customParams.dest_y = game.math.snapToFloor(game.input.activePointer.worldY, this.sprite.height);

            this.sprite.customParams.walking = true;
            
            //Get the Path from Origin to Dest. 
            this.foundPath = this.getPath.bind(this);
            this.pathfinder.findPath(this.sprite.customParams.src_x/this.sprite.width, this.sprite.customParams.src_y/this.sprite.height, this.sprite.customParams.dest_x/this.sprite.width, this.sprite.customParams.dest_y/this.sprite.height, this.foundPath);
            this.pathfinder.calculate();
        
    }

    
    // use this function to restart point and click movement in a saved game.  this.sprite.customParams.walking == true and .dest_x, .dest_y are defined
    restartPtClick(game){
    
            this.destroyAndResetPathfinder(game);
    
            this.sprite.customParams.walking = false;
            this.sprite.customParams.pathfound = false;
            this.sprite.body.velocity.x = 0;
            this.sprite.body.velocity.y = 0;
            this.sprite.customParams.path = [];
            this.sprite.customParams.next_pt_x = null;
            this.sprite.customParams.next_pt_y = null;
            this.sprite.body.moves = false;

            
        
            //Get Sprite Origin Coords.
            this.sprite.customParams.src_x = game.math.snapToFloor(this.sprite.body.center.x, this.sprite.width);
            this.sprite.customParams.src_y = game.math.snapToFloor(this.sprite.body.center.y, this.sprite.height);

            var outofbounds = false;
            // sometimes the bandit is going outside world boundaries.  If that's the case, redefine bandit location to valid grid location
            if (this.sprite.customParams.src_x/game.gameData.tile_size < 0) {
                this.sprite.customParams.src_x = 0;
                outofbounds = true;
            }
            if (this.sprite.customParams.src_y/game.gameData.tile_size < 0) {
                this.sprite.customParams.src_y = 0;
                outofbounds = true;
            }
            if (this.sprite.customParams.src_x/game.gameData.tile_size > game.gameData.mapwidth*game.gameData.tile_size) {
                this.sprite.customParams.src_x = game.gameData.mapwidth*game.gameData.tile_size;
                outofbounds = true;
            }
            if (this.sprite.customParams.src_y/game.gameData.tile_size > game.gameData.mapheight*game.gameData.tile_size) {
                this.sprite.customParams.src_y = game.gameData.mapheight*game.gameData.tile_size;
                outofbounds = true;
            }
            if (outofbounds) {
                // kill any previous motion
                this.sprite.body.velocity.x = 0;
                this.sprite.body.velocity.y = 0;
                game.physics.arcade.moveToXY(this.sprite, this.sprite.customParams.src_x, this.sprite.customParams.src_y, this.sprite.customParams.speed);
            }

            //Get the Path from Origin to Dest. 
            this.foundPath = this.getBanditPath.bind(this);
            this.pathfinder.findPath(Math.floor(this.sprite.customParams.src_x/game.gameData.tile_size), Math.ceil(this.sprite.customParams.src_y/game.gameData.tile_size), 
                Math.floor(this.sprite.customParams.dest_x/game.gameData.tile_size), Math.ceil(this.sprite.customParams.dest_y/game.gameData.tile_size), 
                this.foundPath);
            this.pathfinder.calculate();
    }
    
    

    
    getPath(path){
        // if path was passed in, load the path
        if( path != null){
            this.sprite.customParams.path = [];
                var pt_x;
                var pt_y;
            for(var i =0; i < path.length; i++){
                pt_x = path[i].x * this.sprite.width + (this.sprite.width/2);
                pt_y = path[i].y * this.sprite.height + (this.sprite.height/2);
                this.sprite.customParams.path.push({pt_x, pt_y});
            }
        }
        
        //[TODO] adding this condition because the path isn't always defined????
        if (this.sprite.customParams.path.length > 0) {
            // set up the first point
            this.sprite.customParams.next_pt_x = this.sprite.customParams.path[0].pt_x;
            this.sprite.customParams.next_pt_y = this.sprite.customParams.path[0].pt_y;

        } 
    }


    // copy of getPath but sets walking parameter for bandit
    // using walking to indicate that the path is ready
    getBanditPath(path) {
        // if path was passed in, load the path
        this.sprite.body.moves = true;
        if( path != null){
            this.sprite.customParams.path = [];
                var pt_x;
                var pt_y;
            for(var i =0; i < path.length; i++){
                pt_x = path[i].x * this.sprite.width + (this.sprite.width/2);
                pt_y = path[i].y * this.sprite.height + (this.sprite.height/2);
                this.sprite.customParams.path.push({pt_x, pt_y});
            }
        }
        
        //[TODO] adding this condition because the path isn't always defined????
        if (this.sprite.customParams.path.length > 0) {
            // set up the first point
            this.sprite.customParams.next_pt_x = this.sprite.customParams.path[0].pt_x;
            this.sprite.customParams.next_pt_y = this.sprite.customParams.path[0].pt_y;
            this.sprite.customParams.walking = true;
            this.sprite.customParams.pathfound = true;
        } 
    }

    
    getNextPt(game){
        this.sprite.customParams.path.shift();
        
        //Check that there are points left in path.
        if(this.sprite.customParams.path.length != 0){
            this.sprite.customParams.next_pt_x = this.sprite.customParams.path[0].pt_x;
            this.sprite.customParams.next_pt_y = this.sprite.customParams.path[0].pt_y;
            
        //End of Path. Dest. Reached.
        }else{
            this.sprite.customParams.next_pt_x = null;
            this.sprite.customParams.next_pt_y = null;
            this.sprite.customParams.walking = false;
        }

    }
    
    goUp(game) {
        
        if( !this.sprite.customParams.walking ){
            this.sprite.body.velocity.y = -200;
        
            if(game.gameData.lyreLocation.playerIdx == this.characterIdx){
                this.sprite.animations.play('up_lyre');
            }else{
                this.sprite.animations.play('up');
            }
        }

    }
    
    goRight(game) {
        
        if( !this.sprite.customParams.walking ){
        
            this.sprite.body.velocity.x = 200;
        
            if(game.gameData.lyreLocation.playerIdx == this.characterIdx){
                this.sprite.animations.play('right_lyre');
            }else{
                this.sprite.animations.play('right');
            }
        }

    }
    goLeft(game) {
        
        if( !this.sprite.customParams.walking ){
            this.sprite.body.velocity.x = -200;
        
            if(game.gameData.lyreLocation.playerIdx == this.characterIdx){
                this.sprite.animations.play('left_lyre');
            }else{
                this.sprite.animations.play('left');
            }
        }
        
    }
    goDown(game) {
        
        if( !this.sprite.customParams.walking ){
            this.sprite.body.velocity.y = 200;
        
            if(game.gameData.lyreLocation.playerIdx == this.characterIdx){
                this.sprite.animations.play('down_lyre');
            }else{
                this.sprite.animations.play('down');
            }
            
        }
        
        
    }
   
    stopUp(game) {
        this.sprite.body.velocity.y = 0;
        this.sprite.animations.stop();
    }
    
    stopRight(game) {
        this.sprite.body.velocity.x = 0;
        this.sprite.animations.stop();
    }
    stopLeft(game) {
        this.sprite.body.velocity.x = 0;
        this.sprite.animations.stop();
    }
    stopDown(game) {
        this.sprite.body.velocity.y = 0;
        this.sprite.animations.stop();
    }
    
    
    cameraFollow(game) {
    	// second parameter creates a 'deadzone' - Moving inside this Rectangle will not cause the camera to move
        game.camera.follow(this.sprite, Phaser.Camera.FOLLOW_TOPDOWN_TIGHT);
    }
    
    unstickPlayer(game) {
        this.sprite.customParams.status = "awake";
        if (this.characterType === "bandit") {
            //this.restartPtClick(game);
        }
    }    
    
    playerWakeFromKnockout(game) {
        this.sprite.customParams.status = "awake";
        if (this.characterType === "bandit") {
            //this.restartPtClick(game);
        }
    }
    
    // use this method to do stuff when the player wakes up sleep-->awake
    playerWokeFromSleep(game) {
        
    }
    
    // use this method when awake crew/bandit encounters a player not on their team (player --> bandit or bandit --> player)
    // other player could be "stuck" or "sleep"
    playerOverlapOtherTeam(game, player) {
        // player is the other player encountered
        //console.log("awake player: " + this.name + " ran into player: " + player.name);
        // only check when crew overlaps
        if (this.characterType == "crew") {
            player.emitterActive = false;
            if (this.sprite.customParams.status !== "knockout" && player.sprite.customParams.status !== "knockout") {
                var rndNum = getRandomInt(-2, 3);
                if (rndNum <= 0) {
                    // knock out bandit
                    //console.log('knocking out bandit');
                    player.sprite.customParams.status = "knockout";
                    var slot = player.doesPlayerHaveLyre();
                    if (slot > -1) {
                        this.addItemToList(player.removeItemFromList(slot));    
                    }
                    player.knockoutcount = 0;
                } else if (rndNum > 0) {
                    // knock out player
                    player.emitterActive = true;
                    player.startItemEmitter(game);
                    //console.log('knocking out player');
                    this.sprite.customParams.status = "knockout";
                    var slot = this.doesPlayerHaveLyre();
                    if (slot > -1) {
                        player.addItemToList(this.removeItemFromList(slot));
                    }
                    this.knockoutcount = 0;
                }
                player.emitterActive = false;
            }
        }
    }
    
    // use this method to define what to do if a player overlaps a container (container is not collidable)
    playerOverlapContainer(game, container) {
        if (this.characterType == "bandit") {
            if (this.moveLyreToPlayerInventory(game, container)) {
                game.gameData.lyreLocation.found = true;
            }
        }
    }
    
    // use this method to define what to do if a player collides a container (container is collidable)
    playerCollideContainer(game, container) {
        if (this.characterType == "bandit") {
            if (this.moveLyreToPlayerInventory(game, container)) {
                game.gameData.lyreLocation.found = true;
            }
        }
    }
    
    // used by bandits to pick up lyre
    moveLyreToPlayerInventory(game, container) {
        //if (container.containerstate == "closedhighlight" || container.containerstate == "open") {
            // shortcutting getting the index for bandit
            container.banditSwitchContainerState(game, this.idx-3);
        //}
        var slot = container.isLyreInContainer();
        if ( slot >= 0) {
            this.addItemToList(container.itemslist[slot]);
            container.removeItemFromList(slot);
            return true;
        }
        return false;
    }
    
    makeItemEmitter(game) {
        // the paritcle is defined by the item being used, reference game.gameData.items[<item name>].emitter
        if (game.gameData.items[this.sprite.customParams.equipped[0].name].emitter != undefined )
        {
             // create an emitter for the player
            this.emitter = game.add.emitter(this.sprite.body.x, this.sprite.body.y, 400);
            this.emitter.at(this.sprite);
            this.emitterActive = false;

            //compact way of setting the X velocity range of the emitter
            // [min=0] - The minimum value for this range
            // [max=0] - The maximum value for this range
            this.emitter.setXSpeed(-25, 25);
            this.emitter.setYSpeed(-25, 25);
            this.emitter.width = 100;
            this.emitter.height = 100;
            this.emitter.bounce.setTo(0.5, 0.5);
    
            this.emitter.bringToTop = true;
            this.emitter.setRotation(0, 0);
            
            /**
            * A more compact way of setting the alpha constraints of the particles.
            * The rate parameter, if set to a value above zero, lets you set the speed at which the Particle change in alpha from min to max.
            * If rate is zero, which is the default, the particle won't change alpha - instead it will pick a random alpha between min and max on emit.
            * @method Phaser.Particles.Arcade.Emitter#setAlpha
            * @param {number} [min=1] - The minimum value for this range.
            * @param {number} [max=1] - The maximum value for this range.
            * @param {number} [rate=0] - The rate (in ms) at which the particles will change in alpha from min to max, or set to zero to pick a random alpha between the two.
            * @param {function} [ease=Phaser.Easing.Linear.None] - If you've set a rate > 0 this is the easing formula applied between the min and max values.
            * @param {boolean} [yoyo=false] - If you've set a rate > 0 you can set if the ease will yoyo or not (i.e. ease back to its original values)
            */
            this.emitter.setAlpha(1, 10, 0);
            
            /**
            * A more compact way of setting the scale constraints of the particles.
            * The rate parameter, if set to a value above zero, lets you set the speed and ease which the Particle uses to change in scale from min to max across both axis.
            * If rate is zero, which is the default, the particle won't change scale during update, instead it will pick a random scale between min and max on emit.
            *
            * @method Phaser.Particles.Arcade.Emitter#setScale
            * @param {number} [minX=1] - The minimum value of Particle.scale.x.
            * @param {number} [maxX=1] - The maximum value of Particle.scale.x.
            * @param {number} [minY=1] - The minimum value of Particle.scale.y.
            * @param {number} [maxY=1] - The maximum value of Particle.scale.y.
            * @param {number} [rate=0] - The rate (in ms) at which the particles will change in scale from min to max, or set to zero to pick a random size between the two.
            * @param {function} [ease=Phaser.Easing.Linear.None] - If you've set a rate > 0 this is the easing formula applied between the min and max values.
            * @param {boolean} [yoyo=false] - If you've set a rate > 0 you can set if the ease will yoyo or not (i.e. ease back to its original values)
            * @return {Phaser.Particles.Arcade.Emitter} This Emitter instance.
            */
            this.emitter.setScale(0.1, 0.3, 0.1, 0.3, 0);
            this.emitter.gravity = 0;
            
            // turns off until spacebar hit
            this.emitter.kill();
        }
    }
    
    startItemEmitter(game, comm) {
        // emitter defined for the player as "this.emitter", child of the player sprite
        // the paritcle is defined by the item being used, reference game.gameData.items[<item name>].emitter
        if (this.sprite.customParams.equipped[0] != undefined && game.gameData.items[this.sprite.customParams.equipped[0].name].emitter != undefined && this.sprite.customParams.equipped[0].capacity != undefined 
           && (this.sprite.customParams.equipped[0].capacity > 0))
        {
            this.sprite.customParams.equipped[0].capacity -= 1;
            if (this.game.userPreference.data.sound === 'true') {
                this.game.lyraSound.play(this.game.lyraSound.pickSound(this.sprite.customParams.equipped[0].name, ''), false, .5);
            }
            // make particles from equipped item
            /**
            * This function generates a new set of particles for use by this emitter.
            * The particles are stored internally waiting to be emitted via Emitter.start.
            *
            * @method Phaser.Particles.Arcade.Emitter#makeParticles
            * @param {array|string} keys - A string or an array of strings that the particle sprites will use as their texture. If an array one is picked at random.
            * @param {array|number} [frames=0] - A frame number, or array of frames that the sprite will use. If an array one is picked at random.
            * @param {number} [quantity] - The number of particles to generate. If not given it will use the value of Emitter.maxParticles. If the value is greater than Emitter.maxParticles it will use Emitter.maxParticles as the quantity.
            * @param {boolean} [collide=false] - If you want the particles to be able to collide with other Arcade Physics bodies then set this to true.
            * @param {boolean} [collideWorldBounds=false] - A particle can be set to collide against the World bounds automatically and rebound back into the World if this is set to true. Otherwise it will leave the World.
            * @return {Phaser.Particles.Arcade.Emitter} This Emitter instance.
            */
            this.emitter.makeParticles(game.gameData.items[this.sprite.customParams.equipped[0].name].emitter,0,10,false);
            game.physics.arcade.enable(this.emitter);
            
    
            /**
            * Call this function to emit the given quantity of particles at all once (an explosion)
            * 
            * @method Phaser.Particles.Arcade.Emitter#explode
            * @param {number} [lifespan=0] - How long each particle lives once emitted in ms. 0 = forever.
            * @param {number} [quantity=0] - How many particles to launch.
            * @return {Phaser.Particles.Arcade.Emitter} This Emitter instance.
            */
            this.emitterActive = true;
            this.emitter.at(this.sprite);
        
            //	false means don't explode all the sprites at once, but instead release at a rate of 20 particles per frame
            //	The 5000 value is the lifespan of each particle
            //this.emitter.start(false, 5000, 20);
        
        
            this.emitter.explode(1000, 50);
            // emitter.emitX = 200;
        
            // //game.add.tween(emitter).to( { emitX: 700 }, 2000, Phaser.Easing.Sinusoidal.InOut, true, 0, Number.MAX_VALUE, true);
            // game.add.tween(emitter).to( { emitX: 600 }, 2000, Phaser.Easing.Back.InOut, true, 0, Number.MAX_VALUE, true);
            if (this.sprite.customParams.equipped[0].capacity < 1) {
                // switch to empty
                if (this.sprite.customParams.equipped[0].name == "coffeecup") {
                    this.sprite.customParams.equipped[0] = new ContainerItem(0, "coffeecupempty");
                }
                if (this.sprite.customParams.equipped[0].name == "suppresant") {
                    this.sprite.customParams.equipped[0] = new ContainerItem(0, "suppresantEmpty");
                }
                comm.resetCommunicatorInventory();
            }
        }
    }
    
    stopItemEmitter(game) {
        //this.emitter.kill();
        this.emitterActive = false;
        //this.emitter.stop();
    }
    
    doesPlayerHaveLyre() {
        for (var i=0; i<this.sprite.customParams.inventory.length; i++){
            // [TODO] second condition is only to help with debug while item pick up in work
            if (this.sprite.customParams.inventory[i].name == "lyre") {
                return i;
            }
        }
        for (var i=0; i<this.sprite.customParams.equipped.length; i++){
            if (this.sprite.customParams.equipped[i].name == "lyre") {
                return i;
            }
        }
        return -1;
    }
    
    // player which room am I in map? method
    // returns the room name (mapName in roomManager) or empty string.  Empty is either the passages or esacape pods currently
    playerWhereAmI(game, map) {
        //this.map.map.layers[idx].name has the name equal to map name for cc, d, mh, r1, r2, r3, r4, r5, r6
        // this.map.map.layers[idx].data has 46 arrays of 64 elements, if not zero then part of the floor for corresponding room
        
        // find floor tile nearest sprite location
        var tileX = Math.floor(this.sprite.body.center.x/game.gameData.tile_size);
        var tileY = Math.ceil(this.sprite.body.center.y/game.gameData.tile_size);
        
        // find floor if in a room
        for (var i = 0; i<map.layers.length; i++) {
            if (map.layers[i].name != "walls" && map.layers[i].name != "doors" && map.layers[i].name != "floors"
               && map.layers[i].name != "rooms" && map.layers[i].name != "suppresant") {
                if (map.layers[i].data[tileY][tileX].index > 0 ) {
                    return map.layers[i].name;
                }
            }
        }
        return "";
    }
    
        
    // doors connected to the room I am in
    // this method depends on the naming convention for door names identifying the room
    // <room1>_<room2> 
    roomsConnectingToThisRoom(game, map, roomMapName) {
        var doorArray = [];
        for (var i=0; i<map.objects["doors"].length ; i++) {
            var idx = map.objects["doors"][i].name.indexOf(roomMapName);
            if (idx == 0){
                doorArray.push( map.objects["doors"][i].name.substring(map.objects["doors"][i].name.indexOf("_")+1,map.objects["doors"][i].name.length));
            }
            else if (idx > 0) {
                doorArray.push( map.objects["doors"][i].name.substring(0, map.objects["doors"][i].name.indexOf("_")));
            }
        }
        return (doorArray);
    }
    
    
    savePlayer() {
        //[TODO] stringify inventory and equipped?
        var playerData = {
            isSelected : this.isSelected,
            name : this.name,
            idx : this.idx,
            characterType : this.characterType,
            characterIdx :  this.characterIdx,
            knockoutcount : this.knockoutcount,
            walking : this.sprite.customParams.walking,
            pathfound : this.sprite.customParams.pathfound,
            inventory : this.sprite.customParams.inventory,
            equipped : this.sprite.customParams.equipped,
            status : this.sprite.customParams.status,
            dest_x : this.sprite.customParams.dest_x,
            dest_y : this.sprite.customParams.dest_y,
            path: this.sprite.customParams.path,
            velocityx : this.sprite.body.velocity.x,
            velocityy : this.sprite.body.velocity.y,
            frame : this.sprite.frame,
            angularDrag : this.sprite.body.angularDrag,
            x : this.sprite.body.center.x,
            y : this.sprite.body.center.y,
            containerList : this.sprite.customParams.containerList,
            currentRoom: this.sprite.customParams.currentRoom
        }
        return playerData;
    }
    
}

Player.preloadPlayer = function (game) {
    //Load the items needed: 1st-> Player Name/Key 2nd-> URL to asset
    for (var i=0; i<game.gameData.characters.length; i++) {
        game.load.spritesheet(game.gameData.characters[i].name, game.gameData.characters[i].playerRef, game.gameData.characters[i].width, game.gameData.characters[i].height, game.gameData.characters[i].frames);
    }        
}

Player.rawData = function (game, idx, playerLocType) {
    var playerData = {
        isSelected : playerLocType.isSelected,
        idx : idx,
        name : game.gameData.characters[playerLocType.characterIdx].name,
        characterType : playerLocType.characterType,
        characterIdx :  playerLocType.characterIdx,
        knockoutcount : 0,
        walking : game.gameData.characters[playerLocType.characterIdx].walking,
        pathfound : true,
        inventory : [],
        equipped : [],
        status : playerLocType.status,
        dest_x : game.gameData.characters[playerLocType.characterIdx].dest_x,
        dest_y : game.gameData.characters[playerLocType.characterIdx].dest_y,
        path : [],
        velocityx : game.gameData.characters[playerLocType.characterIdx].velocityx,
        velocityy : game.gameData.characters[playerLocType.characterIdx].velocityy,
        frame : game.gameData.characters[playerLocType.characterIdx].frame,
        angulardrag : game.gameData.characters[playerLocType.characterIdx].angulardrag,
        containerList : [],
        currentRoom: ""
    }
        // setup inventory as ContainerItem
        for (var i=0; i<game.gameData.characters[playerLocType.characterIdx].inventory.length; i++){
            var itemName = game.gameData.characters[playerLocType.characterIdx].inventory[i];
            if (itemName.length > 0) {
                if (game.gameData.items[itemName].capacity != undefined) {
                    playerData.inventory[i] = new ContainerItem(i, itemName, game.gameData.items[itemName].capacity);
                }
                else {
                    playerData.inventory[i] = new ContainerItem(i, itemName);
                }
            }
        }
    
        for (var i=0; i<game.gameData.characters[playerLocType.characterIdx].equipped.length; i++){
            var itemName = game.gameData.characters[playerLocType.characterIdx].equipped[i];
            if (itemName.length > 0) {
                if (game.gameData.items[itemName].capacity != undefined) {
                    playerData.equipped[i] = new ContainerItem(i, itemName, game.gameData.items[itemName].capacity);
                }
                else {
                    playerData.equipped[i] = new ContainerItem(i, itemName);
                }
            } else {
                playerData.equipped = "empty";
            }
        }

    return (playerData);
}

// this class will manage all players and bandits
// playerLocType needs the following: 
//    isSelected : true/false
//    characterIdx : corresponds to index in gameData character array
//    characterType : "crew" or "bandit"
//    status : player status (walk, stuck, sleep)
//    x : x location for character
//    y : y location
class PlayerManager {
    constructor (game, playerLocType, grid, containerManager) {
        this.players = [];
        // indexes in the array corresponding to the type character
        this.crew = [];
        this.bandit = [];
        // if bandits have visited a container, add to this list (deprioritize)
        this.banditContainerList = [];
        // if bandits have visited a room, add to this list(deprioritize)
        this.banditRoomList = [];

        if  (game.gameData.playerarray.length < 1) {
            for (var i = 0; i < playerLocType.length; i++) {
                if (playerLocType[i].characterType == "crew") {
                    this.crew.push(i);
                }
                else {
                    this.bandit.push(i);
                }
                this.players[i] = new Player(); //(game, x, y, idx)
                var playerData = Player.rawData(game, i, playerLocType[i]);
                this.players[i].addPlayer(game,playerLocType[i].x, playerLocType[i].y, playerData);
                this.players[i].setupPathFinder(game, grid);
            }
            this.banditAIdata(game, containerManager);
           // console.log(this.players);
        }
        else {
            // load existing containers into array
            for (var i = 0; i < game.gameData.playerarray.length ; i++) {
                this.players[i] = new Player();
                this.players[i].addPlayer(game, game.gameData.playerarray[i].x, game.gameData.playerarray[i].y, game.gameData.playerarray[i]);
                this.players[i].setupPathFinder(game, grid);
                if (this.players[i].characterType == "crew") {
                    this.crew.push(i);
                }
                else {
                    this.bandit.push(i);
                }

            }
            
            // restore lyre data
            game.gameData.lyreLocation.found = game.gameData.lyreData.found;
            game.gameData.lyreLocation.playerIdx = game.gameData.lyreData.playerIdx;
            game.gameData.lyreLocation.containerIdx = game.gameData.lyreData.containerIdx;
            
            // restore bandit data
            game.gameData.banditAIdata = game.gameData.banditDataRestore;
            for (var i=0; i<game.gameData.containersToSearch.length; i++) {
                game.gameData.banditAIdata.containersToSearch[game.gameData.containersToSearchRoomRef[i]] = game.gameData.containersToSearch[i];
            }
        }
        for (var i = 0; i <this.bandit.length; i++) {
            // restart ptClick
            if (this.players[this.bandit[i]].sprite.customParams.walking && this.players[this.bandit[i]].sprite.customParams.dest_x != null && this.players[this.bandit[i]].sprite.customParams.dest_y != null )
            {
               this.players[this.bandit[i]].restartPtClick(game);
            } 
        }
    }
    
    // returns 0 if isSelected not set
    findSelectedPlayer () {
        var playerIdx = 0;
        for (var i=0; i< this.players.length; i++) {
            if (this.players[i].isSelected) {
                playerIdx = i;
            }
        }
        return playerIdx;

    }

    // returns -1 if selected player is not awake
    findSelectedAwakePlayer () {
        var playerIdx = -1;
        for (var i=0; i< this.players.length; i++) {
            if (this.players[i].isSelected && this.players[i].sprite.customParams.status == "awake") {
                playerIdx = i;
            }
        }
        return playerIdx;

    }

    // returns -1 if selected player is not awake
    findSelectedNotSleepingPlayer () {
        var playerIdx = -1;
        for (var i=0; i< this.players.length; i++) {
            if (this.players[i].isSelected && this.players[i].sprite.customParams.status != "sleep" && this.players[i].sprite.customParams.status != "knockout") {
                playerIdx = i;
            }
        }
        return playerIdx;

    }

    
    // returns true if no players awake or if players have no capacity to suppress slime
    isAnyCrewAwake() {
        for (var i=0; i< this.crew.length; i++) {
            if (this.players[this.crew[i]].sprite.customParams.status == "awake" || this.players[this.crew[i]].sprite.customParams.status == "knockout") {
                return false;
            }
            if (this.players[this.crew[i]].sprite.customParams.status == "stuck") {
                // if player has item in equipped to suppress slime, don't end
                for (var i=0;i<this.players[this.crew[i]].sprite.customParams.equipped.length; i++) {
                    if (this.players[this.crew[i]].sprite.customParams.equipped[i].capacity != undefined &&
                        this.players[this.crew[i]].sprite.customParams.equipped[i].capacity > 0) {
                        return false;
                    }
                }
                // if player has item in inventory to suppress slime, don't end
                for (var i=0; i<this.players[this.crew[i]].sprite.customParams.inventory.length; i++) {
                    if (this.players[this.crew[i]].sprite.customParams.inventory[i].capacity != undefined &&
                    this.players[this.crew[i]].sprite.customParams.inventory[i].capacity > 0) {
                        return false;
                    }
                }
            }
        }
        return true; 
    }

    // updates the player array first for crew and then for bandits
    updatePlayerArray(game,  walls, floors, map, containerManager, roomManager, lyrelocator) {
        // update players
        for (var i=0; i< this.crew.length; i++) {
            this.players[this.crew[i]].updateCrew(game, walls, floors, map, containerManager);
            this.players[this.crew[i]].knockoutcount += 1;
            if (this.players[this.crew[i]].sprite.customParams.status == "knockout" && this.players[this.crew[i]].knockoutcount > 100) {
                this.players[this.crew[i]].sprite.customParams.status = "awake";
            }
        }
        this.updateBanditAI(game, walls, floors, map, containerManager, roomManager);
        
        // loop through player arrays to find overlap between players
        for (var i=0; i<this.players.length; i++) {
            for (var j=0; j<this.players.length; j++) {
                if (i != j) {
                    if (game.physics.arcade.overlap(this.players[i].sprite, this.players[j].sprite) ) {
                        if (this.players[i].characterType == "crew" && this.players[j].characterType == "crew") {
                            if (this.players[j].sprite.customParams.status == "sleep") {
                                // wake up sleeping player
                                this.players[j].sprite.customParams.status = "awake";
                                this.players[j].playerWokeFromSleep(game);
                            }
                        }
                        if (this.players[i].characterType !=  this.players[j].characterType) {
                            if (this.players[i].sprite.customParams.status == "awake" || this.players[i].sprite.customParams.status == "knockout") {
                                // do something - ran into bandit
                                this.players[i].playerOverlapOtherTeam(game, this.players[j]);
                            }
                        }
                    }
                }
            }
            // [TODO] it would be better to do this asyncronously when items are picked up or dropped
            if (this.players[i].doesPlayerHaveLyre() >= 0) {
                lyrelocator.playerPickUpLyre(game, this.players[i]);
            }

        }

    }


    // setup data management for bandit AI
    banditAIdata(game, containerManager) {
        if (game.gameData.banditAIdata == undefined) {
            // containersSearchedList list of indices of containers that have been searched
            // roomsSearchedList list of indices of rooms that have been searched
            // lyreLocation is defined in mapInit when map is built. The data is an object {x: <coord>, y: <coord>, found:true/false}
            game.gameData.banditAIdata = {
                containersToSearch: [],
                banditParams: [],
                lyreStartLoc: game.gameData.lyreLocation
            };
            for (var i=0; i< this.bandit.length; i++) {
                game.gameData.banditAIdata.banditParams[i] = {
                    updateCount: 0,
                    containerObjective: -1
                }
            }
            // copy the array of containers organized by room
            game.gameData.banditAIdata.containersToSearch = containerManager.containerRoomArray;
            // remove containers that we don't care about
            delete game.gameData.banditAIdata.containersToSearch["unknown"];
            delete game.gameData.banditAIdata.containersToSearch["e1"];
            delete game.gameData.banditAIdata.containersToSearch["e2"];
            delete game.gameData.banditAIdata.containersToSearch["e3"];
            delete game.gameData.banditAIdata.containersToSearch["e4"];
            var iterator = Object.keys(game.gameData.banditAIdata.containersToSearch);
            for (var i=0; i< iterator.length; i++) {
                var containerIdxArr = game.gameData.banditAIdata.containersToSearch[iterator[i]];
                // splice off the end so indices don't change
                for (var j=containerIdxArr.length-1; j >=0; j--) {
                    if ((containerManager.containers[containerIdxArr[j]].name === "danceFloor") || (containerManager.containers[containerIdxArr[j]].name === "transparent") || (containerManager.containers[containerIdxArr[j]].name === "escapepod") || (containerManager.containers[containerIdxArr[j]].itemscapacity === 0)  ||  (containerManager.containers[containerIdxArr[j]].name === "espresso") )
                    {   // no need to check these from initial list
                        game.gameData.banditAIdata.containersToSearch[iterator[i]].splice(j,1);
                    }
                }
                if (game.gameData.banditAIdata.containersToSearch[iterator[i]].length < 1) {
                     // no need to check this room
                   delete game.gameData.banditAIdata.containersToSearch[iterator[i]];
                }
            }
        } 
    }
    
    
    // state:
            // walking = true if there's a path and bandit is progressing on it, set to false when calculating path or reached destination
            // pathfound = false when path is calculating, otherwise true
            // states           pathfound   walking
            // at destination   true        false
            // on path          true        true
            // calculating      false       false/true

getBanditUpdateState(game, banditIdx) {
    // magic number of how many updates before we check that the bandit is still doing something
    var updateCheck = 300;
    if (this.players[this.bandit[banditIdx]].sprite.customParams.walking && this.players[this.bandit[banditIdx]].sprite.customParams.pathfound 
                && game.gameData.banditAIdata.banditParams[banditIdx].updateCount < updateCheck) {
                    // on path and walking
                    return ("ontrack");
    }

    if (this.players[this.bandit[banditIdx]].sprite.customParams.walking && this.players[this.bandit[banditIdx]].sprite.customParams.pathfound
                     && game.gameData.banditAIdata.banditParams[banditIdx].updateCount >= updateCheck) {
                    // check that the banidt is on ontrack
                    return ("checkpath");
    }
    
    if (!this.players[this.bandit[banditIdx]].sprite.customParams.walking && this.players[this.bandit[banditIdx]].sprite.customParams.pathfound) {
        // player is at destination
        // [TODO] split this into objective reached and need to continue search
                return ("atdestination");
        }
    
    if (!this.players[this.bandit[banditIdx]].sprite.customParams.pathfound && game.gameData.banditAIdata.banditParams[banditIdx].updateCount >= updateCheck) {
        // path calculation is taking a ridiculous amount of time, restart
            return ("pathcalcstuck");
    } 
    
    if (!this.players[this.bandit[banditIdx]].sprite.customParams.pathfound && game.gameData.banditAIdata.banditParams[banditIdx].updateCount < updateCheck) {
        // path is calculating, wait
        return("calculating");
    }
    


    return ("stuck")
}
    
    // bandit states
    // 1) bandit has lyre, all return to dock
    // 2) lyre has been found, 
    //     a) give bandit current coords of lyre every xx updates
    //     b) bandit overlaps player - steal lyre
    // 3) lyre in container found
    //     a) go to container
    // 4) lyre in container not found
    //     a) search containers in room bandit is in
    //     b) go to next room with containers

    // update lyre location to player location if in player inventory
   updateBanditAI(game, walls, floors, map, containerManager, roomManager) {
        var banditsHaveLyre = false;
        var playersHaveLyre = false;
        // if player has lyre is it a bandit or crew?        
        if (game.gameData.lyreLocation.playerIdx >= 0) {
            if (this.players[game.gameData.lyreLocation.playerIdx].characterType == "crew") {
                playersHaveLyre = true;
            } else {
                banditsHaveLyre = true;
            }
        }

        var text = "banditState: ";

        for (var i=0; i< this.bandit.length; i++) {
            game.gameData.banditAIdata.banditParams[i].updateCount += 1;
            this.players[this.bandit[i]].knockoutcount += 1;
            if (this.players[this.bandit[i]].sprite.customParams.status == "knockout" && this.players[this.bandit[i]].knockoutcount > 100) {
                this.players[this.bandit[i]].sprite.customParams.status = "awake";
            } else if (this.players[this.bandit[i]].sprite.customParams.status == "stuck") {
                this.players[this.bandit[i]].startItemEmitter(game);
                this.players[this.bandit[i]].sprite.body.velocity.x = 0;
                this.players[this.bandit[i]].sprite.body.velocity.y = 0;
                this.players[this.bandit[i]].sprite.customParams.path = [];
            } else if (this.players[this.bandit[i]].sprite.customParams.status != "knockout"){
                var banditState = this.getBanditUpdateState(game, i);
                text = text + banditState;
                // assuming the bandits only pick up the lyre, this is going to indicate recall to dock
                if (banditsHaveLyre) {
                    // set bandit path
                    game.gameData.banditAIdata.banditParams[i].containerObjective = -1;
                    text = text + " return to dock";
                    this.returnToDock(game, walls, floors, map, containerManager, roomManager, banditState, i);
                }
                if (playersHaveLyre) {
                    // [TODO] follow player
                    // update path every xx updates
                    game.gameData.banditAIdata.banditParams[i].containerObjective = -1;
                    text = text + " follow player";
                    this.pathUpdateFromLyreLocation(game, walls, floors, map, containerManager, banditState,  i);
                }
                //no players have the lyre
                if (!banditsHaveLyre && !playersHaveLyre) {
                    // lyre is in a container
                    if (game.gameData.lyreLocation.found) {
                        // bandits heard sound, head for this container
                        // update path in case lyre is moved
                        text = text + " lyre found in container " + game.gameData.lyreLocation.containerIdx;
                        this.pathUpdateFromLyreLocation (game, walls, floors, map, containerManager, banditState, i);
                    }
                    else {
                        if (game.gameData.banditAIdata.banditParams[i].containerObjective < 0) {
                            // start condition - need a destination
                            banditState = "atdestination";
                        }
                        else {
                            text = text + " looking in " + containerManager.containers[game.gameData.banditAIdata.banditParams[i].containerObjective].name;
                        }
                        text = text + " idx: " + game.gameData.banditAIdata.banditParams[i].containerObjective;
                        

                        this.pathUpdateFromContainerLocation (game, walls, floors, map, containerManager, banditState, i, game.gameData.banditAIdata.banditParams[i].containerObjective);
                    }
                }
            }
            text = text + " update count: " + game.gameData.banditAIdata.banditParams[i].updateCount;
            text = text + " dest_x: " + this.players[this.bandit[i]].sprite.customParams.dest_x + " dest_y: " +  this.players[this.bandit[i]].sprite.customParams.dest_y;
            text = text + " path length: " + this.players[this.bandit[i]].sprite.customParams.path.length;
            // values from restart pt-click method
            //Math.floor(this.sprite.customParams.dest_x/game.gameData.tile_size), Math.ceil(this.sprite.customParams.dest_y/game.gameData.tile_size)
            if (this.players[this.bandit[i]].grid != null) {
                text = text + " grid x: " + Math.floor(this.players[this.bandit[i]].sprite.customParams.dest_x/game.gameData.tile_size);
                text = text + " grid y: " + Math.ceil(this.players[this.bandit[i]].sprite.customParams.dest_y/game.gameData.tile_size);
                text = text + " grid value: " + 
                       this.players[this.bandit[i]].grid[Math.ceil(this.players[this.bandit[i]].sprite.customParams.dest_y/game.gameData.tile_size)][Math.floor(this.players[this.bandit[i]].sprite.customParams.dest_x/game.gameData.tile_size)];
            }
            text = text + " sprite x: " + this.players[this.bandit[i]].sprite.body.x;
            text = text + " sprite y: " + this.players[this.bandit[i]].sprite.body.y;
            //this.players[this.bandit[i]].addBanditAIText(game, text);
        }
   }


   pathUpdateFromLyreLocation (game, walls, floors, map, containerManager, banditState, idx) {
        switch (banditState) {
            case ("ontrack") :
                this.players[this.bandit[idx]].updateBandit(game, walls, floors, map, containerManager);
            break;

            case ("checkpath") :
              var lyrePosOffset = this.findOffsetForSearch(game, this.players[this.bandit[idx]], containerManager.containers[game.gameData.lyreLocation.containerIdx]);
              if (this.players[this.bandit[idx]].sprite.customParams.dest_x != lyrePosOffset[0] 
                    || this.players[this.bandit[idx]].sprite.customParams.dest_y != lyrePosOffset[1]) {

                    if (game.gameData.lyreLocation.containerIdx >= 0) {
                        // lyre in container
                        // set new destination
                        this.jiggleContainerDestination(game, this.players[this.bandit[idx]], idx, containerManager.containers[game.gameData.lyreLocation.containerIdx]);
                    } else {
                        // set new destination (lyreLocation is updated each cycle in containerManager and playerManager player updates)
                        this.players[this.bandit[idx]].sprite.customParams.dest_x = game.gameData.lyreLocation.x;
                        this.players[this.bandit[idx]].sprite.customParams.dest_y = game.gameData.lyreLocation.y;
                        // reset update updateCount
                        game.gameData.banditAIdata.banditParams[idx].updateCount = 0;

                        // generate path
                        this.players[this.bandit[idx]].restartPtClick(game);
                    }
                    //console.log("following lyre, path calc for bandit " + idx);
                    //console.log(game.gameData.banditAIdata);
                    //console.log(this.players[this.bandit[idx]]);


              }
            break;

            case ("atdestination") :
                // the player should have picked up the lyre and never get here
                    // set new destination (lyreLocation is updated each cycle in containerManager and playerManager player updates)
 
                    if (game.gameData.lyreLocation.containerIdx >= 0) {
                        // lyre in container
                        // set new destination
                        this.jiggleContainerDestination(game, this.players[this.bandit[idx]], idx, containerManager.containers[game.gameData.lyreLocation.containerIdx]);
                    } else {
                        // set new destination (lyreLocation is updated each cycle in containerManager and playerManager player updates)
                        this.players[this.bandit[idx]].sprite.customParams.dest_x = game.gameData.lyreLocation.x;
                        this.players[this.bandit[idx]].sprite.customParams.dest_y = game.gameData.lyreLocation.y;
                        // reset update updateCount
                        game.gameData.banditAIdata.banditParams[idx].updateCount = 0;
                        // generate path
                        this.players[this.bandit[idx]].restartPtClick(game);
                    }
                    //console.log("following lyre, found destination path calc for bandit " + idx);
                    //console.log(game.gameData.banditAIdata);
                    //console.log(this.players[this.bandit[idx]]);


            break;

            case ("pathcalcstuck") :
                //console.log("following lyre, path calc stuck for bandit " + idx);
                //console.log(this.players[this.bandit[idx]]);
                // jiggle location
                var xoffset = (getRandomInt(-10, 10));
                var yoffset = (getRandomInt(-10, 10));
                if (game.gameData.lyreLocation.containerIdx >= 0) {
                    // lyre in container
                    // set new destination
                    this.jiggleContainerDestination(game, this.players[this.bandit[idx]], idx, containerManager.containers[game.gameData.lyreLocation.containerIdx]);
                } else {
                    // set new destination (lyreLocation is updated each cycle in containerManager and playerManager player updates)
                    var offsetVerified =  this.limitBanditDestToWorldBounds(game.gameData.lyreLocation.x + xoffset, game.gameData.lyreLocation.y + yoffset
                       , this.players[this.bandit[idx]].grid[0].length, this.players[this.bandit[idx]].grid.length, game.gameData.tile_size);
                    this.players[this.bandit[idx]].sprite.customParams.dest_x = offsetVerified[0];
                    this.players[this.bandit[idx]].sprite.customParams.dest_y = offsetVerified[1];     
                    game.gameData.banditAIdata.banditParams[idx].updateCount = 0;
                    this.players[this.bandit[idx]].restartPtClick(game);
                }

      
            break;

            case "calculating":
                // do nothing
                break;
                
            default:
                //console.log("following lyre but stuck, bandit " + idx);
                //console.log(this.players[this.bandit[idx]]);
                // jiggle location
                var xoffset = (getRandomInt(-10, 10));
                var yoffset = (getRandomInt(-10, 10));
                if (game.gameData.lyreLocation.containerIdx >= 0) {
                    // lyre in container
                    // set new destination
                    this.jiggleContainerDestination(game, this.players[this.bandit[idx]], idx, containerManager.containers[game.gameData.lyreLocation.containerIdx]);
                } else {
                    // set new destination (lyreLocation is updated each cycle in containerManager and playerManager player updates)
                    var offsetVerified =  this.limitBanditDestToWorldBounds(game.gameData.lyreLocation.x + xoffset, game.gameData.lyreLocation.y + yoffset, 
                        this.players[this.bandit[idx]].grid[0].length, this.players[this.bandit[idx]].grid.length, game.gameData.tile_size);
                    this.players[this.bandit[idx]].sprite.customParams.dest_x = offsetVerified[0];
                    this.players[this.bandit[idx]].sprite.customParams.dest_y = offsetVerified[1];     
                    game.gameData.banditAIdata.banditParams[idx].updateCount = 0;
                    this.players[this.bandit[idx]].restartPtClick(game);

                }          
        }
   }


    returnToDock(game, walls, floors, map, containerManager, roomManager, banditState, idx) {
        switch (banditState) {
            case ("ontrack") :
                this.players[this.bandit[idx]].updateBandit(game, walls, floors, map, containerManager);
            break;

            case ("checkpath") :
            //   if (this.players[this.bandit[idx]].sprite.customParams.dest_x != roomManager.rooms[roomManager.dockIdx].center_x 
            //     || this.players[this.bandit[idx]].sprite.customParams.dest_y != roomManager.rooms[roomManager.dockIdx].center_y) {

                    // set new destination (lyreLocation is updated each cycle in containerManager and playerManager player updates)
                    this.players[this.bandit[idx]].sprite.customParams.dest_x = roomManager.rooms[roomManager.dockIdx].center_x;
                    this.players[this.bandit[idx]].sprite.customParams.dest_y = roomManager.rooms[roomManager.dockIdx].center_y;

                    //console.log("returning to dock, path calc for bandit " + idx);
                    //console.log(game.gameData.banditAIdata);
                    //console.log(this.players[this.bandit[idx]]);

                    // reset update updateCount
                    game.gameData.banditAIdata.banditParams[idx].updateCount = 0;

                    // generate path
                    this.players[this.bandit[idx]].restartPtClick(game);
            //   }
            break;

            case ("atdestination") :
                // the player should have picked up the lyre and never get here
                // bandit with lyre back at the dock
                if (this.players[this.bandit[idx]].idx == game.gameData.lyreLocation.playerIdx  && this.players[this.bandit[idx]].playerWhereAmI(game, map) == "d" ) {
                    //console.log("bandit found dock with lyre");
                    game.gameData.gameresult = "banditshavelyre";
                } else {
                    // just picked up the lyre need to return to dock
                    // set new destination (lyreLocation is updated each cycle in containerManager and playerManager player updates)
                    this.players[this.bandit[idx]].sprite.customParams.dest_x = roomManager.rooms[roomManager.dockIdx].center_x;
                    this.players[this.bandit[idx]].sprite.customParams.dest_y = roomManager.rooms[roomManager.dockIdx].center_y;

                    //console.log("returning to dock, path calc for bandit " + idx);
                    //console.log(game.gameData.banditAIdata);
                    //console.log(this.players[this.bandit[idx]]);

                    // reset update updateCount
                    game.gameData.banditAIdata.banditParams[idx].updateCount = 0;

                    // generate path
                    this.players[this.bandit[idx]].restartPtClick(game);
                }
            break;

            case ("pathcalcstuck") :
                //console.log("returning to dock, path calc stuck for bandit " + idx);
                //console.log(this.players[this.bandit[idx]]);
                if (this.players[this.bandit[idx]].idx == game.gameData.lyreLocation.playerIdx && this.players[this.bandit[idx]].playerWhereAmI(game, map) == "d" ) {
                    //console.log("bandit with lyre back at dock");
                    game.gameData.gameresult = "banditshavelyre";
                }
                // jiggle location
                var xoffset = (getRandomInt(-10, 10));
                var yoffset = (getRandomInt(-10, 10));
                var offsetVerified =  this.limitBanditDestToWorldBounds(roomManager.rooms[roomManager.dockIdx].center_x + xoffset, roomManager.rooms[roomManager.dockIdx].center_y + yoffset, 
                        this.players[this.bandit[idx]].grid[0].length, this.players[this.bandit[idx]].grid.length, game.gameData.tile_size);
                this.players[this.bandit[idx]].sprite.customParams.dest_x = offsetVerified[0];
                this.players[this.bandit[idx]].sprite.customParams.dest_y = offsetVerified[1];            
                game.gameData.banditAIdata.banditParams[idx].updateCount = 0;
                this.players[this.bandit[idx]].restartPtClick(game);
            break;

            case "calculating":
                // do nothing
                break;

            default:
                //console.log("returning to dock, bandit " + idx);
                //console.log(this.players[this.bandit[idx]]);
                if (this.players[this.bandit[idx]].idx == game.gameData.lyreLocation.playerIdx && this.players[this.bandit[idx]].playerWhereAmI(game, map) == "d" ) {
                    game.gameData.gameresult = "banditshavelyre";
                }
                // jiggle location
                var xoffset = (getRandomInt(-10, 10));
                var yoffset = (getRandomInt(-10, 10));
                var offsetVerified =  this.limitBanditDestToWorldBounds(roomManager.rooms[roomManager.dockIdx].center_x + xoffset, roomManager.rooms[roomManager.dockIdx].center_y + yoffset, 
                        this.players[this.bandit[idx]].grid[0].length, this.players[this.bandit[idx]].grid.length, game.gameData.tile_size);
                this.players[this.bandit[idx]].sprite.customParams.dest_x = offsetVerified[0];
                this.players[this.bandit[idx]].sprite.customParams.dest_y = offsetVerified[1];            
                game.gameData.banditAIdata.banditParams[idx].updateCount = 0;
                this.players[this.bandit[idx]].restartPtClick(game);
        }
    }

    pathUpdateFromContainerLocation (game, walls, floors, map, containerManager, banditState, idx, containerIdx) {
        // banditState set to "atdestination" of containerIdx < 0
        
        // jiggle location
        switch (banditState) {
            case ("ontrack") :
                this.players[this.bandit[idx]].updateBandit(game, walls, floors, map, containerManager);
            break;

            case ("checkpath") :
                // var containerPosOffset = this.findOffsetForSearch(game, this.players[this.bandit[idx]], containerManager.containers[containerIdx]);
                // if (this.players[this.bandit[idx]].sprite.customParams.dest_x != containerPosOffset[0] 
                //     || this.players[this.bandit[idx]].sprite.customParams.dest_y != containerPosOffset[1]) {
                        this.jiggleContainerDestination(game, this.players[this.bandit[idx]], idx, containerManager.containers[containerIdx]);
                // }
                game.gameData.banditAIdata.banditParams[idx].updateCount = 0;
            break;

            case ("atdestination") :
                // this means the container has been found and checked
                // get next container index
                if (game.gameData.banditAIdata.banditParams[idx].containerObjective < 0) {
                    var roomName = this.players[this.bandit[idx]].playerWhereAmI(game, map) ;
                    game.gameData.banditAIdata.banditParams[idx].containerObjective = this.findNextContainerToSearch(game, map,  roomName, idx, containerManager);
                    // set new destination
                    this.setContainerDestination(game, this.players[this.bandit[idx]], idx, containerManager.containers[game.gameData.banditAIdata.banditParams[idx].containerObjective])
                }
                else {
                    // found destination but not container
                     this.jiggleContainerDestination(game, this.players[this.bandit[idx]], idx, containerManager.containers[containerIdx]);
                }
            break;

            case ("pathcalcstuck") :
                // var containerPosOffset = this.findOffsetForSearch(game, this.players[this.bandit[idx]], containerManager.containers[containerIdx]);
                // if (this.players[this.bandit[idx]].sprite.customParams.dest_x != containerPosOffset[0] 
                //     || this.players[this.bandit[idx]].sprite.customParams.dest_y != containerPosOffset[1]) {
                        this.jiggleContainerDestination(game, this.players[this.bandit[idx]], idx, containerManager.containers[containerIdx]);
                // }
                game.gameData.banditAIdata.banditParams[idx].updateCount = 0;
            break;

            case "calculating":
                // do nothing
                break;

            default:
                this.jiggleContainerDestination(game, this.players[this.bandit[idx]], idx, containerManager.containers[containerIdx]);
        }
    }
    
    getVerifiedOffset(game, bandit, container) {
        var offset = this.findOffsetForSearch(game, bandit, container);
        // console.log("getVerifiedOffset");
        // console.log(offset);
        var xoffset = (getRandomInt(-40, 40));
        var yoffset = (getRandomInt(-40, 40));
        var offsetVerified =  this.limitBanditDestToWorldBounds(offset[0] + xoffset, offset[1] + yoffset, bandit.grid[0].length, bandit.grid.length, game.gameData.tile_size);
        // console.log(offsetVerified);
        // console.log(bandit);
        // console.log(container);
        return offsetVerified;
    }
    

    jiggleContainerDestination(game, bandit, idx, container) {
        // set new destination
        // console.log("jiggleContainerDestination");
        var offsetVerified = this.getVerifiedOffset(game, bandit, container);
        // check that the grid is 0 for this destination
        // break loop just in case it gets stuck
        var loopBreak = 0;
        var gridCoord = this.calculateGridCoordinates(offsetVerified[0], offsetVerified[1], bandit.grid[0].length, bandit.grid.length, game.gameData.tile_size);
        // console.log(offsetVerified);
        // console.log(bandit);
        // console.log(gridCoord);
        while (bandit.grid[gridCoord[1]][gridCoord[0]] > 0 && loopBreak < 100) {
            offsetVerified = this.getVerifiedOffset(game, bandit, container);
            gridCoord = this.calculateGridCoordinates(offsetVerified[0], offsetVerified[1], bandit.grid[0].length, bandit.grid.length, game.gameData.tile_size);
            // console.log(gridCoord);
            loopBreak += 1;
        } 
        
        bandit.sprite.customParams.dest_x = offsetVerified[0];
        bandit.sprite.customParams.dest_y = offsetVerified[1];            

        // reset update updateCount
        game.gameData.banditAIdata.banditParams[idx].updateCount = 0;
        
        // generate path
        bandit.restartPtClick(game);
    }
    
    setContainerDestination(game, bandit, idx, container) {
        // set new destination
        var offset = this.findOffsetForSearch(game, bandit, container);
        var offsetVerified =  this.limitBanditDestToWorldBounds(offset[0], offset[1], bandit.grid[0].length, bandit.grid.length, game.gameData.tile_size);
        // check that the grid is 0 for this destination
        // break loop just in case it gets stuck
        var loopBreak = 0;
        // console.log("setContainerDestination");
        // console.log(offset);
        // console.log(offsetVerified);
        // console.log(bandit);
        var gridCoord = this.calculateGridCoordinates(offsetVerified[0], offsetVerified[1], bandit.grid[0].length, bandit.grid.length, game.gameData.tile_size);
        // console.log(gridCoord);
        while (bandit.grid[gridCoord[1]][gridCoord[0]] > 0 && loopBreak < 100) {
            offsetVerified = this.getVerifiedOffset(game, bandit, container);
            gridCoord = this.calculateGridCoordinates(offsetVerified[0], offsetVerified[1], bandit.grid[0].length, bandit.grid.length, game.gameData.tile_size);
            //console.log(gridCoord);
            loopBreak += 1;
        } 
        
        bandit.sprite.customParams.dest_x = offsetVerified[0];
        bandit.sprite.customParams.dest_y = offsetVerified[1];            

        // reset update updateCount
        game.gameData.banditAIdata.banditParams[idx].updateCount = 0;
        
        // console.log("setting container destination");
        // console.log(offsetVerified);
        // console.log(bandit);
        // console.log(container);

        // generate path
        bandit.restartPtClick(game);
    }
    
    // changed to randomize destination
    // findOffsetForSearch(game, bandit, container) {
    //     var xB = bandit.sprite.body.x;
    //     var yB = bandit.sprite.body.y;
    //     var xC = xB;
    //     var yC = yB;
    //     // in case the asynchronous event has occurred and container no longer defined
    //     if (container) {
    //         var xC = container.sprite.body.x;
    //         var yC = container.sprite.body.y;
    //     }
        
    //     // calculate grid coordinates
    //     var xG = Math.floor(xB/game.gameData.tile_size);
    //     var yG = Math.ceil(yB/game.gameData.tile_size);
    //     if (xG > bandit.grid[0].length - 2) { xG = bandit.grid[0].length - 2; }
    //     if (yG > bandit.grid.length - 2) { yG = bandit.grid.length - 2; }
        
    //     // bandit is positive from container
    //     if (xB > xC) {
    //         if (yB > yC && bandit.grid[yG+1][xG] <= 0) {
    //             // aim for lower right unless grid is not available below
    //             return ([xC + game.gameData.containers[container.name].width + 2, yC + game.gameData.containers[container.name].height + 2]);
    //         } else {
    //             // aim for upper right
    //             return ([xC + game.gameData.containers[container.name].width + 2, yC -2]);
    //         }
    //     } else {
    //         if (yB > yC && bandit.grid[yG+1][xG] <= 0) {
    //             // aim for lower left
    //             return ([xC - 2, yC + game.gameData.containers[container.name].height + 2]);
    //         } else {
    //             // aim for upper left
    //             return ([xC - 2, yC - 2]);
    //         }
    //     }
    // }
    
    
    findOffsetForSearch(game, bandit, container)  {
        var xB = bandit.sprite.body.x;
        var yB = bandit.sprite.body.y;
        var xC = xB;
        var yC = yB;
        // in case the asynchronous event has occurred, container could no longer be defined
        if (container) {
            var xC = container.sprite.body.x;
            var yC = container.sprite.body.y;

            var r = this.calculateGridCoordinates(xC, yC, bandit.grid[0].length, bandit.grid.length, game.gameData.tile_size);        
            if (bandit.grid[r[1]][r[0]] <= 0) {
                return([xC, yC]);
            }
            
            // just in case this gets stuck
            var loopBreak = 0;
            while (loopBreak < 100) {
                var rndNum = getRandomInt(0, 7);
                switch (rndNum) {
                    case 0: 
                        // check 8 surrounding squares
                        // variables to calculate result
                        r = this.calculateGridCoordinates(xC-2, yC + game.gameData.containers[container.name].height + 2, bandit.grid[0].length, bandit.grid.length, game.gameData.tile_size);
                        // check nine squares around location
                        if (bandit.grid[r[1]][r[0]] <= 0) {
                            return([xC-2, yC + game.gameData.containers[container.name].height + 2]);
                        }
                        break;
                    case 1:
                        // variables to calculate result
                        r = this.calculateGridCoordinates(xC + game.gameData.containers[container.name].width + 2, yC + game.gameData.containers[container.name].height + 2, bandit.grid[0].length, bandit.grid.length, game.gameData.tile_size);
                        // check nine squares around location
                        if (bandit.grid[r[1]][r[0]] <= 0) {
                            return([xC + game.gameData.containers[container.name].width + 2, yC + game.gameData.containers[container.name].height + 2]);
                        }
                        break;
                    case 2:
                        // variables to calculate result
                        r = this.calculateGridCoordinates(xC-2, yC -2, bandit.grid[0].length, bandit.grid.length, game.gameData.tile_size);
                        // check nine squares around location
                        if (bandit.grid[r[1]][r[0]] <= 0) {
                            return([xC-2, yC -2]);
                        }
                        break;
                    case 3:
                        // variables to calculate result
                        r = this.calculateGridCoordinates(xC + game.gameData.containers[container.name].width + 2, yC -2, bandit.grid[0].length, bandit.grid.length, game.gameData.tile_size);
                        // check nine squares around location
                        if (bandit.grid[r[1]][r[0]] <= 0) {
                            return([xC + game.gameData.containers[container.name].width + 2, yC -2]);
                        }
                        break;
                    case 4:
                        // variables to calculate result
                        r = this.calculateGridCoordinates(xC-33, yC + game.gameData.containers[container.name].height + 33, bandit.grid[0].length, bandit.grid.length, game.gameData.tile_size);
                        // check nine squares around location
                        if (bandit.grid[r[1]][r[0]] <= 0) {
                            return([xC-33, yC + game.gameData.containers[container.name].height + 33]);
                        }
                        break;
                    case 5:
                        // variables to calculate result
                        r = this.calculateGridCoordinates(xC + game.gameData.containers[container.name].width + 33, yC + game.gameData.containers[container.name].height + 33, bandit.grid[0].length, bandit.grid.length, game.gameData.tile_size);
                        // check nine squares around location
                        if (bandit.grid[r[1]][r[0]] <= 0) {
                            return([xC + game.gameData.containers[container.name].width + 33, yC + game.gameData.containers[container.name].height + 33]);
                        }
                        break;
                    case 6:
                        // variables to calculate result
                        r = this.calculateGridCoordinates(xC-33, yC - 33, bandit.grid[0].length, bandit.grid.length, game.gameData.tile_size);
                        // check nine squares around location
                        if (bandit.grid[r[1]][r[0]] <= 0) {
                            return([xC-33, yC - 33]);
                        }
                        break;
                    case 7:
                        // variables to calculate result
                        r = this.calculateGridCoordinates(xC + game.gameData.containers[container.name].width + 33, yC - 33, bandit.grid[0].length, bandit.grid.length, game.gameData.tile_size);
                        // check nine squares around location
                        if (bandit.grid[r[1]][r[0]] <= 0) {
                            return([xC + game.gameData.containers[container.name].width + 33, yC - 33]);
                        }
                        break;
                }
                loopBreak += 1;
            }
        }
        return ([xC, yC]);
    }
    
    calculateGridCoordinates(xC, yC, gridXmax, gridYMax, tile_size) {
        // calculate grid coordinates
        var xG = Math.floor(xC/tile_size);
        var yG = Math.ceil(yC/tile_size);
        if (xG < 0) { xG = 0;}
        if (yG < 0) { yG = 0;}
        if (xG > gridXmax - 1) { xG = gridXmax - 1; }
        if (yG > gridYMax - 1) { yG = gridYMax - 1; }
        return ([xG, yG]);
    }    


    limitBanditDestToWorldBounds(x, y, gridXmax, gridYMax, tile_size) {
        var xPos = x;
        var yPos = y;
        if (x < 0) {xPos = 0;}
        if (y < 0) {yPos = 0;}
        if (x > gridXmax*tile_size - 1) {xPos = gridXmax*tile_size - 1;}
        if (y > gridYMax*tile_size - 1) {yPos = gridYMax*tile_size - 1;}
        return ([xPos, yPos]);
    }
  
    cleanContainerToSearch(game, containerIdx, roomName) {
        // remove container from list
        if (game.gameData.banditAIdata.containersToSearch[roomName] != undefined) {
            // delete index from list to search
            var arrIdx = game.gameData.banditAIdata.containersToSearch[roomName].indexOf(containerIdx);
            if (arrIdx >= 0) {
                game.gameData.banditAIdata.containersToSearch[roomName].splice(arrIdx,1);
            }        
            // delete room from list if no more containers to search
            if (game.gameData.banditAIdata.containersToSearch[roomName].length < 1) {
                // no need to check this room
                  delete game.gameData.banditAIdata.containersToSearch[roomName];
            }
        }
    }

    // returns index of next container or -1
    getContainersInRoomThatHasNotBeenSearched(game, roomName, bandit, containerManager) {
        if (game.gameData.banditAIdata.containersToSearch[roomName] != undefined && 
            game.gameData.banditAIdata.containersToSearch[roomName].length > 0) 
        {
            var containerIdx = this.getClosestContainerOnList(game.gameData.banditAIdata.containersToSearch[roomName], bandit, containerManager);
            if (containerIdx >= 0) {
                    this.cleanContainerToSearch(game, containerIdx, roomName);
                    return containerIdx;
            }
            else {
                // should never hit this condition
                return this.findAnyContainerToSearch(game, containerManager);
            }
        }
        else {return -1; } // there are no containers in this room
    }

    // for list of containers, get the closest
    // containerList is the list of indices into containers that are in the room
    // must contain at least one container indice
    // bandit is the current bandit player
    getClosestContainerOnList(containerList, bandit, containerManager) {       
        // find the closest container
        var containerIdx = containerList[0];
        // calculate the distance between bandit and container, keep index of closest to 
        for (var i=0; i<containerList.length; i++) {
            //[TODO] alg
        }

        // for now returns first on list
        return containerIdx;
    }

    // returns index of next container to go after
    findNextContainerToSearch(game, map,  roomName, idx, containerManager) {
            if (game.gameData.banditAIdata.containersToSearch[roomName] != undefined && 
                game.gameData.banditAIdata.containersToSearch[roomName].length > 0) {
                // there may still be containers to search in this room
                var containerIdx = this.getContainersInRoomThatHasNotBeenSearched(game, roomName, this.players[this.bandit[idx]], containerManager);
                if (containerIdx >= 0) {
                    return containerIdx;
                }
            }
            else {
                // find connecting rooms
                var roomsConnecting = this.players[this.bandit[idx]].roomsConnectingToThisRoom(game, map, roomName);
                if (roomsConnecting != undefined && roomsConnecting.length > 0) {
                    // find connected unsearched rooms
                    // shuffle list so that exploration is random
                    roomsConnecting = shuffleArr(roomsConnecting);
                    for (var j=0; j<roomsConnecting.length; j++) {
                        if (roomsConnecting[j].charAt(0) == "p") {
                            // connecting room is passage, find other side
                            var passageConnections = this.players[this.bandit[idx]].roomsConnectingToThisRoom(game, map, roomsConnecting[j]);
                            for (var k= 0; k<passageConnections.length; k++) {
                                // only look for side not the current room
                                if (passageConnections[k] != roomName) {
                                    var containerIdx = this.getContainersInRoomThatHasNotBeenSearched(game, passageConnections[k], this.players[this.bandit[idx]], containerManager);
                                    if (containerIdx >= 0) {
                                        return (containerIdx);
                                    }
                                } 
                            }
                        }
                        else {
                            // connecting room, look for next container
                            var containerIdx = this.getContainersInRoomThatHasNotBeenSearched(game, roomsConnecting[j], this.players[this.bandit[idx]], containerManager);
                            if (containerIdx >= 0) {
                                return (containerIdx);
                            }
                        }
                    }
                }
            }
            // there are not good choices remaining
            return this.findAnyContainerToSearch(game, containerManager);
    }

    // find next good option for container to search
    findAnyContainerToSearch(game, containerManager) {
        if (game.gameData.banditAIdata.containersToSearch != undefined && game.gameData.banditAIdata.containersToSearch.length > 0) {
            // get the next remaining container from the list
            var iterator = Object.keys(game.gameData.banditAIdata.containersToSearch);
            for (var k=0; k<iterator.length; k++) {
                if (game.gameData.banditAIdata.containersToSearch[iterator[k]].length > 0) {
                    var containerIdx = game.gameData.banditAIdata.containersToSearch[iterator[k]][0];
                    this.cleanContainerToSearch(game, containerIdx, iterator[k]);
                    return (containerIdx);
                }
            } 
        }
        // [TODO] improve algorithm to only go to containers that make sense
        // this is going to randomly pick a container instance, could be a door or suppressant
        var rndNum = getRandomInt(0, containerManager.containers.length-1);
        while (this.checkForValidContainersToSearch(containerManager.containers[rndNum])) {
            rndNum = getRandomInt(0, containerManager.containers.length-1);
        }
        return (rndNum);
    }
    
    checkForValidContainersToSearch(container) {
        if (container.name === "suppresant") {
            return true;
        }
        if (container.name === "espresso"){
            return true;
        }
        
        if (container.name === "danceFloor"){
            return true;
        }
         
        if (container.name === "transparent"){
            return true;
        }
          
        if (container.name === "escapepod") {
            return true;
        }
        
        if (container.itemscapacity < 1) {
            return true;
        }

        return false;
    }
    
    savePlayerManager (game, lyrelocator) {
        var savedPlayers = [];
        for (var i = 0; i < this.players.length; i++) {
            savedPlayers[i] = this.players[i].savePlayer();
        }
        game.gameData.playerarray = savedPlayers;
        
        // save state where lyre found
        lyrelocator.saveGameData(game);
        
        // save bandit data
        game.gameData.banditDataRestore = game.gameData.banditAIdata;
        var iterator = Object.keys(game.gameData.banditAIdata.containersToSearch);
        game.gameData.containersToSearch = [];
        game.gameData.containersToSearchRoomRef = [];
        for (var i=0; i<iterator.length; i++) {
            game.gameData.containersToSearch[i] = game.gameData.banditAIdata.containersToSearch[iterator[i]];
            game.gameData.containersToSearchRoomRef[i] = iterator[i];
        }
        
    }
    
    
    
}