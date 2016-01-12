var playerHand = document.getElementById('player-hand'),
submitBtn = document.getElementById('play-btn'),
drawBtn = document.getElementById('drawcard-btn'),
twoCard = document.getElementById('player-two'),
threeCard = document.getElementById('player-three'),
fourCard = document.getElementById('player-four'),
tableCard = document.getElementById('playing-card'),
game,
player,
socket = io();

console.log(socket);

function selectCard(e) {
  if (e.target !== e.currentTarget) {
    if (e.target.nodeName === 'P') {
      cardSelect = e.target.parentElement;
    }
    else {
      cardSelect = e.target;
    }
  //Check all cards to make sure we do not already have a checkmark on them.
  var checkMark = document.getElementsByClassName('selected-card');
  while (checkMark[0]) {
    checkMark[0].parentNode.removeChild(checkMark[0]);
  }
  //When card is clicked, add class that will show a checkmark.
  var makeCheck = document.createElement('div');
  makeCheck.setAttribute("class", "selected-card");
  cardSelect.appendChild(makeCheck);
}
console.log('Found card to play and selected!' + cardSelect);
e.stopPropagation();
}


playerHand.addEventListener("click", selectCard, false); //Adding event listener for 'Playing Card'

submitBtn.addEventListener('click', function(){
  console.log('Got it.play-card' + cardSelect);
  var number = cardSelect.textContent,
  oldBanner = document.getElementsByClassName('banner'),
  topLevel = document.getElementById('table-top'),
  turnPlayed,
  makeOverlay,
  overlayTag,
  overlayText,
  color;

  while (oldBanner[0]) {
    oldBanner[0].parentNode.removeChild(oldBanner[0]);
  }

  if (cardSelect.classList.contains('blue-card')) {
    console.log('Emitting card: ' + number + ' blue');
    color = 'blue';
  }
  if (cardSelect.classList.contains('yellow-card')) {
    console.log('Emitting card: ' + number + ' yellow');
    color = 'yellow';
  }
  if (cardSelect.classList.contains('green-card')) {
    console.log('Emitting card: ' + number + ' green');
    color = 'green';
  }
  if (cardSelect.classList.contains('red-card')) {
    console.log('Emitting card: ' + number + ' red');
    color = 'red';
  }
  tableNumber = tableCard.getElementsByTagName('p')[0].textContent;
/*Get color of table card as well */
  if (tableCard.classList.contains('blue-card')) {
    console.log('Emitting card: ' + number + ' blue');
    tableColor = 'blue';
  }
  if (tableCard.classList.contains('yellow-card')) {
    console.log('Emitting card: ' + number + ' yellow');
    tableColor = 'yellow';
  }
  if (tableCard.classList.contains('green-card')) {
    console.log('Emitting card: ' + number + ' green');
    tableColor = 'green';
  }
  if (tableCard.classList.contains('red-card')) {
    console.log('Emitting card: ' + number + ' red');
    tableColor = 'red';
  }

  if (tableColor === color || tableNumber === number) {
      console.log('Table Number not if: ' + tableNumber);
    console.log('Table Color not if: ' + color);
    socket.emit('play', [number, color]);
  } else {
    console.log('Card play invalid....');
    makeOverlay = document.createElement('div'); //Makeing the div
    makeOverlay.setAttribute("class", "banner"); //add class to this overlay div
    topLevel.appendChild(makeOverlay); //Appending dark overlay on table
    overlayTag = document.createElement('h2');
    overlayText = document.createTextNode('The card is not valid! Please try again...');
    overlayTag.appendChild(overlayText);
    overlayTag.setAttribute("style", "color: rgb(255,255,255);position: absolute;padding-top: 3px;left: 50%;transform: translate(-50%, -50%);");
    makeOverlay.appendChild(overlayTag);
  }
}, false);

drawBtn.addEventListener('click', function(){
  socket.emit('play', 'Draw Card');
}, false);

socket.on('connect', function () {
  console.log('Connected!');
});

socket.on('cards', function (data) { //When server sends players deck we will need to redraw the players deck.
  console.log('Player Deck:' + data);
  //Wipe 'table' of all Player stats and cards.
  while (playerHand.hasChildNodes()) { //Check to see if we need to clean the table and reset....
    playerHand.removeChild(playerHand.lastChild);
  }
  while (twoCard.hasChildNodes()) {
    twoCard.removeChild(twoCard.lastChild);
  }
  while (threeCard.hasChildNodes()) {
    threeCard.removeChild(threeCard.lastChild);
  }
  while (fourCard.hasChildNodes()) {
    fourCard.removeChild(fourCard.lastChild);
  }
  //Get players hand of cards.
  cardCount = data.length;
  console.log(data);
  console.log('Players deck counted: ' + cardCount);
  for (var i = 0; i < cardCount; i++) {
    var makeCard = document.createElement('div'); //Make card div for webpage
    var cardColor = data[i].color;
    makeCard.setAttribute("class", cardColor + "-card"); //add class to this for the colors.
    var cardNum = document.createElement('p'); //Creates p tag for div with card number
    var pText = document.createTextNode(data[i].number); //This is the number of the Ein card
    cardNum.appendChild(pText); //getting text for p tag <p>1</p>
    makeCard.appendChild(cardNum); //appending p tag to card div <div><p>1</p></div>
    playerHand.appendChild(makeCard); //Placing card in the players hand
  }

});

socket.on('table', function (data) { //When server sends current card on table, we will need to update the card on the table.
  console.log('Table:' + data);
  console.log('Color: ' + data.color);
  console.log('Number: ' + data.number);
  //console.log('Number: ' + card.["number"]);
  while (tableCard.hasChildNodes()) { //Go ahead and remove the number on the table card so we can repopulate it.
    tableCard.removeChild(tableCard.lastChild);
  }
  tableCard.setAttribute("class", data.color + "-card center-block");
  var tableNum = document.createElement('p');
  var tableText = document.createTextNode(data.number);
  tableNum.appendChild(tableText);
  tableCard.appendChild(tableNum);
});

socket.on('status', function (data) { //When we get a new status, such as the playerid (if playerID matches client then announce to player its their turn)
  console.log('Status / Whose turn it is: ' + data);
  console.log('My id is: ' + socket.id);

  var topLevel = document.getElementById('table-top'),
  oldOverlay = document.getElementsByClassName('overlay'),
  oldBanner = document.getElementsByClassName('banner'),
  socketID = '/#' + socket.id,
  makeOverlay,
  overlayTag,
  overlayText;

  while (oldOverlay[0]) {
    oldOverlay[0].parentNode.removeChild(oldOverlay[0]);
  }

  while (oldBanner[0]) {
    oldBanner[0].parentNode.removeChild(oldBanner[0]);
  }

  console.log(socketID);

  switch (data) {
  case socketID:
    //When it is my turn, then...
    socketID = data;
    console.log('Got status in switch for it being my turn.');
    makeOverlay = document.createElement('div'); //Makeing the div
    makeOverlay.setAttribute("class", "banner"); //add class to this overlay div
    topLevel.appendChild(makeOverlay); //Appending dark overlay on table
    overlayTag = document.createElement('h2');
    overlayText = document.createTextNode('Its your turn!');
    overlayTag.appendChild(overlayText);
    overlayTag.setAttribute("style", "color: rgb(255,255,255);position: absolute;padding-top: 3px;left: 50%;transform: translate(-50%, -50%);");
    makeOverlay.appendChild(overlayTag);
    break;
  case 'Waiting for Players':
    //When we are waiting for other players to join the game
    makeOverlay = document.createElement('div'); //Makeing the div
    makeOverlay.setAttribute("class", "overlay"); //add class to this overlay div
    topLevel.appendChild(makeOverlay); //Appending dark overlay on table
    overlayTag = document.createElement('h2');
    overlayText = document.createTextNode('Waiting for other players to join the game...');
    overlayTag.appendChild(overlayText);
    overlayTag.setAttribute("style", "color: rgb(255,255,255);position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);");
    var loadingCard = document.createElement('div');
    loadingCard.setAttribute("class", "loading-card");
    makeOverlay.appendChild(overlayTag);
    makeOverlay.appendChild(loadingCard);
    console.log('Got status in switch for waiting for players');
    break;
  case 'Game in Session':
    //Status for game starting, have a little animation with party streamers
    makeOverlay = document.createElement('div'); //Makeing the div
    makeOverlay.setAttribute("class", "overlay"); //add class to this overlay div
    topLevel.appendChild(makeOverlay); //Appending dark overlay on table
    overlayTag = document.createElement('h2');
    overlayText = document.createTextNode('The game has started!!! We need party streamers!!!');
    overlayTag.appendChild(overlayText);
    overlayTag.setAttribute("style", "color: rgb(255,255,255);position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);");
    makeOverlay.appendChild(overlayTag);
    console.log('Got status in switch for Game in session');
    break;
  case 'You Won':
    makeOverlay = document.createElement('div'); //Makeing the div
    makeOverlay.setAttribute("class", "overlay"); //add class to this overlay div
    topLevel.appendChild(makeOverlay); //Appending dark overlay on table
    overlayTag = document.createElement('h2');
    overlayText = document.createTextNode('Congratulations you won!');
    overlayTag.appendChild(overlayText);
    overlayTag.setAttribute("style", "color: rgb(255,255,255);position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);");
    makeOverlay.appendChild(overlayTag);
    break;
  case 'You Lost':
    makeOverlay = document.createElement('div'); //Makeing the div
    makeOverlay.setAttribute("class", "overlay"); //add class to this overlay div
    topLevel.appendChild(makeOverlay); //Appending dark overlay on table
    overlayTag = document.createElement('h2');
    overlayText = document.createTextNode('Game Over! You Lost...');
    overlayTag.appendChild(overlayText);
    overlayTag.setAttribute("style", "color: rgb(255,255,255);position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);");
    makeOverlay.appendChild(overlayTag);
    console.log('We got the status you have lost :-(');
    break;
  default:
    //When its not my ID and not a general game status, we assume its someone else turn,, waiting for other players to take their turn
    makeOverlay = document.createElement('div'); //Makeing the div
    makeOverlay.setAttribute("class", "overlay"); //add class to this overlay div
    topLevel.appendChild(makeOverlay); //Appending dark overlay on table
    overlayTag = document.createElement('h2');
    overlayText = document.createTextNode('Someone is taking their turn... Please wait...');
    overlayTag.appendChild(overlayText);
    overlayTag.setAttribute("style", "color: rgb(255,255,255);position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);");
    makeOverlay.appendChild(overlayTag);
    console.log('Got status in switch for waiting for players');
    console.log('Got status in switch for something... guess its not my turn :-(');
    break;
}
});


