let map;
var markerSet = '/wp-content/themes/lovecraft-child/assets/images/markers/';
const icon = "cf-asterisk.svg";
var lngList = ["de", "en", "it"]; // ( !!! ) da aggiornare quando si aggiungono lingue ( !!! )
const center = { lat: 51, lng: 10.4 }; // centra la mappa

/* Map Options */
var mapOptions = {
  //mapId: "13fd6f0153a59edc", // Questa è la prima
  //mapId: "5c073af6c502f307", // Questo è il Gray
  mapId: "992e5d5b15b729ab", // Questo è il terzo
  zoom: 6.2,
  center: center,
  mapTypeId: 'roadmap',
  zoomControl: true,
  mapTypeControl: false,
  scaleControl: false,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: true,
  gestureHandling: "cooperative",
  restriction: {
    latLngBounds: {
      north: 59,
      south: 47,
      east: 15.2,
      west: 5.5,
    },
  },
}

/* Mappa di tutta la Germania */
function initDeutschland() {
  var map = new google.maps.Map(document.getElementById("mapB"), mapOptions );

/* +++++++++++++++++++++++++++++++++++++++++++++++++ */
// Aggiunge un controllo custom alla mappa (scelta delle lingue)
  var html = '<select id="lang-select" name="lang" onchange="changeLang(this.value)"><option id="de" value="de">German</option><option id="en" value="en">English</option><option id="it" value="it">Italian</option></select>';
/*
control.js v0.1 - Add custom controls to Google Maps with ease
Created by Ron Royston, www.rack.pub
https://github.com/rhroyston/control
License: MIT
control.topCenter.add.(html)
Qui su stackoverflow: https://stackoverflow.com/questions/6396627/add-custom-control-to-a-google-map-thats-a-dropdown
*/
var control = function() {function o(o) {this.add=function(T){var t=document.createElement("div");if(t.innerHTML=T,o)switch(o){case"TOP_CENTER":map.controls[google.maps.ControlPosition.TOP_CENTER].push(t);break;case"TOP_LEFT":map.controls[google.maps.ControlPosition.TOP_LEFT].push(t);break;case"TOP_RIGHT":map.controls[google.maps.ControlPosition.TOP_RIGHT].push(t);break;case"LEFT_TOP":map.controls[google.maps.ControlPosition.LEFT_TOP].push(t);break;case"RIGHT_TOP":map.controls[google.maps.ControlPosition.RIGHT_TOP].push(t);break;case"LEFT_CENTER":map.controls[google.maps.ControlPosition.LEFT_CENTER].push(t);break;case"RIGHT_CENTER":map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(t);break;case"LEFT_BOTTOM":map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(t);break;case"RIGHT_BOTTOM":map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(t);break;case"BOTTOM_CENTER":map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(t);break;case"BOTTOM_LEFT":map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(t);break;case"BOTTOM_RIGHT":map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(t)}else console.log("err")}}var T={};return T.topCenter=new o("TOP_CENTER"),T.topLeft=new o("TOP_LEFT"),T.topRight=new o("TOP_RIGHT"),T.leftTop=new o("LEFT_TOP"),T.rightTop=new o("RIGHT_TOP"),T.leftCenter=new o("LEFT_CENTER"),T.rightCenter=new o("RIGHT_CENTER"),T.leftBottom=new o("LEFT_BOTTOM"),T.rightBottom=new o("RIGHT_BOTTOM"),T.bottomCenter=new o("BOTTOM_CENTER"),T.bottomLeft=new o("BOTTOM_LEFT"),T.bottomRight=new o("BOTTOM_RIGHT"),T}();
  control.topLeft.add(html);
/* +++++++++++++++++++++++++++++++++++++++++++++++++ */

/* xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx */
/* Aggiunge il Muro di berlino */
/* TRACCIATO OK */
  const triangleCoords = [
    { lat: 52.50305159187053, lng: 13.52694588896717 },
    { lat: 53.84791896260856, lng: 9.942807449889486 },
    { lat: 48.027485052051425, lng: 7.845028606243967 },
    // { lat: -27.467, lng: 153.027 }, test
  ];
  // Construct the polygon.
  const wall = new google.maps.Polygon({
    paths: triangleCoords,
    geodesic: true, // in Polyline ???
    strokeColor: "#C04300",
    strokeOpacity: 0.7,
    strokeWeight: 4,
    fillColor: "#00FF00",
    fillOpacity: 0,
  });

  wall.setMap(map);
/* TRACCIATO OK */
/* xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx */

  // REST request for Posts
  var myURL = urlMakerMap(lngList);
  var myGeoJson = mapAjaxCall(myURL);
  console.log("Questo è myGeoJson in initDeutschland: " + myGeoJson);
  console.log("Questo è myGeoJson.type: " + myGeoJson.type);
  console.log("Questo è myGeoJson.features: " + myGeoJson.features);
  console.log("Questo è myGeoJson.features[1]: " + myGeoJson.features[1]);
  console.log("Questo è myGeoJson.features[1].properties.lat: " + myGeoJson.features[1].properties.lat);
  console.log("Questo è myGeoJson.features.length: " + myGeoJson.features.length);

  /* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */
/* Creaiamo subito i Markes e i Clusters */
/* PROBLEMA: ho dei marker duplicati in aggiunta a quelli creati dal DataSet */
var locations = [];
for (let i = 0; i < myGeoJson.features.length; i++) {
var loc = {};
loc.lat = parseFloat(myGeoJson.features[i].properties.lat);
loc.lng = parseFloat(myGeoJson.features[i].properties.lng);
locations.push(loc);
}
const markers = locations.map((position, i) => {
    //const label = labels[i % labels.length];
    const marker = new google.maps.Marker({
      position,
      //label,
    });
    return marker;
  });

/* Generazione Clusters */
var mcOptions = {
          styles:[{
                color: "Cyan", // non va......
          }]
    };
    //new MarkerClusterer({ markers, map });
    /* da GitHub: When adding via unpkg, the MarkerClusterer can be accessed at markerClusterer.MarkerClusterer. */
      new markerClusterer.MarkerClusterer({ map, markers, mcOptions });
  /* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */

  // Load the GeoJSON onto the map.
  //map.data.loadGeoJson('../wp-content/themes/lovecraft-child/assets/js/postsBis.json', {idPropertyName: 'postid'}); // da locale
  map.data.addGeoJson(myGeoJson, {idPropertyName: 'postid'}); // da remoto

  // Define the custom marker icon.
  map.data.setStyle((feature) => {
    return {
      icon: {
        url: markerSet + icon,
      },
    };
  });

  const apiKey = 'AIzaSyBg9GxYNuuQJD9TUlYlng1HiglInAM4Ki4'; // serve???
  
  /* Creazione delle infoWindows dal dataSet ( Tooltips ) */
  const infoWindow = new google.maps.InfoWindow();
  // Show the infoWindow for a quote when its marker is clicked.
  map.data.addListener('click', (event) => {
    const url = event.feature.getProperty('url');
    const title = event.feature.getProperty('title');
    const lat = event.feature.getProperty('lat');
    const lng = event.feature.getProperty('lng');
    const position = event.feature.getGeometry().get();
    var language = setLanguageIDmap(); // *********************************************************************
    setSelect(language);
    console.log("Questa è language 2: " + language);
    var keyword = event.feature.getProperty(language + "_cf_keyword");
    const text = event.feature.getProperty(language + "_cf_text");
    //console.log("Questa è language + keyword: " + language + "_cf_keyword");
    console.log("Questa è keyword: " + keyword);
    var chunks = cutTextMap(text, keyword);
    var text0 = chunks[0];
    var text1 = chunks[1];

    // per link a Google Maps usare url fatti così: http://www.google.com/maps/place/lat,lng
    const content = `
      <div class="quote-map">
        <spam class='text0'>${text0}</spam><spam class='keyword'><strong>${keyword}</strong></spam><spam class='text1'>${text1}</spam>
      </div>
      <div>
        </br><p class="footnoteM">Go to the <a class="fn-url" href="${url}" target="_blank">footnote</a></p>
      </div>
    `;

    infoWindow.setContent(content);
    infoWindow.setPosition(position);
    infoWindow.setOptions({pixelOffset: new google.maps.Size(0, -25)});
    infoWindow.setOptions({maxWidth: 350});
    infoWindow.open(map);

    map.addListener('click', ()=>{
      infoWindow.close();
    });
  }); // FINE addListener()
  
} // FINE function initDeutschland()

/* Creazione url per REST */
function urlMakerMap(lngList) {
  var path = window.location.protocol + '//' + window.location.hostname + '/wp-json/wp/v2/posts?';
  var postMax = '&per_page=100';
  var fieldsBase = '&_fields=' + 'id,' + 'title,' + 'link,' + 'meta.lat,' +'meta.lng,'; // non cattura post_title. Forse è "slug"?
  var fieldsNext = "";
  for (let i = 0; i < lngList.length; i++) {
    fieldsNext = fieldsNext + 'meta.' + lngList[i] + '_cf_page_num,' + 'meta.' + lngList[i] + '_cf_text,' + 'meta.' + lngList[i] + '_cf_keyword,';
  }
  fieldsNext.substr(0, fieldsNext.length - 1);
  url = path + postMax + fieldsBase + fieldsNext;
  //console.log('Questo è url completo: ' + url);
  return url;
}

/* Chiamata AJAX per Posts mappa */
function mapAjaxCall(url) {
  //console.log("myGeoJson in ingresso mapAjaxCall(): " + myGeoJson);
  //console.log('Questo è url completo: ' + url);
  console.log('mapAjaxCall(url) è partita!');
  var myData = false;
  jQuery.ajax({
    url: url,
    data: {
      format: 'json'
    },
    error: function () {
      $('#info').html('<p>An error has occurred</p>');
    },
    dataType: 'json',
    async: false, // altrimenti non posso ritornare mtData
    success: function (data) {
      //console.log("data = " + data);
      var myGeoJson = {
          "type": "FeatureCollection",
          "features": []
      };
      myData = handleData( data, myGeoJson );
      //return myGeoJson;
    },
    type: 'GET'
  });
  console.log("myData in uscita mapAjaxCall(): " + myData);
  console.log('mapAjaxCall(url) è terminata!');
  return myData;
}

/* Costruisce il dataSet con quello che arriva dal server lasciando fuori i record che non hanno LAT e LNG */
function handleData(data, myGeoJson) {
  console.log("handleData(data) è partita");
  console.log("myGeoJson in ingresso handleData(): " + myGeoJson);
  var feat = [];
  var counter = 0;
  for (var property in data) {
    var prop = {};
    prop.geometry = {};
    prop.type = "Feature",
    prop.properties = {};
    var obj = data[property];
    console.log("obj = " + obj);
    console.log("obj.meta.lat *** = " + obj.meta.lat);

    if ( obj.meta['lat'] != "" && obj.meta['lng'] != "" && typeof obj.meta['lat'] !== "undefined" && typeof obj.meta['lng'] !== "undefined") {
      prop.geometry.type = "Point";
      prop.geometry.coordinates = [ parseFloat(obj.meta.lng[0]), parseFloat(obj.meta.lat[0]) ];
      prop.properties.postid = JSON.stringify(obj['id']);
      prop.properties.title = obj.title['rendered']; // o slug
      prop.properties.url = obj['link']; // link o guid['rendered'] o _links.self.0.href
      prop.properties.lat = obj.meta.lat[0]; // o acf.lat e acf.lng
      prop.properties.lng = obj.meta.lng[0];
      // da aggiornare con le lingue
      prop.properties.de_cf_page_num = JSON.stringify(parseInt(obj.meta.de_cf_page_num[0]));
      prop.properties.de_cf_text = obj.meta.de_cf_text[0];
      prop.properties.de_cf_keyword = obj.meta.de_cf_keyword[0];
      prop.properties.en_cf_page_num = JSON.stringify(parseInt(obj.meta.en_cf_page_num[0]));
      prop.properties.en_cf_text = obj.meta.en_cf_text[0];
      prop.properties.en_cf_keyword = obj.meta.en_cf_keyword[0];
      prop.properties.it_cf_page_num = JSON.stringify(parseInt(obj.meta.it_cf_page_num[0]));
      prop.properties.it_cf_text = obj.meta.it_cf_text[0];
      prop.properties.it_cf_keyword = obj.meta.it_cf_keyword[0];

      feat.push(prop);
      counter = counter + 1; // provvisorio, per contare i post filtrati
    }
  }
  myGeoJson.features = feat;
  console.log("Counter = " + counter);
  console.log("handleData(data) è terminata");
  console.log("Questo è myGeoJson: " + myGeoJson);
  console.log("Questo è myGeoJson.type: " + myGeoJson.type);
  console.log("Questo è myGeoJson.features: " + myGeoJson.features);
  //console.log("Stringify: " + JSON.stringify(myGeoJson));
  return myGeoJson;
}

/* Seleziona la lingua che sarà mostrata nei tooltips */
function setLanguageIDmap(){
  // Mantiene il settaggio della lingua della sessione
  // altrimenti seleziona quella del browser
  if (localStorage.langID) {
    lgID = localStorage.langID;
  } else {
    lgID = navigator.language || navigator.userLanguage;
    lgID = lgID.split('-')[0];
    localStorage.langID = lgID;
  }
  return lgID;
}

/* Taglia i pezzi delle quotes da mettere nei tooltips */
function cutTextMap(text, key) {
  //console.log('cutText() partita!');
  var chunks = [text.substring(0, text.indexOf(key)),
    text.substring(text.indexOf(key) + key.length),
  ];
//console.log('chunks[0] = ' + chunks[0]);
//console.log('chunks[1] = ' + chunks[1]);
  return chunks;
}

/* funzione onClick su <select> di Google Maps */
function changeLang(value) {
  localStorage.langID = value;
  setSelect(value);
  location.reload();
}

/* Fissa la lingua giusta ovunque serve */
function startMap() {
  jQuery(document).ready(function () {
    setLanguageID();
    var langlang = localStorage.langID;
    setSelect(langlang);
    console.log("Questo è langlang: " + langlang);
  });
}
