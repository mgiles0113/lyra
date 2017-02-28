class Comm {
        constructor (game, playerManager, containerManager) {
            //Create Comm. Window
            //[TODO] Fix it to bottom. Determine size.
            this.game = game;
            this.playerManager = playerManager;
            this.containerManager = containerManager;
            this.commCard = $("#communicator-card");
            this.commCard.css("visibility", "visible");
            this.activeContainerIndex = -1;

            // create player icons
            this.playerButtons = {
                p1 : $("#p1"),
                p2 : $("#p2"),
                p3 : $("#p3")
            };

            // create player item slots
            // player equipped item
            this.playerEquippedItem = {
                slot : $("#player-inventory-slot-e"),
                option1 : $("#player-inventory-slot-e-option-1"),
                option2 : $("#player-inventory-slot-e-option-2")
            };

            // player inventory items
            this.playerItems = {
                item1 : {
                    slot : $("#player-inventory-slot-1"),
                    option1 : $("#player-inventory-slot-1-option-1"),
                    option2 : $("#player-inventory-slot-1-option-2")
                },
                item2 : {
                    slot : $("#player-inventory-slot-2"),
                    option1 : $("#player-inventory-slot-2-option-1"),
                    option2 : $("#player-inventory-slot-2-option-2")
                },
                item3 : {
                    slot : $("#player-inventory-slot-3"),
                    option1 : $("#player-inventory-slot-3-option-1"),
                    option2 : $("#player-inventory-slot-3-option-2")
                },
                item4 : {
                    slot : $("#player-inventory-slot-4"),
                    option1 : $("#player-inventory-slot-4-option-1"),
                    option2 : $("#player-inventory-slot-4-option-2")
                }
            };

            // create container item slots
            this.containerItems = {
                item1 : {
                    slot : $("#container-inventory-slot-1"),
                    option1 : $("#container-inventory-slot-1-option-1"),
                    option2 : $("#container-inventory-slot-1-option-2")
                },
                item2 : {
                    slot : $("#container-inventory-slot-2"),
                    option1 : $("#container-inventory-slot-2-option-1"),
                    option2 : $("#container-inventory-slot-2-option-2")
                },
                item3 : {
                    slot : $("#container-inventory-slot-3"),
                    option1 : $("#container-inventory-slot-3-option-1"),
                    option2 : $("#container-inventory-slot-3-option-2")
                },
                item4 : {
                    slot : $("#container-inventory-slot-4"),
                    option1 : $("#container-inventory-slot-4-option-1"),
                    option2 : $("#container-inventory-slot-4-option-2")
                }
            };
            
            this.createClickEvents();
            
        }
        
        createClickEvents() {
            var self = this;
            // player selector
            this.playerButtons.p1.click(function() {
                self.switchPlayer(0);
            });
            this.playerButtons.p2.click(function() {
                self.switchPlayer(1);
            });
            this.playerButtons.p3.click(function() {
                self.switchPlayer(2);
            });
            
            // player items
            // player equipped item
            this.playerEquippedItem.slot.click(function() {
                console.log('equipped item slot clicked');
            });
            this.playerEquippedItem.option1.click(function() {
                console.log('equipped item option 1 clicked');
            });
            this.playerEquippedItem.option2.click(function() {
                console.log('equipped item option 2 clicked');
            });
            // item 1
            this.playerItems.item1.slot.click(function() {
                console.log('player item 1 slot clicked');
            });
            this.playerItems.item1.option1.click(function() {
                console.log('player item 1 option 1 clicked');
            });
            this.playerItems.item1.option2.click(function() {
                console.log('player item 1 option 2 clicked');
            });
            // item 2
            this.playerItems.item2.slot.click(function() {
                console.log('player item 2 slot clicked');
            });
            this.playerItems.item2.option1.click(function() {
                console.log('player item 2 option 1 clicked');
            });
            this.playerItems.item2.option2.click(function() {
                console.log('player item 2 option 2 clicked');
            });
            // item 3
            this.playerItems.item3.slot.click(function() {
                console.log('player item 3 slot clicked');
            });
            this.playerItems.item3.option1.click(function() {
                console.log('player item 3 option 1 clicked');
            });
            this.playerItems.item3.option2.click(function() {
                console.log('player item 3 option 2 clicked');
            });
            // item 4
            this.playerItems.item4.slot.click(function() {
                console.log('player item 4 slot clicked');
            });
            this.playerItems.item4.option1.click(function() {
                console.log('player item 4 option 1 clicked');
            });
            this.playerItems.item4.option2.click(function() {
                console.log('player item 4 option 2 clicked');
            });
            
            // container items
            // item 1
            this.containerItems.item1.slot.click(function() {
                console.log('container item 1 slot clicked');
            });
            this.containerItems.item1.option1.click(function() {
                console.log('cont item 1 option 1 clicked');
            });
            this.containerItems.item1.option2.click(function() {
                console.log('cont item 1 option 2 clicked');
            });
            // item 2
            this.containerItems.item2.slot.click(function() {
                console.log('container item 2 slot clicked');
            });
            this.containerItems.item2.option1.click(function() {
                console.log('cont item 2 option 1 clicked');
            });
            this.containerItems.item2.option2.click(function() {
                console.log('cont item 2 option 2 clicked');
            });
            // item 3
            this.containerItems.item3.slot.click(function() {
                console.log('container item 3 slot clicked');
            });
            this.containerItems.item3.option1.click(function() {
                console.log('cont item 3 option 1 clicked');
            });
            this.containerItems.item3.option2.click(function() {
                console.log('cont item 3 option 2 clicked');
            });
            // item 4
            this.containerItems.item4.slot.click(function() {
                console.log('container item 4 slot clicked');
            });
            this.containerItems.item4.option1.click(function() {
                console.log('cont item 4 option 1 clicked');
            });
            this.containerItems.item4.option2.click(function() {
                console.log('cont item 4 option 2 clicked');
            });
        }
        
        destroyClickEvents() {
            // player selector click events
            this.playerButtons.p1.unbind('click');
            this.playerButtons.p2.unbind('click');
            this.playerButtons.p3.unbind('click');
            // equipped item click events
            this.playerEquippedItem.slot.unbind('click');
            this.playerEquippedItem.option1.unbind('click');
            this.playerEquippedItem.option2.ubbind('click');
            // player items click events
            this.playerItems.item1.slot.unbind('click');
            this.playerItems.item1.option1.unbind('click');
            this.playerItems.item1.option2.unbind('click');
            this.playerItems.item2.slot.unbind('click');
            this.playerItems.item2.option1.unbind('click');
            this.playerItems.item2.option2.unbind('click');
            this.playerItems.item3.slot.unbind('click');
            this.playerItems.item3.option1.unbind('click');
            this.playerItems.item3.option2.unbind('click');
            this.playerItems.item4.slot.unbind('click');
            this.playerItems.item4.option1.unbind('click');
            this.playerItems.item4.option2.unbind('click');
            // container item click events
            this.containerItems.item1.slot.unbind('click');
            this.containerItems.item1.option1.unbind('click');
            this.containerItems.item1.option2.unbind('click');
            this.containerItems.item2.slot.unbind('click');
            this.containerItems.item2.option1.unbind('click');
            this.containerItems.item2.option2.unbind('click');
            this.containerItems.item3.slot.unbind('click');
            this.containerItems.item3.option1.unbind('click');
            this.containerItems.item3.option2.unbind('click');
            this.containerItems.item4.slot.unbind('click');
            this.containerItems.item4.option1.unbind('click');
            this.containerItems.item4.option2.unbind('click');
        }
        
        // get all player items and display to communicator
        displayPlayerInventory(playerIndex){
            this.clearPlayerInventory();
            // show all items in the player's inventory
            for (var i = 0; i < 4; i++) {
                if (this.playerManager.players[playerIndex].getInventory(i) !== 'empty') {
                    this.playerItems['item' + (i + 1)].slot.css('backgroundSize', 'contain');
                    this.playerItems['item' + (i + 1)].slot.css('backgroundImage', 'url(assets/sprites/items/' + this.playerManager.players[playerIndex].getInventory(i) + '.png)');    
                }
            }
        }

        clearPlayerInventory() {
            for (var i = 0; i < 4; i++) {
                this.playerItems['item' + (i + 1)].slot.css('backgroundImage', 'none');
            }
        }

        displayContainerInventory() {
            // show all items in the container's inventory
            if (this.activeContainerIndex !== -1) {
                for (var i = 0; i < 4; i++) {
                    console.log(this.containerManager.containers[this.activeContainerIndex].getInventory(i));
                    if (this.containerManager.containers[this.activeContainerIndex].getInventory(i) !== 'empty') {
                        this.containerItems['item' + (i + 1)].slot.css('backgroundSize', 'contain');
                        this.containerItems['item' + (i + 1)].slot.css('backgroundImage', 'url(assets/sprites/items/' + this.containerManager.containers[this.activeContainerIndex].getInventory(i) + '.png)');
                    } else {
                        this.containerItems['item' + (i + 1)].slot.css('backgroundImage', 'none');    
                    }
                }
            }
        }
        
        clearContainerInventory() {
            this.activeContainerIndex = -1;
            for (var i = 0; i < 4; i++) {
                this.containerItems['item' + (i + 1)].slot.css('backgroundImage', 'none');
            }
        }
        
        switchPlayer(playerIndex) {
            for (var i = 0; i < this.playerManager.players.length; i++) {
                if (i === playerIndex) {
                    if (this.playerManager.players[playerIndex].isSelected === false) {
                        this.playerManager.players[playerIndex].togglePlayer();
                    }    
                } else {
                    if (this.playerManager.players[i].isSelected === true) {
                        this.playerManager.players[i].togglePlayer();
                    }
                }
            }
            this.displayPlayerInventory(playerIndex);
        }
}

Comm.preloadComm = function (game) {
        game.load.image('empty', 'assets/sprites/item_ph.png');
        game.load.image('p1_icon', 'assets/sprites/p1_iconph.png');
        game.load.image('p2_icon', 'assets/sprites/p2_iconph.png');
        game.load.image('p3_icon', 'assets/sprites/p3_iconph.png');
}