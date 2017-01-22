class Map {
    
}


Map.preloadMap = function (game) {
        // create map
        // [TODO] placeholder map for now
        game.load.tilemap('map', 'assets/tilemaps/maps/grayRoom.json', null, Phaser.Tilemap.TILED_JSON);
    
        // map assets
        game.load.image('grayTiles', 'assets/grayTiles.png');
}
