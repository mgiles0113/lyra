class UserPreference {
    constructor() {
        this.default = {
            "sound" : "true",
            "languageChoice" : "ENG",
        };
        this.data = {};
        this.loaded = 0;
        this.ready = 0;
        this.savedGames = [];
        this.savedGameCount = 0;
        this.newGameFileReady = 0;
    }

    load() {
        $.ajax({
            url: apiUrl,
            type: 'GET',
            data: {
                'entity' : 'userPreference',
                'userId' : this.data.userId
            },
            dataType: 'json',
            context: this,
            success: function(response) {
                this.loadedData = JSON.parse(response);
                if (this.data.languageChoice) {
                    this.loadedData.languageChoice = this.data.languageChoice;
                }
                this.data = this.loadedData;
                this.update();
            },
            error: function(response) {
                console.log(response);
                //this.update(JSON.parse(response));
            }
        });
    }

    update() {
        this.ready = false;
        $.ajax({
            url: apiUrl,
            type: 'POST',
            data: {
                'entity' : 'userPreference',
                'data' : this.data
            },
            dataType: 'json',
            context: this,
            success: function(response) {
                this.enable();
            },
            error: function(response) {
                this.enable();
            }
        });
    }
    
    enable() {
        this.ready = true;
    }
    
    generateSavedGameFile(game, mapSelection) {
        $.ajax({
            url: apiUrl,
            type: 'POST',
            data: {
                'entity' : 'savedGameFile',
                'userId' : this.data.userId,
                'mapSelection' : mapSelection
            },
            dataType: 'json',
            context: this,
            success: function(response) {
                this.savedGames.push(response.saveFile);
                this.data.activeGame = response.saveFile;
                this.data.mapData = response.mapData;
                this.newGameFileReady = 1;
            },
            error: function(response) {
                console.log(response);
                console.log('fail');
            }
        });
    }
    
    toggleSound(soundController) {
        console.log('toggling sound new');
        if (this.data.sound === 'true') {
            this.data.sound = 'false';
            soundController.stop();
        } else {
            this.data.sound = 'true';
        }
        this.update();
    }
    
    getSavedGameFiles(menuState) {
        $.ajax({
            url: apiUrl,
            type: 'GET',
            data: {
                'entity' : 'savedGameFiles',
                'userId' : this.data.userId
            },
            dataType: 'json',
            context: this,
            success: function(response) {
                console.log(response);
                this.savedGameCount = response.savedGameCount;
                this.savedGames = response.savedGameFiles || [];
                this.savedGameFilesLoaded = 1;
            },
            error: function(response) {
                console.log('fail');
            }
        });
    }
}