var map;

function initialize() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(drawMap);
  }
  function drawMap(pos) {
    var geo = pos.coords;
    var myLatlng = new google.maps.LatLng(geo.latitude, geo.longitude);
    map = new google.maps.Map(document.getElementById('map'), {
          center: myLatlng,
          zoom: 11,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });
    new google.maps.Marker({ //Add a marker for current location
      position: myLatlng,
      map: map,
      title: 'Hello World!'
    });
  }
}

//Get table data for the scores from database
function getData(url) {
  var xhr = new XMLHttpRequest(); // a new request
  xhr.open("GET",url,false);
  xhr.send(null);
  return JSON.parse(xhr.responseText);
}


var xhr = getData('/data');
scoreBoard(xhr);

function scoreBoard(data) {
  for (var i = 0; i < data.length || i < 4; i++) {
    var table = document.getElementById('jsMongo'),
    makeTr = document.createElement('tr'),
    nameTd = document.createElement('td'),
    scoreTd = document.createElement('td'),
    name = document.createTextNode(data[i].name),
    score = document.createTextNode(data[i].score);

    nameTd.appendChild(name);
    scoreTd.appendChild(score);
    makeTr.appendChild(nameTd);
    makeTr.appendChild(scoreTd);
    table.appendChild(makeTr);
  }
}