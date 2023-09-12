var express = require('express'),
  app = express(),
  port = process.env.PORT || '8080',
  rounds = 0,
  http = require('http').Server(app),
  io = require('socket.io')(http),
  mongoose = require('mongoose'),
  db = mongoose.connection;

const { v4 } = require('uuid')


mongoose.connect('mongodb://127.0.0.1/eins');

var game = {
  // game:     {
  //   session: 'Waiting for Players',
  //   turn: 0,
  // table: [],
  // players: [
  //   {
  //     id: 99,
  //     cards: []
  //   }, {
  //     id: 99,
  //     cards: []
  //   }, {
  //     id: 99,
  //     cards: []
  //   }, {
  //     id: 99,
  //     cards: []
  //   }
  // ]

};
function drawCard(times = 1) {
  const makeCard = () => {
    var ranNumber = Math.floor(Math.random() * 9) + 1,
      ranColor = Math.floor(Math.random() * 4) + 1

    switch (ranColor) {
      case 1:  // Blue
        return {
          number: ranNumber.toString(),
          color: 'blue'
        }

      case 2: //Color Red
        return {
          number: ranNumber.toString(),
          color: 'red'
        }

      case 3: //Color Green
        return {
          number: ranNumber.toString(),
          color: 'green'
        }

      case 4: //Color Yellow
        return {
          number: ranNumber.toString(),
          color: 'yellow'
        }
    }
  }
  let deck = []
  for (let i = 0; i < parseInt(times, 10); i++) {
    deck.push(makeCard())
  }

  if (deck.length === 1) {
    return deck[0]
  }
  return deck;
}

function makeGame(game) {
  let players = []
  let table = []
  table.unshift(drawCard());

  console.log('Generated players cards and the table card for game to start....');
  const gId = v4()
  game[gId] = {
    players,
    session: 'Waiting for Players',
    turn: 0,
    table
  }
  return gId
}

const gameBroadcast = (session, key, val) => {
  session.players.forEach((player) => {
    player.socket.emit(key, val)
  })
}

io.on('connection', function (socket) {
  console.log('It appears someone activated the web socket (new user): ' + socket.id);
  socket.on('disconnect', function (data) {
    console.log(data)
    console.log('Player disconnected');
    // wait for 30 seconds and if game is not rejoined with all players, delete game
  });
  let gId;

  const gameIterable = Object.entries(game)
  for (let i = 0; i < gameIterable.length; i++) {
    for (let z = 0; z < gameIterable[i][1].players.length; z++) {
      if (gameIterable[i][1].players[z].id  === socket.id) {
        gameIterable[i][1].players[z].socket = socket;
        gId = gameIterable[i][0]
        socket.emit('game', {gameId: gameIterable[i][0], ...gameIterable[i][1].players[z]});
      }
      socket.emit('cards', gameIterable[i][1].players[z].cards)
    }
  }

  for (const [sessionId, session] of Object.entries(game)) {
    if (session.players.length < 2) {
      gId = sessionId;
      session.players.push({
        socket,
        id: socket.id,
        cards: drawCard(7)
      })
    }
  }

  if (!gId) {
    gId = makeGame(game)
    game[gId].players.push({
      socket,
      id: socket.id,
      cards: drawCard(7)
    })
  }

  if (game[gId].session === 'Waiting for Players' && game[gId].players.length === 2) {
    gameBroadcast(game[gId], 'status', 'Game in Session');
    var turn = game[gId].turn;
    setTimeout(function() {
      gameBroadcast(game[gId], 'table', game[gId].table[0]);
      gameBroadcast(game[gId], 'status', game[gId].players[turn].id);
      console.log('The game has started and its ' + game[gId].players[turn].id + ' turn.');
    }.bind(undefined, 10), 1000);
    game[gId].session = 'Game in Session';
  }
  
  game[gId].players.forEach((player) => {
    player.socket.emit('cards', player.cards)
    player.socket.emit('status', 'Game in Session');
  })

  socket.on('rejoin' , (data) => {
    game[data.gameId].player[data.playerId].socket = socket;
    game[data.gameId].player[data.playerId].id = socket.id;
  })
  socket.on("play", function (data) {
    var turn = game[gId].turn;
    if (socket.id === game[gId].players[turn].id) {
      if (data === 'Draw Card') {
        var deckCount = game[gId].players[turn].cards.length - 1,
          newCard = drawCard();
          game[gId].players[turn].cards.push(newCard);
        socket.emit('cards', game[gId].players[turn].cards);
      } else {
        console.log('Got a play from: ' + socket.id + ' for the data: ' + data[0] + ' and ' + data[1]);
        for (let i = 0; i <= ((game[gId].players[turn].cards.length) - 1); i++) {
          if (game[gId].players[turn].cards[i].number === data[0] && game[gId].players[turn].cards[i].color === data[1]) {
            if (data[0] === game[gId].table[0].number || data[1] === game[gId].table[0].color) {
              game[gId].table.unshift({
                number: data[0],
                color: data[1]
              })
              game[gId].players[turn].cards.splice(i, 1);
              socket.emit('cards', game[gId].players[turn].cards);
              if (game[gId].players[turn].cards.length === 0) {
                socket.emit('status', 'You Won');
                const playerLost = game[gId].players.find((player) => player.id !== socket.id)
                playerLost.socket.emit('status', 'You Lost')
                delete game[gId]
              } else {
                game[gId].turn = game[gId].turn === 0 ? 1 : 0
                gameBroadcast(game[gId], 'status', game[gId].players[game[gId].turn].id);
                gameBroadcast(game[gId], 'table', game[gId].table[0]);
              }
              break;
            }
          }
        }
      }
    }
  });
});

/*Data for database to recover players scores*/
var schema = mongoose.Schema({ name: String, score: String });
var score = mongoose.model('eins', schema);

app.get('/data', function (req, res) {
  score.find({}).then((docs) => {
    res.send(docs);
  });
});

app.post('/data-submit', express.json(), function (req, res) {
  new score({ name: req.body[0], score: rounds }).save();
  rounds = 0;
});

app.use('/', express.static('public'));

http.listen(port, function () {
  console.log('listening on *:' + port);
});
