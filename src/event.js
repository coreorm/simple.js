/**
 * event model to replace default event model (so IE will work too)
 */
(function (global) {
  'use strict';
  global.SimpleEvent = {
    eventCache: {}, listen: function (e, t) {
      this.eventCache[e] = this.eventCache[e] || [];
      this.eventCache[e].push(t);
    }, emit: function (e, t) {
      if (this.eventCache[e] && this.eventCache[e].length > 0) {
        for (var h in this.eventCache[e]) {
          var n = this.eventCache[e][h];
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