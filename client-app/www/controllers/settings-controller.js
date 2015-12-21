/**
 * @ngdoc controller
 *
 * @name SettingsController
 */
RunturModule
.controller('SettingsController', function($scope, $ionicPlatform, SqliteService, PhotoService, openBarsOnly, photoUri) {
   'use strict';

   var self = this;

   self.openBarsOnly = (openBarsOnly === 'true'); // Convert string "boolean" to boolean
   self.photo = photoUri;

   self.openBarsOnlyChange = function openBarsOnlyChange() {
      SqliteService.setting.set('openBarsOnly', self.showClosedBars);
   };

   self.setPhoto = function setPhoto() {
      PhotoService.setPhoto();
      getPhoto();
   };

   function getPhoto() {
      var defaultValue = 'assets/img/user.svg';

      SqliteService.setting.get('photoUri', defaultValue).then(function getSetting(photo) {
         self.photo = photo;
      });
   }
});