Lyra.Preload = function() {
	this.ready = false;
};

Lyra.Preload.prototype = {
	preload: function() {
		this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
		this.splash.anchor.setTo(0.5);

		this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 256, 'preloadBar');
		this.preloadBar.anchor.setTo(0.5, 0.5);

		this.load.image('leftGreyArrow', 'assets/images/left_grey_arrow.png');
		this.load.image('leftGreenArrow', 'assets/images/left_green_arrow.png');
		this.load.image('leftGreenArrowActive', 'assets/images/left_green_arrow_active.png');

		this.load.image('rightGreyArrow', 'assets/images/right_grey_arrow.png');
		this.load.image('rightGreenArrow', 'assets/images/right_green_arrow.png');
		this.load.image('rightGreenArrowActive', 'assets/images/right_green_arrow_active.png');
		
		this.load.image('equipGrey', 'assets/images/equip_grey.png');
		this.load.image('equipGreen', 'assets/images/equip_green.png');
		this.load.image('equipGreenActive', 'assets/images/equip_green_active.png');

		this.load.audio('menuMusic', 'assets/audio/Lyra_v1_0_0.mp3');
		this.load.audio('gameMusic', 'assets/audio/lyra_game_01.mp3');
		this.load.audio('doorOpen', 'assets/audio/door_open.mp3');
        this.load.audio('doorClose', 'assets/audio/door_close.mp3');
        this.load.audio('containerOpen', 'assets/audio/container_open.wav');
        this.load.audio('containerClose', 'assets/audio/container_close.wav');
        this.load.audio('trance', 'assets/audio/trance.mp3');
        this.load.audio('engine', 'assets/audio/engine.wav');
        this.load.audio('escapepodClose', 'assets/audio/escapepod_close.wav');
        this.load.audio('escapepodOpen', 'assets/audio/escapepod_open.wav');
        this.load.audio('spill', 'assets/audio/spill.wav');
        this.load.audio('spray', 'assets/audio/spray.wav');
        this.load.audio('escapepodTakeoff', 'assets/audio/escapepod_takeoff.wav');
        this.load.audio('lyreMusic','assets/audio/Music_Box-Big_Daddy-1389738694.mp3');
		this.load.onLoadComplete.add(this.onLoadComplete, this);
	},
	create: function() {
		this.preloadBar.cropEnabled = false;
	},
	update: function() {
		if (this.cache.isSoundDecoded('menuMusic') && this.ready === true) {
			this.game.lyraSound = new SoundController(this.game);
			this.state.start('MainMenu');
		}
	},
	onLoadComplete: function() {
		this.ready = true;
	}
}
