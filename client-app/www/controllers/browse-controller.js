/**
 * @ngdoc controller
 *
 * @name BrowseController
 */
RunturModule
.controller('BrowseController', function(bars, PlacesService, $scope, $rootScope) {
   'use strict';

   var self = this;

   self.bars = bars;

   // Updates bars when pull down the refresher and then stops ion-refresher
   // from spinning once bars have been updated
   self.updateBars = function() {
      PlacesService.getBars(true)

      .then(function(bars) {
         self.bars = bars;
      });

      $scope.$broadcast('scroll.refreshComplete');
   };
});