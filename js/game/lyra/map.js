class Map {
        addMap (game, imageTagList) {
                
                this.map = game.add.tilemap('map');
                
                this.imageTagList = []
                this.tileSetImages = []
                for (var i=0; i<imageTagList.length; i++) {
                        this.imageTagList[i] = imageTagList[i];
                        this.tileSetImages[imageTagList[i]] = this.map.addTilesetImage(this.imageTagList[i]);
                }
                
        }
        
}


// loads the map resources
// mapRef is the location of the map .json file
// imageRefList is a array containing the location of the image files
// imageTagList is the list of names used in the map
Map.loadMap = function (game, mapRef, imageTagList, imageRefList) {
        // create map
        //game.load.tilemap('map', 'assets/tilemaps/maps/grayRoom.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('map', mapRef, null, Phaser.Tilemap.TILED_JSON);
    
        // imageTag    
        for (var i=0; i<imageTagList.length; i++) {
                game.load.image(imageTagList[i], imageRefList[i]);
        }
        
}
