/**
 * @ngdoc service
 * @name HttpInterceptorService
 *
 * @description
 * Intercepts
 */
RunturModule
.factory('HttpInterceptorService', function($rootScope) {
   'use strict';

   return {

      /**
       * @ngdoc method
       * @name AuthService#loginWithProvider
       *
       * @description
       * Helper method to login with multiple providers
       */
      request: function(config) {
         $rootScope.$broadcast('loading:show');

         return config;
      },

      /**
       * @ngdoc method
       * @name AuthService#loginWithProvider
       *
       * @description
       * Helper method to login with multiple providers
       */
      response: function(response) {
         $rootScope.$broadcast('loading:hide');

         return response;
      }
   };
});


