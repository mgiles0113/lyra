// default settings in this file provided by Udemy HTML5 Phaser Course

var Lyra = function() {};

Lyra.Boot = function() {};

Lyra.Boot.prototype = {
	preload: function() {
		this.load.image('logo', 'assets/images/lyraFakeLogo.png');
	},
	create: function() {
		this.game.stage.backgroundColor = '#fff';
		// Unless you specifically know your game needs to support multi-touch, set this to 1
		this.input.maxPointers = 1;

		if (this.game.device.desktop) {
			// If you have any desktop specific settings, they go here
			this.scale.pageAlignHorizontally = true;
		} else {
			// Same goes for mobile settings
			// In this case we're saying "scale the game, no lower than 480x260 and no higher than 1024
			this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			this.scale.minWidth = 568;
			this.scale.minHeight = 600;
			this.scale.maxWidth = 2048;
			this.scale.maxHeight = 1536;
			this.scale.forceLandscape = true;
			this.scale.pageAlighHorizontally = true;
			this.scale.setScreenSize(true);
		}

		// by this point the preloader assets have loaded to the cache, 
		// So now let's start the real preloader going
		this.state.start('Preload');
	}
};