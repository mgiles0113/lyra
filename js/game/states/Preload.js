Lyra.Preload = function() {
	this.ready = false;
};

Lyra.Preload.prototype = {
	preload: function() {
		this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
		this.splash.anchor.setTo(0.5);
		
		this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 256, 'preloadBar');
		this.preloadBar.anchor.setTo(0.5, 0.5);
		
		this.load.audio('menuMusic', 'assets/audio/Lyra_v1_0_0.mp3');
		this.load.onLoadComplete.add(this.onLoadComplete, this);
	},
	create: function() {
		
		this.preloadBar.cropEnabled = false;
	},
	update: function() {
		if (this.cache.isSoundDecoded('menuMusic') && this.ready === true) {
			this.game.menuMusic = this.game.add.audio('menuMusic');
			if (this.game.userPreference.data.sound === "true" && this.game.menuMusic.isPlaying === false) {
	        	
	        	this.game.menuMusic.play('', 0, 0.1, true, true);
	    	}
			this.state.start('MainMenu');
		}
	},
	onLoadComplete: function() {
		this.ready = true;
	}
}
