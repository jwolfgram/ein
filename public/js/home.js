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
    navigator.geolocation.getCurrentPosition(initialize);
  }
  var mapCanvas = document.getElementById('map');
  var mapOptions = {
    center: new google.maps.LatLng(33.6839, -117.7946),
    zoom: 10,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    scrollwheel: false
  };
  var map = new google.maps.Map(mapCanvas, mapOptions);
  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    title: 'Hello World!'
  });
  }
  google.maps.event.addDomListener(window, 'load', initialize);