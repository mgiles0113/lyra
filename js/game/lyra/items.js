class Items {
    addItem (game, name, x, y) {
    //Test to see if it works.
        this.sprite = game.add.sprite(x, y, name);
        this.name = name;
        game.physics.arcade.enable(this.sprite);
        this.sprite.body.setSize(32,32);
        this.sprite.body.setCircle(20); // radius of collision body
        this.sprite.anchor.set(0.5, 0.5); // center collision over image
        this.sprite.scale.setTo(0.5, 0.5)

    }
    
    //Add Item to Comm Window
    addtoComm(game, name, x, y){
        if( name != 'empty')
        var commItem = game.add.button(x, y, name);
        commItem.fixedToCamera = true;
        return commItem;
    }
        
}

Items.ItemImages = function(game) {
    // load all the specified item images
    game.load.image("circuit",game.gameData.items["CIRCUIT"].itemRef);
    game.load.image("fuel_tank",game.gameData.items["FUEL_TANK"].itemRef);
    game.load.image("fuse",game.gameData.items["FUSE"].itemRef);
    game.load.image("suppresant",game.gameData.items["SUPPRESANT"].itemRef);
    game.load.image("wrench",game.gameData.items["WRENCH"].itemRef);
}


// use this class for items in containers
class ContainerItem {
    constructor(containerIdx, name) {
        if (name == undefined) {
            this.name = "empty";
        } else {
            this.name = name;
        }
        this.containerIdx = containerIdx;
    }
}
