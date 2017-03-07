Lyra.EndGame = function() {
	this.timeoutText = ['timeout', 'credits', 'authors'];
	this.crewstuckText = ['partialfailcrew', 'credits', 'authors'];
	this.victory = ['victory', 'credits', 'authors'];
	this.escapenolyre = ['partialfaillyre', 'credits', 'authors'];
	this.totalfailure = ['totalfailure', 'credits', 'authors'];
	this.banditshavelyre =['banditshavelyre', 'credits', 'authors'];
    //this.textArray = ['intro0','intro1', 'intro2', 'intro3', 'intro4', 'intro5', 'credits', 'authors'];
	this.primaryCard = $("#primary-card");
	this.storyCard = $("<div id='story-card'></div>")
	this.storyTextCard = $("<p></p>");
	this.storyNextCard = $("<img id='story-next-card' src='/assets/images/next_arrow.png'>");
};

Lyra.EndGame.prototype = {
    preload: function() {
        $("#communicator-card").css('visibility', 'hidden');
        
        switch (this.game.gameData.gameresult) {
        	case "timeout":
        		this.textArray = this.timeoutText;
        		break;
        	case "crewstuck":
        		this.textArray = this.crewstuckText;
        		break;
        	case "victory" :
        		this.textArray = this.victory;
        		break;
        	case "escapenolyre":
        		this.textArray = this.escapenolyre;
        		break;
        	case "banditshavelyre":
        		this.textArray = this.banditshavelyre;
        		break;
        	default:
        		this.textArray = this.totalfailure;
        }
        
        
        this.index = 0;
	    this.storyTextCard.html(this.game.languageText[this.textArray[0]][this.game.userPreference.data.languageChoice]);
	    this.index++;
		this.storyCard.append(this.storyTextCard);
	    this.storyCard.append(this.storyNextCard);
	    primaryCard.append(this.storyCard);
        var context = this;
	    this.storyNextCard.click(function() {
	    	if (context.index === context.textArray.length) {
	    		context.storyCard.remove();
	    		context.state.remove();
	    		context.state.start('MainMenu');
	    	} else {
				context.storyTextCard.html(context.game.languageText[context.textArray[context.index]][context.game.userPreference.data.languageChoice]);
				context.index++;
	    	}
	    });
    }
}