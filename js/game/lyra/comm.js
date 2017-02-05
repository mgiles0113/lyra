class Comm {
        constructor (game) {
            //Create Comm. Window
            //[TODO] Fix it to bottom. Determine size.
            
            //Create player icons.
            this.p1_button = game.add.button(150,650,'p1_icon');
            this.p1_button.fixedToCamera = true;
            
            this.p2_button = game.add.button(300,650,'p2_icon');
            this.p2_button.fixedToCamera = true;
            
            this.p3_button = game.add.button(450,650,'p3_icon');
            this.p3_button.fixedToCamera = true;
        
            
        }
        
        //Add Item Icon to Display
        //Check Player Inventory-- 1. if match found in possible items, get image add icon.
        //                      2. Else add an empty ico
        displayInventory(game){
            //Create the item icons
            this.item1 = game.add.button(600, 650,'item_ph');
            this.item1.fixedToCamera = true;
            
            this.item2 = game.add.button(720, 650, 'item_ph');
            this.item2.fixedToCamera = true;
            
            this.item3 = game.add.button(840, 650, 'item_ph');
            this.item3.fixedToCamera = true;
            
            this.item4 = game.add.button(960, 650, 'item_ph');
            this.item4.fixedToCamera = true;
            
        }
        
        switchPlayer(players){
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
        game.load.image('item_ph', 'assets/sprites/item_ph.png');
        game.load.image('p1_icon', 'assets/sprites/p1_iconph.png');
        game.load.image('p2_icon', 'assets/sprites/p2_iconph.png');
        game.load.image('p3_icon', 'assets/sprites/p3_iconph.png');
}