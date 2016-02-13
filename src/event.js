/**
 * event model to replace default event model (so IE will work too)
 */
(function (global) {
  'use strict';
  global.SimpleEvent = {
    c: {}, listen: function (e, t) {
      this.c[e] = this.c[e] || [];
      this.c[e].push(t);
    }, emit: function (e, t) {
      if (this.c[e] && this.c[e].length > 0) {
        for (var h in this.c[e]) {
          var n = this.c[e][h];
          try {
            n(t);
          } catch (c) {
            console.log("Error", c);
          }
        }
      }
    }
  };
  if (typeof exports != 'undefined') exports.SimpleEvent = global.SimpleEvent;
})(this);