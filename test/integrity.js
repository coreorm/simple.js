// integrity test
var assert = require('assert');
var SimpleApp = require('../dist/simple.dev.js').SimpleApp;

describe('Simple App', function () {
  describe('constructor', function () {
    it('should have a default config', function () {
      var name = 'test-app';
      var app = SimpleApp(name);
      assert.ok(app.aName == name, 'Name should be the same');
      assert.ok(Object.keys(app.cnf).length > 0, 'default config exists');
    });
    it('Should make each app unique', function () {
      var app1 = SimpleApp('App1', {
        localStorageWrite: false
      });
      var app2 = SimpleApp('App2', {
        localStorageWrite: true
      });
      assert.notEqual(app1.name, app2.name);
      assert.notEqual(app1.cnf, app2.cnf);
      assert.notEqual(app1, app2);
    });
  });
});