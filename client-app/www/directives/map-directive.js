/**
 * @ngdoc directive
 * @name map
 * @restrict E
 *
 * @description
 * Uses the Google Maps Cordova plugin to create a native
 * map view behind the web view of the app. This is not HTML.
 * Only one native map view can be created by the plugin so
 * this directive cannot be used more than once.
 *
 * See {@link https://github.com/wf9a5m75/phonegap-googlemaps-plugin}
 * for detailed information on the plugins api.
 *
 * @param {object} center A object containing the current latitude and longitude
 *
 * @usage
 *
 * ```html
 * <map center="map.coords" data-tap-disabled="true">
 *    <a ng-click="map.updatePosition()" class="button button-icon icon ion-navigate"></a>
 * </map>
 * ```
 */
RunturModule
.directive('map', function($ionicPlatform, $location, PlacesService, $state, LocationService, $rootScope) {
   'use strict';

   return {
      restrict: 'E',
      link: function(scope, element, attributes) {

         // After the coords have updated unbind the watch by calling it again
         var unbindWatcher = scope.$watch(attributes.center, function(coords) {

            if (coords) {
               googleMap(scope, element, attributes, coords);
               unbindWatcher();
            }
         });
      }
   };

   function googleMap(scope, element, attributes, coords) {

      var map;
      var currentMarkers = [];
      var customMapElement;

      // Make sure we are ready for the map
      $ionicPlatform.ready(init);

      function init() {
         customMapElement = element[0];
         createMap();

         $rootScope.$on('PlacesService:barsUpdated', function barsUpdated(event, value) {
            removeMarkers();
            setBars();
         });

         // Watch for changes to center to change position and
         scope.$watch(attributes.center, function(coords) {

            // TODO: Refactor this logic correctly
            LocationService.getPosition().then(function(position) {
               coords = {
                  lat: position.latitude,
                  lng: position.longitude
               };

               PlacesService.getBars(true).then(function(bars) {
                  removeMarkers();
                  createCurrentMarker();

                  for (var index = 0; index < bars.length; index++) {
                     createCurrentMarker();
                     createBarMarker(bars[index]);
                  }
               },
               function(error) {
                  alert(error);
               });

               map.animateCamera({
                  'target': new plugin.google.maps.LatLng(position.latitude, position.longitude),
                  'zoom': 17,
                  'duration': 1000
               });
            },
            function(error) {
               alert(error);
            });
         });
      }

      function createMap() {
         var mapSettings = {
            'camera': {
               'latLng': new plugin.google.maps.LatLng(coords.lat, coords.lng),
               'zoom': 17,
               'bearing': 50
            },
            'controls': {
               'compass': false
            },
            'gestures': {
               'tilt': false
            }
         };

         map = plugin.google.maps.Map.getMap(customMapElement, mapSettings);

         map.addEventListener(plugin.google.maps.event.MAP_READY, function() {
            setBars();
         });
      }

      function setBars() {
         PlacesService.getBars().then(function(bars) {

            scope.bars = bars;

            console.log(bars);

            for (var index = 0; index < bars.length; index++) {
               createCurrentMarker();
               createBarMarker(bars[index]);
            }
         });
      }

      function createCurrentMarker() {
         var markerPosition = new plugin.google.maps.LatLng(coords.lat, coords.lng);

         map.addMarker({
            'position': markerPosition,
            'icon': 'www/assets/img/current.png'
         },
         function addMarker(marker) {
            currentMarkers.push(marker);

            marker.setIcon({
               'url':  'www/assets/img/current.png',
               'size': {
                  width: 20,
                  height: 20
               }
            });
         });
      }

      function createBarMarker(place) {
         var position = place.geometry.location;

         var markerPosition = new plugin.google.maps.LatLng(position.A, position.F);

         map.addMarker({
            'position': markerPosition,
            'title': place.name,
            'icon': 'www/assets/img/marker.png'
         },
         function addMarker(marker) {
            marker.setIcon({
               'url': 'www/assets/img/marker.png',
               'size': {
                  width: 40,
                  height: 49
               }
         });

            marker.addEventListener(plugin.google.maps.event.INFO_CLICK, function() {
               //$state.go('tab.map-bar', {
               //   barId: place.place_id
               //});

               //place.place_id
            });
         });
      }

      function removeMarkers() {
         currentMarkers.forEach(function(marker) {
            marker.remove();
         });
      }
   };
});