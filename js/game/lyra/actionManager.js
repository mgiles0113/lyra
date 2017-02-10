class ActionManager {
    constructor () {
        this.actionArr = [];
    }
    updateAction(game, players, doorManager) {
        console.log("wouldn't it be great if this did something?")
        for (var i =0; i<players.length; i++) {
            if (players[i].isSelected) {
                for (var j=0; j<doorManager.doors.length; j++) {
                    switch (doorManager.doors[j].doorstate) {
                        case "dooropenhighlighted" :
                            console.log("closing player: " + i + " door: " + doorManager.doors[j].name);
                            doorManager.doors[j].closedDoorHighlighted(game, i);
                            return;
                        case "doorclosedhighlighted" :
                            console.log("opening player: " + i + " door: " + doorManager.doors[j].name);
                            doorManager.doors[j].openDoorHighlighted(game, i);
                            return;
                    }
                }
            }
        }
    }
}