
var PLAYER1 = {
    x: 260,
    y: 600,
    isSelected: true,
    image: 1,
    imgRef: 'assets/sprites/player_1.png',
    name: 'player_one'
}

var PLAYER2 = {
    x: 360,
    y: 800,
    isSelected: false,
    image: 2,
    imgRef: 'assets/sprites/player_2.png',
    name: 'player_two'
}


var PLAYER3 = {
    x: 450,
    y: 500,
    isSelected: false,
    image: 3,
    imgRef: 'assets/sprites/player_3.png',
    name: 'player_three'
}

var PLAYER_DATA = {
    numPlayers: 3,
    //player: [{260, 600, true, 1}, {360, 800, false, 2}, { 450, 500, false, 3}],
    players: [PLAYER1, PLAYER2, PLAYER3],
    height: 32,
    width: 32,
    frames: 4
}

