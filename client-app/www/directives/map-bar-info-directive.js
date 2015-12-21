/**
 * @ngdoc directive
 *
 * @name mapBarInfo
 *
 * @description
 *
 *
 * @param {expression} imageonload
 */
RunturModule
.directive('mapBarInfo', function() {
   'use strict';

   return {
      restrict: 'E',
      link: function(scope, element) {

      },
      template: '<div ng-repeat="bar in bars" class="map-bar-info">' +
                     '{{bar.name}}' +
                   '<img ng-src="">' +
                '</div>'
   };
});