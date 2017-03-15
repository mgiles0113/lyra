class LyreLocator {
    // lyre data is first constructed in mapInit
    constructor() {
    }

    initializeLocation (game, xPos, yPos) {
        if (game.gameData.lyreLocation == undefined) {
            game.gameData.lyreLocation = {x: xPos, y: yPos, found: false, playerIdx: -1, containerIdx: -1};
        }
    }

    // call when containers are defined at least once
    // call if player drops lyre into a container
    putLyreInContainer(game, container) {
        game.gameData.lyreLocation.containerIdx = container.idx;
        game.gameData.lyreLocation.playerIdx = -1;
        game.gameData.lyreLocation.x = container.sprite.body.x;
        game.gameData.lyreLocation.y = container.sprite.body.y;
    }

    // call if player picks up lyre
    playerPickUpLyre(game, player) {
        game.gameData.lyreLocation.containerIdx = -1;
        game.gameData.lyreLocation.playerIdx = player.idx;
        game.gameData.lyreLocation.found = true;
        game.gameData.lyreLocation.x = player.sprite.body.x;
        game.gameData.lyreLocation.y = player.sprite.body.y;
    }
    
    saveGameData(game) {
        // save lyre data to another location to support restore on load game
        // quick fix for last minute bug
       game.gameData.lyreData.containerIdx =  game.gameData.lyreLocation.containerIdx;
       game.gameData.lyreData.playerIdx = game.gameData.lyreLocation.playerIdx;
       game.gameData.lyreData.found = game.gameData.lyreLocation.found;
    }
}