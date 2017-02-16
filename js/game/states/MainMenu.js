Lyra.MainMenu = function() {
    this.menu = {
        activeMenu : '',
        mainMenuCard : $("#main-menu-card"),
        
        mainMenu : $(".main"),
        noMainMenu : $(".no-main"),
        
        newGameText : $("#new-game-menu-text"),
        newGame : $(".new"),
        noNewGame : $(".no-new"),
        passiveNewGame : $(".passive-new"),
        newGameEasy : $("#new-game-easy"),
	    newGameHard : $("#new-game-hard"),
	    
        loadGameText : $("#load-game-menu-text"),
        loadGame : $(".load"),
        noLoadGame : $(".no-load"),
        passiveLoadGame : $(".passive-load"),
        
        optionsText : $("#options-menu-text"),
        options : $(".options"),
        noOptions : $(".no-options"),
        passiveOptions : $(".passive-options"),
        
        storyText : $("#story-menu-text"),
        story : $(".story"),
        noStory : $(".no-story"),
        passiveStory : $(".passive-story"),
        
	    loadGameGameSave : $("#load-game-game-save"),
	    optionsSoundText : $("#options-sound-text"),
	    optionsSoundTrue : $("#options-sound-true"),
	    optionsSoundFalse : $("#options-sound-false"),
	    optionsLanguageText : $("#options-language-text"),
	    optionsLanguageEnglish : $("#options-language-english"),
	    optionsLanguagePirate : $("#options-language-pirate"),
	    optionsLanguageSpanish : $("#options-language-spanish")
    };
};

Lyra.MainMenu.prototype = {
    preload: function() {
        console.log('initializing main menu');
        this.createClickEvents();
        this.menu.mainMenuCard.css('display', 'inherit');
        this.showMenu('main');
    },
    createClickEvents: function() {
        var self = this;
        // create listeners for menu items
        this.menu.newGameText.click(function() {
            self.showMenu('newGame');
        });
        this.menu.newGameEasy.click(function() {
            self.startNewGame('EASY');
        });
        this.menu.newGameHard.click(function() {
            self.startNewGame('HARD');
        });
        this.menu.loadGameText.click(function() {
            self.showMenu('loadGame');
        });
        this.menu.loadGameGameSave.click(function() {
            self.startSavedGame('gameSave');
        });
        this.menu.optionsText.click(function() {
            self.showMenu('options');
        });
        this.menu.storyText.click(function() {
            self.showMenu('story');
        });
    },
    destroyClickEvents: function() {
        this.menu.newGameText.unbind('click');
        this.menu.newGameEasy.unbind('click');
        this.menu.newGameHard.unbind('click');
        this.menu.loadGameText.unbind('click');
        this.menu.loadGameGameSave.unbind('click');
        this.menu.optionsText.unbind('click');
        this.menu.storyText.unbind('click');
    },
    populateMenuText: function() {
        this.languageChoice = this.game.userPreference.data.languageChoice;
        this.menu.newGameText.html(this.game.languageText.newgame[this.languageChoice]);
        this.menu.newGameEasy.html(this.game.languageText.easymap[this.languageChoice]);
        this.menu.newGameHard.html(this.game.languageText.hardmap[this.languageChoice]);
        this.menu.loadGameText.html(this.game.languageText.loadgame[this.languageChoice]);
        this.menu.loadGameGameSave.html('gameSave');
        this.menu.optionsText.html(this.game.languageText.options[this.languageChoice]);
        this.menu.optionsSoundText.html(this.game.languageText.sound[this.languageChoice]);
        this.menu.optionsSoundTrue.html(this.game.languageText.true[this.languageChoice]);
        this.menu.optionsSoundFalse.html(this.game.languageText.false[this.languageChoice]);
        this.menu.optionsLanguageText.html(this.game.languageText.languageWord[this.languageChoice]);
	    this.menu.optionsLanguageEnglish.html('English');
	    this.menu.optionsLanguagePirate.html('Pirate');
	    this.menu.optionsLanguageSpanish.html('Espanol');
	    this.menu.storyText.html(this.game.languageText.story[this.languageChoice]);
	},
	showMenu: function(menuSelection) {
	    console.log('showMenu function');
	    console.log('menu selection: ' + menuSelection);
	    switch(menuSelection) {
	        case 'main':
                this.menu.noMainMenu.css('display', 'none');
                this.menu.mainMenu.css('color', 'white');
                this.menu.mainMenu.css('display', 'inherit');
	            this.menu.activeMenu = menuSelection;
	            break;
            case 'newGame':
                if (this.menu.activeMenu === menuSelection) {
                    this.showMenu('main');
                } else {
                    this.menu.noNewGame.css('display', 'none');
                    this.menu.passiveNewGame.css('display', 'inherit');
                    this.menu.passiveNewGame.css('color', '#555559');
                    this.menu.newGame.css('color', 'white');
                    this.menu.newGame.css('display', 'inherit');
                    this.menu.activeMenu = 'newGame';
                }
                break;
            case 'loadGame':
                if (this.menu.activeMenu === menuSelection) {
                    this.showMenu('main');
                } else {
                    this.menu.noLoadGame.css('display', 'none');
                    this.menu.passiveLoadGame.css('display', 'inherit');
                    this.menu.passiveLoadGame.css('color', '#555559');
                    this.menu.loadGame.css('color', 'white');
                    this.menu.loadGame.css('display', 'inherit');
                    this.menu.activeMenu = 'loadGame';
                }
                break;
            case 'options':
                if (this.menu.activeMenu === menuSelection) {
                    this.showMenu('main');
                } else {
                    this.menu.noOptions.css('display', 'none');
                    this.menu.passiveOptions.css('display', 'inherit')
                                            .css('color', '#555559');
                    this.menu.options.css('color', 'white')
                                     .css('display', 'inherit');
                    this.menu.activeMenu = 'options';
                }
                break;
            case 'story':
                if (this.menu.activeMenu === menuSelection) {
                    this.showMenu('main');
                } else {
                    this.menu.noStory.css('display', 'none');
                    this.menu.passiveStory.css('display', 'inherit')
                                          .css('color', '#555559');
                    this.menu.story.css('color', 'white')
                                   .css('display', 'inherit');
                    this.menu.activeMenu = 'story';
                }
                this.startNewState('StoryMenu');
                break;
	    }
	},
	startNewState: function(state) {
	    this.destroyClickEvents();
	    this.menu.mainMenuCard.css('display', 'none');
	    
	    switch(state) {
	        case 'StoryMenu':
	            this.state.start("StoryMenu");
	            break;
            case 'LyraGame':
                this.state.start('LyraGame');
                break;
	    }
	},
	optionsMenu: function() {
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
        this.englishText.events.onInputDown.add(function() {
            this.game.userPreference.data.languageChoice = "ENG";
            this.game.userPreference.update();
            this.optionLanguageText = '';
            this.optionSoundText = '';
            this.state.start('MainMenu');
        }, this);
        this.pirateText.events.onInputDown.add(function() {
            console.log('pir clicked');
            this.game.userPreference.data.languageChoice = "PRT";
            this.game.userPreference.update();
            this.optionLanguageText = '';
            this.optionSoundText = '';
            this.state.start('MainMenu');
        }, this);
        this.spanishText.events.onInputDown.add(function() {
            this.game.userPreference.data.languageChoice = "ESP";
            this.game.userPreference.update();
            this.optionLanguageText = '';
            this.optionSoundText = '';
            this.state.start('MainMenu');
        }, this);
	},
	startNewGame: function(mapSelection) {
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
	startSavedGame: function(gameSaveFile) {
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
                this.launchGame(JSON.parse(response));
            },
            error: function(response) {
                console.log(response);
            }
        });
    },
	launchGame: function(mapData) {
	    if (this.game.menuMusic.isPlaying) {
	        this.game.menuMusic.stop();
	    }
	    this.game.gameData = JSON.parse(mapData);
	    this.game.playerData = PLAYER_DATA;
	    this.game.itemData = ITEMS_DATA;
	    this.game.newGame = true;
	    this.startNewState('LyraGame');
	}
};