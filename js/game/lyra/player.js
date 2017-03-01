class Player {
    addPlayer(game, x, y, playerData) {
        this.game = game;
        this.idx = playerData.idx;
        this.isSelected = playerData.isSelected;
        this.characterType = playerData.characterType;
        this.characterIdx = playerData.characterIdx;
        this.name = playerData.name;
        this.itemsCapacity = 4;
        this.equippedItem = "empty";
        
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
    
        game.physics.arcade.enable(this.sprite);
    
        this.sprite.body.setSize(game.gameData.characters[ playerData.characterIdx].width,game.gameData.characters[ playerData.characterIdx].height);
    
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
       //this.makeItemEmitter(game);
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
    updateCrew(game, walls, floors) {
        this.updatePlayer (game, walls, floors);
    }
    
    // use this method for bandit updates each update cycle
    updateBandit(game, walls, floors) {
        this.updatePlayer (game, walls, floors);
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
			    this.getNextPt();
			    console.log(this.sprite.customParams.next_pt_x);
		        console.log(this.sprite.customParams.next_pt_y);
		        
		        //Stop Sprite
		        this.sprite.body.velocity.x = 0;
				this.sprite.body.velocity.y = 0;
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
            //[TODO} Move player toward dest based on path points.
            this.foundPath = this.getPath.bind(this);
            pathfinder.findPath(this.sprite.customParams.src_x/this.sprite.width, this.sprite.customParams.src_y/this.sprite.height, this.sprite.customParams.dest_x/this.sprite.width, this.sprite.customParams.dest_y/this.sprite.height, this.foundPath);
            pathfinder.calculate();
        
    }

    
    // use this function to restart point and click movement in a saved game.  this.sprite.customParams.walking == true and .dest_x, .dest_y are defined
    restartPtClick(game, pathfinder){
        
            //Get Sprite Origin Coords.
            this.sprite.customParams.src_x = game.math.snapTo(this.sprite.body.center.x, this.sprite.width);
            this.sprite.customParams.src_y = game.math.snapTo(this.sprite.body.center.y, this.sprite.height);

            //Get the Path from Origin to Dest. 
            this.foundPath = this.getPath.bind(this);
            pathfinder.findPath(this.sprite.customParams.src_x/this.sprite.width, this.sprite.customParams.src_y/this.sprite.height, this.sprite.customParams.dest_x/this.sprite.width, this.sprite.customParams.dest_y/this.sprite.height, this.foundPath);
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
    
    getNextPt(){
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
        
    }
    
    // use this method to define what to do if a player collides a container (container is collidable)
    playerCollideContainer(game, container) {

    }
    
    
    
    makeItemEmitter(game) {
        // the paritcle is defined by the item being used, reference game.gameData.items[<item name>].emitter
        if (game.gameData.items[this.sprite.customParams.equipped.name].emitter != undefined )
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
        if (game.gameData.items[this.sprite.customParams.equipped.name].emitter != undefined && this.sprite.customParams.equipped.capacity != undefined 
           && (this.sprite.customParams.equipped.capacity > 0))
        {
            this.this.sprite.customParams.equipped.capacity -= 1;

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
            this.emitter.makeParticles(game.gameData.items[this.sprite.customParams.equipped.name].emitter,0,50,false);
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

    
    
     savePlayer() {
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
            y : this.sprite.body.center.y
        }
        return playerData;
    }
    
}

Player.preloadPlayer = function (game) {
    //Load the items needed: 1st-> Player Name/Key 2nd-> URL to asset
    for (var i=0; i<game.gameData.characters.length; i++) {
        game.load.spritesheet(game.gameData.characters[i].name, game.gameData.characters[i].playerRef, game.gameData.characters[i].height, game.gameData.characters[i].width, game.gameData.characters[i].frames);
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
        inventory : game.gameData.characters[playerLocType.characterIdx].inventory,
        equipped : ["suppresant"],
        status : playerLocType.status,
        dest_x : game.gameData.characters[playerLocType.characterIdx].dest_x,
        dest_y : game.gameData.characters[playerLocType.characterIdx].dest_y,
        path : [],
        velocityx : game.gameData.characters[playerLocType.characterIdx].velocityx,
        velocityy : game.gameData.characters[playerLocType.characterIdx].velocityy,
        frame : game.gameData.characters[playerLocType.characterIdx].frame,
        angulardrag : game.gameData.characters[playerLocType.characterIdx].angulardrag
    }
    return (playerData);
}

// this class will manage all players and bandits
// playerLocType needs the following: 
//    isSelected : true/false
//    characterIdx : corresponds to index in gameData character array
//    characterType : "crew" or "bandit"
//    inventory : array of names
//    status : player status (walk, stuck, sleep)
//    x : x location for character
//    y : y location
class PlayerManager {
    constructor (game, playerLocType, pathfinder) {
        this.players = [];
        // indexes in the array corresponding to the type character
        this.crew = [];
        this.bandit = [];
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
        for (var i = 0; i <this.players.length; i++) {
            // restart ptClick
            if (this.players[i].sprite.customParams.walking && this.players[i].sprite.customParams.dest_x != null && this.players[i].sprite.customParams.dest_y != null ) { 
               // this.players[i].restartPtClick(game, pathfinder);
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

    
    // returns true if no players awake
    isAnyCrewAwake() {
        for (var i=0; i< this.crew.length; i++) {
            if (this.players[this.crew[i]].sprite.customParams.status == "awake") {
                return false;
            }
        }
        return true; 
    }

    // updates the player array first for crew and then for bandits
    updatePlayerArray(game,  walls, floors, map) {
        // update players
        for (var i=0; i< this.crew.length; i++) {
            if (this.players[this.crew[i]].updateCrew(game, walls, floors)) {
                return false;
            }
        }
        // update bandits
        for (var i=0; i< this.bandit.length; i++) {
            if (this.players[this.bandit[i]].updateBandit(game, walls, floors)) {
                return false;
            }
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


    
    savePlayerManager (game) {
        var savedPlayers = [];
        for (var i = 0; i < this.players.length; i++) {
            savedPlayers[i] = this.players[i].savePlayer();
        }
        game.gameData.playerarray = savedPlayers;
    }
    
    
    
}