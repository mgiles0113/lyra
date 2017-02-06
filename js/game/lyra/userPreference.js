class UserPreference {
    constructor() {
        this.default = {
            "sound" : "true",
            "languageChoice" : "ENG",
        };
        this.data = {};
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
                this.update(JSON.parse(response));
            },
            error: function(response) {
                console.log(response);
                this.update(JSON.parse(response));
            }
        });
    }

    update(savedPreferences) {
        this.data.sound = savedPreferences.sound || this.default.sound;
        this.data.languageChoice = savedPreferences.languageChoice || this.default.languageChoice;

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
                this.ready = true;
            },
            error: function(response) {
                console.log('fail');
                console.log(response);
                this.ready = true;
            }
        });
    }
}