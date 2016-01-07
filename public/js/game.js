var xhr = new XMLHttpRequest(),
playerHand = document.getElementById('player-hand'),
submitBtn = document.getElementById('play-btn'),
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
  var number = cardSelect.textContent;
  var turnPlayed;

  //test.emit('play', [number, "blue"]);

  if (cardSelect.classList.contains('blue-card')) {
    console.log('Emitting card: ' + number + ' blue');
    socket.emit('play', [number, "blue"]);
  }
  if (cardSelect.classList.contains('yellow-card')) {
    console.log('Emitting card: ' + number + ' yellow');
    socket.emit('play', [number, "yellow"]);
  }
  if (cardSelect.classList.contains('green-card')) {
    console.log('Emitting card: ' + number + ' green');
    socket.emit('play', [number, "green"]);
  }
  if (cardSelect.classList.contains('red-card')) {
    console.log('Emitting card: ' + number + ' red');
    socket.emit('play', [number, "red"]);
  }
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
  console.log('Status / Whose turn it is:' + data);
  console.log('My id is: ' + socket.id);
});