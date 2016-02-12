/**
 * Simple JS Manager
 * manages multiple apps and support async app creations (Using the event.js included)
 */
(function (global) {
  'use strict';
  global.SimpleAppManager = {
    apps: {},
    /**
     * create a single app
     * @param name
     * @param config | note: this is the system config
     * @returns {SimpleApp}
     */
    create: function (name, config) {
      var app = null;
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
    /**
     * run an existing app
     * @param name
     * @param container (optional) the main container for app to render, if not found, it will only excute main
     */
    run: function (name, container) {
      if (typeof this.apps[name] != 'object') {
        throw new Error('App ' + name + ' does not exist');
      }
      var app = this.apps[name];
      app.container = container;
      app.main();
    },
    getAppByName: function (name) {
      return this.apps[name] || new SimpleApp(name);
    }
  };
  // nodejs compatible
  if (typeof exports != 'undefined') exports.SimpleAppManager = global.SimpleAppManager;
})(this);