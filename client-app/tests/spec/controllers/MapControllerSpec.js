describe('MapController', function() {
   'use strict';

   var controller;
   var scope;

   beforeEach(module('runtur'));

   beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      controller = $controller('MapController', { $scope: scope });
   }));


});