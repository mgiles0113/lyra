// default settings in this file provided by Udemy HTML5 Phaser Course

var Lyra = function() {};

Lyra.Boot = function() {};

Lyra.Boot.prototype = {
	preload: function() {
		this.load.image('logo', 'assets/images/lyraFakeLogo.png');
		this.load.image('preloadBar', 'assets/images/preloadBar.png');
	},
	create: function() {
		// Unless you specifically know your game needs to support multi-touch, set this to 1
		this.input.maxPointers = 1;

		if (this.game.device.desktop) {
			// If you have any desktop specific settings, they go here
			this.scale.pageAlignHorizontally = true;
		} else {
			// Same goes for mobile settings
			// In this case we're saying "scale the game, no lower than 480x260 and no higher than 1024
			this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			this.scale.maxWidth = 1024;
			this.scale.maxHeight = 800;
			this.scale.minWidth = 1024;
			this.scale.minHeight = 800;
			this.scale.forceLandscape = true;
			this.scale.pageAlighHorizontally = true;
			this.scale.setScreenSize(true);
		}
		this.game.userPreference.load();
	},
	update: function() {
		if (this.game.userPreference.ready == true) {
			this.state.start('Preload');
		}
	}
};
