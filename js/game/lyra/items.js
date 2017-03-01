class Items {
    
// deprecated
//     addItem (game, name, x, y) {
//     //Test to see if it works.
//         this.sprite = game.add.sprite(x, y, name);
//         this.name = name;
//         game.physics.arcade.enable(this.sprite);
//         this.sprite.body.setSize(32,32);
//         this.sprite.body.setCircle(20); // radius of collision body
//         this.sprite.anchor.set(0.5, 0.5); // center collision over image
//         this.sprite.scale.setTo(0.5, 0.5)

//     }
    
//     //Add Item to Comm Window
//     addtoComm(game, name, x, y){
//         if( name != 'empty')
//         var commItem = game.add.button(x, y, name);
//         commItem.fixedToCamera = true;
//         return commItem;
//     }
 }

Items.ItemImages = function(game) {
    // load all the specified item images
    var iterator = Object.keys(game.gameData.items);
    //for (var i = 0; i < game.gameData.itemsnames.length; i++) {
    for (var i = 0; i < iterator.length; i++) {
        game.load.image(game.gameData.items[iterator[i]].name, game.gameData.items[iterator[i]].itemRef);
        if (game.gameData.items[iterator[i]].emitter != undefined) {
            game.load.image(game.gameData.items[iterator[i]].emitter,game.gameData.items[iterator[i]].emitterRef);
        }
    }
}


// use this class for items in containers
class ContainerItem {
    constructor(containerIdx, name, capacity) {
        if (name == undefined) {
            this.name = "empty";
        } else {
            this.name = name;
        }
        this.containerIdx = containerIdx;
        if (capacity != undefined) {
            this.capacity = capacity;
        }
    }
}
