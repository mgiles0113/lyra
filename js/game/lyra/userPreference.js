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
                console.log(response);
                this.loadedData = JSON.parse(response);
                this.loadedData.languageChoice = this.data.languageChoice;
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
        console.log("this ready: " + this.ready);
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
                console.log('success');
                console.log(response);
                this.enable();
            },
            error: function(response) {
                console.log('fail');
                console.log(response);
                this.enable();
            }
        });
    }
    
    enable() {
        this.ready = true;
        console.log("this ready: " + this.ready);
    }
    
    generateSavedGameFile() {
        $.ajax({
            url: apiUrl,
            type: 'POST',
            data: {
                'entity' : 'savedGameFile',
                'userId' : this.data.userId
            },
            dataType: 'json',
            context: this,
            success: function(response) {
                console.log(response);
                this.savedGames.push(response.saveFile);
                this.data.activeGame = response.saveFile;
            },
            error: function(response) {
                console.log('fail');
            }
        });
    }
}