var playerHand = document.getElementById('player-hand'),
  submitBtn = document.getElementById('play-btn'),
  drawBtn = document.getElementById('drawcard-btn'),
  twoCard = document.getElementById('player-two'),
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
  bannerOverlay = document.createElement('div');
  bannerOverlay.setAttribute("class", "banner");
  topLevel.appendChild(bannerOverlay);
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
  makeOverlay = document.createElement('div');
  newContent = document.createElement('div');
  makeOverlay.setAttribute("class", "overlay");
  newContent.setAttribute('id', 'overlay-content');
  contentTag = document.createElement('h2');
  contentText = document.createTextNode(msg);
  contentTag.appendChild(contentText);
  newContent.appendChild(contentTag);
  makeOverlay.appendChild(newContent);
  topLevel.appendChild(makeOverlay);
}

function selectCard(e) {
  if (e.target !== e.currentTarget) {
    if (e.target.nodeName === 'P') {
      cardSelect = e.target.parentElement;
    } else {
      cardSelect = e.target;
    }
    var checkMark = document.getElementsByClassName('selected-card');
    while (checkMark[0]) {
      checkMark[0].parentNode.removeChild(checkMark[0]);
    }
    //When card is clicked, add class that will show a checkmark.
    var makeCheck = document.createElement('div');
    makeCheck.setAttribute("class", "selected-card");
    cardSelect.appendChild(makeCheck);
  }
  e.stopPropagation();
}

let gameId;

function sendEmit(name, data) {
  socket.emit(name, data)
}

playerHand.addEventListener("click", selectCard, false);

submitBtn.addEventListener('click', function() {
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
    sendEmit('play', [number, color]);
  } else {
    newBanner('The card is not valid! Please try again...');
  }
}, false);

drawBtn.addEventListener('click', function() {
  sendEmit('play', 'Draw Card');
}, false);

socket.on('connect', function() {
  console.log(socket.id)
  const gameId = localStorage.getItem('gameId')
  const playerId = localStorage.getItem('playerId')
  if ( gameId && playerId ) {
    sendEmit('rejoining', {gameId, playerId})
  }
  console.log('Connected!');
});

socket.on('cards', function(data) { // Deal the users deck
  console.log('Player Deck:' + data);
  while (playerHand.hasChildNodes()) {
    playerHand.removeChild(playerHand.lastChild);
  }
  while (twoCard.hasChildNodes()) {
    twoCard.removeChild(twoCard.lastChild);
  }
  // while (threeCard.hasChildNodes()) {
  //   threeCard.removeChild(threeCard.lastChild);
  // }
  // while (fourCard.hasChildNodes()) {
  //   fourCard.removeChild(fourCard.lastChild);
  // }
  //Get players hand of cards.
  cardCount = data.length;
  console.log(data);
  console.log('Players deck counted: ' + cardCount);
  for (var i = 0; i < cardCount; i++) {
    var makeCard = document.createElement('div');
    var cardColor = data[i].color;
    makeCard.setAttribute("class", cardColor + "-card");
    var cardNum = document.createElement('p');
    var pText = document.createTextNode(data[i].number);
    cardNum.appendChild(pText);
    makeCard.appendChild(cardNum);
    playerHand.appendChild(makeCard);
  }

});

socket.on('table', function(data) { // Deal first card to table
  while (tableCard.hasChildNodes()) {
    tableCard.removeChild(tableCard.lastChild);
  }
  tableCard.setAttribute("class", data.color + "-card center-block");
  var tableNum = document.createElement('p');
  var tableText = document.createTextNode(data.number);
  tableNum.appendChild(tableText);
  tableCard.appendChild(tableNum);
});

socket.on('game', function(data) {
  localStorage.setItem('gameId', data.gameId);
  localStorage.setItem('playerId', data.id);
  
})

socket.on('debug', (data) => {
  console.log(`DEBUGWS: ${JSON.stringify(data, null, 2)}`)
})

socket.on('status', function(data) {
  var topLevel = document.getElementById('table-top'),
    makeOverlay,
    overlayTag,
    overlay,
    overlayText,
    home,
    homeA;

  switch (data) {
    case socket.id:
      newBanner('Its your turn!');
      break;
    case 'Waiting for Players':
      newOverlay('Waiting for other players to join the game...');
      overlay = document.getElementById('overlay-content');
      var loadingCard = document.createElement('div');
      loadingCard.setAttribute("class", "loading-card");
      overlay.appendChild(loadingCard);
      break;
    case 'Game in Session': // we need to set gameId here///
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
      submitScore.addEventListener('click', function() {
        var xhr = new XMLHttpRequest();
        var value = document.getElementsByTagName('input')[0].value;
        var name = [value, 'Name'];
        xhr.open("POST", "/data-submit", true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        formSend = JSON.stringify(name);
        xhr.send(formSend);
        newOverlay('Score Submitted!');
        window.setTimeout(function() {
          window.location = "/";
        }, 1500);

      }, false);
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
    case 'Player Disconnected':
      newOverlay('Player Disconnected, game over!');
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
      newOverlay('Someone is taking their turn... Please wait...');
      break;
  }
});
