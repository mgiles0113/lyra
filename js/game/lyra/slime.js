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

    
    constructor (indexNum, game, x, y) {
        this.idx = indexNum;
        this.age = 0;
        this.animation = 'p0';
        this.speed = 1;
        this.phaseLife = getRandomInt(10, 100);
        this.phase = 0;
        this.numChildren = 0;
        this.isSuppressed = false;
        this.isMobile = true;
    
        if (indexNum == 0) {
            this.xPos =  game.world.width/2;
            this.yPos =  game.world.height/2;
        }
        else {
            this.xPos = x;
            this.yPos = y;
        }
        
        this.slimeLabel = slimeLabels[getRandomInt(0, 3)];
        this.age = 0;
        
        this.slimesprite = game.add.sprite(this.xPos, this.yPos, this.slimeLabel);
        for (var i = 0; i < SLIME_ANIMATION.length; i++) {
            this.slimesprite.animations.add('p'+i, SLIME_ANIMATION[i], this.speed, true );
        }
        game.physics.arcade.enable(this.slimesprite);
        this.slimesprite.body.setSize(32,32);
        this.slimesprite.body.setCircle(20);
    }
    
    immobilize() {
         this.slimesprite.immovable = true; this.slimesprite.body.immovable = true; this.slimesprite.body.moves = false;
         this.isMobile = false;
    }
    
    suppress() {
        this.phase = this.phase + 10;
        this.animation = "p" + this.phase;
        this.isSuppressed = true;
    }
    
    updateTrajectory() {
        this.slimesprite.body.velocity.x = 15 + getRandomInt(50, 150) * getRandomInt(-1, 1);
        this.slimesprite.body.velocity.y = 15 + getRandomInt(50, 150) * getRandomInt(-1, 1);
        this.slimesprite.body.angularVelocity = 5 + getRandomInt(50, 100) * getRandomInt(-1, 1);
    }
    
    
    updatePos(game, x, y) {
        game.physics.arcade.moveToXY(this.slimesprite, x, y, 1000);
    }


    replicateSlime (indexNum, game) {
        var slimeObj  = new Slime(indexNum, game, this.xPos, this.yPos);
        this.updateTrajectory();
        this.numChildren +=1;
        return (slimeObj);
    }

    // generateNewSlimePosition(width, height) {
    //     var validPos = true;
    //     var pos = new Array(2);
    //     while (validPos) {
    //         if (getRandomInt(0, 2) > 1)
    //             pos[0] = getRandomInt(this.xPos+20, this.xPos+50);
    //         else
    //             pos[0] = getRandomInt(this.xPos-50, this.xPos-20);

    //         if (getRandomInt(0, 2) > 1)
    //             pos[1] = getRandomInt(this.yPos+20, this.yPos+50);
    //         else
    //             pos[1] = getRandomInt(this.yPos-50, this.yPos-20);
            
    //         if (pos[0] > 80 && pos[0] < width - 80 && pos[1] > 80 && pos[1] < height - 80) {
    //             validPos = false;
    //             break;
    //         }
    //     }
    //     return pos;
    // }
    
}

Slime.preloadSlime = function(game) {
        game.load.spritesheet('greenCircle1', 'assets/lyraImages/greenCircle1.png', 32, 32, 30, 0, 0);
        game.load.spritesheet('greenCircle2', 'assets/lyraImages/greenCircle2.png', 32, 32, 30, 0, 0);
        game.load.spritesheet('greenCircle3', 'assets/lyraImages/greenCircle3.png', 32, 32, 30, 0, 0);
        game.load.spritesheet('greenCircle4', 'assets/lyraImages/greenCircle4.png', 32, 32, 30, 0, 0);
    }
    
class SlimeManager {
    constructor (limit, game) {
        this.limit = limit;
        this.slimeArr=[];
        this.slimeArr[0] = new Slime(0, game);
        this.slimeArr[0].immobilize();
        this.slimeCounter = 1;
    } 
    
    updateSlimeArr (game, walls) {
        // play and update animation
        for (var i=0; i< this.slimeArr.length; i++) {
            if (this.slimeArr[i].isMobile) {game.physics.arcade.collide(this.slimeArr[i].slimesprite, walls);}
            this.slimeArr[i].slimesprite.animations.play(this.slimeArr[i].animation)
                this.slimeArr[i].age +=1;
                if ((this.slimeArr[i].age % 30 == 0) && this.slimeArr[i].phase >=0 && this.slimeArr[i].phase < 9) {
                    this.slimeArr[i].phase += 1;
                    this.slimeArr[i].animation = "p" + this.slimeArr[i].phase;
                }
        };
        
        // for now replicate to limit
        if (this.slimeCounter < this.limit) {
            for (var i=0; i<10; i++) {
                var rndNum = i;
                if (rndNum > this.slimeArr.length-1) {
                    rndNum = this.slimeArr.length-1;
                }
                if (this.slimeArr.length > 10) {
                   rndNum = getRandomInt(0, this.slimeArr.length-1); 
                }
                if ((this.slimeArr[rndNum].phase == 9 ) && (!this.slimeArr[rndNum].isMobile)) {
                    this.slimeArr[this.slimeCounter] = this.slimeArr[rndNum].replicateSlime(this.slimeCounter, game);
                    console.log("created slime #: " + this.slimeCounter);
                    console.log(this.slimeArr[this.slimeCounter]);
                    this.slimeCounter += 1;
                }
            }
        }
                    
        // check for overlap - iterates through the whole slimeArr^2
        for (var k=0; k < this.slimeArr.length - 1; k++) {
            var overlapTest = true;
            for (var j=k+1; j<this.slimeArr.length - 1; j++) {
                if (j != k) {  // don't test against itself
                    if (game.physics.arcade.overlap(this.slimeArr[k].slimesprite, this.slimeArr[j].slimesprite)) {
                        overlapTest = false;
                        if (this.slimeArr[k].isMobile && this.slimeArr[k].age % 20 == 0) {this.slimeArr[k].updateTrajectory()};
                    }
                }
            }
            if (overlapTest) {
                this.slimeArr[k].immobilize();
            }
        }

    }
}

