class Grid{
    
    constructor(game, tileSize){
        this.map_cols = game.gameData.mapwidth/tileSize;
        this.map_rows = game.gameData.mapheight/tileSize;
        this.grid = [];
    
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