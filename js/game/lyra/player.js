class Player {
    addPlayer(game, x, y, playerData) {
        this.game = game;
        this.idx = playerData.idx;
        this.isSelected = playerData.isSelected;
        this.characterType = playerData.characterType;
        this.characterIdx = playerData.characterIdx;
        this.name = playerData.name;
        this.itemsCapacity = 4;
        this.equippedItem = playerData.equipped;
        
        // create player(s) 
        this.sprite = game.add.sprite(x,y,playerData.name);
        this.sprite.frame = playerData.frame;
        this.sprite.anchor.set(0.5);
       
        //Custom Params for Player.
        this.sprite.customParams = [];
        this.sprite.customParams.inventory = playerData.inventory; //['fuse', 'circuit'];
        this.sprite.customParams.inv_size = playerData.inventory.length;
        this.sprite.customParams.walking = playerData.walking;
        this.sprite.customParams.equipped = playerData.equipped;
        
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
        this.sprite.body.setSize(game.gameData.characters[ playerData.characterIdx].width - 2,game.gameData.characters[ playerData.characterIdx].height - 2);
        
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
            this.sprite.customParams.status = "stuck";
            this.sprite.body.velocity.x = 0;
            this.sprite.body.velocity.y = 0;
            console.log("Player " + this.idx  +" is stuck!");
        }, this);
        
       // add emitter
       this.makeItemEmitter(game);
       
       //add animations to the player
       this.sprite.animations.add('down',[0,1,2], 10, true);
       this.sprite.animations.add('up',[3,4,5], 10, true);
       this.sprite.animations.add('left',[9,10,11], 10, true);
       this.sprite.animations.add('right',[6,7,8], 10, true);
    }

    equipItem(item) {
        if (this.equippedItem !== "empty") {
            var swapItem = this.equippedItem;
            this.equippedItem = item;
            return swapItem;
        } else {
            this.equippedItem = item;
        }
        
        return false;
    }

    unequipItem() {
        if (this.sprite.customParams.inventory.length < this.itemsCapacity) {
            console.log('attempting to unequip...');
            console.log(this.equippedItem);
            this.addItemToList(this.equippedItem);
            this.equippedItem = "empty";
        } else {
            console.log('No room in player inventory. Make some room and try again.')
        }
    }

    // add item to the item list
    addItemToList(item) {
        if (this.sprite.customParams.inventory.length < this.itemsCapacity) {
            console.log('pushing to player inventory');
            console.log(item);
            this.sprite.customParams.inventory.push(item);
        } else {
            //[TODO] raise a signal that says this item can't be added
            console.log("the " + this.name +" inventory is full");
        }
    }
    
    // remove item from the list
    removeItemFromList(itemIndex) {
        var item = '';
        if (item = this.sprite.customParams.inventory.splice(itemIndex, 1)) {
            return item;
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
        
		if( (this.sprite.customParams.walking == true) && (this.sprite.customParams.path.length != 0) ){
	        
	        //Move Sprite to Next Pt.	    
		    game.physics.arcade.moveToXY(this.sprite, this.sprite.customParams.next_pt_x, this.sprite.customParams.next_pt_y, 200);
		    
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
			    }
		        
		        //Stop Sprite
		        this.sprite.body.velocity.x = 0;
				this.sprite.body.velocity.y = 0;
				
				//Stop Animation
				this.sprite.animations.stop();
			}
			
			//If player overlaps slime, stop immed.
			if( this.sprite.customParams.status == "stuck"){
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
        console.log(angle);
        
        if(angle != 0){
            //Left
            if( (angle > 135 && angle <= 180) || (angle >= -180 && angle <= -135) ){
                this.sprite.animations.play('left');    
        
            //Up    
            }else if(angle > -135 && angle <= -45){
                this.sprite.animations.play('up');
        
            //Right  
            }else if(angle > -45 && angle <= 45){
                this.sprite.animations.play('right');
        
            //Down    
            }else if(angle > 45 && angle <= 135){
                this.sprite.animations.play('down');
            }
        }
     
    }
    
    ptClick(game, pathfinder){

            //Get Sprite Origin Coords.
            this.sprite.customParams.src_x = game.math.snapToFloor(this.sprite.x, this.sprite.width);
            this.sprite.customParams.src_y = game.math.snapToFloor(this.sprite.y, this.sprite.height);

            //Get Sprite Dest Coords
            this.sprite.customParams.dest_x = game.math.snapToFloor(game.input.activePointer.worldX, this.sprite.width);
            this.sprite.customParams.dest_y = game.math.snapToFloor(game.input.activePointer.worldY, this.sprite.height);

            this.sprite.customParams.walking = true;
            
            //Get the Path from Origin to Dest. 
            this.foundPath = this.getPath.bind(this);
            pathfinder.findPath(this.sprite.customParams.src_x/this.sprite.width, this.sprite.customParams.src_y/this.sprite.height, this.sprite.customParams.dest_x/this.sprite.width, this.sprite.customParams.dest_y/this.sprite.height, this.foundPath);
            pathfinder.calculate();
        
    }

    
    // use this function to restart point and click movement in a saved game.  this.sprite.customParams.walking == true and .dest_x, .dest_y are defined
    restartPtClick(game, pathfinder){
            this.sprite.customParams.walking = false;
        
            //Get Sprite Origin Coords.
            this.sprite.customParams.src_x = game.math.snapToFloor(this.sprite.body.center.x, this.sprite.width);
            this.sprite.customParams.src_y = game.math.snapToFloor(this.sprite.body.center.y, this.sprite.height);

            //Get the Path from Origin to Dest. 
            this.foundPath = this.getBanditPath.bind(this);
            pathfinder.findPath(Math.floor(this.sprite.customParams.src_x/game.gameData.tile_size), Math.ceil(this.sprite.customParams.src_y/game.gameData.tile_size), Math.floor(this.sprite.customParams.dest_x/game.gameData.tile_size), Math.ceil(this.sprite.customParams.dest_y/game.gameData.tile_size), this.foundPath);
            pathfinder.calculate();
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
        this.sprite.body.velocity.y = -300;
        this.sprite.animations.play('up');
    }
    
    goRight(game) {
        this.sprite.body.velocity.x = 300;
        this.sprite.animations.play('right');
    }
    goLeft(game) {
        this.sprite.body.velocity.x = -300;
        this.sprite.animations.play('left');
    }
    goDown(game) {
        this.sprite.body.velocity.y = 300;
        this.sprite.animations.play('down');
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
    
    
    // use this method to do stuff when the player wakes up sleep-->awake
    playerWokeFromSleep(game) {
        
    }
    
    // use this method when awake crew/bandit encounters a player not on their team (player --> bandit or bandit --> player)
    // other player could be "stuck" or "sleep"
    playerOverlapOtherTeam(game, player) {
        // player is the other player encountered
        console.log("awake player: " + this.name + " ran into player: " + player.name);
    }
    
    // use this method to define what to do if a player overlaps a container (container is not collidable)
    playerOverlapContainer(game, container) {
        if (this.characterType == "bandit") {
            this.moveLyreToPlayerInventory(container);
        }
    }
    
    // use this method to define what to do if a player collides a container (container is collidable)
    playerCollideContainer(game, container) {
        if (this.characterType == "bandit") {
            this.moveLyreToPlayerInventory(container);
        }
    }
    
    moveLyreToPlayerInventory(container) {
        var slot = container.isLyreInContainer();
        if ( slot >= 0) {
            this.getInventory(slot);
            //[TODO] clean up the container list, recall bandits
        }
        else {
            //[TODO] remove container from the list of containers to search
        }
    }
    
    
    makeItemEmitter(game) {
        // the paritcle is defined by the item being used, reference game.gameData.items[<item name>].emitter
        if (game.gameData.items[this.sprite.customParams.equipped[0].name].emitter != undefined )
        {
             // create an emitter for the player
            this.emitter = game.add.emitter(this.sprite.body.x, this.sprite.body.y, 50);
            this.emitter.at(this.sprite);
            this.emitterActive = false;

            //compact way of setting the X velocity range of the emitter
            // [min=0] - The minimum value for this range
            // [max=0] - The maximum value for this range
            this.emitter.setXSpeed(-25, 25);
            this.emitter.setYSpeed(-25, 25);
            this.emitter.width = 50;
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
    
    startItemEmitter(game) {
        // emitter defined for the player as "this.emitter", child of the player sprite
        // the paritcle is defined by the item being used, reference game.gameData.items[<item name>].emitter
        if (game.gameData.items[this.sprite.customParams.equipped[0].name].emitter != undefined && this.sprite.customParams.equipped[0].capacity != undefined 
           && (this.sprite.customParams.equipped[0].capacity > 0))
        {
            this.sprite.customParams.equipped[0].capacity -= 1;

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
            this.emitter.makeParticles(game.gameData.items[this.sprite.customParams.equipped[0].name].emitter,0,50,false);
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

        }
    }
    
    stopItemEmitter(game) {
        //this.emitter.kill();
        this.emitterActive = false;
        //this.emitter.stop();
    }
 
    
    // methods to help with AI
    playerAI(game, map, containerManager) {
        // for now this just show that the methods work
        var roomName = this.playerWhereAmI(game, map);
        if (roomName.length > 0) {
            console.log(roomName);
            // get list of containers in this room
            if (containerManager.containerRoomArray[roomName] != undefined) {
                var containerArr = containerManager.containerRoomArray[roomName];
                console.log(containerArr);
            }
            
            // get doors connected to this room
            var doorArr = this.roomsConnectingToThisRoom(game, map, roomName);
            console.log(doorArr);
        }
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
            walking : this.sprite.customParams.walking,
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
        walking : game.gameData.characters[playerLocType.characterIdx].walking,
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
    constructor (game, playerLocType, pathfinder) {
        this.players = [];
        // indexes in the array corresponding to the type character
        this.crew = [];
        this.bandit = [];
        // if bandits have visited a container, add to this list (deprioritize)
        this.banditContainerList = [];
        // if bandits have visited a room, add to this list(deprioritize)
        this.banditRoomList = [];
        // track if the banditsHaveLyre
        if (game.gameData.banditsHaveLyre == undefined)  {
            game.gameData.banditsHaveLyre = false;
        }
        console.log(game.gameData.playerarray);
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
            }
           // console.log(this.players);
        }
        else {
            // load existing containers into array
            for (var i = 0; i < game.gameData.playerarray.length ; i++) {
                this.players[i] = new Player();
                this.players[i].addPlayer(game, game.gameData.playerarray[i].x, game.gameData.playerarray[i].y, game.gameData.playerarray[i]);
                if (this.players[i].characterType == "crew") {
                    this.crew.push(i);
                }
                else {
                    this.bandit.push(i);
                }

            }
        }
        for (var i = 0; i <this.bandit.length; i++) {
            // restart ptClick
            if (this.players[this.bandit[i]].sprite.customParams.walking && this.players[this.bandit[i]].sprite.customParams.dest_x != null && this.players[this.bandit[i]].sprite.customParams.dest_y != null )
            {
               this.players[this.bandit[i]].restartPtClick(game, pathfinder);
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
            if (this.players[i].isSelected && this.players[i].sprite.customParams.status != "sleep") {
                playerIdx = i;
            }
        }
        return playerIdx;

    }

    
    // returns true if no players awake or if players have no capacity to suppress slime
    isAnyCrewAwake() {
        for (var i=0; i< this.crew.length; i++) {
            if (this.players[this.crew[i]].sprite.customParams.status == "awake") {
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
    updatePlayerArray(game,  walls, floors, map, containerManager, roomManager) {
        // update players
        for (var i=0; i< this.crew.length; i++) {
            this.players[this.crew[i]].updateCrew(game, walls, floors, map, containerManager);
        }
        // update bandits
        for (var i=0; i< this.bandit.length; i++) {
            // assuming the bandits only pick up the lyre, this is going to indicate recall to dock
            if (this.players[this.bandit[i]].sprite.customParams.inventory.length > 0) {
                game.gameData.banditsHaveLyre = true;
            }
            if (game.gameData.banditsHaveLyre) {
                // [TODO] recall bandits to dock
                
            }
            
            // path to next container has been established
            if (this.players[this.bandit[i]].sprite.customParams.path.length > 0) {
                this.players[this.bandit[i]].updateBandit(game, walls, floors, map, containerManager);
            }
            // [TODO] need to think this through....  when does container get added to 'searched' stack?
            // else {
            //     // find next container and setup path
            //     if (this.players[this.bandit[i]].sprite.customParams.containerList.length > 0) {
            //         var nextContainer = this.players[this.bandit[i]].sprite.customParams.containerList.pop();
            //         this.players[this.bandit[i]].sprite.customParams.dest_x = containerManager.containers[nextContainer].sprite.body.x;
            //         this.players[this.bandit[i]].sprite.customParams.dest_y = containerManager.containers[nextContainer].sprite.body.y;
            //         this.banditContainerList.push(nextContainer);
            //     } else {
            //         // find the next room and container list
            //         var nextRoom = this.findNextRoomTooSearch(game, map, this.players[this.bandit[i]], containerManager);
            //         this.players[this.bandit[i]].sprite.customParams.containerList = this.getListOfContainersInRoomThatHaveNotBeenSearched(nextRoom, containerManager);
            //     }
            // }
        }
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
                            if (this.players[i].sprite.customParams.status == "awake") {
                                // do something - ran into bandit
                                this.players[i].playerOverlapOtherTeam(game, this.players[j]);
                            }
                        }
                    }
                }
            }
        }

    }


    // returns true if room is on the list of rooms already searched or not really a room name
    hasRoomBeenSearched(roomName) {
        if (roomName.length < 1) {
            return true;
        }
        for (var i=0; i< this.banditRoomList; i++) {
            if (this.banditRoomList[i] == roomName) {
                return true;
            }
        }
        return false;
    }

    getListOfContainersInRoomThatHaveNotBeenSearched(roomName, containerManager) {
        var containerList = containerManager.containerRoomArray[roomName];
        if (containerList == undefined) {
            // there are no containers in the room
            return ([]);
        }
                
        for (var j=0; j<this.banditContainerList.length; j++) {
            for (var k=0; k<containerList.length; k++) {
                if (this.banditContainerList[j] == containerList[k]) {
                    // container has already been searched, remove from list
                    containerList = containerList.splice(k, 1);
                }
            }
        }
        if (containerList.length < 1) {
            // all containers inthe room have been searched, add to list of rooms
            if (!this.hasRoomBeenSearched(roomName)) {
                this.banditRoomList.push(roomName);
            }
        }
        return containerList;
    }



    findNextRoomTooSearch(game, map, bandit, containerManager) {
        bandit.sprite.customParams.currentRoom = bandit.playerWhereAmI(game, map);
        if (bandit.sprite.customParams.currentRoom.length < 1) {
            // [TODO]in passage or escape pod, find the next door or fix map so this doesn't happen
            nextRoom = "d";
        } else {
            // get list of containers in current room
            bandit.sprite.customParams.containerList = this.getListOfContainersInRoomThatHaveNotBeenSearched(bandit.sprite.customParams.currentRoom, containerManager);
            // if the container list is now empty, find a door
            if (bandit.sprite.customParams.containerList.length < 1) {
                var connectedRooms = bandit.roomsConnectingToThisRoom(game, map, bandit.sprite.customParams.currentRoom);
                // go through the list and remove any rooms already searched
                for (var j=0; j<connectedRooms.length; j++) {
                    if (this.hasRoomBeenSearched(connectedRooms[j])) {
                        connectedRooms = connectedRooms.splice(j, 1);
                    }
                }
                if (connectedRooms.length < 1) {
                    // get the list again
                    connectedRooms = bandit.roomsConnectingToThisRoom(game, map, bandit.sprite.customParams.currentRoom);
                }
                // randomly choose the next room to go to
                var nextRoom = connectedRooms[getRandomInt(0,connectedRooms.length-1)];
            }
        }
        return(nextRoom);
    }
    
    savePlayerManager (game) {
        var savedPlayers = [];
        for (var i = 0; i < this.players.length; i++) {
            savedPlayers[i] = this.players[i].savePlayer();
        }
        game.gameData.playerarray = savedPlayers;
    }
    
    
    
}