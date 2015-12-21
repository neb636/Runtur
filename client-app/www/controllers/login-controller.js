/**
 * @ngdoc controller
 *
 * @name LoginController
 */
RunturModule
.controller('LoginController', function(AuthService) {
   'use strict';

   var self = this;

   // Initially set no user to be logged in
   self.user = null;

   // Logs a user in with Facebook
   self.facebookLogin = function facebookLogin() {
      AuthService.loginWithFacebook()

      .then(function(authData) {
         console.log('We are logged in!', authData);
      })

      .catch(function(error) {
         console.error(error);
      });
   };

   self.emailLogin = function emailLogin() {
      //
   };

   // Logs a user out
   self.logout = AuthService.logout;

   // detect changes in authentication state
   // when a user logs in, set them to $scope
   AuthService.onAuth(function(authData) {
      self.user = authData;

      console.log(self.user);
   });
});