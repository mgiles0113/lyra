// Lyra
// used to collect all the components of the game and interface to phaser in one object
// derived from phaser.io example "features test.js"
// use LyraState to initialize new or restart from previously saved by setting up the Lyra class with the appropriate state data.
// [TODO] Lyra class defineState() needs to handle state initialization

class LyraState {
    startGame ( mapRefData,  playerRefData, gamewidth, gameheight) {
        // this creates a class that extends the State class
        // currently, defineState only creates a variable - but - very exciting, it's available in the preload state!
        // we can use defineState to initialize the game state
        this.lyra = new Lyra();
        this.lyra.defineState(mapRefData, playerRefData, gamewidth, gameheight);

        //this.game = new Phaser.Game(mapwidth, mapheight, Phaser.AUTO, 'phaser-example', {preload: this.preload, create: this.create, update: this.update, render: this.render });
        //this.game = new Phaser.Game(mapwidth, mapheight, Phaser.CANVAS, 'phaser-example', {preload: this.preload, create: this.create, update: this.update, render: this.render });
        this.game = new Phaser.Game(gamewidth, gameheight, Phaser.AUTO, 'phaser-example', this.lyra);
    }

}