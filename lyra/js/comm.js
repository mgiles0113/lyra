class Comm {
        constructor (game) {
            //Create Comm. Window
            //[TODO] Fix it to bottom. Determine size.
            //this.comm_window = game.add.sprite(x, y, 'comm_window');
            //this.comm_window.anchor.set(0.5);
            
            //Create the player icons
            //[TODO] 2.Link to players
            //Create player icons.
            this.p1_button = game.add.button(150,1300,'p1_icon');
            this.p1_button.fixedToCamera = true;
            
            this.p2_button = game.add.button(300,1300,'p2_icon');
            this.p2_button.fixedToCamera = true;
            
            this.p3_button = game.add.button(450,1300,'p3_icon');
            this.p3_button.fixedToCamera = true;
        
            //
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
        game.load.image('comm_window', 'assets/sprites/comm_window_ph.png');
        game.load.image('p1_icon', 'assets/sprites/p1_iconph.png');
        game.load.image('p2_icon', 'assets/sprites/p2_iconph.png');
        game.load.image('p3_icon', 'assets/sprites/p3_iconph.png');
}