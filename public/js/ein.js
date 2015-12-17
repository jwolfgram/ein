var newBtn = document.getElementById('new-game'),
map,
joinBtn = document.getElementById('join-game'),
overview = document.getElementById('info-overview'),
howPlay = document.getElementById('info-howtoplay'),
tips = document.getElementById('info-tips'),
tabOverview = document.getElementById('tab-overview'),
tabhowPlay = document.getElementById('tab-howtoplay'),
tabTips = document.getElementById('tab-tips');

newBtn.addEventListener('mouseover', function(){
  newBtn.setAttribute('class', 'button-hover');
  console.log('PASSED');
}, false);

joinBtn.addEventListener('click', function(){
  joinBtn.setAttribute('class', 'button-hover');
}, false);

//Overview, How to Play, Tips selector
overview.addEventListener('click', function(){
  tabOverview.setAttribute('class', '');
  tabhowPlay.setAttribute('class', 'hidden');
  tabTips.setAttribute('class', 'hidden');
}, false);

howPlay.addEventListener('click', function(){
  tabhowPlay.setAttribute('class', '');
  tabOverview.setAttribute('class', 'hidden');
  tabTips.setAttribute('class', 'hidden');
}, false);

tips.addEventListener('click', function(){
  tabTips.setAttribute('class', '');
  tabhowPlay.setAttribute('class', 'hidden');
  tabOverview.setAttribute('class', 'hidden');
}, false);

//Google Maps
function initialize() {
  var mapCanvas = document.getElementById('map');
  var mapOptions = {
    center: new google.maps.LatLng(44.5403, -78.5463),
    zoom: 8,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(mapCanvas, mapOptions);
  }
  google.maps.event.addDomListener(window, 'load', initialize);