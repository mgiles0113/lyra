var DOOR_OPEN_ID = 5;
var DOOR_CLOSED_ID = 46;

class Door {
    addDoor (game, name, x, y) {
    //Test to see if it works.
        this.sprite = game.add.tileSprite(x, y, 64, 64, 'scifitiles-sheet', 25);
        this.name = name;
        game.physics.arcade.enable(this.sprite);
        this.sprite.body.setSize(64, 64);
        // this.sprite.anchor.set(0.5, 0.5); // center collision over image
    }
}