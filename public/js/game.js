var xhr = new XMLHttpRequest(),
playerHand = document.getElementById('player-hand'),
i;

xhr.open('GET', '/game-state');
xhr.send();


xhr.onload = function() {
  var game = JSON.parse(xhr.response);
  here.textContent = game.players[0].cards[1].color + game.players[0].cards.length;
  console.log('THIS IS GAME: ');
  console.log(game);
  cardsHand();
};

function cardsHand(playerID) {
  var cardCount = game.players[playerID].cards.length;
  for (i = 0; i <= cardCount; i++) {

  }
}