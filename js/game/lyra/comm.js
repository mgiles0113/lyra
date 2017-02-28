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
            this.activePlayerIndex = 0;

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
                option1 : {
                    isActive : false,
                    element : $("#player-inventory-slot-e-option-1")
                },
                option2 : {
                    isActive : false,
                    element : $("#player-inventory-slot-e-option-2")
                }
            };

            // player inventory items
            this.playerItems = {
                item1 : {
                    slot : $("#player-inventory-slot-1"),
                    option1 : {
                        isActive : false,
                        element : $("#player-inventory-slot-1-option-1")
                    },
                    option2 : {
                        isActive : false,
                        element : $("#player-inventory-slot-1-option-2")
                    }
                },
                item2 : {
                    slot : $("#player-inventory-slot-2"),
                    option1 : {
                        isActive : false,
                        element : $("#player-inventory-slot-2-option-1")
                    },
                    option2 : {
                        isActive : false,
                        element : $("#player-inventory-slot-2-option-2")
                    }
                },
                item3 : {
                    slot : $("#player-inventory-slot-3"),
                    option1 : {
                        isActive : false,
                        element : $("#player-inventory-slot-3-option-1")
                    },
                    option2 : {
                        isActive : false,
                        element : $("#player-inventory-slot-3-option-2")
                    }
                },
                item4 : {
                    slot : $("#player-inventory-slot-4"),
                    option1 : {
                        isActive : false,
                        element : $("#player-inventory-slot-4-option-1")
                    },
                    option2 : {
                        isActive : false,
                        element : $("#player-inventory-slot-4-option-2")
                    }
                }
            };

            // create container item slots
            this.containerItems = {
                item1 : {
                    slot : $("#container-inventory-slot-1"),
                    option1 : {
                        isActive : false,
                        element : $("#container-inventory-slot-1-option-1")
                    },
                    option2 : {
                        isActive : false,
                        element : $("#container-inventory-slot-1-option-2")
                    }
                },
                item2 : {
                    slot : $("#container-inventory-slot-2"),
                    option1 : {
                        isActive : false,
                        element : $("#container-inventory-slot-2-option-1")
                    },
                    option2 : {
                        isActive : false,
                        element : $("#container-inventory-slot-2-option-2")
                    }
                },
                item3 : {
                    slot : $("#container-inventory-slot-3"),
                    option1 : {
                        isActive : false,
                        element : $("#container-inventory-slot-3-option-1")
                    },
                    option2 : {
                        isActive : false,
                        element : $("#container-inventory-slot-3-option-2")
                    }
                },
                item4 : {
                    slot : $("#container-inventory-slot-4"),
                    option1 : {
                        isActive : false,
                        element : $("#container-inventory-slot-4-option-1")
                    },
                    option2 : {
                        isActive : false,
                        element : $("#container-inventory-slot-4-option-2")
                    }
                }
            };
            
            this.createClickEvents();
            
        }
        
        resetCommunicatorInventory() {
            this.displayContainerInventory();
            this.displayPlayerInventory();
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
            this.playerEquippedItem.option1.element.click(function() {
                if (self.playerEquippedItem.option1.isActive && self.activeContainerIndex !== -1) {
                    console.log('equipped item option 1 clicked');    
                }
            });
            this.playerEquippedItem.option2.element.click(function() {
                if (self.playerEquippedItem.option2.isActive && self.activeContainerIndex !== -1) {
                    console.log('equipped item option 2 clicked');
                }
            });
            // item 1
            this.playerItems.item1.slot.click(function() {
                console.log('player item 1 slot clicked');
            });
            this.playerItems.item1.option1.element.click(function() {
                if (self.playerItems.item1.option1.isActive && self.activeContainerIndex !== -1) {
                    console.log('player item 1 option 1 clicked');
                }
            });
            this.playerItems.item1.option2.element.click(function() {
                if (self.playerItems.item1.option2.isActive && self.activeContainerIndex !== -1) {
                    console.log('player item 1 option 2 clicked');
                    self.containerManager.containers[self.activeContainerIndex].transferItem('player', 0, self.playerManager.players[self.activePlayerIndex], self);
                    self.resetCommunicatorInventory();
                }
            });
            // item 2
            this.playerItems.item2.slot.click(function() {
                console.log('player item 2 slot clicked');
            });
            this.playerItems.item2.option1.element.click(function() {
                if (self.playerItems.item2.option1.isActive && self.activeContainerIndex !== -1) {
                    console.log('player item 2 option 1 clicked');
                }
            });
            this.playerItems.item2.option2.element.click(function() {
                if (self.playerItems.item2.option2.isActive && self.activeContainerIndex !== -1) {
                    console.log('player item 2 option 2 clicked');
                    self.containerManager.containers[self.activeContainerIndex].transferItem('player', 1, self.playerManager.players[self.activePlayerIndex], self);
                    self.resetCommunicatorInventory();
                }
            });
            // item 3
            this.playerItems.item3.slot.click(function() {
                console.log('player item 3 slot clicked');
            });
            this.playerItems.item3.option1.element.click(function() {
                if (self.playerItems.item3.option1.isActive && self.activeContainerIndex !== -1) {
                    console.log('player item 3 option 1 clicked');    
                }
            });
            this.playerItems.item3.option2.element.click(function() {
                if (self.playerItems.item3.option2.isActive && self.activeContainerIndex !== -1) {
                    console.log('player item 3 option 2 clicked');
                    self.containerManager.containers[self.activeContainerIndex].transferItem('player', 2, self.playerManager.players[self.activePlayerIndex], self);
                    self.resetCommunicatorInventory();
                }
            });
            // item 4
            this.playerItems.item4.slot.click(function() {
                console.log('player item 4 slot clicked');
            });
            this.playerItems.item4.option1.element.click(function() {
                if (self.playerItems.item4.option1.isActive && self.activeContainerIndex !== -1) {
                    console.log('player item 4 option 1 clicked');
                }
            });
            this.playerItems.item4.option2.element.click(function() {
                if (self.playerItems.item4.option2.isActive && self.activeContainerIndex !== -1) {
                    console.log('player item 4 option 2 clicked');
                    self.containerManager.containers[self.activeContainerIndex].transferItem('player', 3, self.playerManager.players[self.activePlayerIndex], self);
                    self.resetCommunicatorInventory();
                }
            });
            
            // container items
            // item 1
            this.containerItems.item1.slot.click(function() {
                console.log('container item 1 slot clicked');
            });
            this.containerItems.item1.option1.element.click(function() {
                if (self.containerItems.item1.option1.isActive) {
                    console.log('cont item 1 option 1 clicked');
                }
            });
            this.containerItems.item1.option2.element.click(function() {
                if (self.containerItems.item1.option2.isActive && self.activeContainerIndex !== -1) {
                    console.log('cont item 1 option 2 clicked');
                    self.containerManager.containers[self.activeContainerIndex].transferItem('container', 0, self.playerManager.players[self.activePlayerIndex], self);
                    self.resetCommunicatorInventory();
                }
            });
            // item 2
            this.containerItems.item2.slot.click(function() {
                console.log('container item 2 slot clicked');
            });
            this.containerItems.item2.option1.element.click(function() {
                if (self.containerItems.item2.option1.isActive) {
                    console.log('cont item 2 option 1 clicked');
                }
            });
            this.containerItems.item2.option2.element.click(function() {
                if (self.containerItems.item2.option2.isActive) {
                    console.log('cont item 2 option 2 clicked');
                    self.containerManager.containers[self.activeContainerIndex].transferItem('container', 1, self.playerManager.players[self.activePlayerIndex], self);
                    self.resetCommunicatorInventory();
                }
            });
            // item 3
            this.containerItems.item3.slot.click(function() {
                console.log('container item 3 slot clicked');
            });
            this.containerItems.item3.option1.element.click(function() {
                if (self.containerItems.item3.option1.isActive) {
                    console.log('cont item 3 option 1 clicked');
                }
            });
            this.containerItems.item3.option2.element.click(function() {
                if (self.containerItems.item3.option2.isActive) {
                    console.log('cont item 3 option 2 clicked');
                    self.containerManager.containers[self.activeContainerIndex].transferItem('container', 2, self.playerManager.players[self.activePlayerIndex], self);
                    self.resetCommunicatorInventory();
                }
            });
            // item 4
            this.containerItems.item4.slot.click(function() {
                console.log('container item 4 slot clicked');
            });
            this.containerItems.item4.option1.element.click(function() {
                if (self.containerItems.item4.option1.isActive) {
                    console.log('cont item 4 option 1 clicked');
                }
            });
            this.containerItems.item4.option2.element.click(function() {
                if (self.containerItems.item4.option2.isActive) {
                    console.log('cont item 4 option 2 clicked');
                    self.containerManager.containers[self.activeContainerIndex].transferItem('container', 3, self.playerManager.players[self.activePlayerIndex], self);
                    self.resetCommunicatorInventory();
                }
            });
        }

        enableSlot(type, number) {
            if (type === 'container') {
                this.containerItems['item' + number].option1.isActive = true;
                this.containerItems['item' + number].option2.isActive = true;
            } else if (type === 'player') {
                this.playerItems['item' + number].option1.isActive = true;
                this.playerItems['item' + number].option2.isActive = true;
            }
        }

        disableSlot(type, number) {
            if (type === 'container') {
                this.containerItems['item' + number].option1.isActive = false;
                this.containerItems['item' + number].option2.isActive = false;
            } else if (type === 'player') {
                this.playerItems['item' + number].option1.isActive = false;
                this.playerItems['item' + number].option2.isActive = false;
            }
        }

        destroyClickEvents() {
            // player selector click events
            this.playerButtons.p1.unbind('click');
            this.playerButtons.p2.unbind('click');
            this.playerButtons.p3.unbind('click');
            // equipped item click events
            this.playerEquippedItem.slot.unbind('click');
            this.playerEquippedItem.option1.element.unbind('click');
            this.playerEquippedItem.option2.element.unbind('click');
            // player items click events
            this.playerItems.item1.slot.unbind('click');
            this.playerItems.item1.option1.element.unbind('click');
            this.playerItems.item1.option2.element.unbind('click');
            this.playerItems.item2.slot.unbind('click');
            this.playerItems.item2.option1.element.unbind('click');
            this.playerItems.item2.option2.element.unbind('click');
            this.playerItems.item3.slot.unbind('click');
            this.playerItems.item3.option1.element.unbind('click');
            this.playerItems.item3.option2.element.unbind('click');
            this.playerItems.item4.slot.unbind('click');
            this.playerItems.item4.option1.element.unbind('click');
            this.playerItems.item4.option2.element.unbind('click');
            // container item click events
            this.containerItems.item1.slot.unbind('click');
            this.containerItems.item1.option1.element.unbind('click');
            this.containerItems.item1.option2.element.unbind('click');
            this.containerItems.item2.slot.unbind('click');
            this.containerItems.item2.option1.element.unbind('click');
            this.containerItems.item2.option2.element.unbind('click');
            this.containerItems.item3.slot.unbind('click');
            this.containerItems.item3.option1.element.unbind('click');
            this.containerItems.item3.option2.element.unbind('click');
            this.containerItems.item4.slot.unbind('click');
            this.containerItems.item4.option1.element.unbind('click');
            this.containerItems.item4.option2.element.unbind('click');
        }
        
        // get all player items and display to communicator
        displayPlayerInventory() {
            this.clearPlayerInventory();
            // show all items in the player's inventory
            for (var i = 0; i < 4; i++) {
                if (this.playerManager.players[this.activePlayerIndex].getInventory(i) !== 'empty') {
                    this.playerItems['item' + (i + 1)].slot.css('backgroundSize', 'contain');
                    this.playerItems['item' + (i + 1)].slot.css('backgroundImage', 'url(assets/sprites/items/' + this.playerManager.players[this.activePlayerIndex].getInventory(i) + '.png)');
                    this.enableSlot('player', i + 1);
                }
            }
        }

        clearPlayerInventory() {
            for (var i = 0; i < 4; i++) {
                this.playerItems['item' + (i + 1)].slot.css('backgroundImage', 'none');
                this.disableSlot('player', i + 1);
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
                        this.enableSlot('container', i + 1);
                    } else {
                        this.containerItems['item' + (i + 1)].slot.css('backgroundImage', 'none');
                        this.disableSlot('container', i + 1);
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
            this.activePlayerIndex = playerIndex;
            this.displayPlayerInventory(playerIndex);
        }
}

Comm.preloadComm = function (game) {
        game.load.image('empty', 'assets/sprites/item_ph.png');
        game.load.image('p1_icon', 'assets/sprites/p1_iconph.png');
        game.load.image('p2_icon', 'assets/sprites/p2_iconph.png');
        game.load.image('p3_icon', 'assets/sprites/p3_iconph.png');
}