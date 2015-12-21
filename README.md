# Runtur

Bar finding and hopping Ionic App

## App Style Guide

- Use 3 spaces to indent

- Try not to go over 85 characters per line

- Files should be ideally no longer than 400 lines

## Javascript Style Guide

- Use 'usestrict';

- Always use semicolons

- Use camelCase for variables

- Use single quotes '' for strings.

- Use === and !== over == and !=.

- Always use braces even for single if statements

- Use the literal syntax for array and object creation.

// good
var arrays = [];
var objects = {};

### Naming Conventions

- Avoid single letter names when naming variables and functions. Be descriptive with
your naming.

```javascript
   // bad
   function q() {
     // ...stuff...
   }

   // good
   function query() {
     // ..stuff..
   }
```

- Use a leading underscore _ when naming private properties or functions/methods.

```javascript
   // bad
   this.__firstName__ = 'Panda';
   function privateQuery() {
      // ...
   }

   // good
   this._firstName = 'Panda';
   function _query() {
      // ...
   }
```

- When saving a reference to this use self.

```javascript

   // bad
   function() {
     var _this = this;

     return function() {
       console.log(_this);
     };
   }

   // good
   function() {
     var self = this;

     return function() {
       console.log(self);
     };
   }
```

- Name your anonymous functions. This is helpful for stack traces and debugging.

```javascript
   // bad
   var log = function(msg) {
     console.log(msg);
   };

   // good
   var log = function log(msg) {
     console.log(msg);
   };
```

### Variables

- Use one `var` declaration per variable.

It's easier to add new variable declarations this way, and you never have
to worry about swapping out a `;` for a `,` or introducing punctuation-only
diffs.

```javascript
   // bad
   var items = getItems(),
       goSportsTeam = true,
       dragonball = 'z';

   // good
   var items = getItems();
   var goSportsTeam = true;
   var dragonball = 'z';
```

- Declare unassigned variables last. This is helpful when later on you might need to
assign a variable depending on one of the previous assigned variables.


## Angular Style Guide

### Naming Conventions

- All factories, services, and providers should be named XxxxService so when injected
you know you are dealing with a service.

- All controllers should be named XxxxxController
