var express = require('express'),
app = express(),
//path = require('path'),
port = '8080',
bodyParser = require('body-parser');

var playCard = {
  game: [{player:'0',session:'inGame', whoami:'0'}],
  table: [{number:'2', color:'blue'}],
  players: [
  {
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
    cards: [
    {number: '', color: ''},
    {number: '', color: ''}
    ]
  },
  {
    cards: [
    {number: '', color: ''},
    {number: '', color: ''},
    {number: '', color: ''}
    ]
  },
  {
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

app.get('/game-state', function(req, res) {
  var send = playCard.game[0].whoami;
  res.send(String(send));
  res.status(200);
  console.log('New player: ' + playCard.game[0].whoami);
  send++;
  if (send == 4) {
    send = 0;
    playCard.game[0].session = 'inGame';
  }
  playCard.game[0].whoami = send;
});

app.get('/game-state/:id', function(req, res) {
  var gameState = playCard;
  gameState.game[0].whoami = req.params.id;
  console.log('Whoami: ' + gameState.players[0].cards);
  res.send(gameState);
  //case structure in here for game id for players cards. change game.whoami to player number then send to player
  console.log('We send data requested for game state');
  //next();
});

app.use('/', express.static('public')); //ROUTE the /web

app.post('/game-turn', bodyParser.json(), function (req, res) {
  res.status(200);
  if (playCard.game[0].session == 'inGame') {
    var turnTaken = JSON.stringify(req.body, null, 2);
    console.log('We got a play... ' + turnTaken);
    turnTaken = JSON.parse(turnTaken);
    var player = turnTaken[2];
    var number = turnTaken[0];
    var color = turnTaken[1];
    console.log(playCard.game[0].player);
    console.log('here we go....' + playCard.players[player].cards.length);
    if (playCard.game[0].player[player] == player) {
      //playCard.game[0].player++;
      for (var i = 0;i < playCard.players[player].cards.length; i++) { //counting cards and running loop for only that long.
        console.log('Loop #.' + i);
        //console.log(playCard);
        if (playCard.players[player].cards[i].number == number && playCard.players[player].cards[i].color == color) {
          console.log('Either the number matched or the color matched for their deck' + playCard.players[player].cards[i].number + number + playCard.players[player].cards[i].color + color);
          if (number == playCard.table[0].number || color == playCard.table[0].color) { // In here we need to remove player card and play the card on the deck.
            playCard.table[0].number = number;
            playCard.table[0].color = color;
            delete playCard.players[player].cards[i];
            console.log('Player Cards: ' + playCard.players[player].cards);
          }
          else {
            console.log('Card would not hve aplay :(');
          }
        }
      }
    }
    else {
      console.log('Player is not valid :-/ or card is invalid... i think: ' + playCard.game[0].player + ':::' + player);
    }
  }
});

app.listen(port);
console.log(port + ' is the port your webserver is running on.');