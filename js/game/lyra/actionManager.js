class ActionManager {
    constructor () {
        this.actionArr = [];
    }
    updateAction(game, playerid, containerManager, comm) {
        for (var j=0; j<containerManager.containers.length; j++) {
            if (containerManager.containers[j].containerstate == "openhighlight"  ||
                containerManager.containers[j].containerstate == "closedhighlight") {
                var playerIdx = containerManager.containers[j].findPlayerHighlight(playerid);
                // player that caused the highlight for this container
                if (playerIdx >= 0) {
                    containerManager.containers[j].switchContainerState(game, comm, playerIdx);
                }
            }
        }
    }
}