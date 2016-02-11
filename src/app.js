/**
 * simple app
 */
'use strict';

(function (global) {
  /**
   * template engine
   * @param data
   * @param template
   * @returns {*}
   */
  function template(data, template) {
    var output = template;
    for (var n in data) {
      var search = new RegExp(':' + n, 'g'), rep = data[n];
      output = output.replace(search, rep);
    }
    return output;
  }

  /**
   * app base class
   * @param name
   * @param config
   */
  var app = function (name, config) {
    // defaults
    var prefix = '_SIMPLE_JS_APP_' + name;
    this.name = name;
    this.localStorageKey = prefix + '_data';
    this.container = null;

    this.config = {
      shouldSaveStateToLocalStorage: false,
      shouldLoadStateFromLocalStorage: false,
      enablePartialRendering: true
    };

    // override with external config
    if (typeof config == 'object') {
      for (var k in config) {
        this.config[k] = config[k];
      }
    }
  };
  /**
   * store state in local storage
   */
  app.store = function () {
    if (this.config.shouldSaveStateToLocalStorage && typeof window.localStorage == 'object') {
      window.localStorage.setItem(this.localStorageKey, JSON.stringify(this.state));
    }
  };
  /**
   * retrieve state from local storage
   */
  app.load = function () {
    if (this.config.shouldLoadStateFromLocalStorage && typeof window.localStorage == 'object') {
      var d = window.localStorage.getItem(this.localStorageKey);
      if (!d) return;
      try {
        this.state = JSON.parse(d);
      } catch (e) {
        !window.console || console.log('Unable to parse state ' + d, e);
      }
    }
  };
  /**
   * update state of an element
   * @param elementOrName, if value presents and this param is string, this will be a direct update
   * @param valueOrNull optional, if the first param is element with value, it will use that
   */
  app.updateState = function (elementOrName, valueOrNull) {
    var name, value, element;
    if (typeof elementOrName == 'string') {
      name = elementOrName;
      value = valueOrNull;
      this.state[elementOrName] = valueOrNull;
    } else if (typeof element == 'object' && typeof el.nodeName == 'string') {
      // must be object
      var el = element;
      var nodeName = el.nodeName;
      var type = el.type;
      if (nodeName == 'SELECT') {
        type = 'select';
      }
      name = el.name;
      value = el.value;
      switch (type) {
        case 'select':
        case 'text':
        case 'radio':
          this.state[name] = value;
          break;
        case 'checkbox':
          if (!this.state[name]) {
            this.state[name] = [];
          }
          if (el.checked && value.length > 0) {
            if (this.state[name].indexOf(value) < 0) {
              this.state[name].push(value);
            }
          } else {
            var pos = this.state[name].indexOf(value);
            if (pos >= 0) {
              this.state[name].splice(pos, 1);
            }
          }
          break;
        default:
          this.state[name] = value;
          break;
      }
    }
    // callback
    app.stateIsUpdated({
      name: name,
      value: value,
      element: element,
      state: this.state
    });
  };
  /**
   * implement this yourself
   * @param data
   */
  app.stateIsUpdated = function (data) {
  };

})(this);
