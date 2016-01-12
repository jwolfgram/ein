var playerHand = document.getElementById('player-hand'),
submitBtn = document.getElementById('play-btn'),
drawBtn = document.getElementById('drawcard-btn'),
twoCard = document.getElementById('player-two'),
threeCard = document.getElementById('player-three'),
fourCard = document.getElementById('player-four'),
tableCard = document.getElementById('playing-card'),
game,
player,
cardSelect,
socket = io();

function newBanner(msg) {
  var oldBanner = document.getElementsByClassName('banner'),
  topLevel = document.getElementById('table-top'),
  oldOverlay = document.getElementsByClassName('overlay'),
  bannerOverlay,
  bannerTag,
  bannerText;

  while (oldBanner[0]) {
    oldBanner[0].parentNode.removeChild(oldBanner[0]);
  }
  while (oldOverlay[0]) {
    oldOverlay[0].parentNode.removeChild(oldOverlay[0]);
  }
  bannerOverlay = document.createElement('div'); //Makeing the div
  bannerOverlay.setAttribute("class", "banner"); //add class to this overlay div
  topLevel.appendChild(bannerOverlay); //Appending dark overlay on table
  overlayTag = document.createElement('h2');
  bannerText = document.createTextNode(msg);
  overlayTag.appendChild(bannerText);
  overlayTag.setAttribute("style", "color: rgb(255,255,255);position: absolute;padding-top: 3px;left: 50%;transform: translate(-50%, -50%);");
  bannerOverlay.appendChild(overlayTag);
}

function newOverlay(msg) {
  var oldBanner = document.getElementsByClassName('banner'),
  topLevel = document.getElementById('table-top'),
  oldOverlay = document.getElementsByClassName('overlay'),
  makeOverlay,
  contentTag,
  contentText;

  while (oldBanner[0]) {
    oldBanner[0].parentNode.removeChild(oldBanner[0]);
  }
  while (oldOverlay[0]) {
    oldOverlay[0].parentNode.removeChild(oldOverlay[0]);
  }
  makeOverlay = document.createElement('div'); //Makeing the div
  newContent = document.createElement('div');
  makeOverlay.setAttribute("class", "overlay"); //add class to this overlay div
  newContent.setAttribute('id', 'overlay-content');
  contentTag = document.createElement('h2');
  contentText = document.createTextNode(msg);
  contentTag.appendChild(contentText);
  newContent.appendChild(contentTag);
  makeOverlay.appendChild(newContent);
  topLevel.appendChild(makeOverlay); //Appending dark overlay on table
}

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
  color;

  if (cardSelect.classList.contains('blue-card')) {
    color = 'blue';
  }
  if (cardSelect.classList.contains('yellow-card')) {
    color = 'yellow';
  }
  if (cardSelect.classList.contains('green-card')) {
    color = 'green';
  }
  if (cardSelect.classList.contains('red-card')) {
    color = 'red';
  }
  tableNumber = tableCard.getElementsByTagName('p')[0].textContent;
  /*Get color of table card as well */
  if (tableCard.classList.contains('blue-card')) {
    tableColor = 'blue';
  }
  if (tableCard.classList.contains('yellow-card')) {
    tableColor = 'yellow';
  }
  if (tableCard.classList.contains('green-card')) {
    tableColor = 'green';
  }
  if (tableCard.classList.contains('red-card')) {
    tableColor = 'red';
  }

  if (tableColor === color || tableNumber === number) {
    console.log('Table Number not if: ' + tableNumber);
    console.log('Table Color not if: ' + color);
    socket.emit('play', [number, color]);
  } else {
    newBanner('The card is not valid! Please try again...');
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
  socketID = '/#' + socket.id,
  makeOverlay,
  overlayTag,
  overlay,
  overlayText,
  home,
  homeA;

  console.log(socketID);

  switch (data) {
    case socketID:
    //When it is my turn, then...
    console.log('Got status in switch for it being my turn.');
    newBanner('Its your turn!');
    break;
    case 'Waiting for Players':
    //When we are waiting for other players to join the game
    newOverlay('Waiting for other players to join the game...');
    overlay = document.getElementById('overlay-content');
    var loadingCard = document.createElement('div');
    loadingCard.setAttribute("class", "loading-card");
    overlay.appendChild(loadingCard);
    console.log('Got status in switch for waiting for players');
    break;
    case 'Game in Session':
      //Status for game starting, have a little animation with party streamers
      newOverlay('The game has started!!! We need party streamers!!!');
    break;
    case 'You Won':
      newOverlay('Congratulations you won!');
      overlay = document.getElementById('overlay-content');
      var winnerName = document.createElement('input');
      var submitScore = document.createElement('button');
      home = document.createElement('button');
      homeA = document.createElement('a');

      submitScore.setAttribute('class', 'btn btn-success center-block');
      home.setAttribute('class', 'btn btn-danger center-block');
      winnerName.setAttribute("class", "form-control winner-input");
      winnerName.setAttribute("placeholder", "Enter your name here!!!");
      homeA.setAttribute("href", "/");
      scoreText = document.createTextNode('Submit your score!');
      homeText = document.createTextNode('Back to home.');
      submitScore.appendChild(scoreText);
      home.appendChild(homeText);
      homeA.appendChild(home);
      overlay.appendChild(winnerName);
      overlay.appendChild(submitScore);
      overlay.appendChild(homeA);
      console.log('Got status in switch for waiting for players');
    break;
    case 'You Lost':
      newOverlay('Game Over! You Lost...');
      home = document.createElement('button');
      homeA = document.createElement('a');
      overlay = document.getElementById('overlay-content');
      homeText = document.createTextNode('Back to home.');
      home.setAttribute('class', 'btn btn-danger center-block');
      homeA.setAttribute("href", "/");
      home.appendChild(homeText);
      homeA.appendChild(home);
      overlay.appendChild(homeA);
    break;
    default:
      //When its not my ID and not a general game status, we assume its someone else turn,, waiting for other players to take their turn
      newOverlay('Someone is taking their turn... Please wait...');
    break;
  }
});