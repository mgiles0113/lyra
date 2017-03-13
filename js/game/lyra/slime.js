class Slime {

    
    constructor (game, x, y, slimeData) {
        this.idx = slimeData.idx;
        this.age = slimeData.age;
        this.animation = slimeData.animation;
        this.texture = slimeData.texture;
        this.speed = slimeData.speed; //getRandomInt(1,2);
        this.phaseLife = slimeData.phaselife;
        this.phase = slimeData.phase;
        this.numChildren = slimeData.numchildren;
        this.isSuppressed = slimeData.isSuppressed;
        this.isMobile = slimeData.isMobile;
    
        this.xPos = x;
        this.yPos = y;
        this.template = slimeData.template;
        this.slimeLabel = slimeData.slimelabel;
        
        this.slimesprite = game.add.sprite(this.xPos, this.yPos, this.slimeLabel);
        for (var i = 0; i < game.gameData.slimeanimations.length; i++) {
            this.slimesprite.animations.add('p'+i, game.gameData.slimeanimations[i], this.speed, true );
        }
        game.physics.arcade.enable(this.slimesprite);
        this.slimesprite.body.setSize(game.gameData.slimetemplate[this.template].width,game.gameData.slimetemplate[this.template].height);
        this.slimesprite.anchor.set(game.gameData.slimetemplate[this.template].anchor[0], game.gameData.slimetemplate[this.template].anchor[1]); // center collision over image
        
        // try not setting a radius to see if collision/overlap lines up better
        //this.slimesprite.body.setCircle(game.gameData.slimetemplate[this.template].radius); // radius of collision body
        this.slimesprite.body.bounce.x = 0.1;
        this.slimesprite.body.bounce.y = 0.1;
    }
    
    immobilize() {
         this.slimesprite.immovable = true; this.slimesprite.body.immovable = true; this.slimesprite.body.moves = false;
         this.slimesprite.body.setCircle(4);
         this.isMobile = false;
    }
    
    suppress(game, equipped) {
        var offset = 10;
        if (equipped[0].name == "coffeecup") {
            offset = 20;
        }
        this.phase = this.phase + offset;
        this.immobilize();
        this.animation = "p" + this.phase;
        this.slimesprite.loadTexture(this.slimeLabel, game.gameData.slimeanimations[this.phase][0], true);
        this.isSuppressed = true;
        //console.log("kill the slime");
    }
    
    updateTrajectory() {
        var a = getRandomInt(20 , 90);
        var b = getRandomInt(20, 90);
        var c = getRandomInt(4, 10);
        // console.log(a , b, c);
        if  (getRandomInt(1, 2) == 2 ) {
            this.slimesprite.body.velocity.x = a; //(10 - this.phase)*a;
        }
        else
            this.slimesprite.body.velocity.x = -a; //(10 - this.phase)*a;
            
        if  (getRandomInt(1, 2) == 2 ) {
            this.slimesprite.body.velocity.y = b; //(10 - this.phase)*b;
        }
        else
            this.slimesprite.body.velocity.y = -b; //(10 - this.phase)*b;
        if  (getRandomInt(1, 2) == 2 ) {
            this.slimesprite.body.angularVelocity = c;
        }
        else
            this.slimesprite.body.angularVelocity = -c;
    }
    
    
    // updatePos(game, x, y) {
    //     game.physics.arcade.moveToXY(this.slimesprite, x, y, 1000);
    // }


    replicateSlime (indexNum, game) {
        var slimeObj  = new Slime(game, this.slimesprite.body.center.x, this.slimesprite.body.center.y,  Slime.rawData(indexNum, game));
        this.updateTrajectory();
        this.numChildren +=1;
        slimeObj.slimesprite.animations.play(slimeObj.animation);
        return (slimeObj);
    }
    
    
    updateSlime (game, walls) {
        // if mobile, check for collision with walls
        if (this.isMobile) {
            game.physics.arcade.collide(this.slimesprite, walls);
            // change trajectory every once in awhile if still mobile
            if (this.age % this.phaseLife == 0) {
                this.updateTrajectory();
            }
        }

        // mature the slime
        if ((this.age % this.phaseLife == 0) && this.phase >=0 && this.phase < 9) {
            this.phase += 1;
            this.animation = "p" + this.phase;
            this.slimesprite.animations.play(this.animation);
        }
    }

    
    
    saveSlime (offsetX, offsetY) {
        var slimeData = {
            idx : this.idx,
            template : this.template,
            age : this.age,
            animation : this.animation,
            texture : this.texture,
            speed : this.speed,
            phaselife : this.phaseLife,
            phase : this.phase,
            numchildren : this.numChildren,
            isSuppressed : this.isSuppressed,
            isMobile : this.isMobile,
            x : this.slimesprite.body.position.x + offsetX,
            y : this.slimesprite.body.position.y + offsetY,
            slimelabel : this.slimeLabel,
            velocityx : this.slimesprite.body.velocity.x,
            velocityy : this.slimesprite.body.velocity.y,
            angularvelocity : this.slimesprite.body.angularVelocity
        }
        return (slimeData);
    }

}

Slime.preloadSlime = function(game) {
        for (var i = 0; i< game.gameData.slimetemplate.length; i++) {
            game.load.spritesheet(game.gameData.slimetemplate[i].slimelabel, game.gameData.slimetemplate[i].imageref, game.gameData.slimetemplate[i].width, game.gameData.slimetemplate[i].height, game.gameData.slimetemplate[i].frames, 0, 0);
            game.load.image(game.gameData.slimetemplate[i].slimelabel + "mature", game.gameData.slimetemplate[i].imageref, game.gameData.slimetemplate[i].width, game.gameData.slimetemplate[i].height);
        }
    }
    
Slime.rawData = function(idx, game) {
    var chooseTemplate = getRandomInt(0, 3);
    var slimeData = {
            idx : idx,
            template : chooseTemplate,
            age : 0,
            animation : 'p0',
            texture : 0,
            speed : 1, //getRandomInt(1,2);,
            phaselife : getRandomInt(150, 200),
            phase : 0,
            numchildren : 0,
            isSuppressed : false,
            isMobile : true,
            slimelabel : game.gameData.slimetemplate[chooseTemplate].slimelabel,
            velocityx : 0,
            velocityy : 0,
            angularvelocity : 0
    }
    return (slimeData)
}
    
class SlimeManager {
    // limit will be the number of slime in motion, currently the total number
    // x, y are the starting position of the initial spore
    constructor (game, spawnCoord, numPlayers) {
        this.limit = game.gameData.slimemotionlimit;
        this.movingSlime = 0;
        this.lastToMature = 0;
        this.spawnCoord = spawnCoord;
        if (game.gameData.slimearray.length < 1) {
            this.slimeArr=[];
            // spawn to new set of room coordinates
            this.generateFirstSlime(game) 
        }
        else {
            // load suppressed slime images on the gameboard
            var slimeImage = [];
            if (game.gameData.slimeSuppressedArray != undefined) {
                for (var j=0; j< game.gameData.slimeSuppressedArray.length; j++) {
                    slimeImage[j] = new Slime(game, game.gameData.slimeSuppressedArray[j].x, game.gameData.slimeSuppressedArray[j].y, game.gameData.slimeSuppressedArray[j]);
                    slimeImage[j].slimesprite.loadTexture(slimeImage[j].slimeLabel, game.gameData.slimeanimations[slimeImage[j].phase][0], true )
                }
            }
            // load existing slime into array
            this.slimeArr=[];
            for (var i = 0; i < game.gameData.slimearray.length ; i++) {
                this.slimeArr[i] = new Slime(game, game.gameData.slimearray[i].x, game.gameData.slimearray[i].y, game.gameData.slimearray[i]);
                if (this.slimeArr[i].isMobile) { this.movingSlime += 1; }
                if (this.slimeArr[i].phase == 9) {
                    this.lastToMature = i;
                     this.slimeArr[i].slimesprite.loadTexture(this.slimeArr[i].slimeLabel, game.gameData.slimeanimations[9][getRandomInt(0, 7)], true);
                } else {
                    this.slimeArr[i].slimesprite.animations.play(this.slimeArr[i].animation);
                }
            }
        }
    } 
    
    generateFirstSlime(game) {
            var coord = this.spawnCoord[getRandomInt(0, this.spawnCoord.length-1)];
            this.slimeArr[0] = new Slime(game, coord[0], coord[1], Slime.rawData(0, game));
            this.slimeArr[0].immobilize();
            //this.slimeCounter = 1;
            this.slimeArr[0].slimesprite.animations.play(this.slimeArr[0].animation);
    }
    
    addNewSlime (game) {
        // number of moving slime is limited
        if (this.movingSlime < this.limit) {
            if (this.slimeArr[0].age % 50 == 0) {
                // spawn to new set of room coordinates
                var coord = this.spawnCoord[getRandomInt(0, this.spawnCoord.length-1)];
                this.slimeArr[this.slimeArr.length] =  new Slime(game, coord[0], coord[1], Slime.rawData(this.slimeArr.length, game));
                //console.log("spawn new slime in room coord: " + coord);
            } else {
                this.slimeArr[this.slimeArr.length] = this.slimeArr[this.lastToMature].replicateSlime(this.slimeArr.length, game);
                this.movingSlime += 1;
            }
        }
    }
    
    removeSuppressedSlime(game, slimeIdx) {
        // create array of suppressed slime - this is to recreate for saved game
        if (game.gameData.slimeSuppressedArray == undefined) {
            game.gameData.slimeSuppressedArray = [];
        }
        var offsetX = game.gameData.slimetemplate[this.slimeArr[slimeIdx].template].width*game.gameData.slimetemplate[this.slimeArr[slimeIdx].template].anchor[0];
        var offsetY = game.gameData.slimetemplate[this.slimeArr[slimeIdx].template].height*game.gameData.slimetemplate[this.slimeArr[slimeIdx].template].anchor[1];
        game.gameData.slimeSuppressedArray.push(this.slimeArr[slimeIdx].saveSlime (offsetX, offsetY));
        
        // just in case there's a logic error, don't try to remove from empty array
        if (this.slimeArr.length > 1) {
            if (this.slimeArr[slimeIdx].isMobile) {
                this.movingSlime -= 1;
            }
            if (slimeIdx == this.lastToMature) {
                // setup a new starting point
                if (this.slimeArr.length > 2) { // there are at least three slime left, we're about to remove one
                        this.lastToMature = this.slimeArr.length - 2;
                } else {
                    this.lastToMature = 0;
                }
            }
            // remove slime from array
            this.slimeArr.splice(slimeIdx,1);
        }
    }
    
    
    updateSlime(game, walls, containerManager, playerManager) {
        // this array will track slime that has been suppressed
        var slimeToKill = [];
        
        // track if the player still overlaps any slime
        var playerStuck = [];
        for (var j=0; j<playerManager.players.length; j++) {
            playerStuck[j] = false;
        }
        // in case all slime are suppressed
        if (this.slimeArr.length < 1) {
            this.generateFirstSlime(game);
            this.movingSlime = 0;
            this.lastToMature = 0;
        }
        
        for (var k=this.slimeArr.length - 1; k>=0 ; k--) {
            if (this.slimeArr[k].phase > 9) {
                // prepare slime to suppress
                slimeToKill.push(k);
            } else {
                this.slimeArr[k].age +=1;
                if (this.slimeArr[k].phase == 9) {
                    // play animation every once in awhile
                    if (this.age % this.phaseLife == 0) {
                        this.slimeArr[k].slimesprite.animations.play(this.slimeArr[k].animation, false);
                    }
                    if (this.slimeArr[k].isMobile)  {
                        // change to text with no animation most slime
                         this.slimeArr[k].immobilize();
                         this.movingSlime -= 1;
                         // stop animation
                         this.slimeArr[k].slimesprite.animations.stop();
                         this.slimeArr[k].slimesprite.loadTexture(this.slimeArr[k].slimeLabel, game.gameData.slimeanimations[9][getRandomInt(0, game.gameData.slimeanimations[9].length-1)], true);
                         this.lastToMature = k;
                    }
                } else {
                    this.slimeArr[k].updateSlime(game, walls);
                    for (var c=0; c<containerManager.containers.length - 1; c++) {
                        if (containerManager.containers[c].name == "doors" && containerManager.containers[c].sprite.body.checkCollision.any) {
                            game.physics.arcade.collide(containerManager.containers[c].sprite, this.slimeArr[k].slimesprite);
                        }
                    }
                }
                for (var j=0; j < playerManager.players.length; j++)
                { 
                    if (game.physics.arcade.overlap(playerManager.players[j].sprite, this.slimeArr[k].slimesprite)) {
                        // player is still overlapping active slime
                        playerStuck[j] = true;
                        // player has spacebar selected and equipped item has capacity
                        if (playerManager.players[j].emitterActive) {
                            // spray slime if player overlaps and there's an emitter running
                            //game.physics.arcade.overlap(this.slimeArr[k].slimesprite, this.emitter, this.slimeArr[k].suppress(game));
                            this.slimeArr[k].suppress(game, playerManager.players[j].sprite.customParams.equipped);
                        }
                        // if not already stuck or asleep, set player to stuck
                        if (!(playerManager.players[j].sprite.customParams.status == "stuck" || playerManager.players[j].sprite.customParams.status == "knockout" || playerManager.players[j].sprite.customParams.status == "sleep")) {
                            playerManager.players[j].stuckInSlimeSignal.dispatch(playerManager.players[j].sprite, this.slimeArr[k].slimesprite);
                        }
                    }
                }
            }
        }
        
        for (var j=0; j<playerStuck.length; j++) {
            // only allow one shot per press of spacebar
            if (playerManager.players[j].emitterActive) {
                playerManager.players[j].emitterActive = false;
            }
            // make sure player is awake after slime suppressant
            if (!playerStuck[j] && playerManager.players[j].sprite.customParams.status == "stuck") {
                playerManager.players[j].unstickPlayer(game);
            }
        }
        
        
        // kill off any slime that was suppressed by removing from slimeArr
        // remove higher indices first so array index in the array doesn't change
        slimeToKill = slimeToKill.sort(function(a, b){return b-a});
        for (var k=0; k<slimeToKill.length; k++) {
            this.removeSuppressedSlime(game, slimeToKill[k]);
        }
    }
    
    
    
    
    // updateSlimeArr (game, walls) {
    //     // check for overlap - iterates through the whole slimeArr^2
    //     for (var k=this.slimeArr.length - 1; k>=0 ; k--) {
    //         if (this.slimeArr[k].isMobile) {
    //             game.physics.arcade.collide(this.slimeArr[k].slimesprite, walls);
    //             for (var c=0; c<containerManager.containers.length - 1; c++) {
    //                 if (containerManager.containers[c].name == "doors" && containerManager.containers[c].sprite.body.checkCollision.any) {
    //                     game.physics.arcade.collide(containerManager.containers[c].sprite, this.slimeArr[k].slimesprite);
    //                 }
    //             }
    //         }
    //         this.slimeArr[k].age +=1;
    //         // mature the slime
    //         if ((this.slimeArr[k].age % this.slimeArr[k].phaseLife == 0) && this.slimeArr[k].phase >=0 && this.slimeArr[k].phase < 9) {
    //             this.slimeArr[k].phase += 1;
    //             this.slimeArr[k].animation = "p" + this.slimeArr[k].phase;
    //             this.slimeArr[k].slimesprite.animations.play(this.slimeArr[k].animation);
    //         }
            
    //         // change trajectory every once in awhile if still mobile
    //         if (this.slimeArr[k].isMobile && this.slimeArr[k].age % this.slimeArr[k].phaseLife == 0 ) {
    //             this.slimeArr[k].updateTrajectory(); 
    //         } 
            
    //         for (var j=0; j < playerManager.players.length; j++)
    //         { 
    //             if (playerManager.players[j].sprite.customParams.status == "awake" && game.physics.arcade.overlap(playerManager.players[j].sprite, this.slimeArr[k].slimesprite)) {
    //                 playerManager.players[j].stuckInSlimeSignal.dispatch(playerManager.players[j].sprite, this.slimeArr[k].slimesprite);
    //             }
    //         }
            

    //         // var overlapTest = true;
    //         // for (var j=0; j<this.slimeArr.length - 1; j++) {
    //         //     // this would cause slime to collide into each other.  If they are set to immobile, essentially blocks doors
    //         //     // if (this.slimeArr[k].isMobile && !this.slimeArr[j].isMobile) {
    //         //     //     if (game.physics.arcade.collide(this.slimeArr[k].slimesprite, this.slimeArr[j].slimesprite)) {
    //         //     //         overlapTest = false;
    //         //     //         if (this.slimeArr[k].isMobile && this.slimeArr[k].age % 20 == 0) {
    //         //     //             this.slimeArr[k].updateTrajectory(); 
    //         //     //         }
    //         //     //     }
    //         //     // }
    //         //     // skip testing slime that has been immobilized, otherwise look for overlap, keep moving if overlapping.
    //         //     if ((j != k) && (this.slimeArr[k].isMobile)) {  // don't test against itself
    //         //         if (game.physics.arcade.overlap(this.slimeArr[k].slimesprite, this.slimeArr[j].slimesprite)) {
    //         //             overlapTest = false;
    //         //             // update trajectory every once in awhile
    //         //             // if (this.slimeArr[k].age % this.slimeArr[k].phaseLife == 0) {
    //         //             //     this.slimeArr[k].updateTrajectory(); 
    //         //             //     //console.log("trajectory update")
    //         //             // }
    //         //         }
    //         //     }
    //         // }
            
    //         // play animation every once in awhile
    //         if (this.slimeArr[k].phase == 9 && !this.slimeArr[k].isMobile && (this.slimeArr[k].age % 10 == 0)) {
    //                  // change to text with no animation most slime
    //                  this.slimeArr[k].slimesprite.animations.play(1, false);
    //         }
            
    //         // immobilize slime when not overlapping
    //         //if (overlapTest && this.slimeArr[k].phase == 9 && this.slimeArr[k].isMobile)  {
    //         if (this.slimeArr[k].phase == 9 && this.slimeArr[k].isMobile)  {
    //              this.slimeArr[k].immobilize();
    //              this.movingSlime -= 1;
    //              //console.log("immobilized: " + this.slimeArr[k].idx + " pos: " + this.slimeArr[k].slimesprite.body.position);
    //              // stop animation
    //              this.slimeArr[k].slimesprite.animations.stop();
    //              this.slimeArr[k].slimesprite.loadTexture(this.slimeArr[k].slimeLabel, 9, true);
    //         }
    //     }
    // }
    
    saveSlimeManager (game) {
        var savedSlime = [];
        for (var i = 0; i < this.slimeArr.length; i++) {
            var offsetX = game.gameData.slimetemplate[this.slimeArr[i].template].width*game.gameData.slimetemplate[this.slimeArr[i].template].anchor[0];
            var offsetY = game.gameData.slimetemplate[this.slimeArr[i].template].height*game.gameData.slimetemplate[this.slimeArr[i].template].anchor[1];
            savedSlime[i] = this.slimeArr[i].saveSlime (offsetX, offsetY); 
        }
        game.gameData.spawnCoord = this.spawnCoord;
        game.gameData.slimearray = savedSlime;
    }
}

