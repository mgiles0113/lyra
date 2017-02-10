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
		this.menuMusic = this.game.add.audio('menuMusic');
        
	    if (this.game.userPreference.data.sound === "true") {
	        this.menuMusic.play('', 0, 0.5, true, true);
	    }

        this.newGameText = this.game.add.text(
                            this.game.world.centerX,
                            this.game.world.centerY - 100,
                            this.game.languageText.newgame[this.game.userPreference.data.languageChoice],
                            'newGame'
                        );
        this.newGameText.inputEnabled = true;
        this.newGameText.fontSize = this.menuTextSize;
        this.newGameText.fill = this.menuTextFill;
        this.newGameText.events.onInputOver.add(function() { this.newGameText.fill = 'aqua';}, this);
        this.newGameText.events.onInputOut.add(function() { this.newGameText.fill = this.menuTextFill; }, this);
        this.newGameText.events.onInputDown.add(this.newGame, this);
        
        this.loadGameText = this.game.add.text(
                            this.game.world.centerX,
                            this.game.world.centerY - 25,
                            this.game.languageText.loadgame[this.game.userPreference.data.languageChoice],
                            'loadGame'
                        );
        this.loadGameText.inputEnabled = true;
        this.loadGameText.fontSize = this.menuTextSize;
        this.loadGameText.fill = this.menuTextFill;
        this.loadGameText.events.onInputDown.add(this.loadGameMenu, this);

        this.optionsText = this.game.add.text(
                            this.game.world.centerX,
                            this.game.world.centerY + 50,
                            this.game.languageText.options[this.game.userPreference.data.languageChoice],
                            'options'
                        );
        this.optionsText.inputEnabled = true;
        this.optionsText.fontSize = this.menuTextSize;
        this.optionsText.fill = this.menuTextFill;
        this.optionsText.events.onInputDown.add(this.optionsMenu, this);
	},
	update: function() {
		
	},
	newGame: function() {
	    console.log('new game clicked');
	    this.newGameText.fill = this.menuTextFill;
        this.loadGameText.fill = "#555559";
        this.optionsText.fill = "#555559";
        
        if (!this.easyMapText) {
            this.easyMapText = this.game.add.text(
                                this.game.world.centerX + 250,
                                this.game.world.centerY - 125,
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
                                this.game.world.centerX + 250,
                                this.game.world.centerY - 75,
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
        
        if(this.easyMapText) {
            this.easyMapText.destroy(true);
            this.easyMapText = '';
        }
        if(this.hardMapText) {
            this.hardMapText.destroy(true);
            this.hardMapText = '';
        }
        
        this.getSavedGameList();
	},
	populateSavedGameList : function() {
	    console.log('populating');
	    if (!this.gameSaveText) {
            this.gameSaveText = this.game.add.text(
                                this.game.world.centerX + 250,
                                this.game.world.centerY - 25,
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
                this.populateSavedGameList(JSON.parse(response));
            },
            error: function(response) {
                console.log('fail');
            }
        });
	},
	optionsMenu: function() {
	    console.log('options clicked');
	    this.optionsText.fill = this.menuTextFill;
	    this.newGameText.fill = "#555559";
        this.loadGameText.fill = "#555559";
        
        if(this.easyMapText) {
            this.easyMapText.destroy(true);
            this.easyMapText = '';
        }
        if(this.hardMapText) {
            this.hardMapText.destroy(true);
            this.hardMapText = '';
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
	    if (this.menuMusic.isPlaying) {
	        this.menuMusic.stop();
	    }
	    console.log(mapData);
	    this.game.gameData = JSON.parse(mapData);
	    this.game.playerData = PLAYER_DATA;
	    this.game.itemData = ITEMS_DATA;
	    this.game.newGame = true;
        this.state.start('LyraGame');
	}
};