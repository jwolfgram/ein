var express = require('express'),
app = express(),
port = '8080',
io = require('socket.io')(),
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
    {number: '2', color: 'green'},
    {number: '1', color: 'green'},
    {number: '1', color: 'yellow'},
    {number: '3', color: 'blue'}
    ]
  },
  {
    id: 99,
    cards: [
    {number: '', color: ''},
    {number: '', color: ''}
    ]
  },
  {
    id: 99,
    cards: [
    {number: '', color: ''},
    {number: '', color: ''},
    {number: '', color: ''}
    ]
  },
  {
    id: 99,
    cards: [
    {number: '', color: ''},
    {number: '', color: ''},
    {number: '', color: ''},
    {number: '', color: ''}
    ]
  }
  ]
};

app.use(bodyParser.urlencoded({extended: false}));

app.use('/', express.static('public')); //ROUTE the /web

io.listen(app.listen(port));

io.on('connection', function (socket) {
  var i;
  console.log('It appears someone activated the socket: ' + socket.id);
  socket.emit('status', playCard.game[0].session);
  //For loop to assign ID a deck or send game status to players if Game in Session
  if (playCard.game[0].session === 'Waiting for Players') {
    for (i = 0; i < playCard.players.length; i++) {
      if (i === 3) { //Checking if all player slots are filled, need this before break
        playCard.game[0].session = 'Game in Session'; //Every update game.js will redraw table
        socket.emit('status', 'Game in Session');
        console.log('Assigned Game in Session status');
      }
      if (playCard.players[i].id === socket.id) { //Check if existing player connected for status update
        socket.emit('status', playCard.game[0].session);
      }
      else {
        if (playCard.players[i].id === 99) {
          playCard.players[i].id = socket.id;
          console.log('Player ' + socket.id + ' has joined and been loggged... ' +  playCard.players[i].id);
          break;
        }
      }
    }
  }
  else { //Lets check to make sure game is really in session....
    if (playCard.game[0].session === 'Game in Session') {
      var turn = playCard.game[0].turn;
      var sessionID = playCard.players[turn].id;
      socket.emit('table', playCard.table[0]);
      if (socket.id === sessionID) {
        socket.emit('cards', playCard.players[turn].cards);
        playCard.game[0].turn++;
      }
      else {
        socket.emit('status', 'Player: ' + turn + ' turn.'); // If this happens hopefully client will respond and not allow plays
      }
    }
  }
});

console.log(port + ' is the port your webserver is running on.');