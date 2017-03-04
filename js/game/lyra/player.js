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
        // using this to indicate to PlayerManager that the path is available to start updates for bandit AI
        this.sprite.customParams.pathfound = playerData.pathfound;
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
            this.sprite.customParams.pathfound = false;
        
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
    
    doesPlayerHaveLyre() {
        for (var i=0; i<this.sprite.customParams.inventory.length; i++){
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
    constructor (game, playerLocType, pathfinder,  containerManager) {
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
            this.banditAIdata(game, containerManager);
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
    updatePlayerArray(game,  walls, floors, map, containerManager, roomManager, lyrelocator, pathfinder) {
        // update players
        for (var i=0; i< this.crew.length; i++) {
            this.players[this.crew[i]].updateCrew(game, walls, floors, map, containerManager);
        }
        // [TODO] major debugging in progress
        this.updateBanditAI(game, walls, floors, map, containerManager, roomManager, pathfinder)
        
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
            // [TODO] it would be better to do this asyncronously when items are picked up or dropped
            if (this.players[i].doesPlayerHaveLyre() >= 0) {
                lyrelocator.playerPickUpLyre(game,this.players[i]);
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
                    returningToDock: false
                }
            }
            // copy the array of containers organized by room
            game.gameData.banditAIdata.containersToSearch = containerManager.containerRoomArray;
            // remove containers that we don't care about
            var iterator = Object.keys(game.gameData.banditAIdata.containersToSearch);
            for (var i=0; i< iterator.length; i++) {
                var containerIdxArr = game.gameData.banditAIdata.containersToSearch[iterator[i]];
                // splice off the end so indices don't change
                for (var j=containerIdxArr.length-1; j >=0; j--) {
                    if (containerManager.containers[containerIdxArr[j]].name == "transparent" ||
                       containerManager.containers[containerIdxArr[j]].name == "escapepod" ||
                      containerManager.containers[containerIdxArr[j]].itemscapacity == 0  || 
                      containerManager.containers[containerIdxArr[j]].name == "espresso"
                      )
                    {   // no need to check these from initial list
                        game.gameData.banditAIdata.containersToSearch[iterator[i]] = game.gameData.banditAIdata.containersToSearch[iterator[i]].splice(j,1);
                    }
                }
                if (game.gameData.banditAIdata.containersToSearch[iterator[i]].length < 1) {
                     // no need to check this room
                   delete game.gameData.banditAIdata.containersToSearch[iterator[i]];
                }
            }
        } 
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
   updateBanditAI(game, walls, floors, map, containerManager, roomManager, pathfinder) {
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

        for (var i=0; i< this.bandit.length; i++) {
            // state:
            // walking = true if there's a path and bandit is progressing on it, set to false when calculating path or reached destination
            // pathfound = false when path is calculating, otherwise true
            // states           pathfound   walking
            // at destination   true        false
            // on path          true        true
            // calculating      false       false/true
            //
            // use this value to make sure bandit doesn't becom stalled
            game.gameData.banditAIdata.banditParams[i].updateCount += 1;

            // assuming the bandits only pick up the lyre, this is going to indicate recall to dock
            if (banditsHaveLyre) {
                // set bandit path
                this.returnToDock(game, walls, floors, map, containerManager, roomManager, i, pathfinder);
            }
            if (playersHaveLyre) {
                // [TODO] follow player
                // update path every xx updates
                this.pathUpdateFromLyreLocation(game, walls, floors, map, containerManager, i, pathfinder);
            }
            //no players have the lyre
            if (!banditsHaveLyre && !playersHaveLyre) {
                // lyre is in a container
                if (game.gameData.lyreLocation.found) {
                    // bandits heard sound, head for this container
                    // update path in case lyre is moved
                    this.pathUpdateFromLyreLocation (game, walls, floors, map, containerManager, i, pathfinder);
                }
                else {
                    if ((this.players[this.bandit[i]].sprite.customParams.walking == true) && (this.players[this.bandit[i]].sprite.customParams.path.length != 0))
                        {  // player is walking somewhere 
                            game.gameData.banditAIdata.banditParams[i].updateCount += 1;
                            this.players[this.bandit[i]].updateBandit(game, walls, floors, map, containerManager);
                        } else {
                            // bandits search, path should be configured after this call if not already
                            // calls updateBandit if path configured or pathUpdateFromContainerLocation to configure path
                            this.banditAISearchPattern(game, walls, floors, map, containerManager, i, pathfinder);
                        }
                }
            }
        }
   }


    pathUpdateFromLyreLocation (game, walls, floors, map, containerManager, idx, pathfinder) {
            // decide if a path update is needed
            // update path every xx updates
            if (this.players[this.bandit[idx]].sprite.customParams.walking && this.players[this.bandit[idx]].sprite.customParams.pathfound 
                && game.gameData.banditAIdata.banditParams[idx].updateCount < 100) {
                // update bandit if there's a path and they are still walking
                this.players[this.bandit[idx]].updateBandit(game, walls, floors, map, containerManager);
            } else if (this.players[this.bandit[idx]].sprite.customParams.walking && this.players[this.bandit[idx]].sprite.customParams.pathfound
                     && game.gameData.banditAIdata.banditParams[idx].updateCount > 100) {
                // check every 100 update cycles that the bandit is still on track
                if (this.players[this.bandit[idx]].sprite.customParams.dest_x != game.gameData.lyreLocation.x 
                    || this.players[this.bandit[idx]].sprite.customParams.dest_y != game.gameData.lyreLocation.y) {

                    // set new destination
                    this.players[this.bandit[idx]].sprite.customParams.dest_x = game.gameData.lyreLocation.x;
                    this.players[this.bandit[idx]].sprite.customParams.dest_y = game.gameData.lyreLocation.y;

                    // generate path
                    this.players[this.bandit[idx]].restartPtClick(game, pathfinder);

                } 
                // reset update updateCount
                game.gameData.banditAIdata.banditParams[idx].updateCount = 0;
            } 
            else if (!this.players[this.bandit[idx]].sprite.customParams.walking && this.players[this.bandit[idx]].sprite.customParams.pathfound) {
                // walking gets set to false when the player stops
                // should be at the lyre location, pick up?  happens due to collision, next update should return to dock

            } else if (!this.players[this.bandit[idx]].sprite.customParams.pathfound && game.gameData.banditAIdata.banditParams[idx].updateCount > 100) {
            // if !this.players[this.bandit[i]].sprite.customParams.walking && !this.players[this.bandit[i]].sprite.customParams.pathfound
            // path is still being calculated but taking a really long time, try again
                // generate path
                // reset update updateCount
                game.gameData.banditAIdata.banditParams[idx].updateCount = 0;
                this.players[this.bandit[idx]].restartPtClick(game, pathfinder);
            }
    }

    pathUpdateFromContainerLocation (game, walls, floors, map, containerManager, banditIdx, containerIdx, pathfinder) {
        if (this.players[this.bandit[banditIdx]].sprite.customParams.dest_x != containerManager.containers[containerIdx].sprite.body.x 
                || this.players[this.bandit[banditIdx]].sprite.customParams.dest_y != containerManager.containers[containerIdx].sprite.body.y) {
                if (this.players[this.bandit[banditIdx]].sprite.customParams.pathfound) {
                    // need to set new destination
                    this.players[this.bandit[banditIdx]].sprite.customParams.dest_x = containerManager.containers[containerIdx].sprite.body.x ;
                    this.players[this.bandit[banditIdx]].sprite.customParams.dest_y = containerManager.containers[containerIdx].sprite.body.y;

                    // generate path
                    this.players[this.bandit[banditIdx]].restartPtClick(game, pathfinder);

                    // reset update updateCount
                    game.gameData.banditAIdata.banditParams[banditIdx].updateCount = 0;
                }
                // if (this.players[this.bandit[i]].sprite.customParams.pathfound == false) then still calculating path
                else if (!this.players[this.bandit[banditIdx]].sprite.customParams.pathfound && game.gameData.banditAIdata.banditParams[banditIdx].updateCount > 100) {
                    // if !this.players[this.bandit[i]].sprite.customParams.walking && !this.players[this.bandit[i]].sprite.customParams.pathfound
                    // path is still being calculated but taking a really long time, try again
                    // generate path
                    this.players[this.bandit[banditIdx]].restartPtClick(game, pathfinder);
                    // reset update updateCount
                    game.gameData.banditAIdata.banditParams[banditIdx].updateCount = 0;
                }
        } else if (this.players[this.bandit[banditIdx]].sprite.customParams.walking && this.players[this.bandit[banditIdx]].sprite.customParams.pathfound) {
            // update bandit if there's a path and they are still walking
            this.players[this.bandit[banditIdx]].updateBandit(game, walls, floors, map, containerManager);
        }
    }

    returnToDock(game, walls, floors, map, containerManager, roomManager, idx, pathfinder) {
        if (this.players[this.bandit[idx]].sprite.customParams.dest_x != roomManager.rooms[roomManager.dockIdx].center_x 
                || this.players[this.bandit[idx]].sprite.customParams.dest_y != roomManager.rooms[roomManager.dockIdx].center_y) {
             if (this.players[this.bandit[idx]].sprite.customParams.pathfound) {
                 // generate path to dock
                // set new destination
                this.players[this.bandit[idx]].sprite.customParams.dest_x = roomManager.rooms[roomManager.dockIdx].center_x;
                this.players[this.bandit[idx]].sprite.customParams.dest_y = roomManager.rooms[roomManager.dockIdx].center_y;
                
                // generate path 
                this.players[this.bandit[idx]].restartPtClick(game, pathfinder);
                // reset update updateCount
                game.gameData.banditAIdata.banditParams[idx].updateCount = 0;
             }
            // if (this.players[this.bandit[i]].sprite.customParams.pathfound == false) then still calculating path
             else if (!this.players[this.bandit[idx]].sprite.customParams.pathfound && game.gameData.banditAIdata.banditParams[idx].updateCount > 100) {
                    // if !this.players[this.bandit[i]].sprite.customParams.walking && !this.players[this.bandit[i]].sprite.customParams.pathfound
                    // path is still being calculated but taking a really long time, try again
                    // generate path
                    this.players[this.bandit[idx]].restartPtClick(game, pathfinder);
                    // reset update updateCount
                    game.gameData.banditAIdata.banditParams[idx].updateCount = 0;
             }
        } else if (this.players[this.bandit[idx]].sprite.customParams.walking && this.players[this.bandit[idx]].sprite.customParams.pathfound) {
             // already found path to dock, update player (will only update if walking variable is ture)
            this.players[this.bandit[idx]].updateBandit(game, walls, floors, map, containerManager);
        } else {
            // bandit should be at dock 
            // [TODO] end game condition if all bandits at dock
        }
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
                    this.cleanContainerToSearchToSearch(game, containerIdx, iterator[k]);
                    return (containerIdx);
                }
            } 
        }
        // [TODO] improve algorithm to only go to containers that make sense
        // this is going to randomly pick a container instance, could be a door or suppressant
        return (getRandomInt(0, containerManager.containers.length-1));
    }


    banditAISearchPattern(game, walls, floors, map, containerManager, idx, pathfinder) {
            if (this.players[this.bandit[idx]].sprite.customParams.walking && this.players[this.bandit[idx]].sprite.customParams.pathfound) {
                // make update based on current path
                this.players[this.bandit[idx]].updateBandit(game, walls, floors, map, containerManager);
            } else if (!this.players[this.bandit[idx]].sprite.customParams.walking && this.players[this.bandit[idx]].sprite.customParams.pathfound) {
                // set a new destination and calcualte path
                var roomName = this.players[this.bandit[idx]].playerWhereAmI(game, map);
                if (roomName != undefined && roomName.length > 0) {            
                    var containerIdx = this.findNextContainerToSearch(game, map,  roomName, idx, containerManager);
                    if (containerIdx < 0) {
                        // there's nothing connected left to search
                        // pick from what's left on list
                        // or pick randomly from container list?
                        containerIdx = this.findAnyContainerToSearch(game, containerManager);                        
                    }
                }  else {
                    // couldn't find room
                    containerIdx = this.findAnyContainerToSearch(game, containerManager);
                }
                this.pathUpdateFromContainerLocation (game, walls, floors, map, containerManager, idx, containerIdx, pathfinder)
            } else if (!this.players[this.bandit[idx]].sprite.customParams.pathfound && game.gameData.banditAIdata.banditParams[idx].updateCount > idx*1000) {
                    // if !this.players[this.bandit[i]].sprite.customParams.walking && !this.players[this.bandit[i]].sprite.customParams.pathfound
                    // path is still being calculated but taking a really long time, try again
                    // generate path
                    this.players[this.bandit[idx]].restartPtClick(game, pathfinder);
                    // reset update updateCount
                    game.gameData.banditAIdata.banditParams[idx].updateCount = 0;
             }
    }
    
    savePlayerManager (game) {
        var savedPlayers = [];
        for (var i = 0; i < this.players.length; i++) {
            savedPlayers[i] = this.players[i].savePlayer();
        }
        game.gameData.playerarray = savedPlayers;
    }
    
    
    
}