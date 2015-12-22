var express = require('express'),
app = express(),
path = require('path'),
port = '8080',
bodyParser = require('body-parser');

var playCard = {
  table: [{number:'2', color:'blue', player:'0'}],
  players: [
  {
    id: 1,
    cards: [
      {number: '1', color: 'blue'},
      {number: '1', color: 'red'},
      {number: '1', color: 'yellow'},
      {number: '1', color: 'green'},
      {number: '1', color: 'green'},
      {number: '1', color: 'yellow'},
      {number: '2', color: 'blue'}
    ]
  },
  {
        id: 2,
    cards: [
      {number: '', color: ''},
      {number: '', color: ''}
    ]
  },
  {
    id: 3,
    cards: [
      {number: '', color: ''},
      {number: '', color: ''},
      {number: '', color: ''}
    ]
  },
  {
    id: 4,
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
  res.send(playCard);
  console.log('We send data requested for game state');
  //next();
});

app.use('/', express.static('public')); //ROUTE the /web

app.post('/game-turn', bodyParser.json(), function (req, res) {
  var turnTaken = JSON.stringify(req.body, null, 2);
  console.log('We got a play... ' + turnTaken);
  turnTaken = JSON.parse(turnTaken);
  var player = turnTaken[2];
  var number = turnTaken[0];
  var color = turnTaken[1];
  console.log('here we go....' + playCard.players[player].cards.length);
  if (playCard.table[0].player == player) {
    playCard.table[0].player++;
   for (var i = 0;i < playCard.players[player].cards.length; i++) { //counting cards and running loop for only that long.
    console.log('Loop #.' + i);
    //console.log(playCard);
    if (playCard.players[player].cards[i].number == number || playCard.players[player].cards[i].color == color) {
      if (number == playCard.table[0].number || color == playCard.table[0].color) { // In here we need to remove player card and play the card on the deck.
        playCard.table[0].number = number;
        playCard.table[0].color = color;
        delete playCard.players[player].cards[i].color;
        //delete playCard.players[player].cards[i].number;
        console.log(playCard);
      }
      else {
        console.log('Card would not hve aplay :(');
      }
    }
  }
}
else {
  console.log('Player is not valid :-/');
}
});

app.listen(port);
console.log(port + ' is the port your webserver is running on.');