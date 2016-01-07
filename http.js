var express = require('express'),
app = express(),
port = '8080',
http = require('http').Server(app),
io = require('socket.io')(http),
bodyParser = require('body-parser');

var playCard = {
  game: [{session:'Waiting for Players', turn: 0}],
  table: [{number:'2', color:'blue'}],
  players: [
  {
    id: 99,
    cards: [
    {number: '1', color: 'blue'},
    {number: '1', color: 'red'},
    {number: '1', color: 'yellow'},
    {number: '1', color: 'green'},
    {number: '1', color: 'green'},
    {number: '1', color: 'yellow'},
    {number: '1', color: 'green'}
    ]
  },
  {
    id: 99,
    cards: [
    {number: '2', color: 'red'},
    {number: '2', color: 'red'},
    {number: '2', color: 'yellow'},
    {number: '2', color: 'green'},
    {number: '2', color: 'green'},
    {number: '2', color: 'yellow'},
    {number: '2', color: 'blue'}
    ]
  },
  {
    id: 99,
    cards: [
    {number: '3', color: 'yellow'},
    {number: '3', color: 'red'},
    {number: '3', color: 'yellow'},
    {number: '3', color: 'green'},
    {number: '3', color: 'green'},
    {number: '3', color: 'yellow'},
    {number: '3', color: 'blue'}
    ]
  },
  {
    id: 99,
    cards: [
    {number: '4', color: 'blue'},
    {number: '4', color: 'red'},
    {number: '4', color: 'yellow'},
    {number: '4', color: 'green'},
    {number: '4', color: 'green'},
    {number: '4', color: 'yellow'},
    {number: '4', color: 'blue'}
    ]
  }
  ]
};

app.use(bodyParser.urlencoded({extended: false}));

app.use('/', express.static('public')); //ROUTE the /public

io.on('connection', function (socket) { //'connection' only runs on the client connection.... as long as client does not refresh should be okay.
  var i;
  console.log('It appears someone activated the socket: ' + socket.id);
  socket.emit('status', playCard.game[0].session);
  //For loop to assign ID a deck or send game status to players if Game in Session
  if (playCard.game[0].session === 'Waiting for Players') {
    for (i = 0; i < playCard.players.length; i++) {
      if (i === 3) { //Checking if all player slots are filled, need this before break
        var turn = playCard.game[0].turn;
        playCard.game[0].session = 'Game in Session'; //Every update game.js will redraw table
        io.emit('status', 'Game in Session');  //Client screen will go 'yay! game started'
        //Timeout for a second so the clients have a chance to show that game has started....
        setTimeout(function(){
          io.emit('table', playCard.table[0]); //Send table card data to client to populate current card.
          io.emit('status', playCard.players[turn].id); //Client will check to see if the id matches themselves and annonce if its their turn or not
          console.log('The game has started and its ' + playCard.players[turn].id + ' turn.');
        }.bind(undefined, 10), 3000);
      }
      if (playCard.players[i].id === 99) {
        playCard.players[i].id = socket.id;
        console.log('Player ' + socket.id + ' has joined the current game session. ' +  playCard.players[i].id);
        socket.emit('cards', playCard.players[i].cards);
        break;
      }
    }
  }
  else { //Game is full, see if game is over and reset game for new one if needed.
    for (i = 0; i < playCard.players.length; i++) {
      if (playCard.players[i].length === 0) {
        playCard.game[0].session = 'Game End';
      }
    }
    if (playCard.game[0].session === 'Game End') {
      for (i = 0; i < playCard.players.length; i++) {
        playCard.players[i].id = 99;
      }
    }
    socket.emit('status', 'Game is full'); //Send private message to the fifth client joining saying the game is full
  }
  socket.on("play", function (data) { //GETTING CARD GAME PLAY HERE
    console.log('Got a play from: ' + socket.id + ' for the data: ' + data[0] + ' and ' + data[1]); //data0 is the number on card and data1 is the color
    var turn = playCard.game[0].turn;  //define the turn we are on to associate socket.id
    var playerTurn = playCard.players[turn].id; // get player turn socket.id
    if (socket.id === playerTurn) { //verify incoming data is only from player with their turn.
      //Basically, check if the incomming card is valid in players deck and remove card from their deck
      for (i = 0; i < playCard.players[turn].cards.length; i++) { //Counting cards, running loop for length of cards in players deck
        if (playCard.players[turn].cards[i].number === data[0] && playCard.players[turn].cards[i].color === data[1]) { //Checking if card is valid in players deck
          if (data[0] === playCard.table[0].number || data[1] === playCard.table[0].color) { //Checking if card is valid for the table play
            playCard.table[0].number = data[0];
            playCard.table[0].color = data[1];
            playCard.players[turn].cards.splice(i, 1);
            //delete playCard.players[turn].cards[i];
            console.log(playCard.players[turn].cards);
            socket.emit('cards', playCard.players[turn].cards);
            playCard.game[0].turn++;
            turn = playCard.game[0].turn;
            playerTurn = playCard.players[turn].id;
          }
        }
      }
    }
    io.emit('status', playerTurn); // If this then resend data to clients saying whose turn it is to active eventlistener to stop incorrect players playing
    io.emit('table', playCard.table[0]); //Since play was made, resend the current card on table to players to see current card
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});