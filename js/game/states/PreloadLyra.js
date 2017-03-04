// deprecated??? I don't think we call this method - all done in Game.js
Lyra.PreloadLyra = function() {
	this.ready = false;
};

Lyra.PreloadLyra.prototype = {
	preload: function() {

		this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 256, 'preloadBar');
		this.preloadBar.anchor.setTo(0.5, 0.5);
		
		this.load.onLoadComplete.add(this.onLoadComplete, this);
		
        Map.loadMap(this.game, this.game.mapData.mapRef, this.game.mapData.imageTagList, this.game.mapData.imageRefList);
		
		// added as example preload game specific data
        // player assets
        Player.preloadPlayer(this.game);
        
        //slime assets
        Slime.preloadSlime(this.game);
        
        //comm window assets
        Comm.preloadComm(this.game);
        
        //item assets
        Items.preloadItems(this.game)
        
	},
	create: function() {
		this.preloadBar.cropEnabled = false;
	},
	update: function() {
		if (this.cache.isSoundDecoded('menuMusic') && this.ready === true) {
			this.state.start('LyraGame');
		}
	},
	onLoadComplete: function() {
		this.ready = true;
	}
}
