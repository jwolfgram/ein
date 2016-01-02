var xhr = new XMLHttpRequest(),
playerHand = document.getElementById('player-hand'),
submitBtn = document.getElementById('play-btn'),
twoCard = document.getElementById('player-two'),
threeCard = document.getElementById('player-three'),
fourCard = document.getElementById('player-four'),
tableCard = document.getElementById('playing-card'),
game,
player;

function getPlayer() {
  xhr.open('GET', '/game-state/', false);
  console.log('xhr status: ' + xhr.status);
  xhr.send();
  console.log('xhr status: (before player defined) ' + xhr.status);
  player = xhr.response;
  console.log('xhr status: ' + xhr.status);
  console.log('Player number from server: ' + xhr.response);
  //getGame();
}

Promise.all([getPlayer()]);
//getPlayer();
getGame();

function getGame() {
  var cardsTwo,
  cardsThree,
  cardsFour,
  twoDiv = document.createElement('p'),
  twoText,
  threeDiv = document.createElement('p'),
  threeText,
  fourDiv,
  fourText,
  path = '/game-state/' + player;

  console.log('This is path: ' + path);
  xhr.open('GET', path, true);
  console.log('xhr status: ' + xhr.status);
  xhr.send();
  console.log('xhr status: ' + xhr.status);
  xhr.onload = function() {
    console.log('xhr status: ' + xhr.status);
    game = JSON.parse(xhr.response);
    console.log('xhr status: ' + xhr.status);
    drawGame();

  };
}

function drawGame() {
  //Wipe 'table' of all Player stats and cards.
  while (playerHand.hasChildNodes()) { //Check to see if we need to clean the table and reset....
    playerHand.removeChild(playerHand.lastChild);
  }
  if (twoCard.hasChildNodes()) {
    twoCard.removeChild(twoCard.lastChild);
  }
  if (threeCard.hasChildNodes()) {
    threeCard.removeChild(threeCard.lastChild);
  }
  if (fourCard.hasChildNodes()) {
    fourCard.removeChild(fourCard.lastChild);
  }
  if (tableCard.hasChildNodes()) {
    tableCard.removeChild(tableCard.lastChild);
  }
  //Get players hand of cards.
  cardCount = game.players[player].cards.length;
  console.log('Cards counted: ' + cardCount);
  for (var i = 0; i < cardCount; i++) {
    var makeCard = document.createElement('div'); //Make card div for webpage
    var cardColor = game.players[player].cards[i].color;
    makeCard.setAttribute("class", cardColor + "-card"); //add class to this for the colors.
    var cardNum = document.createElement('p'); //Creates p tag for div with card number
    var pText = document.createTextNode(game.players[player].cards[i].number); //This is the number of the Ein card
    cardNum.appendChild(pText); //getting text for p tag <p>1</p>
    makeCard.appendChild(cardNum); //appending p tag to card div <div><p>1</p></div>
    playerHand.appendChild(makeCard); //Placing card in the players hand
  }

  twoDiv = document.createElement('p');
  twoCard.appendChild(twoDiv);

  threeDiv = document.createElement('p');
  threeCard.appendChild(threeDiv);

  fourDiv = document.createElement('p');
  fourCard.appendChild(fourDiv);
  //Write number of remaining cards on ememies cards.
  switch (player) {
    case "0": //Select PLayer 1
    cardsTwo = game.players[1].cards.length;
    cardsThree = game.players[2].cards.length;
    cardsFour = game.players[3].cards.length;
    console.log('Player hand: ' + game.players[0].cards.length);

    twoText = document.createTextNode('Cards: ' + game.players[1].cards.length);
    twoDiv.appendChild(twoText);

    threeText = document.createTextNode('Cards: ' + game.players[2].cards.length);
    threeDiv.appendChild(threeText);

    fourText = document.createTextNode('Cards: ' + game.players[3].cards.length);
    fourDiv.appendChild(fourText);
    break;

    case 1: //Select PLayer 2
    cardsTwo = game.players[0].cards.length;
    cardsThree = game.players[2].cards.length;
    cardsFour = game.players[3].cards.length;
    console.log('Player hand: ' + game.players[1].cards.length);

    twoText = document.createTextNode('Cards: ' + game.players[1].cards.length);
    twoDiv.appendChild(twoText);

    threeText = document.createTextNode('Cards: ' + game.players[2].cards.length);
    threeDiv.appendChild(threeText);

    fourText = document.createTextNode('Cards: ' + game.players[3].cards.length);
    fourDiv.appendChild(fourText);
    break;

    case 2: //Select PLayer 3
    cardsTwo = game.players[0].cards.length;
    cardsThree = game.players[1].cards.length;
    cardsFour = game.players[3].cards.length;
    console.log('Player hand: ' + game.players[2].cards.length);

    twoText = document.createTextNode('Cards: ' + game.players[1].cards.length);
    twoDiv.appendChild(twoText);

    threeText = document.createTextNode('Cards: ' + game.players[2].cards.length);
    threeDiv.appendChild(threeText);

    fourText = document.createTextNode('Cards: ' + game.players[3].cards.length);
    fourDiv.appendChild(fourText);
    break;

    case 3:  //Select PLayer 4
    cardsTwo = game.players[0].cards.length;
    cardsThree = game.players[1].cards.length;
    cardsFour = game.players[2].cards.length;
    console.log('Player hand: ' + game.players[3].cards.length);

    twoText = document.createTextNode('Cards: ' + game.players[1].cards.length);
    twoDiv.appendChild(twoText);

    threeText = document.createTextNode('Cards: ' + game.players[2].cards.length);
    threeDiv.appendChild(threeText);

    fourText = document.createTextNode('Cards: ' + game.players[3].cards.length);
    fourDiv.appendChild(fourText);
    break;

    default:
    console.log('There was an error with the switch statement in game.js the function enemyCard(): ' + player);
    break;
  }
  //Draw playing card on table.
  tableCard.setAttribute("class", game.table[0].color + "-card center-block");
  var tableNum = document.createElement('p');
  var tableText = document.createTextNode(game.table[0].number);
  tableNum.appendChild(tableText);
  tableCard.appendChild(tableNum);
}

function sendTurn() {
  console.log('Sending Card: ' + cardSelect);
  var number = cardSelect.textContent;
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
  console.log('xhr status: ' + xhr.status);
  xhr.open('POST', '/game-turn', true);
  console.log('xhr status: ' + xhr.status);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  console.log('xhr status:content-type ' + xhr.status);
  xhr.send(turnPlayed);
  console.log('xhr status:last ' + xhr.status);
  if (xhr.readyState == 4) {
    console.log('xhr status (onload function): ' + xhr.status);
    setTable(); //redraw table
    console.log('xhr status final?: ' + xhr.status);
  }
}

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

playerHand.addEventListener("click", selectCard, false); //Adding event listener for 'Playing Card'


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

  Promise.all([sendTurn(),getGame(),drawGame()]);
}, false);