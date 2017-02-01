function generateAnimation () {
    var a = [];
    var idx = 0;
    for (var i=0; i<10; i++) {
        a[idx]=[i,i+1];
        a[idx+1]=[i,i+10];
        idx +=2;
    }
    return a;
}

var slimeLabels = ['greenCircle1', 'greenCircle2', 'greenCircle3', 'greenCircle4'];


class Slime {
    
    constructor (indexNum, game, x, y) {
        this.idx = indexNum;
        this.age = 0;
        this.animation = "slime"+indexNum;
        this.animationSequence = generateAnimation();
        this.speed = 1;
        this.phaseLife = getRandomInt(10, 100);
        this.phase = 1;
        this.numChildren = 0;
        this.isSuppressed = false;
    
        if (indexNum == 0) {
            this.xPos = game.world.width/2;
            this.yPos = game.world.height/2;
        }
        else {
            this.xPos = x;
            this.yPos = y;
        }
        
        this.slimeLabel = slimeLabels[getRandomInt(0, 3)];
        this.age = 0;
        
        this.slimesprite = game.add.sprite(this.xPos, this.yPos, this.slimeLabel);
        this.slimesprite.animations.add(this.animation, this.animationSequence[0], this.speed, true );
        game.physics.arcade.enable(this.slimesprite);
        this.slimesprite.immovable = true; this.slimesprite.body.immovable = true; this.slimesprite.body.moves = false;
    }


    replicateSlime (indexNum, game) {
        var pos = this.generateNewSlimePosition(game);
        var slimeObj  = new Slime(indexNum, game, pos[0], pos[1]);
        this.numChildren +=1;
        return (slimeObj);
    }

    generateNewSlimePosition(game) {
        var validPos = true;
        var pos = new Array(2);
        while (validPos) {
            if (getRandomInt(-1, 1) >=0)
                pos[0] = getRandomInt(this.xPos+20, this.xPos+50);
            else
                pos[0] = getRandomInt(this.xPos-50, this.xPos-20);

            if (getRandomInt(-1, 1) >=0)
                pos[1] = getRandomInt(this.yPos+20, this.yPos+50);
            else
                pos[1] = getRandomInt(this.yPos-50, this.yPos-20);
            
            if (pos[0] > 80 && pos[0] < game.world.width - 80 && pos[1] > 80 && pos[1] < game.world.height - 80) {
                validPos = false;
                break;
            }
        }
        return pos;
    }
    
    incrementAge (value) {
        this.age += value;
    }
    
    getPhase () {
        var idx = 1;
        for (var i = 0; i < 10; i++) {
            if ( (this.age >= (this.phaseLife*idx - this.phaseLife )) && (this.age < (this.phaseLife*idx + this.phaseLife ))) {
                return i;
            }
        }
        return 0;
    }
    
    updateAnimation (phase) {
        if (phase != this.phase) {
            if (phase > 0) {
                this.slimesprite.animations.add(this.animation, this.animationSequence[phase-1], this.speed, true );
            }
            else {
                if (phase == 0) {
                    // reached maturity
                    this.slimesprite.animations.add(this.animation, [19, 18, 9, 8], this.speed, true );
                } else {
                    // suppressed
                    this.isSuppressed = true;
                    if (this.phase > 0) {
                        this.slimesprite.animations.add(this.animation, [this.phase-1+20], this.speed, true );
                    }
                    else {
                        this.slimesprite.animations.add(this.animation, [29], this.speed, true );
                    }
                }
            }
            this.phase = phase;
        }
    }
    
    
    updateSlime (game, phase) {
        
        this.incrementAge(1);
        
    }
}

Slime.preloadSlime = function(game) {
        game.load.spritesheet('greenCircle', 'assets/greenCircle.png', 32, 32);
        game.load.spritesheet('greenCircle1', 'assets/greenCircle1.png', 32, 32);
        game.load.spritesheet('greenCircle2', 'assets/greenCircle2.png', 32, 32);
        game.load.spritesheet('greenCircle3', 'assets/greenCircle3.png', 32, 32);
        game.load.spritesheet('greenCircle4', 'assets/greenCircle4.png', 32, 32);
    }
    
class SlimeManager {
    constructor (limit, game) {
        this.slimeCounter = 0;
        this.limit = limit;
        this.slimeArr=[];
        this.slimeArr[0] = new Slime(0, game);
        this.slimeCounter += 1;
    } 
    
    updateSlimeArr (game) {
        if (this.slimeCounter < this.limit) {
            // if (this.slimeCounter == 0) { 
            //     this.slimeArr[0] = new Slime(0, game);
            //     this.slimeCounter += 1;
            // }
            // else {
                var currentSlime = this.slimeCounter;
                for (var i=0; i<currentSlime; i++) {
                    this.slimeArr[i].incrementAge(1);
                    var phase = this.slimeArr[i].getPhase();
                    this.slimeArr[i].updateAnimation(phase);
                    this.slimeArr[i].slimesprite.animations.play(this.slimeArr[i].animation);
                    if ((phase == 0 ) && this.slimeArr[i].numChildren < 10) {
                        this.slimeCounter += 1;
                        this.slimeArr[this.slimeCounter-1] = this.slimeArr[i].replicateSlime(this.slimeCounter, game);
                    }
                }
            //}
            // console.log("created slime #: " + this.slimeCounter);
            // console.log(this.slimeArr[this.slimeCounter]);
        }
    }
        
    
}
