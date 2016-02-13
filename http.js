var express = require('express'),
app = express(),
port = '8080',
rounds = 0,
http = require('http').Server(app),
io = require('socket.io')(http),
mongoose = require('mongoose'),
bodyParser = require('body-parser'),
db = mongoose.connection;

mongoose.connect('mongodb://localhost/eins');

var playCard = {
  game: [{session:'Waiting for Players', turn: 0}],
  table: [],
  players: [
  {
    id: 99,
    cards: []
  },
  {
    id: 99,
    cards: []
  },
  {
    id: 99,
    cards: []
  },
  {
    id: 99,
    cards: []
  }
  ]
};

function drawCard() {
  var ranNumber = Math.floor(Math.random() * 9) + 1,
  ranColor = Math.floor(Math.random() * 4) + 1,
  result;

  switch (ranColor) {
    case 1: //Color Blue
    result = [ranNumber.toString(),'blue'];
    return result;

    case 2: //Color Red
    result = [ranNumber.toString(),'red'];
    return result;

    case 3: //Color Green
    result = [ranNumber.toString(),'green'];
    return result;

    case 4: //Color Yellow
    result = [ranNumber.toString(),'yellow'];
    return result;
  }
}

function drawDecks() {
  var newCard,
  i;
  for (i = 0; i < 4; i++) { //Length of players in game
    playCard.players[i].cards.splice(0, playCard.players[i].cards.length);
    for (var z = 0; z < 7; z++) {//Run this 7 times for players decks
      newCard = drawCard();
      playCard.players[i].cards.splice(0, 0, {number: newCard[0],color: newCard[1]});
    }
  }
  playCard.table.splice(0, 0, {number: newCard[0],color: newCard[1]});
  console.log('Generated players cards and the table card for game to start....');
}

drawDecks();

io.on('connection', function (socket) {
  var i;
  console.log('It appears someone activated the web socket (new user): ' + socket.id);
  socket.on('disconnect', function(){
    console.log('Player disconnected');
    for (i = 0; i < playCard.players.length; i++) {
      if (playCard.players[i].id === socket.id) {
        for (i = 0; i < playCard.players.length; i++) {
          playCard.players[i].id = 99;
        }
        drawDecks();
        playCard.game[0].session = 'Waiting for Players';
        io.emit('status', 'Player Disconnected');
      }
    }
  });
  socket.emit('status', playCard.game[0].session);
  if (playCard.game[0].session === 'Waiting for Players') {
    for (i = 0; i < playCard.players.length; i++) {
      if (i === 3) {
        io.emit('status', 'Game in Session');
        var turn = playCard.game[0].turn;
        setTimeout(function(){
          io.emit('table', playCard.table[0]);
          io.emit('status', playCard.players[turn].id);
          console.log('The game has started and its ' + playCard.players[turn].id + ' turn.');
        }.bind(undefined, 10), 1000);
        playCard.game[0].session = 'Game in Session';
      }
      if (playCard.players[i].id === 99) {
        playCard.players[i].id = socket.id;
        console.log('Player ' + socket.id + ' has joined the current game session.');
        socket.emit('cards', playCard.players[i].cards);
        break;
      }
    }
  }
  else {
    //If you want, we can put people in a que here.... since game is full
    socket.emit('status', 'Game is full');
  }
  socket.on("play", function (data) {
    var turn = playCard.game[0].turn;
    var playerTurn = playCard.players[turn].id;
    if (socket.id === playerTurn) {
      if (data === 'Draw Card') {
        var deckCount = playCard.players[turn].cards.length - 1,
        newCard = drawCard();
        playCard.players[turn].cards.push({number: newCard[0],color: newCard[1]});
        socket.emit('cards', playCard.players[turn].cards);
      }
      else {
        console.log('Got a play from: ' + socket.id + ' for the data: ' + data[0] + ' and ' + data[1]);
        for (i = 0; i <= ((playCard.players[turn].cards.length) - 1); i++) {
          var breakOut = 0;
          if (playCard.players[turn].cards[i].number === data[0] && playCard.players[turn].cards[i].color === data[1]) {
            if (data[0] === playCard.table[0].number || data[1] === playCard.table[0].color) {
              playCard.table[0].number = data[0];
              playCard.table[0].color = data[1];
              playCard.players[turn].cards.splice(i, 1);
              socket.emit('cards', playCard.players[turn].cards);
              breakOut = 1;
              if (playCard.game[0].turn < 3) {
                playCard.game[0].turn++;
                console.log('Incremented a turn: ' + playCard.game[0].turn);
              } else {
                rounds++;
                console.log('Reset turn counter to zero.');
                playCard.game[0].turn = 0;
              }
              if (playCard.players[turn].cards.length === 0) {
                socket.emit('status', 'You Won');
                socket.broadcast.emit('status', 'You Lost');
                playCard.game[0].session = 'Waiting for Players';
                for (i = 0; i < playCard.players.length; i++) {
                  playCard.players[i].id = 99;
                }
                drawDecks();
                console.log('We have a winner!!!');
              }
              else {
                turn = playCard.game[0].turn;
                playerTurn = playCard.players[turn].id;
                io.emit('status', playerTurn);
                io.emit('table', playCard.table[0]);
              }
            }
          }
          if (breakOut === 1) {
            break;
          }
        }
      }
    }
    //console.log('Player cards in deck:: ' + playCard.players[turn].cards.length);
  });
});

/*Data for database to recover players scores*/
var schema = mongoose.Schema({
    name: String,
    score: String
    });
var score = mongoose.model('eins', schema);

app.get('/data', function (req, res) {
  //new score({ name: 'Joe', score: '10'  }).save();
  score.find({}, function (err, docs) {
    res.send(docs);
  });
});

app.post('/data-submit', bodyParser.json(), function (req, res) {
  console.log(req.body[0]);
  console.log(rounds);
  new score({ name: req.body[0], score: rounds  }).save();
  rounds = 0;
});

app.use('/', express.static('public'));

http.listen(port, function(){
  console.log('listening on *:' + port);
});