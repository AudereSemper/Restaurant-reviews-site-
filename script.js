$(document).ready(function(){
  var burger = $('.btn');
  var menu = $('.full-menu');
  var navItems =$('.nav__item');
  
  burger.click(function(){
    $(document).toggleClass("disable-scroll");
    burger.toggleClass('btn--open');
    menu.toggleClass('menu--open');
  });
  
  navItems.hover(function(){
    navItems.not($(this)).toggleClass('nav__item--hover');
  });
});

var restaurantsArray=[];

$(".columnsContainer").hide();

// ---------------- GOOGLE API DOWN BELOW ------------------------

var sectionShow =false; //check for the first section

function initAutocomplete() {
        var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -33.8688, lng: 151.2195},
          zoom: 13,
          mapTypeId: 'roadmap'
        });
    
            
        initialize();
    
        google.maps.event.addListener(map, 'rightclick', function(event) {
        placeMarker(event.latLng);
            console.log(event.latLng);
        });

        function placeMarker(location) {
            var marker = new google.maps.Marker({
                position: location, 
                map: map
            });
        }

        // Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        
        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });

        var markers = [];
        
        // Listen for the event fired when the user selects a prediction and retrieve    
        // more details for that place.
        searchBox.addListener('places_changed', function() {
            
            //check if the first sectin is already Up
            if(!sectionShow){
                $(".columnsContainer").fadeIn();
                sectionShow=true;
            }
            
            //automatic movements of the scroll
            document.querySelector('#map').scrollIntoView({ 
                behavior: 'smooth'         
            });
            
          var places = searchBox.getPlaces();  
          if (places.length == 0) {
            return;
          }
         
            review = [];
            //this jquery line delete the previous card if you start another research 
            $(".card-grid").parent().find('.card-wrap').remove();
          // Clear out the old markers.
          markers.forEach(function(marker) {
            marker.setMap(null);
          });
          markers = [];
               
          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
            //hai aggiunto bounds, ricorda che stai cercando di passare le coordinate posto per posto.
              
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
              
              containerPlace=places;
              
            var photos = place.photos;
            if (!photos) {
            return;
            }
    
            var icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };
              
              // photo is usefull to store the photo of every place.
              var photo = photos[0].getUrl({'maxWidth': 800, 'maxHeight': 900})
              var title = place.name;
              var rating = place.rating;
              var address = place.formatted_address;
              var idPlace = place.place_id;   
              
              console.log(idPlace);
              
              printCard(photo, title, rating, address, idPlace);
              initMap(idPlace, map);            
                                      
            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          map.fitBounds(bounds);
        });
     infoWindow = new google.maps.InfoWindow;

        // GeoLocation from Here
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
              
              
            let places = new google.maps.places.PlacesService(map);
            let service = new google.maps.places.PlacesService(map);

            let request = {
                location: pos,
                radius: 500,
                types: ['restaurant']
            }

            service.nearbySearch(request, callback);

            function callback(results, status) {
                const script = document.createElement('script');
                script.src = 'place.js';
                document.getElementsByTagName('head')[0].appendChild(script);
                window.eqfeed_callback = function(results) {
                    results = results.results;
                    restaurantsArray = [];
                    for (let i = 0; i < results.length; i++) {
                        restaurantsArray.push(results[i]);
                        console.log(restaurantsArray[i]);
                    }
                };
                
            }
              
            $(".columnsContainer").fadeIn();
            document.querySelector('#map').scrollIntoView({ 
                behavior: 'smooth'         
            });

            infoWindow.setPosition(pos);
            infoWindow.setContent('You are here');
            infoWindow.open(map);
            map.setCenter(pos);
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
    
}

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
      }

 
function printCard(photoMarker, name, rating, address, idPlace){
        
    let card ="<div class=\"card-wrap\" id=\"" + idPlace + "\"><img src=\"" + photoMarker + " class=\"photo\" style=\"border-top-left-radius: 10px;border-top-right-radius: 10px;\"><div class=\"restoName\"><h3>" + name + "</h3><p class=\"restoAddress\">" + address + "</p><p class=\"ratePlace\">Rating: " + rating + "</p></div></div>";
    
    $(".card-grid").append(card);
}



// these 2 functions below are necessary for the correct function of the street view, in the detailed section downbelow.

var detailSectionShow = false;
    //store the information to print in the detailed section 
$(".columnsContainerTwo").hide();

$(document).on("click", ".card-wrap", function(){
    //check if the section detailed (columnsContainerTwo) is already open
    if(!detailSectionShow){
                $(".columnsContainerTwo").fadeIn();
                detailSectionShow=true;
            }
    
    //move the scroll on the right section
    document.querySelector('.columnsContainerTwo').scrollIntoView({ 
                behavior: 'smooth'         
            });
    
    //save the variable to print
    let restaurant = {
        img: $(this).find("img").attr("src"),
        name: $(this).find("h3").text(),
        address: $(this).find(".restoAddress").text(),
        rating: "Rating: " + $(this).find(".ratePlace").text(),
        id: $(this).attr("id")
    };
    
    printDetailSection(restaurant);
    initialize(restaurant.address);
});

function initMap(idPlace, map) {

    var infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);

    service.getDetails({
      placeId: idPlace
    }, function(place, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location
        });
         
        for(let i = 0; i<place.reviews.length; i++){
              let AReview = {
                  author: place.reviews[i].author_name,
                  comment: place.reviews[i].text,
                  relativeTime: place.reviews[i].relative_time_description,
                  rating:place.reviews[i].rating,
              }
              review.push(AReview);
            }
          
          //ricorda di personalizzare l'infowindow e il marker
        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
            place.formatted_address + '</div>');
          infowindow.open(map, this);
        });
      }
    });
    
  }

let review = [];

function printDetailSection(InfoToPrint){
    $(".detailPhoto").attr("src", InfoToPrint.img);                                         $(".titleRestaurant").text(InfoToPrint.name);
    $("#addressRestaurant").text(InfoToPrint.address);
    $("#ratingPlace").text(InfoToPrint.rating);    
    printReview(review);
}

function removeElement(elementId) {
    var element = document.getElementsByClassName(elementId);
    element.parentNode.removeChild(element);
}

function printReview(review){
    //clean previous reviews
    $(".cardDetail--contentDetail").remove();
    
    let card = "<div class=\"cardDetail--contentDetail\"><p class=\"authorName\">"+ review[0].author +"</p><p class=\"review\">" + review[0].comment + "</p><p class=\"dateOfReview\">"+ review[0].relativeTime +"</p></div>"
        
    for(let i = 0; i<review.length; i++){
        card = "<div class=\"cardDetail--contentDetail\"><p class=\"authorName\">"+ review[i].author +"</p><p class=\"review\">" + review[i].comment + "</p><p class=\"dateOfReview\">"+ review[i].relativeTime +"</p><p class=\"rating\">"+  "</p></div>"
        
        $(".cardDetail").append(card);
    }
}

//Filtersearch function

$("select").on("change", function() {
  let selectedValue = parseInt(this.value, 10) || 0;
    
    $('.card-wrap').removeClass("notSearched");

  if (selectedValue === 0)
    return;

  $('.card-wrap').each(function() {
    let $cardWrap = $(this);
    let rate = $cardWrap.find(".ratePlace").text();
      var str = rate;
      str = str.split(':')[1];
      
      var str1 = str.replace(/:/, "");
      let number = parseInt(str1 || 10);

      $cardWrap.toggleClass('notSearched', number < selectedValue );
  })
});

//streetview down below

function initialize(addressOfPlaceClicked) {

        var geocoder = new google.maps.Geocoder();
        var address = addressOfPlaceClicked;
        geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK)
      {
          var fenway = {lat:results[0].geometry.location.lat(), lng: results[0].geometry.location.lng()};
      var map = new google.maps.Map(document.getElementById('mapA'), {
        center: fenway,
        zoom: 14
      });
      var panorama = new google.maps.StreetViewPanorama(
          document.getElementById('pano'), {
            position: fenway,
            pov: {
              heading: 34,
              pitch: 10
            }
          });
      map.setStreetView(panorama);
      }
    }); 
}

//review buttons and add new review card down below

$(".containerForm").hide();

$(".button").click(function(){
   $(".containerForm").fadeIn();
    $(".button").hide();
    $("#sendButton").unbind().click(function(){  
 
    var authorName = $('input#authName').val();
    var review = $('textarea#reviewHere').val();
        
    let card = "<div class=\"cardDetail--contentDetail\"><p class=\"authorName\">"+ authorName +"</p><p class=\"review\">" + review + "</p><p class=\"dateOfReview\">";
    
        if((authorName == "")||(authorName == null) || (review == "")||(review == null)){
      alert('Enter a valid input');
    }
    else{
      $(".cardDetail").append(card);
    }
           $(".containerForm").fadeOut();
  }); 
   $(".button").fadeIn();  
});

//add a restaurant

//cosa fare con la funzione qua sotto? devi trovare il modo di ottenere le coord con un click, successivamente apri il form dove chiedi soltato il nome del ristorante e dopo aggiungi il name al marker. 

$(".infoAdd").hide();

$(".buttonTwo").unbind().click(function(){
    $(".InfoAdd").fadeIn();
    $(".columnsContainer").fadeIn();
});








