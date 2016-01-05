var xhr = new XMLHttpRequest(),
playerHand = document.getElementById('player-hand'),
submitBtn = document.getElementById('play-btn'),
twoCard = document.getElementById('player-two'),
threeCard = document.getElementById('player-three'),
fourCard = document.getElementById('player-four'),
tableCard = document.getElementById('playing-card'),
game,
player,
socket = io.connect('http://localhost:8080');

socket.on('connect', function () {
    console.log('Connected!');
});

socket.on('cards', function (data) { //When server sends players deck we will need to redraw the players deck.
  console.log('Player Deck:' + data);
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