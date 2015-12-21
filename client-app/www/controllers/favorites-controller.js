/**
 * @ngdoc controller
 *
 * @name FavoritesController
 */
RunturModule
.controller('FavoritesController', function(favoriteBars) {
   'use strict';

   var self = this;

   self.bars = favoriteBars;
});