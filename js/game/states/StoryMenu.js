Lyra.StoryMenu = function() {
	this.textArray = ['intro1', 'intro2', 'intro3', 'intro4', 'intro5'];
	this.primaryCard = $("#primary-card");
	this.storyCard = $("<div id='story-card'></div>")
	this.storyTextCard = $("<p></p>");
	this.storyNextCard = $("<img id='story-next-card' src='/assets/images/next_arrow.png'>");
};

Lyra.StoryMenu.prototype = {
	preload: function() {
		this.index = 1;
	    this.storyTextCard.html(this.game.languageText[this.textArray[0]][this.game.userPreference.data.languageChoice]);
	    this.index++;
		this.storyCard.append(this.storyTextCard);
	    this.storyCard.append(this.storyNextCard);
	    primaryCard.append(this.storyCard);
	    var context = this;
	    this.storyNextCard.click(function() {
	    	if (context.index === context.textArray.length) {
	    		context.storyCard.remove();
	    		context.state.start('MainMenu');
	    	} else {
				context.storyTextCard.html(context.game.languageText[context.textArray[context.index]][context.game.userPreference.data.languageChoice]);
				context.index++;
	    	}
	    });
	}
}