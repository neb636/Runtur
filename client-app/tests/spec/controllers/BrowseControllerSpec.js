describe('BrowseController', function() {
   'use strict';

   var controller;
   var scope;

   beforeEach(module('runtur'));

   beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      controller = $controller('BrowseController', { $scope: scope });
   }));

   it('controller should be defined', function () {
      expect(controller).to.not.be.undefined;
   });
});