let map;
var markerSet = '/wp-content/themes/lovecraft-child/assets/images/markers/';
const icon = "cf-asterisk.svg";
const clust = "m-dot.svg";
var lngList = ["de", "en", "it"]; // ( !!! ) da aggiornare quando si aggiungono lingue ( !!! )
const center = { lat: 50.5, lng: 10.4 };
const centerBerlin = { lat: 52.51553724557109, lng: 13.415113594397699};
var markers = [];
var myGeoJson;

/* Map Options */
var mapOptions = {
  //mapId: "13fd6f0153a59edc", // Questa è la prima
  mapId: "5c073af6c502f307", // Questo è il Gray
  //mapId: "992e5d5b15b729ab", // Questo è il terzo
  //zoom: 6,
  zoom: 10.2,
  center: centerBerlin,
  mapTypeId: 'roadmap',
  zoomControl: true,
  mapTypeControl: false,
  scaleControl: false,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: true,
  gestureHandling: "cooperative",
  minZoom: 6,
  restriction: {
    latLngBounds: {
      //north: 56,
      north: 58,
      south: 46.5,
      east: 15.2,
      west: 5.5,
    },
  },
}

/* Mappa di tutta la Germania */
function initDeutschland() {
  var map = new google.maps.Map(document.getElementById("mapB"), mapOptions );
  // REST request for Posts
  var myURL = urlMakerMap(lngList);
  myGeoJson = mapAjaxCall(myURL);

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

/* sistema la lingua sul select dopo che è stato creato il controllo (NON VA) */
var language = localStorage.langID;
setSelect(language);
/* sistema la lingua sul select dopo che è stato creato il controllo */

/* Costruzione dei Markers*/  
for (let i = 0; i < myGeoJson.features.length; i++) { // DA CHIUDERE
    var loc = {};
    loc.lat = parseFloat(myGeoJson.features[i].properties.lat);
    loc.lng = parseFloat(myGeoJson.features[i].properties.lng);
    const marker = new google.maps.Marker({
      position: loc,
      icon: { // custom icon
        url: markerSet + icon,
      },
      //map, // serve? (NO)
    });

    /* Creare i contenuti del tooltip */
    //const url = JSON.stringify(myGeoJson.features[i].properties.url); // sbagliato
    const url = myGeoJson.features[i].properties.url; // giusto
    var cont = contentOK(language, myGeoJson.features[i]);
    const keyword = cont[0];
    const text = cont[1];
    var chunks = cutTextMap(text, keyword);
    var text0 = chunks[0];
    var text1 = chunks[1];
    const contentString = `
      <div class="quote-map">
        <spam class='text0'>${text0}</spam><spam class='keyword'><strong>${keyword}</strong></spam><spam class='text1'>${text1}</spam>
      </div>
      <div>
        </br><p class="footnoteM">Go to the <a class="fn-url" href="${url}" target="_blank">footnote</a></p>
      </div>
    `;
    /* Fine dei contenuti del tooltip */

    /* Costruzione delle infoWindow */
    const infowindow = new google.maps.InfoWindow({
      content: contentString,
      maxWidth: 350
    });

    // usare click invece di mouseover.... ?
    marker.addListener("click", () => {
      hideAllInfoWindows(map);
      infowindow.open({
        anchor: marker,
        //map, // serve?
        shouldFocus: false,
      });     
    });

    // Se lo attivo ammazza il click di open()
    const mapDiv = document.getElementById("mapB");
    google.maps.event.addDomListener(mapDiv, "click", (e) => {
          if(infowindow)
            infowindow.close();
       });

    markers.push(marker);
  } // fine ciclo FOR


  /* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */
/* Generazione Clusters */
var mcOptions = {
          styles:[{
            //url: markerSet + clust,
          //url: "https://googlemaps.github.io/js-marker-clusterer/images/m1.png",
                width: 53,
                height:53,
                fontFamily:"comic sans ms",
                textSize:15,
                textColor:"red",
                color: "#C04300", // non va......
          }]
    };

const customRenderer = {
render: function ({ count, position }, stats) {
        // change color if this cluster has more markers than the mean cluster
        //const color = count > Math.max(10, stats.clusters.markers.mean) ? "#ff0000" : "#0000ff";
        const color = "#C04300";
        // create svg url with fill color
        const svg = window.btoa(`
  <svg fill="${color}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
    <circle cx="120" cy="120" opacity=".6" r="70" />
    <circle cx="120" cy="120" opacity=".3" r="90" />
    <circle cx="120" cy="120" opacity=".2" r="110" />
  </svg>`);
        // create marker using svg icon
        return new google.maps.Marker({
            position,
            icon: {
                url: `data:image/svg+xml;base64,${svg}`,
                scaledSize: new google.maps.Size(45, 45),
            },
            label: {
                text: String(count),
                color: "rgba(255,255,255,0.9)",
                fontSize: "12px",
            },
            title: `Cluster of ${count} markers`,
            // adjust zIndex to be above other markers
            zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
        });
    }
  };

  //new MarkerClusterer({ markers, map });
  /* da GitHub: When adding via unpkg, the MarkerClusterer can be accessed at markerClusterer.MarkerClusterer. */
  //var klust = new markerClusterer.MarkerClusterer({ map, markers, mcOptions }); // originale
  //new markerClusterer.MarkerClusterer(map, markers, {imagePath: '/wp-content/themes/lovecraft-child/assets/images/markers/m-dot.svg'} );
  new markerClusterer.MarkerClusterer({ map, markers, customRenderer });
  /* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */

  /* xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx */
  /* Aggiunge il Muro di berlino e i confini */
  const mauer = "/wp-content/themes/lovecraft-child/assets/js/berlin-wall.geojson";
  const confine = "/wp-content/themes/lovecraft-child/assets/js/confine.geojson";
  const deutsch = "/wp-content/themes/lovecraft-child/assets/js/3_mittel.geo.json";
  map.data.loadGeoJson( mauer );
  map.data.loadGeoJson( deutsch );
  map.data.loadGeoJson( confine );
  map.data.setStyle((feature) => {
      return {
        /*icon: { // custom icon
          url: markerSet + icon,
        },*/
        fillColor: 'green',
        fillOpacity: 0,
        strokeColor: "#C04300",
        strokeOpacity: 1,
        strokeWeight: 2,
      };
    });
  /* xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx */

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
      var myGeoJson = {
          "type": "FeatureCollection",
          "features": []
      };
      myData = handleData( data, myGeoJson );
    },
    type: 'GET'
  });
  return myData;
}

function handleData(data, myGeoJson) {
  var feat = [];
  var counter = 0;
  for (var property in data) {
    var prop = {};
    prop.geometry = {};
    prop.type = "Feature",
    prop.properties = {};
    var obj = data[property];
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
  return myGeoJson;
}

/* da modificare all'aggiunta di lingue nuove */
/* Prepara i pezzi in lingua giusta per la infoWindow */
function contentOK(language, json) {
  var keyword = "";
  var text = "";
  if (language == "de") {
    keyword = JSON.stringify(json.properties.de_cf_keyword);
    text = JSON.stringify(json.properties.de_cf_text);
  }
  if (language == "en") {
    keyword = JSON.stringify(json.properties.en_cf_keyword);
    text = JSON.stringify(json.properties.en_cf_text);
  }
  if (language == "it") {
    keyword = JSON.stringify(json.properties.it_cf_keyword);
    text = JSON.stringify(json.properties.it_cf_text);
  }
  /* Toglie le virgolette dal testo */
  keyword = keyword.substring(1, keyword.length-1);
  text = text.substring(1, text.length-1);
  return [keyword, text];
}

/* Taglia i pezzi di testo per evidenziare la keyword */
function cutTextMap(text, key) {
  var chunks = [text.substring(0, text.indexOf(key)),
    text.substring(text.indexOf(key) + key.length),
  ];
  return chunks;
}


/* FUNZIONI PER LINGUE */

// Mantiene il settaggio della lingua della sessione
// altrimenti seleziona quella del browser (NON USATA)
function setLanguageIDmap(){
  console.log("setLanguageIDmap() PARTITA");
  if (localStorage.langID) {
    lgID = localStorage.langID;
  } else {
    lgID = navigator.language || navigator.userLanguage;
    lgID = lgID.split('-')[0];
    localStorage.langID = lgID;
  }
  return lgID;
}

/* Settaggio lingua */
function setLanguageID(){
  if (localStorage.langID) {
    return;
  } else {
    lgID = navigator.language || navigator.userLanguage;
    lgID = lgID.split('-')[0];
    localStorage.langID = lgID;
  }
}

/* Click su <select> di Google Maps*/
function changeLang(value) {
  localStorage.langID = value;
  setSelect(value);
  location.reload(); // ricarica la pagina con la nuova lingua
}

/* Settaggio <select> */
function setSelect(lgID) {
  jQuery("option").filter(":selected").removeAttr("selected");
  jQuery("#" + lgID).attr("selected", "selected");
}

function startMap() {
  jQuery(document).ready(function () {
    setLanguageID();
    var langlang = localStorage.langID;
    setSelect(langlang);
    console.log("Questo è langlang: " + langlang);
  });
}

// chiude tutte le info window
function hideAllInfoWindows(map) {
   markers.forEach(function(marker) {
     marker.infowindow.close(map, marker);
  }); 
}


