Lyra.MainMenu = function() {
    this.menuTextStyle = {
        "fillColor" : "#fff",
        "size" : "40",
        "verticalSpace" : "50",
    };

    this.menuTextFill = '#fff';
    this.menuTextSize = 40;
    this.menuTextVerticalSpace = 50;

    this.savedGames = [];
};

Lyra.MainMenu.prototype = {
    preload: function() {},
    
	create: function() {
        this.newGameText = this.game.add.text(
                            this.game.world.centerX - 350,
                            this.game.world.centerY - 300,
                            this.game.languageText.newgame[this.game.userPreference.data.languageChoice],
                            'newGame'
                        );
        this.newGameText.inputEnabled = true;
        this.newGameText.fontSize = this.menuTextSize;
        this.newGameText.fill = this.menuTextFill;
        this.newGameText.events.onInputDown.add(this.newGame, this);
        
        this.loadGameText = this.game.add.text(
                            this.game.world.centerX - 350,
                            this.game.world.centerY - 225,
                            this.game.languageText.loadgame[this.game.userPreference.data.languageChoice],
                            'loadGame'
                        );
        this.loadGameText.inputEnabled = true;
        this.loadGameText.fontSize = this.menuTextSize;
        this.loadGameText.fill = this.menuTextFill;
        this.loadGameText.events.onInputDown.add(this.loadGameMenu, this);

        this.optionsText = this.game.add.text(
                            this.game.world.centerX - 350,
                            this.game.world.centerY - 150,
                            this.game.languageText.options[this.game.userPreference.data.languageChoice],
                            'options'
                        );
        this.optionsText.inputEnabled = true;
        this.optionsText.fontSize = this.menuTextSize;
        this.optionsText.fill = this.menuTextFill;
        this.optionsText.events.onInputDown.add(this.optionsMenu, this);
        
        this.storyText = this.game.add.text(
                            this.game.world.centerX - 350,
                            this.game.world.centerY - 75,
                            this.game.languageText.story[this.game.userPreference.data.languageChoice],
                            'story'
                        );
        this.storyText.inputEnabled = true;
        this.storyText.fontSize = this.menuTextSize;
        this.storyText.fill = this.menuTextFill;
        this.storyText.events.onInputDown.add(this.launchStoryState, this);
        this.storyText.active = 1;
        this.storyText.events.onInputOver.add(function() {
            this.storyText.fill = this.menuTextFill;
        }, this);
        this.storyText.events.onInputOut.add(function() {
            if (!this.storyText.active) { 
                this.storyText.fill = "#555559";
            }
        }, this);
	},
	clearSelectedText: function() {
	    this.storyText.fill = this.menuTextFill;
	    this.newGameText.fill = this.menuTextFill;
	    this.loadGameText.fill = this.menuTextFill;
        this.optionsText.fill = this.menuTextFill;
	    if(this.gameSaveText) {
            this.gameSaveText.destroy(true);
            this.gameSaveText = '';
        }
        if(this.easyMapText) {
            this.easyMapText.destroy(true);
            this.easyMapText = '';
        }
        if(this.hardMapText) {
            this.hardMapText.destroy(true);
            this.hardMapText = '';
        }
	},
	update: function() {

	},
	launchStoryState: function() {
	    this.storyText.fill = this.menuTextFill;
	    this.storyText.active = 1;
	    this.newGameText.fill = "#555559";
	    this.loadGameText.fill = "#555559";
        this.optionsText.fill = "#555559";
        if(this.gameSaveText) {
            this.gameSaveText.destroy(true);
            this.gameSaveText = '';
        }
        if(this.easyMapText) {
            this.easyMapText.destroy(true);
            this.easyMapText = '';
        }
        if(this.hardMapText) {
            this.hardMapText.destroy(true);
            this.hardMapText = '';
        }
        if(this.optionSoundText) {
            this.optionSoundText.destroy(true);
            this.optionSoundText = '';
        }
        if(this.optionLanguageText) {
            this.optionLanguageText.destroy(true);
            this.optionLanguageText = '';
        }
        if(this.englishText) {
            this.englishText.destroy(true);
            this.englishText = '';
        }
        if(this.pirateText) {
            this.pirateText.destroy(true);
            this.pirateText = '';
        }
        if(this.spanishText) {
            this.spanishText.destroy(true);
            this.spanishText = '';
        }
	    this.state.start("StoryMenu");
	},
	newGame: function() {
	    console.log('new game clicked');
	    this.newGameText.fill = this.menuTextFill;
        this.loadGameText.fill = "#555559";
        this.optionsText.fill = "#555559";
        this.storyText.fill = "#555559";
        this.storyText.active = 0;
        
        if(this.gameSaveText) {
            this.gameSaveText.destroy(true);
            this.gameSaveText = '';
        }
        if(this.optionSoundText) {
            this.optionSoundText.destroy(true);
            this.optionSoundText = '';
        }
        if(this.optionLanguageText) {
            this.optionLanguageText.destroy(true);
            this.optionLanguageText = '';
        }
        if(this.englishText) {
            this.englishText.destroy(true);
            this.englishText = '';
        }
        if(this.pirateText) {
            this.pirateText.destroy(true);
            this.pirateText = '';
        }
        if(this.spanishText) {
            this.spanishText.destroy(true);
            this.spanishText = '';
        }
        
        if (!this.easyMapText) {
            this.easyMapText = this.game.add.text(
                                this.game.world.centerX - 100,
                                this.game.world.centerY - 325,
                                this.game.languageText.easymap[this.game.userPreference.data.languageChoice],
                                'easyMap'
                            );
            this.easyMapText.inputEnabled = true;
            this.easyMapText.fontSize = this.menuTextSize - 15;
            this.easyMapText.fill = this.menuTextFill;
            this.easyMapText.events.onInputDown.add(function() { this.loadMapData('EASY'); }, this);
        }
        if (!this.hardMapText) {
            this.hardMapText = this.game.add.text(
                                this.game.world.centerX - 100,
                                this.game.world.centerY - 275,
                                this.game.languageText.hardmap[this.game.userPreference.data.languageChoice],
                                'largeMap'
                            );
            this.hardMapText.inputEnabled = true;
            this.hardMapText.fontSize = this.menuTextSize - 15;
            this.hardMapText.fill = this.menuTextFill;
            this.hardMapText.events.onInputDown.add(function() { this.loadMapData('HARD'); }, this);
        }
	},
	loadGameMenu: function() {
	    console.log('load game clicked');
	    this.loadGameText.fill = this.menuTextFill;
	    this.newGameText.fill = "#555559";
        this.optionsText.fill = "#555559";
        this.storyText.fill = "#555559";
        this.storyText.active = 0;
        
        if(this.easyMapText) {
            this.easyMapText.destroy(true);
            this.easyMapText = '';
        }
        if(this.hardMapText) {
            this.hardMapText.destroy(true);
            this.hardMapText = '';
        }
        if(this.optionSoundText) {
            this.optionSoundText.destroy(true);
            this.optionSoundText = '';
        }
        if(this.optionLanguageText) {
            this.optionLanguageText.destroy(true);
            this.optionLanguageText = '';
        }
        if(this.englishText) {
            this.englishText.destroy(true);
            this.englishText = '';
        }
        if(this.pirateText) {
            this.pirateText.destroy(true);
            this.pirateText = '';
        }
        if(this.spanishText) {
            this.spanishText.destroy(true);
            this.spanishText = '';
        }
        
        if (!this.gameSaveLoadText) {
            this.gameSaveLoadText = this.game.add.text(
                                this.game.world.centerX - 100,
                                this.game.world.centerY - 225,
                                'Loading...',
                                'gameSaveLoad'
                            );
            this.gameSaveLoadText.inputEnabled = true;
            this.gameSaveLoadText.fontSize = this.menuTextSize - 15;
            this.gameSaveLoadText.fill = this.menuTextFill;
        }
        this.getSavedGameList();
	},
	populateSavedGameList : function() {
	    console.log('populating');
	    if (!this.gameSaveText) {
            this.gameSaveText = this.game.add.text(
                                this.game.world.centerX - 100,
                                this.game.world.centerY - 225,
                                'gameSave',
                                'gameSave'
                            );
            this.gameSaveText.inputEnabled = true;
            this.gameSaveText.fontSize = this.menuTextSize - 15;
            this.gameSaveText.fill = this.menuTextFill;
            this.gameSaveText.events.onInputDown.add(function() { this.restoreGameData('gameSave'); }, this);
        }
	},
	getSavedGameList : function() {
	    $.ajax({
            url: apiUrl,
            type: 'GET',
            context: this,
            data: { 
                "entity" : "gameData",
                "action" : "list",
                "userId" : this.game.userPreference.data.userId
            },
            dataType: 'json',
            success: function(response) {
                console.log(response);
                if(this.gameSaveLoadText) {
                    this.gameSaveLoadText.destroy(true);
                    this.gameSaveLoadText = '';
                }
                this.populateSavedGameList(JSON.parse(response));
            },
            error: function(response) {
                console.log('fail');
            }
        });
	},
	optionsMenu: function() {
	    console.log('options clicked');
        console.log(this.game.userPreference.ready);
	    this.optionsText.fill = this.menuTextFill;
	    this.newGameText.fill = "#555559";
        this.loadGameText.fill = "#555559";
        this.storyText.fill = "#555559";
        this.storyText.active = 0;
        
        if(this.gameSaveText) {
            this.gameSaveText.destroy(true);
            this.gameSaveText = '';
        }
        if(this.easyMapText) {
            this.easyMapText.destroy(true);
            this.easyMapText = '';
        }
        if(this.hardMapText) {
            this.hardMapText.destroy(true);
            this.hardMapText = '';
        }
        
        if (!this.optionSoundText) {
            var soundText = '';
            if (this.game.userPreference.data.sound === 'true') {
                soundText = 'true';
            } else {
                soundText = 'false';
            }
            this.optionSoundText = this.game.add.text(
                                this.game.world.centerX - (this.game.userPreference.data.languageChoice === 'PRT' ? 0 : 100),
                                this.game.world.centerY - 150,
                                this.game.languageText.sound[this.game.userPreference.data.languageChoice] + ':    ' + this.game.languageText[soundText][this.game.userPreference.data.languageChoice],
                                'sound'
                            );
            this.optionSoundText.inputEnabled = true;
            this.optionSoundText.fontSize = this.menuTextSize - 15;
            this.optionSoundText.fill = this.menuTextFill;
            
            this.optionSoundText.events.onInputDown.add(function() {
                if (this.game.userPreference.data.sound === "true") {
                    this.game.userPreference.data.sound = "false";
                    this.game.menuMusic.stop();
                } else {
                    this.game.userPreference.data.sound = "true";
                    this.game.menuMusic.play('', 0, 0.1, true, true);
                }
                this.game.userPreference.update();
                this.optionSoundText.destroy(true);
                this.optionSoundText = '';
                this.optionsMenu();
            }, this);
        }
        
        if (!this.optionLanguageText) {
            var languageText = '';
            this.optionLanguageText = this.game.add.text(
                                this.game.world.centerX - (this.game.userPreference.data.languageChoice === 'PRT' ? 0 : 100),
                                this.game.world.centerY - 100,
                                this.game.languageText.languageWord[this.game.userPreference.data.languageChoice] + ": ",
                                'language'
                            );
            this.optionLanguageText.inputEnabled = true;
            this.optionLanguageText.fontSize = this.menuTextSize - 15;
            this.optionLanguageText.fill = this.menuTextFill;
            
            this.englishText = this.game.add.text(
                                this.game.world.centerX + (this.game.userPreference.data.languageChoice === 'PRT' ? 150 : 50),
                                this.game.world.centerY - 100,
                                'English',
                                'english'
                            );
            this.englishText.inputEnabled = true;
            this.englishText.fontSize = this.menuTextSize - 15;
            this.englishText.fill = this.game.userPreference.data.languageChoice === 'ENG' ?  this.menuTextFill : "#555559";
            this.englishText.events.onInputDown.add(function() {
                this.game.userPreference.data.languageChoice = "ENG";
                this.game.userPreference.update();
                this.optionLanguageText = '';
                this.optionSoundText = '';
                this.state.start('MainMenu');
            }, this);
            
            this.pirateText = this.game.add.text(
                                this.game.world.centerX + (this.game.userPreference.data.languageChoice === 'PRT' ? 150 : 50),
                                this.game.world.centerY,
                                'Pirate',
                                'pirate'
                            );
            this.pirateText.inputEnabled = true;
            this.pirateText.fontSize = this.menuTextSize - 15;
            this.pirateText.fill = this.game.userPreference.data.languageChoice === 'PRT' ?  this.menuTextFill : "#555559";
            this.pirateText.events.onInputDown.add(function() {
                console.log('pir clicked');
                this.game.userPreference.data.languageChoice = "PRT";
                this.game.userPreference.update();
                this.optionLanguageText = '';
                this.optionSoundText = '';
                this.state.start('MainMenu');
            }, this);
            
            this.spanishText = this.game.add.text(
                                this.game.world.centerX + (this.game.userPreference.data.languageChoice === 'PRT' ? 150 : 50),
                                this.game.world.centerY - 50,
                                'Espanol',
                                'espanol'
                            );
            this.spanishText.inputEnabled = true;
            this.spanishText.fontSize = this.menuTextSize - 15;
            this.spanishText.fill = this.game.userPreference.data.languageChoice === 'ESP' ?  this.menuTextFill : "#555559";
            this.spanishText.events.onInputDown.add(function() {
                this.game.userPreference.data.languageChoice = "ESP";
                this.game.userPreference.update();
                this.optionLanguageText = '';
                this.optionSoundText = '';
                this.state.start('MainMenu');
            }, this);
        }
        
	},
	loadMapData: function(mapSelection) {
        console.log('map selected: ' + mapSelection);
        $.ajax({
            url: apiUrl,
            type: 'GET',
            context: this,
            data: { 
                "entity" : "map",
                "mapSelection" : mapSelection
            },
            dataType: 'json',
            success: function(response) {
                this.launchGame(response);
            },
            error: function(response) {
                console.log(response);
                
            }
        });
    },
	restoreGameData: function(gameSaveFile) {
        console.log('restore game data selected');
        $.ajax({
            url: apiUrl,
            type: 'GET',
            context: this,
            data: { 
                "entity" : "gameData",
                "action" : "game",
                "gameSelected" : gameSaveFile
            },
            dataType: 'json',
            success: function(response) {
                console.log('it worked');
                this.launchGame(JSON.parse(response));
            },
            error: function(response) {
                console.log('fail');
                console.log(response);
            }
        });
    },
	launchGame: function(mapData) {
	    console.log('launching game');
	    if (this.game.menuMusic.isPlaying) {
	        this.game.menuMusic.stop();
	    }
	    console.log(mapData);
	    this.game.gameData = JSON.parse(mapData);
	    this.game.playerData = PLAYER_DATA;
	    this.game.itemData = ITEMS_DATA;
	    this.game.newGame = true;
        this.state.start('LyraGame');
	}
};