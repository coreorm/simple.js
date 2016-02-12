/**
 * simple app
 * App base
 */
(function (global) {
  'use strict';
  // lib
  String.prototype.hashCode = function() {
    var hash = 0, i, chr, len;
    if (this.length === 0) return hash;
    for (i = 0, len = this.length; i < len; i++) {
      chr   = this.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0;
    }
    return hash;
  };
  /**
   * app base class
   * @param name
   * @param config
   */
  var app = function (name, config) {
    // defaults
    name = JSON.stringify(name).hashCode();
    var prefix = '__ss_app_' + name;
    this.name = name;
    // register app
    global[prefix] = this;
    // local storage key
    this.localStorageKey = prefix + '_data';
    this.container = null;
    // state of the app
    this.state = {};
    this.previousState = {};
    // config default
    this.config = {
      shouldSaveStateToLocalStorage: false,
      shouldLoadStateFromLocalStorage: false,
      enablePartialRendering: true
    };

    /**
     * callback registry
     * @type {{getElementStyle: {}}}
     */
    this.callback = {
      getElementStyle: {},
      renderElement: {},
      parseElementData: {},
      stateIsUpdated: {}
    };

    // override with external config
    if (typeof config == 'object') {
      for (var k in config) {
        this.config[k] = config[k];
      }
    }
    /**
     * update state of an element
     * @param elementOrName, if value presents and this param is string, this will be a direct update
     * @param valueOrNull optional, if the first param is element with value, it will use that
     */
    this.updateState = function (elementOrName, valueOrNull) {
      var name, value, element;
      if (typeof elementOrName == 'string') {
        console.log('=> update state by name/value', elementOrName, valueOrNull);
        name = elementOrName;
        value = valueOrNull;
        this.state[elementOrName] = valueOrNull;
      } else if (typeof elementOrName == 'object' && typeof elementOrName.nodeName == 'string') {
        console.log('=> update state by element', elementOrName);
        // must be object
        var el = elementOrName;
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
      this.stateIsUpdated({
        name: name,
        value: value,
        element: element,
        state: this.state
      });
    };
    /**
     * add callbacks to fire this for your own elements
     * or even directly over-write this function
     * @param data
     */
    this.stateIsUpdated = function (data) {
      // callback by name
      console.log('state updated: ', data);
      return data;
      if (typeof this.callback.stateIsUpdated[data.name] == 'function') {
        var c = this.callback.stateIsUpdated[data.name];
        return c(data);
      }
    };
    /**
     * template engine
     * @param template
     * @param data
     * @returns {*}
     */
    this.htmlTemplate = function (template, data) {
      console.log('replacing template ' + template, 'with', data);
      var output = template;
      for (var n in data) {
        var search = new RegExp(':' + n, 'g'), rep = data[n];
        output = output.replace(search, rep);
      }
      return output;
    };
    /**
     * store state in local storage
     */
    this.store = function () {
      if (this.config.shouldSaveStateToLocalStorage && typeof window.localStorage == 'object') {
        window.localStorage.setItem(this.localStorageKey, JSON.stringify(this.state));
      }
    };
    /**
     * retrieve state from local storage
     */
    this.load = function () {
      if (this.config.shouldLoadStateFromLocalStorage && typeof window.localStorage == 'object') {
        var d = window.localStorage.getItem(this.localStorageKey);
        if (!d) return;
        try {
          this.state = JSON.parse(d);
        } catch (e) {
          console.log('Unable to parse state ' + d, e);
        }
      }
    };
    /*------ elements config ------*/
    this.elements = {
      data: {},
      template: {}
    };
    /**
     * element data
     * can be preset or retrieved from ajax
     * @type {{main: {}, sub: {}}}
     */
    this.elements.data = {
      main: {},
      sub: {}
    };
    /**
     * template config
     * {
   *  elment name: {
   *    style: template
   *  }
   * }
     * must have default template, or render will return empty string
     * if 'selected' template is available, when data fits in the current state, it will use selected state
     * within template, use
     * :__ss for save state calls, e.g. :__ss('foo', 'bar') or :__ss(this) for elements
     * @type {{}}
     */
    this.elements.template = {
      main: {
        'default': ''
      },
      sub: {}
    };
    /**
     * callback: get element style
     * @param elName
     * @param state
     * @param dataKey
     * @param dataValue
     */
    this.getElementStyle = function (elName, state, dataKey, dataValue) {
      // check if callback is registered
      if (typeof this.callback.getElementStyle[elName] == 'function') {
        var c = this.callback.getElementStyle[elName];
        return c(state, dataKey, dataValue);
      }
      if (typeof dataValue != 'object' && state) {
        return (state.indexOf(dataValue) >= 0) ? 'selected' : 'default';
      }
      return 'default';
    };
    /**
     * callback: custom data parser
     * @param elName
     * @param state
     * @param dataKey
     * @param dataValue
     * @returns {*}
     */
    this.parseElementData = function (elName, state, dataKey, dataValue) {
      // check if callback is registered
      if (typeof this.callback.parseElementData[elName] == 'function') {
        var c = this.callback.parseElementData[elName];
        return c(state, dataKey, dataValue);
      }
      // default
      var t = {};
      t[dataKey] = dataValue;
      return t;
    };
    /*------ render ------*/
    /**
     * render entire app
     */
    this.render = function () {

    };
    /**
     * render single element
     * @param elName
     * @returns {*}
     */
    this.renderElement = function (elName) {
      if (typeof this.elements.template.sub[elName] != 'object') {
        console.log('[Warning] No element template found - return empty string');
        return '';
      }
      // now, find the 4 things: template, data, state, and style
      var data = this.elements.data.sub[elName] || {};
      var state = this.state[elName] || null;
      // if custom render function exists, use it.
      if (typeof this.callback.renderElement[elName] == 'function') {
        var c = this.callback.renderElement[elName];
        return c(state, data);
      }
      // otherwise, default
      var output = '';
      // render as list, even when there's only 1 item (then just render 1)
      // each item will have different styles by callback: this.getElementStyle(element, state, data);
      for (var n in data) {
        var v = data[n];
        var s = this.getElementStyle(elName, state, n, v);
        var t = this.elements.template.sub[elName][s];
        var data = this.parseElementData(elName, state, n, v);
        // update state interaction
        data['__ss'] = prefix + '.updateState';
        output += this.htmlTemplate(t, data);
      }
      return output;
    };
  };
  /*------ export ------*/
  global.SimpleApp = app;
  // nodejs compatible
  if (typeof exports != 'undefined') exports.SimpleApp = app;
})(this);
