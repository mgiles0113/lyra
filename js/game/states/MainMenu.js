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
        loadGameSlot1 : $("#load-game-slot-1"),
        loadGameSlot2 : $("#load-game-slot-2"),
        loadGameSlot3 : $("#load-game-slot-3"),
        loadGameSlot4 : $("#load-game-slot-4"),
        loadGameSlot5 : $("#load-game-slot-5"),
        loadGameLeftArrow : $("#load-game-left-arrow"),
        loadGameRightArrow : $("#load-game-right-arrow"),
        optionsText : $("#options-menu-text"),
        options : $(".options"),
        noOptions : $(".no-options"),
        passiveOptions : $(".passive-options"),
        soundOptions : $(".sound-options"),
        noSoundOptions : $(".no-sound-options"),
        passiveSoundOptions : $(".passive-sound-options"),
        languageOptions : $(".language-options"),
        noLanguageOptions : $(".no-language-options"),
        passiveLanguageOptions : $(".passive-language-options"),
        optionsSoundText : $("#options-sound-text"),
        optionsSoundTrue : $("#options-sound-true"),
        optionsSoundFalse : $("#options-sound-false"),
        optionsLanguageText : $("#options-language-text"),
        optionsLanguageEnglish : $("#options-language-english"),
	    optionsLanguagePirate : $("#options-language-pirate"),
	    optionsLanguageSpanish : $("#options-language-spanish"),
        storyText : $("#story-menu-text"),
        story : $(".story"),
        noStory : $(".no-story"),
        passiveStory : $(".passive-story"),
        logoutText : $("#logout-menu-text"),
        logout : $(".logout"),
        noLogout : $(".no-logout"),
        passiveLogout : $(".passive-logout"),
        savedGameList : {
            pageCount : 0,
            partialLastPage : false,
            currentPage : 1
        }
    };
};

Lyra.MainMenu.prototype = {
    preload: function() {
        if (this.game.storyStateRunning) {
            this.game.storyStateRunning = 0;
        } else {
            this.game.lyraSound.stop();
            if (this.game.userPreference.data.sound === "true") {
                if (!this.game.lyraSound.music['menuMusic'].isPlaying) {
                    this.game.lyraSound.play('menuMusic', true, .6);
                }
	        }
        }

        this.createClickEvents();
        this.populateMenuText();
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
            self.game.userPreference.generateSavedGameFile(this, 'EASY');
        });
        this.menu.newGameHard.click(function() {
            self.game.userPreference.generateSavedGameFile(this, 'HARD');
        });
        this.menu.loadGameText.click(function() {
            self.game.userPreference.getSavedGameFiles(this);
            self.game.userPreference.savedGames.sort(function(a,b) {return(b-a)});
        });
        this.menu.loadGameLeftArrow.click(function() {
            if (self.menu.savedGameList.currentPage > 1) {
                self.menu.savedGameList.currentPage--;
                self.menu.activeMenu = '';
                self.populateLoadMenuText();
            }
        });
        this.menu.loadGameRightArrow.click(function() {
            if (self.menu.savedGameList.currentPage < self.menu.savedGameList.pageCount) {
                self.menu.savedGameList.currentPage++;
                self.menu.activeMenu = '';
                self.populateLoadMenuText()
            }
        });
        this.menu.loadGameSlot1.click(function() {
            self.startSavedGame(self.game.userPreference.savedGames[((self.menu.savedGameList.currentPage - 1) * 5)]);
        });
        this.menu.loadGameSlot2.click(function() {
            self.startSavedGame(self.game.userPreference.savedGames[((self.menu.savedGameList.currentPage - 1) * 5) + 1]);
        });
        this.menu.loadGameSlot3.click(function() {
            self.startSavedGame(self.game.userPreference.savedGames[((self.menu.savedGameList.currentPage - 1) * 5) + 2]);
        });
        this.menu.loadGameSlot4.click(function() {
            self.startSavedGame(self.game.userPreference.savedGames[((self.menu.savedGameList.currentPage - 1) * 5) + 3]);
        });
        this.menu.loadGameSlot5.click(function() {
            self.startSavedGame(self.game.userPreference.savedGames[((self.menu.savedGameList.currentPage - 1) * 5) + 4]);
        });
        this.menu.optionsText.click(function() {
            self.showMenu('options');
        });
        this.menu.optionsSoundText.click(function() {
            self.showMenu('soundOptions');
        });
        this.menu.optionsSoundTrue.click(function() {
            self.toggleSound('true');
        });
        this.menu.optionsSoundFalse.click(function() {
            self.toggleSound('false');
        });
        this.menu.optionsLanguageText.click(function() {
            self.showMenu('languageOptions');
        });
        this.menu.optionsLanguageEnglish.click(function() {
            self.setLanguage('ENG');
        });
	    this.menu.optionsLanguagePirate.click(function() {
	        self.setLanguage('PRT');
	    });
	    this.menu.optionsLanguageSpanish.click(function() {
	        self.setLanguage('ESP');
	    });
        this.menu.storyText.click(function() {
            self.showMenu('story');
        });
        this.menu.logoutText.click(function() {
            self.logout();
        });
    },
    update: function() {
        if (this.game.userPreference.savedGameFilesLoaded) {
            this.game.userPreference.savedGameFilesLoaded = 0;
            this.populateLoadMenuText();
        }
        if (this.game.userPreference.newGameFileReady) {
            this.game.userPreference.newGameFileReady = 0;
            this.launchGame(this.game.userPreference.data.mapData);
        }
    },
    displayLogoutOverlay: function() {
        var overlay = $("<div id='logout-overlay'>Logging out...</div>");
        overlay.css('position', 'absolute')
               .css('top', '0')
               .css('left', '0')
               .css('backgroundColor', 'rgba(0, 0, 0, .6)')
               .css('textAlign', 'center')
               .css('paddingTop', $(window).height() * .4)
               .css('width', '100%')
               .css('fontSize', '6em')
               .css('color', 'white')
               .css('height', '100%');
        $("body").append(overlay);
    },
    logout: function() {
        this.displayLogoutOverlay();
        var method = 'POST',
        url = apiUrl,
        parameters = {
            action : 'logout',
        };

        $.ajax({
            url: url,
            type: method,
            data: parameters,
            dataType: 'json',
            context: this,
            success: function(response) {
                if (response.error === "none") {
                    location.reload();
                }
            },
            error: function(response) {
                console.log(response);
            }
        });
    },
    populateLoadMenuText: function() {
        this.menu.savedGameList.pageCount = Math.floor(this.game.userPreference.savedGameCount / 5);
        
        if ((this.game.userPreference.savedGameCount % 5) > 0) {
            this.menu.savedGameList.partialLastPage = this.game.userPreference.savedGameCount % 5;
            this.menu.savedGameList.pageCount++;
        }
        this.menu.loadGameSlot1.css('visibility', 'hidden');
        this.menu.loadGameSlot1.html('');
        this.menu.loadGameSlot2.css('visibility', 'hidden');
        this.menu.loadGameSlot2.html('');
        this.menu.loadGameSlot3.css('visibility', 'hidden');
        this.menu.loadGameSlot3.html('');
        this.menu.loadGameSlot4.css('visibility', 'hidden');
        this.menu.loadGameSlot4.html('');
        this.menu.loadGameSlot5.css('visibility', 'hidden');
        this.menu.loadGameSlot5.html('');
        if (this.game.userPreference.savedGameCount === "0") {
            this.menu.loadGameSlot1.html('none');
            this.menu.loadGameSlot2.html('none');
            this.menu.loadGameSlot2.css('visibility', 'hidden');
            this.menu.loadGameSlot3.html('none');
            this.menu.loadGameSlot3.css('visibility', 'hidden');
            this.menu.loadGameSlot4.html('none');
            this.menu.loadGameSlot4.css('visibility', 'hidden');
            this.menu.loadGameSlot5.html('none');
            this.menu.loadGameSlot5.css('visibility', 'hidden');
        } else if (this.menu.savedGameList.pageCount === this.menu.savedGameList.currentPage &&
                   this.menu.savedGameList.partialLastPage) {
            // display partial last page
            var startingIndex = (this.menu.savedGameList.currentPage * 5) - 5;
            var endingIndex = ((this.menu.savedGameList.currentPage * 5) - 5) + this.menu.savedGameList.partialLastPage;
            var slotNumber = 1;
            for (var i = startingIndex; i < endingIndex; i++) {
                this.menu['loadGameSlot' + slotNumber].html(this.game.userPreference.savedGames[i].replace(/.json/, '').slice(7, 25))
                                                      .css('visibility', 'visible');
                slotNumber++;
            }
            while (slotNumber < 6) {
                this.menu['loadGameSlot' + slotNumber].css('visibility', 'hidden');
                slotNumber++;
            }
        } else {
            // display current full page
            var startingIndex = (this.menu.savedGameList.currentPage * 5) - 5;
            this.menu.loadGameSlot1.html(this.game.userPreference.savedGames[startingIndex].replace(/.json/, '').slice(7, 25))
                                   .css('visibility', 'visible');
            this.menu.loadGameSlot2.html(this.game.userPreference.savedGames[startingIndex + 1].replace(/.json/, '').slice(7, 25))
                                   .css('visibility', 'visible');
            this.menu.loadGameSlot3.html(this.game.userPreference.savedGames[startingIndex + 2].replace(/.json/, '').slice(7, 25))
                                   .css('visibility', 'visible');
            this.menu.loadGameSlot4.html(this.game.userPreference.savedGames[startingIndex + 3].replace(/.json/, '').slice(7, 25))
                                   .css('visibility', 'visible');
            this.menu.loadGameSlot5.html(this.game.userPreference.savedGames[startingIndex + 4].replace(/.json/, '').slice(7, 25))
                                   .css('visibility', 'visible');
        }
        this.showMenu('loadGame');
    },
    setLanguage: function(choice) {
        this.game.userPreference.data.languageChoice = choice;
        this.menu.activeMenu = '';
        this.populateMenuText();
        this.showMenu('languageOptions');
        this.game.userPreference.update();
    },
    toggleSound: function(choice) {
        if (choice === 'true') {
            this.game.userPreference.data.sound = 'true';
	        this.game.lyraSound.play('menuMusic', true, .6);
        } else {
            this.game.userPreference.data.sound = 'false';
            this.game.lyraSound.stop('');
        }
        this.game.userPreference.update();
        this.menu.activeMenu = '';
        this.showMenu('soundOptions');
    },
    destroyClickEvents: function() {
        this.menu.newGameText.unbind('click');
        this.menu.newGameEasy.unbind('click');
        this.menu.newGameHard.unbind('click');
        this.menu.loadGameText.unbind('click');
        this.menu.loadGameLeftArrow.unbind('click');
        this.menu.loadGameRightArrow.unbind('click');
        this.menu.loadGameSlot1.unbind('click');
        this.menu.loadGameSlot2.unbind('click');
        this.menu.loadGameSlot3.unbind('click');
        this.menu.loadGameSlot4.unbind('click');
        this.menu.loadGameSlot5.unbind('click');
        this.menu.optionsText.unbind('click');
        this.menu.optionsSoundText.unbind('click');
        this.menu.optionsSoundTrue.unbind('click');
        this.menu.optionsSoundFalse.unbind('click');
        this.menu.optionsLanguageText.unbind('click');
        this.menu.optionsLanguageEnglish.unbind('click');
	    this.menu.optionsLanguagePirate.unbind('click');
	    this.menu.optionsLanguageSpanish.unbind('click');
        this.menu.storyText.unbind('click');
        this.menu.logoutText.unbind('click');
    },
    populateMenuText: function() {
        this.languageChoice = this.game.userPreference.data.languageChoice;
        this.menu.newGameText.html(this.game.languageText.newgame[this.languageChoice]);
        this.menu.newGameEasy.html(this.game.languageText.easymap[this.languageChoice]);
        this.menu.newGameHard.html(this.game.languageText.hardmap[this.languageChoice]);
        this.menu.loadGameText.html(this.game.languageText.loadgame[this.languageChoice]);
        this.menu.optionsText.html(this.game.languageText.options[this.languageChoice]);
        this.menu.optionsSoundText.html(this.game.languageText.sound[this.languageChoice]);
        this.menu.optionsSoundTrue.html(this.game.languageText.true[this.languageChoice]);
        this.menu.optionsSoundTrue.css('color', this.game.userPreference.data.sound === 'true' ? 'white' : '#555559');
        this.menu.optionsSoundFalse.html(this.game.languageText.false[this.languageChoice]);
        this.menu.optionsSoundFalse.css('color', this.game.userPreference.data.sound === 'false' ? 'white' : '#555559');
        this.menu.optionsLanguageText.html(this.game.languageText.languageWord[this.languageChoice]);
	    this.menu.optionsLanguageEnglish.html('English');
	    this.menu.optionsLanguagePirate.html('Pirate');
	    this.menu.optionsLanguageSpanish.html('Espanol');
	    this.menu.storyText.html(this.game.languageText.story[this.languageChoice]);
	},
	showMenu: function(menuSelection) {
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
            case 'languageOptions':
                if (this.menu.activeMenu === menuSelection) {
                    this.showMenu('options');
                } else {
                    this.menu.noLanguageOptions.css('display', 'none');
                    this.menu.passiveLanguageOptions.css('display', 'inherit')
                                            .css('color', '#555559');
                    this.menu.languageOptions.css('color', 'white')
                                            .css('display', 'inherit');
                    this.menu.optionsLanguageEnglish.css('color', this.game.userPreference.data.languageChoice === 'ENG' ? 'white' : '#555559');
                    this.menu.optionsLanguagePirate.css('color', this.game.userPreference.data.languageChoice === 'PRT' ? 'white' : '#555559');
                    this.menu.optionsLanguageSpanish.css('color', this.game.userPreference.data.languageChoice === 'ESP' ? 'white' : '#555559');
                    this.menu.activeMenu = 'languageOptions';
                }
                break;
            case 'soundOptions':
                if (this.menu.activeMenu === menuSelection) {
                    this.showMenu('options');
                } else {
                    this.menu.noSoundOptions.css('display', 'none');
                    this.menu.passiveSoundOptions.css('display', 'inherit')
                                            .css('color', '#555559');
                    this.menu.soundOptions.css('color', 'white')
                                          .css('display', 'inherit');
                    this.menu.optionsSoundTrue.css('color', this.game.userPreference.data.sound === 'true' ? 'white' : '#555559');
                    this.menu.optionsSoundFalse.css('color', this.game.userPreference.data.sound === 'false' ? 'white' : '#555559');
                    this.menu.activeMenu = 'soundOptions';   
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
	startNewGame: function(mapSelection) {
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
                //console.log(response);
                
            }
        });
    },
	startSavedGame: function(gameSaveFile) {
        this.game.userPreference.data.activeGame = gameSaveFile;
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
                //console.log(response);
                this.launchGame(JSON.parse(response));
            },
            error: function(response) {
                //console.log(response);
            }
        });
    },
	launchGame: function(mapData) {
	    this.game.gameData = JSON.parse(mapData);
	   // this.game.playerData = PLAYER_DATA;
	   // this.game.itemData = ITEMS_DATA;
	    this.game.newGame = true;
	    this.startNewState('LyraGame');
	}
};