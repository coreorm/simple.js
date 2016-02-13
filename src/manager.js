/**
 * Simple JS Manager
 * manages multiple apps and support async app creations (Using the event.js included)
 */
(function (w) {
  'use strict';
  w.SimpleAppManager = {
    apps: {},
    /**
     * create a single app
     * @param name
     * @param config | note: this is the system config
     * @returns {SimpleApp}
     */
    create: function (name, config) {
      var app;
      if (typeof this.apps[name] == 'object') {
        console.log('App ' + name + ' is in memory, use it now');
        app = this.apps[name];
      } else {
        // create new app
        app = new SimpleApp(name, config);
        this.apps[name] = app;
      }
      return app;
    },
    getAppByName: function (name) {
      return this.apps[name] || new SimpleApp(name);
    }
  };
  // nodejs compatible
  if (typeof exports != 'undefined') exports.SimpleAppManager = w.SimpleAppManager;
})(this);