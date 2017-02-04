var TRIAL_MAP = {
        // [TODO] how to get this data passed in from the startGame!
        gameType: "TRIAL_MAP",
        mapRef: 'assets/tilemaps/maps/grayRoom.json',
        imageTagList: ['grayTiles', 'background'],
        imageRefList: ['assets/grayTiles.png', 'assets/backgroundGray.png'],
        mapLayerRef: ['layer2', 'layer1'],
        mapwidth: 40*32,
        mapheight: 40*32,
}

var EASY_MANYLAYER_MAP = {
        gameType: "EASY_MAP",
        mapRef: 'assets/tilemaps/maps/reference_map.json',
        imageTagList: ['scifitiles-sheet', 'meta_tiles'],
        imageRefList: ['assets/lyraImages/scifitiles-sheet.png', 'assets/lyraImages/meta_tiles.png'],
        // [TODO] build this list off the json map file? ordered by display order, for now walls are last
        mapLayerRef: ['escape_pods', 'halls', 'dock', 'workshop', 'engine_room', 'rec_room', 'crew_quarters', 'cafeteria', 'med_bay', 'command_center', 'doors', 'walls'],
        mapwidth: 64*32,
        mapheight: 46*32,
}

var EASY_MAP = {
        gameType: "EASY_MAP",
        mapRef: 'assets/tilemaps/maps/reference_map.json',
        imageTagList: ['scifitiles-sheet', 'meta_tiles'],
        imageRefList: ['assets/lyraImages/scifitiles-sheet.png', 'assets/lyraImages/meta_tiles.png'],
        // [TODO] build this list off the json map file? ordered by display order, for now walls are last
        mapLayerRef: ['floors', 'doors', 'walls'],
        mapwidth: 64*32,
        mapheight: 46*32,
}

var HARD_MAP = {
    // for now the same
        gameType: "HARD_MAP",
        mapRef: 'assets/tilemaps/maps/reference_map.json',
        imageTagList: ['scifitiles-sheet', 'meta_tiles'],
        imageRefList: ['assets/scifitiles-sheet.png', 'assets/meta_tiles.png'],
        // [TODO] build this list off the json map file? ordered by display order, for now walls are last
        mapLayerRef: ['escape_pods', 'halls', 'dock', 'workshop', 'engine_room', 'rec_room', 'crew_quarters', 'cafeteria', 'med_bay', 'command_center', 'doors', 'walls'],
        mapwidth: 64*32,
        mapheight: 46*32,
}

function mapData (typeMap) {
    switch (typeMap) {
        case "EASY_MAP":
            return (EASY_MAP);
    }
    return null;
}