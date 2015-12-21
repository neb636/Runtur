/**
 * @ngdoc service
 * @name PlacesService
 *
 * @description
 * Handel's interactions with the Google Places Javascript API
 */
RunturModule
.service('PlacesService', function(LocationService, $q, $rootScope) {
   'use strict';

   var self = this;
   var dummyElement = document.getElementById('dummy-element');
   var places = new google.maps.places.PlacesService(dummyElement);

   /**
    * @ngdoc attribute
    * @name PlacesService#bars
    *
    * @description
    * Stores list of current bars near user
    */
   self.bars = [];

   /**
    * @ngdoc method
    * @name PlacesService#getBars
    *
    * @description
    * Gets a list of current bars from Google Places and sets self.bars
    *
    * @param {boolean} updatedBarsList
    */
   self.getBars = function getBars(updatedBarsList) {
      updatedBarsList = updatedBarsList || false;

      var deferred = $q.defer();

      if (self.bars.length > 0 && !updatedBarsList) {
         deferred.resolve(self.bars);
      }
      else {
         LocationService.getPosition().then(function(position) {

            var coordinates = new google.maps.LatLng(position.latitude, position.longitude);

            var placesRequest = {
               location: coordinates,
               types: ['bar'],
               openNow: true, // TODO: Change this to use database at later date
               rankBy: google.maps.places.RankBy.DISTANCE
            };

            places.nearbySearch(placesRequest, function(bars, status) {

               if (status === google.maps.places.PlacesServiceStatus.OK) {
                  _calculateDistances(bars, position).then(function(bars) {
                     self.bars = bars;
                     deferred.resolve(self.bars);
                  });
               }
            });
         },
         function(error) {
            console.log('Failed to Get Bars');
            deferred.reject(error);
         });
      }

      return deferred.promise;
   };

   /**
    * @ngdoc method
    * @name PlacesService#getBar
    *
    * @description
    * Gets detailed information about a bar by it's Google Places ID
    *
    * @param {string} barId
    */
   self.getBar = function getBar(barId) {
      var deferred = $q.defer();

      var placesRequest = {
         placeId: barId
      };

      places.getDetails(placesRequest, function(place, status) {

         if (status === google.maps.places.PlacesServiceStatus.OK) {
            deferred.resolve(place);
         }
      },
      function(error) {
         deferred.reject(error);
      });

      return deferred.promise;
   };

   /**
    * @ngdoc method
    * @name PlacesService#cachedBarInfo
    *
    * @description
    * Returns some of the cache bar info from bars attribute
    *
    * @param {string} barId
    */
   self.cachedBarInfo = function cachedBarInfo(barId) {
      var deferred = $q.defer();

      if (self.bars.length) {
         self.bars.forEach(function(bar) {

            if (bar.place_id === barId) {
               deferred.resolve(bar);
            }
         });

         // Let's resolve false if a match was not found
         deferred.resolve(false);
      }
      else {
         deferred.resolve(false);
      }

      return deferred.promise;
   };


   /**
    * @ngdoc method
    * @name PlacesService#cachedBarInfo
    * @private
    *
    * @description
    * Uses Google Maps distance matrix to return time estimates.
    * Does a one to one matching in the same order. Updates bar object with these
    * stats
    *
    * @link https://developers.google.com/maps/documentation/javascript/distancematrix
    * @param {array} bars
    */
   function _calculateDistances(bars, current) {
      var deferred = $q.defer();
      var distanceMatrixService = new google.maps.DistanceMatrixService();
      var currentLocation = new google.maps.LatLng(current.latitude, current.longitude);
      var barLocations = [];

      bars.forEach(function(bar) {
         barLocations.push(bar.vicinity);
      });

      var requestOptions = {
         origins: [currentLocation],
         destinations: barLocations,
         travelMode: google.maps.TravelMode.WALKING,
         unitSystem: google.maps.UnitSystem.IMPERIAL
      };

      distanceMatrixService.getDistanceMatrix(requestOptions, function(response, status) {
         if (status === 'OK') {
            var distanceResults = response.rows[0].elements;

            // Match response up ith original bar object
            var newBarsObject = bars.map(function(bar, index) {
               bar.distance = distanceResults[index].distance.text;
               bar.walkingDuration = distanceResults[index].duration.text;

               return bar;
            });

            deferred.resolve(newBarsObject);
         }
         else {
            deferred.reject(response);
         }
      });

      return deferred.promise;
   }
});