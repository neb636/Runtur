/**
 * @ngdoc controller
 *
 * @name MapController
 */
RunturModule
.controller('MapController', function($scope, $ionicLoading, LocationService, PlacesService) {
   'use strict';

   var self = this;

   // Gets position on initial Load
   getCurrentPosition();

   // Updates current position on click
   self.updatePosition = function updatePosition() {
      getCurrentPosition();
   };

   self.barInfoActive = false;

   PlacesService.getBars().then(function(bars) {
      self.bars = bars;
   });

   function getCurrentPosition() {
      LocationService.getPosition().then(function getPosition(position) {
         self.coords = {
            lat: position.latitude,
            lng: position.longitude
         };
      },
      function(error) {
         alert(error);
      });
   }
});