class Map {
        addMap (game, imageTagList) {
                
                this.map = game.add.tilemap('map');
                
                this.imageTagList = []
                for (var i=0; i<imageTagList.length; i++) {
                        this.imageTagList[i] = imageTagList[i];
                        this.map.addTilesetImage(this.imageTagList[i]);
                }
                // this.map.addTilesetImage('grayTiles');
                // this.map.addTilesetImage('greenCircle'); 
                
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

        // // map assets
        // game.load.image('grayTiles', 'assets/grayTiles.png');
        
        // // load a background image
        // game.load.image('background', 'assets/backgroundGray.png');
        

}
