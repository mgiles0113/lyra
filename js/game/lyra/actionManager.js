class ActionManager {
    constructor () {
        this.actionArr = [];
    }
    updateAction(game, playerid, doorManager) {
        console.log("wouldn't it be great if this did something?")

        for (var j=0; j<doorManager.doors.length; j++) {
            if (doorManager.doors[j].doorstate == game.gameData.doors["dooropenhighlighted"].imageTagList  ||
                doorManager.doors[j].doorstate == game.gameData.doors["doorclosedhighlighted"].imageTagList) {
                var playerIdx = doorManager.doors[j].findPlayerHighlight(playerid);
                // player that caused the highlight for this door
                if (playerIdx >= 0) {
                    doorManager.doors[j].switchDoorState(game);
                }
            }
        }
    }
}