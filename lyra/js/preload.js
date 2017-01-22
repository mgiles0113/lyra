      // functions in this file load game assets and setup game map

    // basic game setup
      function preloadLyra(game) {
        
        // create tilemap and load assets
        Map.preloadMap(game);
        
        // player assets
        Player.preloadPlayer(game);
        
        //slime assets
        Slime.preloadSlime(game);

      }