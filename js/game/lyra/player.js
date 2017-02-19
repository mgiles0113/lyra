class Player {
    // constructor (game, x, y, idx) {
    //     this.idx = idx
    //     this.isSelected = game.gameData.characters[game.gameData.crew[idx]].isSelected;
       
    //     // create player(s) 
    //     this.sprite = game.add.sprite(x,y,game.gameData.characters[game.gameData.crew[idx]].name);
    //     this.sprite.frame = game.gameData.characters[game.gameData.crew[idx]].frame;
    //     this.sprite.anchor.set(0.5);
       
    //     //Custom Params for Player.
    //     this.sprite.customParams = [];
    //     this.sprite.customParams.inventory = game.gameData.characters[game.gameData.crew[idx]].inventory; //['fuse', 'circuit'];
    //     this.sprite.customParams.inv_size = game.gameData.characters[game.gameData.crew[idx]].inventory.length;
       
    //     this.sprite.customParams.status =  game.gameData.characters[game.gameData.crew[idx]].status;
       
    //     //Init Dest Coords as Sprite's Spawn Coord.
    //     this.sprite.customParams.dest_x = game.gameData.characters[game.gameData.crew[idx]].dest_x;
    //     this.sprite.customParams.dest_y = game.gameData.characters[game.gameData.crew[idx]].dest_y;
    
    //     game.physics.arcade.enable(this.sprite);
    
    //     this.sprite.body.setSize(game.gameData.characters[game.gameData.crew[idx]].width,game.gameData.characters[game.gameData.crew[idx]].height);
    
    //     //  We'll set a lower max angular velocity here to keep it from going totally nuts
    //     this.sprite.body.maxAngular = 500;
    
    //     //  Apply a drag otherwise the sprite will just spin and never slow down
    //     this.sprite.body.angularDrag = game.gameData.characters[game.gameData.crew[idx]].angulardrag;
        
        
    //     this.sprite.body.velocity.x =  game.gameData.characters[game.gameData.crew[idx]].velocityx;
    //     this.sprite.body.velocity.y = game.gameData.characters[game.gameData.crew[idx]].velocityy;
        
    //     // set up signal callback function when the overlap occurs between sprite and slime
    //     this.stuckInSlimeSignal = new Phaser.Signal();
    //     this.stuckInSlimeSignal.add(function(a,b) {
    //         // [TODO] refer to function in player object?
    //         console.log("overlap with slime");
    //     });
    //     // this.sprite.body.bounce.x = 0.2;
    //     // this.sprite.body.bounce.y = 0.2;
    // }
    
    addPlayer(game, x, y, playerData) {
        this.idx = playerData.idx
        this.isSelected = playerData.isSelected;
        this.characterType = playerData.characterType;
        this.characterIdx = playerData.characterIdx;
        this.name = playerData.name;
        // create player(s) 
        this.sprite = game.add.sprite(x,y,playerData.name);
        this.sprite.frame = playerData.frame;
        this.sprite.anchor.set(0.5);
       
        //Custom Params for Player.
        this.sprite.customParams = [];
        this.sprite.customParams.inventory = playerData.inventory; //['fuse', 'circuit'];
        this.sprite.customParams.inv_size = playerData.inventory.length;
        this.sprite.customParams.walking = playerData.walking;
        
        //PathFinder for Pt&Click
        this.sprite.customParams.path = [];
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
    
    
    // use this method for crew updates each update cycle
    updateCrew(game, cursors, walls, floors) {
        this.updatePlayer (game, cursors, walls, floors);
    }
    
    // use this method for bandit updates each update cycle
    updateBandit(game, cursors, walls, floors) {
        this.updatePlayer (game, cursors, walls, floors);
    }
    
    // generic update to move to destination
    updatePlayer (game, cursors, walls, floors) {
        
        // Move player object
        game.physics.arcade.collide(this.sprite, walls);
        
		if( (this.sprite.customParams.walking == true) && (this.sprite.customParams.path.length != 0) ){
	
	        //Move Sprite to Next Pt.	    
		    game.physics.arcade.moveToXY(this.sprite, this.sprite.customParams.next_pt_x, this.sprite.customParams.next_pt_y, 200);
		    
            //Check if sprite has reached the next point.
            this.sprite.customParams.dist_dest = game.physics.arcade.distanceToXY(this.sprite, this.sprite.customParams.next_pt_x, this.sprite.customParams.next_pt_y);
	
            //Move to Destination By Grabbing the Next Point.
			if( this.sprite.customParams.dist_dest < 5){
			    
			    //Get Next Point
			    this.getNextPt();
			    console.log(this.sprite.customParams.next_pt_x);
		        console.log(this.sprite.customParams.next_pt_y);
		        
		        //Stop Sprite
		        this.sprite.body.velocity.x = 0;
				this.sprite.body.velocity.y = 0;
			}
				
			//Stop Sprite When Collision Occurs
			if( this.sprite.body.blocked.up || this.sprite.body.blocked.down || this.sprite.body.blocked.right || this.sprite.body.blocked.left ){
			    this.sprite.customParams.path = [];
				this.sprite.customParams.walking = false;
				
				this.sprite.body.velocity.x = 0;
				this.sprite.body.velocity.y = 0;
			}
		}
    }
    
    
    ptClick(game, pathfinder){
        
            //Get Sprite Origin Coords.
            this.sprite.customParams.src_x = game.math.snapToFloor(this.sprite.x, 32);
            this.sprite.customParams.src_y = game.math.snapToFloor(this.sprite.y, 32);

            //Get Sprite Dest Coords
            this.sprite.customParams.dest_x = game.math.snapToFloor(game.input.activePointer.worldX, 32);
            this.sprite.customParams.dest_y = game.math.snapToFloor(game.input.activePointer.worldY, 32);

            this.sprite.customParams.walking = true;
            
            //Get the Path from Origin to Dest. 
            //[TODO} Move player toward dest based on path points.
            this.foundPath = this.getPath.bind(this);
            pathfinder.findPath(this.sprite.customParams.src_x/32, this.sprite.customParams.src_y/32, this.sprite.customParams.dest_x/32, this.sprite.customParams.dest_y/32, this.foundPath);
            pathfinder.calculate();
        
    }
    
    getPath(path){
        if( path != null){
            this.sprite.customParams.path = [];
                var pt_x;
                var pt_y;
            for(var i =0; i < path.length; i++){
                pt_x = path[i].x * 32;
                pt_y = path[i].y * 32;
                this.sprite.customParams.path.push({pt_x, pt_y});
            }
        }
        
        //Set up the first point.
        this.sprite.customParams.next_pt_x = this.sprite.customParams.path[0].pt_x;
        this.sprite.customParams.next_pt_y = this.sprite.customParams.path[0].pt_y;
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
    
    // savePlayerData(game, idx) {
    //     game.gameData.characters[game.gameData.crew[idx]].isSelected = this.isSelected;
    //     game.gameData.characters[game.gameData.crew[idx]].inventory = this.sprite.customParams.inventory;
    //     game.gameData.characters[game.gameData.crew[idx]].status = this.sprite.customParams.status;
    //     game.gameData.characters[game.gameData.crew[idx]].dest_x = this.sprite.customParams.dest_x;
    //     game.gameData.characters[game.gameData.crew[idx]].dest_y = this.sprite.customParams.dest_y;
    //     game.gameData.characters[game.gameData.crew[idx]].x = this.sprite.body.position.x + game.gameData.characters[game.gameData.crew[idx]].width/2;
    //     game.gameData.characters[game.gameData.crew[idx]].y = this.sprite.body.position.y + game.gameData.characters[game.gameData.crew[idx]].height/2;
    //     game.gameData.characters[game.gameData.crew[idx]].velocityx = this.sprite.body.velocity.x;
    //     game.gameData.characters[game.gameData.crew[idx]].velocityy = this.sprite.body.velocity.y;
    //     game.gameData.characters[game.gameData.crew[idx]].frame = this.sprite.frame;
    //     game.gameData.characters[game.gameData.crew[idx]].angularDrag =this.sprite.body.angularDrag;
    // }
    
    savePlayer() {
        var playerData = {
            isSelected : this.isSelected,
            name : this.name,
            idx : this.idx,
            characterType : this.characterType,
            characterIdx :  this.characterIdx,
            walking : this.sprite.customParams.walking,
            inventory : this.sprite.customParams.inventory,
            status : this.sprite.customParams.status,
            dest_x : this.sprite.customParams.dest_x,
            dest_y : this.sprite.customParams.dest_y,
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

// Player.preloadDefaultPlayer = function (game) {
    
//     //Load the items needed: 1st-> Player Name/Key 2nd-> URL to asset
//     for (var i=0; i<game.playerData.players.length; i++) {
//         game.load.spritesheet(game.playerData.players[i].name, game.playerData.players[i].playerRef, game.playerData.height, game.playerData.width, game.playerData.frames);
//     }
        
// }


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
        status : playerLocType.status,
        dest_x : game.gameData.characters[playerLocType.characterIdx].dest_x,
        dest_y : game.gameData.characters[playerLocType.characterIdx].dest_y,
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
    constructor (game, playerLocType) {
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
    updatePlayerArray(game, cursors, walls, floors) {
        for (var i=0; i< this.crew.length; i++) {
            if (this.players[this.crew[i]].updateCrew(game, cursors, walls, floors)) {
                return false;
            }
        }
        for (var i=0; i< this.bandit.length; i++) {
            if (this.players[this.bandit[i]].updateBandit(game, cursors, walls, floors)) {
                return false;
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