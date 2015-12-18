var xhr = new XMLHttpRequest(),
playerHand = document.getElementById('player-hand'),
game;

xhr.open('GET', '/game-state');
xhr.send();


xhr.onload = function() {
  game = JSON.parse(xhr.response);
  //here.textContent = game.players[0].cards[1].color + game.players[0].cards.length;
  console.log(game);
  cardsHand('0');
};

function cardsHand(playerID) {
  var cardCount = game.players[playerID].cards.length;
  console.log(cardCount);
  for (var i = 0; i < cardCount; i++) {
    console.log(game.players[0].cards[i].number);
    var makeCard = document.createElement('div'); //Make card div for webpage
    var cardColor = game.players[playerID].cards[i].color;
    makeCard.setAttribute("class", cardColor + "-card"); //add class to this for the colors.
    var cardNum = document.createElement('p'); //Creates p tag for div with card number
    var pText = document.createTextNode(game.players[playerID].cards[i].number); //This is the number of the Ein card
    cardNum.appendChild(pText); //getting text for p tag
    makeCard.appendChild(cardNum); //appending p tag to card div
    playerHand.appendChild(makeCard); //Placing card in the players hand
  }
}