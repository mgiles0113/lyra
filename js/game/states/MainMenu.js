Lyra.MainMenu = function() {
    this.menuTextFill = '#fff';
    this.menuTextSize = 40;
    this.menuTextVerticalSpace = 50;
};

Lyra.MainMenu.prototype = {
	create: function() {
		this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'background')
		this.menuMusic = this.game.add.audio('menuMusic');
		this.menuMusic.play('', 0, 0.5, true, true);


        this.newGameText = this.game.add.text(
                            this.game.world.centerX,
                            this.game.world.centerY - 100,
                            'New Game',
                            'newGame'
                        );
        //this.newGameText.anchor.setTo(.5);
        this.newGameText.name = name;
        this.newGameText.inputEnabled = true;
        this.newGameText.fontSize = this.menuTextSize;
        this.newGameText.fill = this.menuTextFill;
        this.newGameText.events.onInputDown.add(this.newGame, this);
        
        this.loadGameText = this.game.add.text(
                            this.game.world.centerX,
                            this.game.world.centerY - 25,
                            'Load Game',
                            'loadGame'
                        );
        //this.loadGameText.anchor.setTo(.5);
        this.loadGameText.name = name;
        this.loadGameText.inputEnabled = true;
        this.loadGameText.fontSize = this.menuTextSize;
        this.loadGameText.fill = this.menuTextFill;
        this.loadGameText.events.onInputDown.add(this.loadGameMenu, this);
        
        this.optionsText = this.game.add.text(
                            this.game.world.centerX,
                            this.game.world.centerY + 50,
                            'Options',
                            'options'
                        );
        //this.optionsText.anchor.setTo(.5);
        this.optionsText.name = name;
        this.optionsText.inputEnabled = true;
        this.optionsText.fontSize = this.menuTextSize;
        this.optionsText.fill = this.menuTextFill;
        this.optionsText.events.onInputDown.add(this.optionsMenu, this);
        
        
	},
	update: function() {
		
	},
	newGame: function() {
	    console.log('new game clicked');
	},
	loadGameMenu: function() {
	    console.log('load game clicked');
	},
	optionsMenu: function() {
	    console.log('options clicked');
	},
};