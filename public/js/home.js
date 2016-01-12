var newBtn = document.getElementById('new-game'),
map,
joinBtn = document.getElementById('join-game'),
overview = document.getElementById('info-overview'),
howPlay = document.getElementById('info-howtoplay'),
tips = document.getElementById('info-tips'),
tabOverview = document.getElementById('tab-overview'),
tabhowPlay = document.getElementById('tab-howtoplay'),
tabTips = document.getElementById('tab-tips');

//Overview, How to Play, Tips selector
overview.addEventListener('click', function(){
  tabOverview.setAttribute('class', '');
  tabhowPlay.setAttribute('class', 'hidden');
  tabTips.setAttribute('class', 'hidden');
  overview.setAttribute('class', 'active');
  howPlay.setAttribute('class', '');
  tips.setAttribute('class', '');
}, false);

howPlay.addEventListener('click', function(){
  tabhowPlay.setAttribute('class', '');
  tabOverview.setAttribute('class', 'hidden');
  tabTips.setAttribute('class', 'hidden');
  overview.setAttribute('class', '');
  howPlay.setAttribute('class', 'active');
  tips.setAttribute('class', '');
}, false);

tips.addEventListener('click', function(){
  tabTips.setAttribute('class', '');
  tabhowPlay.setAttribute('class', 'hidden');
  tabOverview.setAttribute('class', 'hidden');
  overview.setAttribute('class', '');
  howPlay.setAttribute('class', '');
  tips.setAttribute('class', 'active');
}, false);

//Google Maps
function initialize() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(drawMap);
  }
  function drawMap(pos) {
    var geo = pos.coords;
    console.log(pos.coords);
    var myLatlng = new google.maps.LatLng(geo.latitude, geo.longitude);
    var mapCanvas = document.getElementById('map');
    var mapOptions = {
      center: new google.maps.LatLng(33.6839, -117.7946),
      zoom: 11,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      scrollwheel: false
    };
    var map = new google.maps.Map(mapCanvas, mapOptions);
    new google.maps.Marker({ //Literally all we need to do to add more markers is repeat lines 56 - 60
      position: myLatlng,
      map: map,
      title: 'Hello World!'
    });
  }
}

google.maps.event.addDomListener(window, 'load', initialize);