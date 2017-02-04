class Items {
    addItem (game) {
    //Test to see if it works.
    //this.sprite = game.add.sprite(500, 500, game.itemData.items[0].name);
                
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

