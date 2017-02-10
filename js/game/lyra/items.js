class Items {
    addItem (game, name, x, y) {
    //Test to see if it works.
        this.sprite = game.add.sprite(x, y, name);
        this.name = name;
        game.physics.arcade.enable(this.sprite);
        this.sprite.body.setSize(32,32);
        this.sprite.body.setCircle(20); // radius of collision body
        this.sprite.anchor.set(0.5, 0.5); // center collision over image

    }
    
    //Add Item to Comm Window
    addtoComm(game, name, x, y){
        if( name != 'empty')
        var commItem = game.add.button(x, y, name);
        commItem.fixedToCamera = true;
        return commItem;
        }
        
}

//Loads the item resources
Items.preloadItems = function (game) {
    //Load the items needed.
    //1st-> Item Name/Key
    //2nd-> URL to asset
    for (var i=0; i<game.itemData.items.length; i++) {
        game.load.image(game.itemData.items[i].name, game.itemData.items[i].itemRef);
    }
}

//Method to add Item to Container/Inventory
/*Items.addItemCon = function(game){
        //Add item
;
}*/

