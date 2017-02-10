var SLIME_ANIMATION = [
    [0,1,10,11],
    [1,2,11,12],
    [2,3,12,13],
    [3,4,13,14],
    [4,5,13,14],
    [5,6,15,16],
    [6,7,16,17],
    [7,8,17,18],
    [8,9,18,19],
    [9, 19],
    [20],
    [21],
    [22],
    [23],
    [24],
    [25],
    [26],
    [27],
    [28],
    [29]
]


var slimeLabels = ['greenCircle1', 'greenCircle2', 'greenCircle3', 'greenCircle4'];


class Slime {

    
    constructor (game, x, y, slimeData) {
        this.idx = slimeData.idx;
        this.age = slimeData.age;
        this.animation = slimeData.animation;
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
        for (var i = 0; i < SLIME_ANIMATION.length; i++) {
            this.slimesprite.animations.add('p'+i, game.gameData.slimeanimations[i], this.speed, true );
        }
        game.physics.arcade.enable(this.slimesprite);
        this.slimesprite.body.setSize(game.gameData.slimetemplate[this.template].width,game.gameData.slimetemplate[this.template].height);
        this.slimesprite.body.setCircle(game.gameData.slimetemplate[this.template].radius); // radius of collision body
        this.slimesprite.anchor.set(game.gameData.slimetemplate[this.template].anchor[0], game.gameData.slimetemplate[this.template].anchor[1]); // center collision over image
    }
    
    immobilize() {
         this.slimesprite.immovable = true; this.slimesprite.body.immovable = true; this.slimesprite.body.moves = false;
         this.slimesprite.body.setCircle(4);
         this.isMobile = false;
    }
    
    suppress() {
        this.phase = this.phase + 10;
        this.animation = "p" + this.phase;
        this.isSuppressed = true;
    }
    
    updateTrajectory() {
        var a = getRandomInt(5, 15);
        var b = getRandomInt(5, 15);
        var c = getRandomInt(5, 15);
        // console.log(a , b, c);
        if  (getRandomInt(1, 2) == 2 ) {
            this.slimesprite.body.velocity.x = a;
        }
        else
            this.slimesprite.body.velocity.x = -a;
            
        if  (getRandomInt(1, 2) == 2 ) {
            this.slimesprite.body.velocity.y = b;
        }
        else
            this.slimesprite.body.velocity.y = -b;
        if  (getRandomInt(1, 2) == 2 ) {
            this.slimesprite.body.angularVelocity = c;
        }
        else
            this.slimesprite.body.angularVelocity = -c;
    }
    
    
    updatePos(game, x, y) {
        game.physics.arcade.moveToXY(this.slimesprite, x, y, 1000);
    }


    replicateSlime (indexNum, game) {
        var slimeObj  = new Slime(game, this.slimesprite.body.position.x, this.slimesprite.body.position.y,  Slime.rawData(indexNum, game));
        this.updateTrajectory();
        this.numChildren +=1;
        slimeObj.slimesprite.animations.play(slimeObj.animation);
        return (slimeObj);
    }
    
    saveSlime (offsetX, offsetY) {
        var slimeData = {
            idx : this.idx,
            template : this.template,
            age : this.age,
            animation : this.animation,
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
        }
    }
    
Slime.rawData = function(idx, game) {
    var chooseTemplate = getRandomInt(0, 3);
    var slimeData = {
            idx : idx,
            template : chooseTemplate,
            age : 0,
            animation : 'p0',
            speed : 1, //getRandomInt(1,2);,
            phaselife : getRandomInt(50, 200),
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
    constructor (game, x, y) {
        this.limit = game.gameData.slimemotionlimit;
        if (game.gameData.slimearray.length < 1) {
            this.slimeArr=[];
            this.slimeArr[0] = new Slime(game, x, y, Slime.rawData(0, game));
            this.slimeArr[0].immobilize();
            //this.slimeCounter = 1;
            this.slimeArr[0].slimesprite.animations.play(this.slimeArr[0].animation);
        }
        else {
            // load existing slime into array
            this.slimeArr=[];
            for (var i = 0; i < game.gameData.slimearray.length ; i++) {
                this.slimeArr[i] = new Slime(game, game.gameData.slimearray[i].x, game.gameData.slimearray[i].y, game.gameData.slimearray[i]);
            }
        }
    } 
    
    updateSlimeArr (game, walls) {
        // play and update animation and collision with walls
        for (var i=0; i< this.slimeArr.length; i++) {
            if (this.slimeArr[i].isMobile) {game.physics.arcade.collide(this.slimeArr[i].slimesprite, walls);}
            this.slimeArr[i].age +=1;
            // mature the slime
            if ((this.slimeArr[i].age % this.slimeArr[i].phaseLife == 0) && this.slimeArr[i].phase >=0 && this.slimeArr[i].phase < 9) {
                this.slimeArr[i].phase += 1;
                this.slimeArr[i].animation = "p" + this.slimeArr[i].phase;
                this.slimeArr[i].slimesprite.animations.play(this.slimeArr[i].animation);
            }
        };
        
        // for now replicate to limit
        if (this.slimeArr.length < this.limit) {
            for (var i=0; i<1; i++) {
                var rndNum = i;
                if (rndNum > this.slimeArr.length-1) {
                    rndNum = this.slimeArr.length-1;
                }
                if (this.slimeArr.length > 10) {
                   rndNum = getRandomInt(0, this.slimeArr.length-1); 
                }
                // slow down replication by requiring slime in phase 9, that is no longer mobile and only allow 20% of time
                if ((this.slimeArr[rndNum].phase == 9 ) && (this.slimeArr[rndNum].age % 5 == 0) && (!this.slimeArr[rndNum].isMobile)) {
                    this.slimeArr[this.slimeArr.length] = this.slimeArr[rndNum].replicateSlime(this.slimeArr.length, game);
                    // console.log("created slime #: " + this.slimeCounter);
                    // console.log(this.slimeArr[this.slimeCounter]);
                    //this.slimeCounter += 1;
                }
            }
        }
                    
        // check for overlap - iterates through the whole slimeArr^2
        for (var k=this.slimeArr.length - 1; k>=0 ; k--) {
            var overlapTest = true;
            for (var j=0; j<this.slimeArr.length - 1; j++) {
                // this would cause slime to collide into each other.  If they are set to immobile, essentially blocks doors
                // if (this.slimeArr[k].isMobile && !this.slimeArr[j].isMobile) {
                //     if (game.physics.arcade.collide(this.slimeArr[k].slimesprite, this.slimeArr[j].slimesprite)) {
                //         overlapTest = false;
                //         if (this.slimeArr[k].isMobile && this.slimeArr[k].age % 20 == 0) {
                //             this.slimeArr[k].updateTrajectory(); 
                //         }
                //     }
                // }
                // skip testing slime that has been immobilized, otherwise look for overlap, keep moving if overlapping.
                if ((j != k) && (this.slimeArr[k].isMobile)) {  // don't test against itself
                    if (game.physics.arcade.overlap(this.slimeArr[k].slimesprite, this.slimeArr[j].slimesprite)) {
                        overlapTest = false;
                        // update trajectory every once in awhile
                        if (this.slimeArr[k].age % this.slimeArr[k].phaseLife == 0) {
                            this.slimeArr[k].updateTrajectory(); 
                            //console.log("trajectory update")
                        }
                    }
                }
            }
            // immobilize slime when not overlapping
            if (overlapTest && this.slimeArr[k].phase == 9 && this.slimeArr[k].isMobile)  {
                 this.slimeArr[k].immobilize();
                 //console.log("immobilized: " + this.slimeArr[k].idx + " pos: " + this.slimeArr[k].slimesprite.body.position);

            }
        }
    }
    
    saveSlimeManager (game) {
        var savedSlime = [];
        for (var i = 0; i < this.slimeArr.length; i++) {
            var offsetX = game.gameData.slimetemplate[this.slimeArr[i].template].width*game.gameData.slimetemplate[this.slimeArr[i].template].anchor[0];
            var offsetY = game.gameData.slimetemplate[this.slimeArr[i].template].height*game.gameData.slimetemplate[this.slimeArr[i].template].anchor[1];
            savedSlime[i] = this.slimeArr[i].saveSlime (offsetX, offsetY); 
        }
        game.gameData.slimearray = savedSlime;
    }
}

