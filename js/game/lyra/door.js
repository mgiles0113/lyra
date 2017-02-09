class Door {
    addDoor (game, name, x, y) {
    //Test to see if it works.
        this.sprite = game.add.tileSprite(x, y, 64, 64, 'dooropen');
        this.name = name;
        game.physics.arcade.enable(this.sprite);
        this.sprite.body.setSize(64, 64);
        // this.sprite.anchor.set(0.5, 0.5); // center collision over image
    }
}

Door.preloadDoorImages = function(game) {
    game.load.image('dooropen', 'assets/lyraImages/dooropen.png');
    game.load.image('doorclosed', 'assets/lyraImages/doorclosed.png');
    game.load.image('dooropenhighlighted', 'assets/lyraImages/dooropenhighlighted.png');
    game.load.image('doorclosedhighlighted', 'assets/lyraImages/doorclosedhighlighted.png');
}