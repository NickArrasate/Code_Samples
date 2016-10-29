---

---

var map;
function initialize() {
  //This section will break out each 'vendor' object into it's constituent parts

  {% assign vendors_list = site.vendors %} 
  var vendors_loc = [];
  var vendors_coords = [];
  var vendors_name = [];
  var vendors_address =[];
  var vendors_phone =[];
  var vendors_dir =[];
  var vendors_state =[];
  var vendors_site =[];
  var eMap = $("#map");
  var latlng = [];

  // Gets the coords from the 'vendor' objects and sets them in an array.
  {% for vendor in vendors_list %}
    vendors_coords.push('{{vendor.lat}}');
    vendors_coords.push('{{vendor.long}}');
    vendors_loc.push(vendors_coords);
    vendors_coords = [];
    vendors_coords = [];
  {% endfor %}

  //Gets other vendor info to set up the tooltips
  {% for vendor in vendors_list %}
    vendors_address.push('{{vendor.address}}');
    vendors_phone.push('{{vendor.phone}}');
    vendors_dir.push('{{vendor.direction_url}}');
    vendors_name.push('{{vendor.name}}');
    vendors_state.push('{{vendor.city}}');
    vendors_site.push('{{vendor.site-url}}')
  {% endfor %}
  //We set the map's center to the first location in the list of vendors. This can be changed at will
  var mapcenter = new google.maps.LatLng(vendors_loc[0][0], vendors_loc[0][1]);
  var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';

  //Setting the options to be passed to google
  var mapOptions = {
    center: mapcenter,
    disableDefaultUI: false,
    scrollwheel: false,
    zoom: 12,
    navigationControl: true,
    mapTypeControl: false,
    scaleControl: true,
    panControl: false,
    streetViewControl: false,
    zoomControl: true,
    draggable: true
  };
  //Instantiateing a new Map
  var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  var infowindow = new google.maps.InfoWindow({});

  //setting the icon to the clients logo
  var icon = {
    url: 'img/NWNW-logo-no-bg.png',
    scaledSize: new google.maps.Size(35, 30),
    origin: new google.maps.Point(0,0),
    anchor: new google.maps.Point(0, 0)
  };

  var marker, i;

  //Setting Markers for each vendor based on their coords
  for (i = 0; i < vendors_loc.length; i++) {
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(vendors_loc[i][0], vendors_loc[i][1]),
      icon: icon,
      map: map
    });

    //Setting a listener for user 'clicks' and appending the tooltip to the dom
    google.maps.event.addListener(marker, 'click', (function (marker, i) {
      return function () {
        infowindow.setContent('<strong><a href="' + vendors_site[i] + '">' + vendors_name[i] + '</a></strong><br>\
        ' + vendors_address[i] + '<br> '+ vendors_state[i] +'<br>\
        ' + vendors_phone[i]+ '<br>\
        <a href="' + vendors_dir[i] +'">Get Directions</a>');
        infowindow.open(map, marker);
      }
    })(marker, i));
  }

  //Set of buttons to recenter the map over different cities. Also sets the 'current' class to add styles
  google.maps.event.addDomListener(document.getElementById('Portland'), 'click', function () {
    $('.map-button').removeClass('current');
    $('#Portland').addClass('current');
    map.panTo(new google.maps.LatLng(45.5231, -122.6765));
  });
  google.maps.event.addDomListener(document.getElementById('Eugene'), 'click', function () {
    $('.map-button').removeClass('current');
    $('#Eugene').addClass('current');
    map.panTo(new google.maps.LatLng(44.0521, -123.0868));
  });
  google.maps.event.addDomListener(document.getElementById('Salem'), 'click', function () {
    $('.map-button').removeClass('current');
    $('#Salem').addClass('current');
    map.panTo(new google.maps.LatLng(44.9429, -123.0351));
  });
};

//calling the map function and making the API request
function loadScript() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&callback=initialize&key={{site.google_api_key}}';
  document.body.appendChild(script);
}

window.onload = loadScript;
