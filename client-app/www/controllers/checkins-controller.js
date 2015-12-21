/**
 * @ngdoc controller
 *
 * @name CheckInsController
 */
RunturModule
.controller('CheckInsController', function(checkIns, SqliteService) {
   'use strict';

   var self = this;

   SqliteService.checkIn.set('dfgdfgdf', 'Serios');

   SqliteService.checkIn.getAll().then(function(bar) {
      console.log(bar);
   });

   self.all = checkIns;
});