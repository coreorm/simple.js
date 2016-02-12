// integrity test
var assert = require('assert');
var App = require('../src/app.js').SimpleApp;

describe('Simple App', function () {
  describe('constructor', function () {
    it('should have a default config', function () {
      var name = 'test-app';
      var app = new App(name);
      assert.ok(app.name == name, 'Name should be the same');
      assert.ok(Object.keys(app.config).length > 0, 'default config exists');
    });
    it('Should make each app unique', function () {
      var app1 = new App('App1', {
        shouldSaveStateToLocalStorage: false
      });
      var app2 = new App('App2', {
        shouldSaveStateToLocalStorage: true
      });
      assert.notEqual(app1.name, app2.name);
      assert.notEqual(app1.config, app2.config);
      assert.notEqual(app1, app2);
    });
  });
});