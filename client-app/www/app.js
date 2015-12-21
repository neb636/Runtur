/**
 * @ngdoc overview
 * @name Runtur module
 *
 * @description
 * Main module of the application.
 */
var RunturModule = angular.module('runtur', ['ionic'])

.run(function($ionicPlatform, SqliteService, PlacesService, $ionicLoading, $rootScope) {
   'use strict';

   $ionicPlatform.ready(function() {

      SqliteService.init();
      PlacesService.getBars();

      // Hide the accessory bar by default (remove this to show the accessory bar
      // above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
         cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
         cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
         // org.apache.cordova.statusbar required
         StatusBar.styleDefault();
      }
   });

   $rootScope.$on('loading:show', function() {
      $ionicLoading.show({
         template: 'foo'
      });
   });

   $rootScope.$on('loading:hide', function() {
      $ionicLoading.hide();
   });
})

.constant('FIREBASE_URL', 'https://crackling-heat-5986.firebaseio.com')

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
   'use strict';

   $ionicConfigProvider.templates.maxPrefetch(20);
   $httpProvider.interceptors.push("HttpInterceptorService");

   $stateProvider

   .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'views/tabs.html'
   })

   .state('tab.map', {
      url: '/map',
      views: {
         'tab-map' :{
            templateUrl: 'views/map.html',
            controller: 'MapController as map'
         }
      }
   })

   .state('tab.browse', {
      url: '/browse',
      views: {
         'tab-browse' :{
            templateUrl: 'views/browse.html',
            controller: 'BrowseController as browse',
            resolve: {
               bars: function(PlacesService) {
                  return PlacesService.getBars();
               }
            }
         }
      }
   })

   .state('tab.favorites', {
      url: '/favorites',
      views: {
         'tab-favorites' :{
            templateUrl: 'views/favorites.html',
            controller: 'FavoritesController as favorites',
            resolve: {
               favoriteBars: function(SqliteService) {
                  return SqliteService.favorite.getAll();
               }
            }
         }
      }
   })

      //.state('tab.checkIns', {
      //    url: '/check-ins',
      //    views: {
      //        'tab-check-ins' :{
      //            templateUrl: 'views/check-ins.html',
      //            controller: 'CheckInsController as checkIns',
      //            resolve: {
      //                checkIns: function(SqliteService) {
      //                    return SqliteService.checkIn.getAll();
      //                }
      //            }
      //        }
      //    }
      //})

      //.state('tab.login', {
      //    url: '/login',
      //    views: {
      //        'tab-login' :{
      //            templateUrl: 'views/login.html',
      //            controller: 'LoginController as login'
      //        }
      //    }
      //})

   .state('tab.settings', {
      url: '/settings',
      views: {
         'tab-settings' :{
            templateUrl: 'views/settings.html',
            controller: 'SettingsController as settings',
            resolve: {
               openBarsOnly: function(SqliteService) {
                  return SqliteService.setting.get('openBarsOnly', 'true');
               },
               photoUri: function(SqliteService) {
                  var defaultValue = 'assets/img/user.svg';
                  return SqliteService.setting.get('photoUri', defaultValue);
               }
            }
         }
      }
   });

   // if none of the above states are matched, use this as the fallback
   $urlRouterProvider.otherwise('/tab/map');

   nestedBarState('map');
   nestedBarState('browse');
   nestedBarState('favorites');

   /*
    * Used to keep code dry since child states cannot share multiple parent states
    * in UI Router
    */
   function nestedBarState(parentState) {
      var stateConfig = {
         url: '/' + parentState + '/:barId',
         views: {}
      };

      stateConfig.views['tab-' + parentState] = {
         templateUrl: 'views/bar.html',
         controller: 'BarController as bar',
         resolve: {
            barId: function($stateParams) {
               return $stateParams.barId;
            },
            // Pulls in cached params
            cachedBarInfo: function($stateParams, PlacesService) {
               return PlacesService.cachedBarInfo($stateParams.barId);
            },
            favoriteClass: function($stateParams, SqliteService) {
               return SqliteService.favorite.exist($stateParams.barId);
            }
            //checkIns: function($stateParams, SqliteService) {
            //   return SqliteService.checkIn.get($stateParams.barId);
            //}
         }
      };

      $stateProvider.state('tab.' + parentState + '-bar', stateConfig);
   }
});
