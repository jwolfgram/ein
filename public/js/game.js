var xhr = new XMLHttpRequest(),
playerHand = document.getElementById('player-hand'),
game,
player  = 0;

function updateEins() {
  console.log('Fetching json from server!');
  xhr.open('GET', '/game-state', true);
  xhr.send();
  xhr.onload = function() {
    game = JSON.parse(xhr.response);
    cardsHand(player); //Get players hand of cards.
    enemyCard(player);
    tableCard(); //Get count for other players cards.
  };
}

updateEins();

function cardsHand(playerID) {
  while (playerHand.hasChildNodes()) { //Check to see if we need to clean the table and reset....
    playerHand.removeChild(playerHand.lastChild);
  }
  var cardCount = game.players[playerID].cards.length;
  console.log('Cards counted: ' + cardCount);
  for (var i = 0; i < cardCount; i++) {
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

function enemyCard(playerID) {
  var cardsTwo,
  cardsThree,
  cardsFour,
  twoCard,
  threeCard,
  fourCard,
  twoDiv,
  twoText,
  threeDiv,
  threeText,
  fourDiv,
  fourText;

  twoCard = document.getElementById('player-two');
  threeCard = document.getElementById('player-three');
  fourCard = document.getElementById('player-four');

  while (twoCard.hasChildNodes() || threeCard.hasChildNodes() || fourCard.hasChildNodes()) { //Check to see if we need to clean the table and reset....
    twoCard.removeChild(twoCard.lastChild);
    threeCard.removeChild(threeCard.lastChild);
    fourCard.removeChild(fourCard.lastChild);
  }

  switch (playerID) {
    case 0: //Select PLayer 1
    cardsTwo = game.players[1].cards.length;
    cardsThree = game.players[2].cards.length;
    cardsFour = game.players[3].cards.length;
    console.log('Player hand: ' + game.players[0].cards.length);

    twoDiv = document.createElement('p');
    twoText = document.createTextNode('Cards: ' + game.players[1].cards.length);
    twoDiv.appendChild(twoText);
    twoCard.appendChild(twoDiv);

    threeDiv = document.createElement('p');
    threeText = document.createTextNode('Cards: ' + game.players[2].cards.length);
    threeDiv.appendChild(threeText);
    threeCard.appendChild(threeDiv);

    fourDiv = document.createElement('p');
    fourText = document.createTextNode('Cards: ' + game.players[3].cards.length);
    fourDiv.appendChild(fourText);
    fourCard.appendChild(fourDiv);
    break;

    case 1: //Select PLayer 2
    cardsTwo = game.players[0].cards.length;
    cardsThree = game.players[2].cards.length;
    cardsFour = game.players[3].cards.length;
    console.log('Player hand: ' + game.players[1].cards.length);

    twoDiv = document.createElement('p');
    twoText = document.createTextNode('Cards: ' + game.players[1].cards.length);
    twoDiv.appendChild(twoText);
    twoCard.appendChild(twoDiv);

    threeDiv = document.createElement('p');
    threeText = document.createTextNode('Cards: ' + game.players[2].cards.length);
    threeDiv.appendChild(threeText);
    threeCard.appendChild(threeDiv);

    fourDiv = document.createElement('p');
    fourText = document.createTextNode('Cards: ' + game.players[3].cards.length);
    fourDiv.appendChild(fourText);
    fourCard.appendChild(fourDiv);
    break;

    case 2: //Select PLayer 3
    cardsTwo = game.players[0].cards.length;
    cardsThree = game.players[1].cards.length;
    cardsFour = game.players[3].cards.length;
    console.log('Player hand: ' + game.players[2].cards.length);

    twoDiv = document.createElement('p');
    twoText = document.createTextNode('Cards: ' + game.players[1].cards.length);
    twoDiv.appendChild(twoText);
    twoCard.appendChild(twoDiv);

    threeDiv = document.createElement('p');
    threeText = document.createTextNode('Cards: ' + game.players[2].cards.length);
    threeDiv.appendChild(threeText);
    threeCard.appendChild(threeDiv);

    fourDiv = document.createElement('p');
    fourText = document.createTextNode('Cards: ' + game.players[3].cards.length);
    fourDiv.appendChild(fourText);
    fourCard.appendChild(fourDiv);
    break;

    case 3:  //Select PLayer 4
    cardsTwo = game.players[0].cards.length;
    cardsThree = game.players[1].cards.length;
    cardsFour = game.players[2].cards.length;
    console.log('Player hand: ' + game.players[3].cards.length);

    twoDiv = document.createElement('p');
    twoText = document.createTextNode('Cards: ' + game.players[1].cards.length);
    twoDiv.appendChild(twoText);
    twoCard.appendChild(twoDiv);

    threeDiv = document.createElement('p');
    threeText = document.createTextNode('Cards: ' + game.players[2].cards.length);
    threeDiv.appendChild(threeText);
    threeCard.appendChild(threeDiv);

    fourDiv = document.createElement('p');
    fourText = document.createTextNode('Cards: ' + game.players[3].cards.length);
    fourDiv.appendChild(fourText);
    fourCard.appendChild(fourDiv);
    break;

    default:
    console.log('There was an error with the switch statement in game.js the function enemyCard(): ' + player);
    break;
  }
}

function tableCard() {
  var tableCard = document.getElementById('playing-card');
  while (tableCard.hasChildNodes()) { //Check to see if we need to clean the table and reset....
    tableCard.removeChild(tableCard.lastChild);
  }
  console.log(game.table[0].number); // Console.log
  var number = game.table[0].number;
  var color = game.table[0].color;
  tableCard.setAttribute("class", color + "-card center-block");
  var cardNum = document.createElement('p');
  var pText = document.createTextNode(game.table[0].number);
  cardNum.appendChild(pText);
  tableCard.appendChild(cardNum);
}

playerHand.addEventListener("click", selectCard, false);

function selectCard(e) {
  if (e.target !== e.currentTarget) {
    if (e.target.nodeName === 'P') {
      cardSelect = e.target.parentElement;
    }
    else {
      cardSelect = e.target;
    }
  }
  console.log('Found card to play and selected!' + cardSelect);
  e.stopPropagation();
}
//Play button submission

submitBtn = document.getElementById('play-btn');

submitBtn.addEventListener('click', function(){
  console.log('Got it.play-card' + cardSelect);
  console.log(number);
  var number = cardSelect.textContent;
  console.log(number);
  var turnPlayed;
  if (cardSelect.classList.contains('blue-card')) {
    turnPlayed = [number, "blue", player];
  }
  if (cardSelect.classList.contains('yellow-card')) {
    turnPlayed = [number, "yellow", player];
  }
  if (cardSelect.classList.contains('green-card')) {
    turnPlayed = [number, "green", player];
  }
  if (cardSelect.classList.contains('red-card')) {
    turnPlayed = [number, "red", player];
  }
  turnPlayed = JSON.stringify(turnPlayed);
  console.log(turnPlayed + 'Right before shit goes down...');
  xhr.open('POST', '/game-turn', true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(turnPlayed);
  //updateEins();
}, false);