class Slime {
    
    constructor (indexNum, game, x, y) {
        this.idx = indexNum;
        this.animation = "slime"+indexNum;
        this.speed = getRandomInt(1, 5);
    
        if (indexNum == 0) {
            this.xPos = getRandomInt(80, 560);
            this.yPos = getRandomInt(80, 560);
        }
        else {
            this.xPos = x;
            this.yPos = y;
        }
        
        this.age = 0;
        this.slimesprite = game.add.sprite(this.xPos, this.yPos, 'greenCircle');
        this.slimesprite.animations.add(this.animation, [0, 1, 2, 3, 4, 5], this.speed, true );
        game.physics.enable(this.slimesprite);
    }


    replicateSlime (indexNum, game) {
        var pos = this.generateNewSlimePosition(this.xPos, this.yPos);
        var slimeObj  = new Slime(indexNum, game, pos[0], pos[1]);
        return (slimeObj);
    }

    generateNewSlimePosition(x, y) {
        var validPos = true;
        var pos = new Array(2);
        while (validPos) {
            pos[0] = getRandomInt(x-30, x+30);
            pos[1] = getRandomInt(y-30, y+30);
            if (pos[0] > 80 && pos[0] < 560 && pos[1] > 80 && pos[1] < 560) {
                validPos = false;
                break;
            }
        }
        return pos;
    }

    incrementAge (value) {
    this.age += value;
    }
}

Slime.preloadSlime = function(game) {
        game.load.spritesheet('greenCircle', 'assets/greenCircle.png', 32, 32);
    }
    
Slime.createSlime = function() {
    
}

Slime.updateSlime = function() {
    
}
