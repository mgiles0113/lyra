      // functions in this file load game assets and setup game map

    // basic game setup
      function preloadLyra(game) {
        
        // player assets
        Player.preloadPlayer(game);
        
        //slime assets
        Slime.preloadSlime(game);
        
        //comm window assets
        Comm.preloadComm(game);

      }