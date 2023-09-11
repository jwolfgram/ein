var map,
mapModal = document.getElementById('playersOnMap');

function initialize() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(drawMap);
  }
  function drawMap(pos) {
    var geo = pos.coords;
    myLatlng = new google.maps.LatLng(geo.latitude, geo.longitude);
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

//mapModal.addEventListener("click", initialize(), false);
mapModal.addEventListener("click", function() {
  console.log('MODAL');
  initialize();
}, false);

fetch('/data').then((data) => data.json()).then((res) => {
  scoreBoard(res);
});

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