/**
 * @ngdoc controller
 *
 * @name BarController
 */
RunturModule
.controller('BarController', function(barId, favoriteClass, PlacesService, SqliteService, LocationService, cachedBarInfo) {
   'use strict';

   // cachedBarInfo is used so the bar information loads quicker.

   var self = this;

   self.favoriteClass = favoriteClass;

   if (cachedBarInfo) {
      self.name = cachedBarInfo.name;
      self.address = cachedBarInfo.vicinity;

      if (cachedBarInfo.photos) {
         self.photo = cachedBarInfo.photos[0].getUrl({'maxWidth': 1000, 'maxHeight': 1000});
      }

      // Use ng-repeat to simulate doing something like _.times in Angular.
      if (cachedBarInfo.rating) {
         var ratingNumber = parseInt(cachedBarInfo.rating.toFixed());

         self.stars = new Array(ratingNumber);
      }
   }

   // Does not matter if these are repeated since only binding once
   PlacesService.getBar(barId).then(function(bar) {
      self.name = bar.name;
      self.address = bar.vicinity;
      self.reviews = bar.reviews;

      if (bar.photos) {
         self.photo = bar.photos[0].getUrl({'maxWidth': 1000, 'maxHeight': 1000});
      }

      // Use ng-repeat to simulate doing something like _.times in Angular.
      if (bar.rating) {
         var ratingNumber = parseInt(bar.rating.toFixed());

         self.stars = new Array(ratingNumber);
      }

      self.launchDirections = function() {
         LocationService.launchDirections(bar.vicinity);
      };

      self.toggleFavorite = function() {
         if (self.favoriteClass === false) {
            SqliteService.favorite.set(bar.place_id, bar.name);
            self.favoriteClass = true;
         }
         else if (self.favoriteClass === true) {
            SqliteService.favorite.unset(bar.place_id);
            self.favoriteClass = false;
         }
      };

      //self.checkIn = function() {
      //   console.log(bar.id, bar.name);
      //   SqliteService.checkIn.set(bar.id, bar.name);
      //};

      //self.recentActivity = checkIns;
   },
   function(error) {
      console.log('Failed to Get Bar Info');
      console.log(error);
   });
});