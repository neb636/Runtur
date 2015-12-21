/**
 * @ngdoc service
 * @name LocationService
 * @description
 * Responsible for location information
 */
RunturModule
.service('LocationService', function($q, $ionicPlatform) {
   'use strict';

   var self = this;

   /**
    * @ngdoc method
    * @name LocationService#getPosition
    * @description
    * Gets current position using Cordova geolocation plugin.
    */
   self.getPosition = function getPosition() {
      var deferred = $q.defer();

      var options = {
         maximumAge: 3000,
         timeout: 5000,
         enableHighAccuracy: true
      };

      navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

      function onSuccess(current) {
         var latLong =  {
            'latitude': current.coords.latitude,
            'longitude': current.coords.longitude
         };
         deferred.resolve(latLong);
      }

      function onError(error) {
         deferred.reject('Failed to Get Lat Long');
      }

      return deferred.promise;
   };

   /**
    * @ngdoc method
    * @name LocationService#launchDirections
    * @description
    * Launches Google Maps for specific bar
    */
   self.launchDirections = function launchDirections(to) {
      self.getPosition().then(function getPosition(position) {

         $ionicPlatform.ready(function() {

            plugin.google.maps.external.launchNavigation({
               'from': position.latitude + ', ' + position.longitude,
               'to': to
            });
         });
      },
      function(error) {
         alert(error);
      });
   };
});