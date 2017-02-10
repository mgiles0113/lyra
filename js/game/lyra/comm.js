class Comm {
        constructor (game) {
            //Create Comm. Window
            //[TODO] Fix it to bottom. Determine size.

            this.commCard = $("#communicator-card");
            this.commCard.css("background-color", "black");

            //Create player icons.
            this.p1_button = game.add.button(150,650,'p1_icon');
            this.p1_button.fixedToCamera = true;
            
            this.p2_button = game.add.button(300,650,'p2_icon');
            this.p2_button.fixedToCamera = true;
            
            this.p3_button = game.add.button(450,650,'p3_icon');
            this.p3_button.fixedToCamera = true;

            //Create item slots.
            this.items = [];
            this.items[0] = game.add.sprite(600, 650, 'empty');
            this.items[0].fixedToCamera = true;
            
            this.items[1] = game.add.sprite(720, 650, 'empty');
            this.items[1].fixedToCamera = true;
            
            this.items[2] = game.add.sprite(840, 650, 'empty');
            this.items[2].fixedToCamera = true;
            
            this.items[3] = game.add.sprite(960, 650, 'empty');
            this.items[3].fixedToCamera = true;
        }
        
        //Add Item Icon to Display 
        //Check Player Inventory
        displayInventory(player, game, ingameItems){
            
            //Return inventory Size
            this.maxItems = 4;
            this.player_items = [];
            this.comm_items = [];
            this.commItemInitX = 600;
            this.commItemY = 650;
            
            //Get the item in the player's inventory.
            for (var i=0; i < this.maxItems; i++){
                this.player_items[i] = player.getInventory(i);
            }

            //Create the item icons
            for( var j=0; j < this.maxItems; j++){
                //check that it's not empty
                if(this.player_items[j] != 'empty'){
                    this.comm_items[j] = ingameItems.addtoComm(game, this.player_items[j], this.commItemInitX + 28, this.commItemY + 28);
                    
                }
                this.commItemInitX += 120;
                
            }

        }
        
        switchPlayer(players, game){
            //Update Current Player to Player1
            this.p1_button.events.onInputDown.add(function(){
                if(players[0].isSelected == false){
                    players[0].togglePlayer();
                    
                    if(players[1].isSelected == true){ 
                        players[1].togglePlayer();

                    }else if( players[2].isSelected == true){
                        players[2].togglePlayer();
                    }
                   
                }
                
            });
            
            //Update Current Player to Player2
            this.p2_button.events.onInputDown.add(function(){
                if(players[1].isSelected == false){
                    players[1].togglePlayer();
                    
                    if(players[0].isSelected == true){ 
                        players[0].togglePlayer();

                    }else if( players[2].isSelected == true){
                        players[2].togglePlayer();
                    }
                    
                }
                
            });
            
            //Update Current Player to Player3
            this.p3_button.events.onInputDown.add(function(){
                if(players[2].isSelected == false){
                    players[2].togglePlayer();
                    
                }
                
                    if(players[0].isSelected == true){ 
                        players[0].togglePlayer();

                    }else if( players[1].isSelected == true){
                        players[1].togglePlayer();
                    }
                    
            });
            
        }
}

Comm.preloadComm = function (game) {
        game.load.image('empty', 'assets/sprites/item_ph.png');
        game.load.image('p1_icon', 'assets/sprites/p1_iconph.png');
        game.load.image('p2_icon', 'assets/sprites/p2_iconph.png');
        game.load.image('p3_icon', 'assets/sprites/p3_iconph.png');
}