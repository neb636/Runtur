/**
 * @ngdoc directive
 *
 * @name imageonload
 *
 * @description
 * Give a more mobile feel by fading in once image fully loaded
 *
 * @param {expression} imageonload
 */
RunturModule
.directive('imageonload', function() {
   'use strict';

   return {
      restrict: 'A',
      link: function(scope, element) {
         element.bind('load', function() {
            element[0].classList.add('loaded');
         });
      }
   };
});