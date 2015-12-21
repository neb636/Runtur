/**
 * @ngdoc service
 * @name PhotoService
 *
 * @description
 * Handel's Getting photos for users
 */
RunturModule
.service('PhotoService', function($q, $ionicActionSheet, SqliteService) {
   'use strict';

   var self = this;

   self.setPhoto = function setPhoto() {

      $ionicActionSheet.show({
         buttons: [
            { text: 'Take a Photo' },
            { text: 'Choose from Library' }
         ],
         cancelText: 'Cancel',
         buttonClicked: function(index) {

            // Kind of weird but needed for the order
            if (index === 0) {
               choosePicture(1);
            }
            else if (index === 1) {
               choosePicture(2);
            }

            return true;
         }
      });
   };

   // Uses either the Camera or Photo Library depending on passed in sourceType
   var choosePicture = function choosePicture(sourceType) {

      var options = {
         quality: 50,
         destinationType: Camera.DestinationType.FILE_URI,
         sourceType: sourceType, // 0 = Photo Library, 1 = Camera, 2 = Saved Photo Album
         encodingType: 0 // 0 = JPG 1 = PNG
      };

      navigator.camera.getPicture(function(fileUri) {
         SqliteService.setting.set('photoUri', fileUri);
      },
      function(error) {
         console.log(error);
      }, options);
   };
});
