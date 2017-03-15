class Grid{
    
    constructor (game) {
        this.mapJSON = game.cache.getJSON('pathfinder_map', true).layers[2].data;
        this.tile_size = game.gameData.tile_size;
        //Get the Walls Map Layer --> 2D Array of Tiles.
        var map_cols = game.gameData.mapwidth/this.tile_size;
        var map_rows = game.gameData.mapheight/this.tile_size;
        var grid_col = 0;
        var grid_row = 0;

        this.grid = [];
        
        for(grid_row = 0; grid_row < map_rows; grid_row++){
            this.grid[grid_row] = [];
            
            for(grid_col = 0; grid_col < map_cols; grid_col++){
                this.grid[grid_row][grid_col] = this.mapJSON[(grid_row *map_cols) + grid_col];
                
            }
        }
    }
    
   addContainerCollision(game, containerManager) {

        for(var i = 0; i < containerManager.containerCount; i++){
            
            if(containerManager.containers[i].name == 'smallbox' || containerManager.containers[i].name == 'espresso' || containerManager.containers[i].name == 'engine'){
                if(containerManager.containers[i].x != undefined && containerManager.containers[i].y != undefined){
                    
                    var container_x = game.math.roundTo(containerManager.containers[i].x/this.tile_size, 0); 
                    var container_y = game.math.roundTo(containerManager.containers[i].y/this.tile_size, 0);
                
                    //Give Containers a gid of 1.
                    if( container_x != undefined && container_y != undefined){
                        this.grid[container_y][container_x] = 1;
                        if (containerManager.containers[i].name == 'espresso') {
                            // this is because the espresso has a weird size
                            this.grid[container_y][container_x+1] = 1;
                            this.grid[container_y+1][container_x] = 1;
                            this.grid[container_y+1][container_x+1] = 1;
                        }
                    }

                }
            }
        }
   }
    
    makeGrid(mapJSON){
        var grid_col = 0;
        var grid_row = 0;
        
        for(grid_row = 0; grid_row < this.map_rows; grid_row++){
            this.grid[grid_row] = [];
            
            for(grid_col = 0; grid_col < this.map_cols; grid_col++){
                this.grid[grid_row][grid_col] = mapJSON[(grid_row *this.map_cols) + grid_col];
            }
        }
        
    }
}