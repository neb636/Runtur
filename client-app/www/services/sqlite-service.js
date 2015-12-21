/**
 * @ngdoc service
 * @name SqliteService
 *
 * @description
 * Handel's all the Sqlite in the app.
 */
RunturModule
.factory('SqliteService', function($q, $ionicPlatform) {
   'use strict';

   var database = null;

   /**
    * @ngdoc method
    * @name SqliteService#init
    *
    * @description
    * Setup the database and create tables if first time used
    */
   var init = function() {
      // Different database if I am in the browser vs my phone
      try {
         database = window.sqlitePlugin.openDatabase({ name: 'runtur' });
      }
      catch(error) {
         database =  window.openDatabase('runtur', '1.0', 'database', -1);
      }

      _runQuery('DROP TABLE checkIns');

      // Create settings table
      _runQuery(
         'CREATE TABLE IF NOT EXISTS settings (name varchar primary key, value text)'
      );

      // Create favorites table
      _runQuery(
         'CREATE TABLE IF NOT EXISTS favorites (id varchar primary key, name text, dateTime datetime default current_timestamp)'
      );

      // Create check-ins table
      _runQuery(
         'CREATE TABLE IF NOT EXISTS checkIns (barId varchar, barName text, dateTime datetime default current_timestamp)'
      );
   };

   /**
    * Settings methods
    */
   var setting = {

      set: function settingSet(name, value) {
         var query = 'INSERT OR REPLACE INTO settings (name, value) VALUES (?, ?)';
         _runQuery(query, [name, value]);
      },

      get: function settingGet(name, defaultValue) {
         var deferred = $q.defer();
         var query = 'SELECT value FROM settings WHERE name = ?';

         _runQuery(query, [name]).then(function(result) {

            if (result.rowsAffected === 0) {
               deferred.resolve(defaultValue);
            }
            else {
               deferred.resolve(result.rows.item(0).value);
            }
         });

         return deferred.promise;
      }
   };

   /**
    * Favorites methods
    */
   var favorite = {

      set: function favoriteSet(id, name) {
         var query = 'INSERT OR REPLACE INTO favorites (id, name) VALUES (?, ?)';
         _runQuery(query, [id, name]);
      },

      unset: function favoriteUnset(id) {
         var query = 'DELETE FROM favorites WHERE id = ?';
         _runQuery(query, [id]);
      },

      getAll: function favoriteGetAll() {
         var deferred = $q.defer();
         var query = 'SELECT * FROM favorites';

         _runQuery(query).then(function(result) {
            var amount = result.rows.length;

            if (amount === 0) {
               deferred.resolve([]);
            }
            else {
               var favorites = [];

               for (var index = 0; index < amount; index++) {
                  favorites.push(result.rows.item(index));
               }
               deferred.resolve(favorites);
            }
         });

         return deferred.promise;
      },

      exist: function favoriteExist(barId) {
         var deferred = $q.defer();
         var query = 'SELECT * FROM favorites WHERE id = ?';

         _runQuery(query, [barId]).then(function(result) {

            if (result.rows.length === 0) {
               deferred.resolve(false);
            }
            else {
               deferred.resolve(true);
            }
         });

         return deferred.promise;
      }
   };

   /**
    * Check Ins methods
    */
   var checkIn = {

      set: function checkInSet(barId, barName) {
         var query = 'INSERT INTO check_ins (barId, barName) VALUES (?)';
         _runQuery(query, [barId, barName]);
      },

      get: function(barId) {
         var deferred = $q.defer();
         var query = 'SELECT * FROM check_ins where barId = ?';

         _runQuery(query, [barId]).then(function(result) {
            var amount = result.rows.length;

            if (amount === 0) {
               deferred.resolve([]);
            }
            else {
               var checkIns = [];

               for (var index = 0; index < amount; index++) {
                  checkIns.push(result.rows.item(index));
               }
               deferred.resolve(checkIns);
            }
         });

         return deferred.promise;
      },

      getAll: function checkInGetAll() {
         var deferred = $q.defer();
         var query = 'SELECT * FROM check_ins';

         _runQuery(query).then(function(result) {
            var amount = result.rows.length;

            if (amount === 0) {
               deferred.resolve([]);
            }
            else {
               var checkIns = [];

               for (var index = 0; index < amount; index++) {
                  checkIns.push(result.rows.item(index));
               }

               deferred.resolve(checkIns);
            }
         });

         return deferred.promise;
      }
   };

   /**
    * @ngdoc method
    * @name _runQuery
    *
    * @description
    * Runs queries once Ionic is ready
    *
    * @private
    */
   function _runQuery(query, bindings) {
      var deferred = $q.defer();
      bindings = typeof bindings !== 'undefined' ? bindings : [];

      // Lets wait until cordova is ready
      $ionicPlatform.ready(function() {
         database.transaction(function(transaction) {

            transaction.executeSql(query, bindings, function(transaction, result) {
               deferred.resolve(result);
            }, function(transaction, error) {
               deferred.reject(error);
            });
         });
      });

      return deferred.promise;
   }

   // Return Public Methods
   return {
      init: init,
      setting: setting,
      favorite: favorite,
      checkIn: checkIn
   };
});