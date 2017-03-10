class SoundController {
    constructor(game) {
        this.game = game;
        this.music = {
            menuMusic : this.game.add.audio('menuMusic'),
			doorOpen : this.game.add.audio('doorOpen'),
			doorClose : this.game.add.audio('doorClose'),
			containerOpen : this.game.add.audio('containerOpen'),
			containerClose : this.game.add.audio('containerClose'),
			lyreMusic : this.game.add.audio('lyreMusic'),
			gameMusic : this.game.add.audio('gameMusic'),
			trance : this.game.add.audio('trance'),
			engine : this.game.add.audio('engine'),
			escapepodOpen : this.game.add.audio('escapepodOpen'),
			escapepodClose : this.game.add.audio('escapepodClose'),
			escapepodTakeoff : this.game.add.audio('escapepodTakeoff'),
			spill : this.game.add.audio('spill'),
			spray : this.game.add.audio('spray')
        };
    }

    pickSound(spriteName, option) {
        //console.log(spriteName);
        switch (spriteName) {
            case "doors":
                if (option === "open") {
                    return 'doorOpen';
                } else if (option === "close") {
                    return 'doorClose';
                }
                break;

            case "smallbox":
                if (option === "open") {
                    return 'containerOpen';
                } else if (option === "close") {
                    return 'containerClose';
                }
                break;

            case "danceFloor":
                return 'trance';
                break;

            case "engine":
                if (option === "open") {
                    return 'engine';    
                } else {
                    return 'none';
                }
                break;

            case "escapepod":
                if (option === "open") {
                    return 'escapepodOpen';
                } else if (option === "close") {
                    return 'escapepodClose';
                } else if (option === "takeoff") {
                    return 'escapepodTakeoff';
                }
                break;
            case "sleeppod":
                return 'none';
                break;

            case "coffeecup":
                return 'spill';
                break;

            case "suppresant":
                return 'spray';
                break;

            case "blaster":
                return 'spray';
                break;

            default:

                break;
        }
    }
    
    play(soundChoice, repeat, volume) {
        if (soundChoice === 'none') {
            return 0;
        }
        this.music[soundChoice].play('', 0, volume, repeat, true);
    }
    
    stop(soundChoice) {
        if (!soundChoice) {
            for (var music in this.music) {
                if (this.music[music].isPlaying) {
                    this.music[music].stop();
                }
            }
        }
    }
}