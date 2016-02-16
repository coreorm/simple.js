/**
 * simple app
 * App base
 */
(function (w) {
  'use strict';
  // lib
  String.prototype.hashCode = function () {
    var hash = 0, i, chr, len;
    if (this.length === 0) return hash;
    for (i = 0, len = this.length; i < len; i++) {
      chr = this.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0;
    }
    return Math.abs(hash);
  };
  /**
   * string converter
   * @param obj
   * @private
   */
  var _s = function (obj) {
    return JSON.stringify(obj);
  };
  /**
   * obj copier
   * @param obj
   * @private
   */
  var _c = function (obj) {
    return JSON.parse(JSON.stringify(obj));
  };
  /**
   * app base class
   * @param name
   * @param cnf
   */
  var app = function (name, cnf) {
    // defaults
    name = _s(name).hashCode();
    var prefix = '_sj_' + name;
    this.name = name;
    // register app
    w[prefix] = this;
    // local storage key
    this.localStorageKey = prefix + '_data';
    this.container = null;
    // state of the app
    this.state = {};
    this.pState = {};
    // cnf default
    this.cnf = {
      localStorageWrite: true,
      localStorageRead: true,
      partialRender: true
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

    // override with external cnf
    if (typeof cnf == 'object') {
      for (var k in cnf) {
        this.cnf[k] = cnf[k];
      }
    }
    /**
     * update state of an element
     * @param elementOrName, if value presents and this param is string, this will be a direct update
     * @param valueOrNull optional, if the first param is element with value, it will use that
     */
    this.updateState = function (elementOrName, valueOrNull) {
      var name, value, el;
      if (typeof elementOrName == 'string') {
        console.log('=> update state by name/value', elementOrName, valueOrNull);
        name = elementOrName;
        value = valueOrNull;
        this.state[elementOrName] = valueOrNull;
      } else if (typeof elementOrName == 'object' && typeof elementOrName.nodeName == 'string') {
        console.log('=> update state by element', elementOrName);
        // must be object
        el = elementOrName;
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
      // save local if necessary
      this.store();
      // callback
      this.stateIsUpdated({
        name: name,
        value: value,
        element: el,
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
      if (typeof this.callback.stateIsUpdated[data.name] == 'function') {
        var c = this.callback.stateIsUpdated[data.name];
        return c(data);
      }
      return data;
    };
    /**
     * template engine
     * @param template
     * @param data
     * @returns {*}
     */
    this.htmlTemplate = function (template, data) {
      try {
        var output = template;
        for (var n in data) {
          var search = new RegExp('{' + n + '}', 'g'), rep = data[n];
          output = output.replace(search, rep);
        }
        return output;
      } catch (e) {
        console.log('[Error] html template failure', e);
        return '';
      }
    };
    /**
     * store state in local storage
     */
    this.store = function () {
      if (this.cnf.localStorageWrite && typeof window.localStorage == 'object') {
        window.localStorage.setItem(this.localStorageKey, _s(this.state));
      }
    };
    /**
     * retrieve state from local storage
     */
    this.load = function () {
      if (this.cnf.localStorageRead && typeof window.localStorage == 'object') {
        var d = window.localStorage.getItem(this.localStorageKey);
        if (!d) return;
        try {
          this.state = JSON.parse(d);
        } catch (e) {
          console.log('Unable to parse state ' + d, e);
        }
      }
    };
    /*------ elements cnf ------*/
    /**
     * template: must have default template, or render will return empty string
     * if 'selected' template is available, when data fits in the current state, it will use selected state
     * within template, use
     * {__s} for save state calls, e.g. {__s}('foo', 'bar') or {__s}s(this) for elements
     * @type {{main: {}, sub: {}}}
     */
    this.template = {main: {}, sub: {}};
    /**
     * data for elements
     * @type {{main: {}, sub: {}}}
     */
    this.data = {};
    /**
     * previous data
     * @type {{main: {}, sub: {}}}
     */
    this.pData = {};
    /**
     * elements cache
     * @type {{}}
     */
    this.cache = {};
    /**
     * callback: get element style
     * @param elName
     * @param state
     * @param data
     */
    this.getElementStyle = function (elName, state, data) {
      // check if callback is registered
      if (typeof this.callback.getElementStyle[elName] == 'function') {
        var c = this.callback.getElementStyle[elName];
        return c(state, data);
      }
      if (state) {
        var s = _s(state);
        var v = _s(data.value);
        return (s.indexOf(v) >= 0) ? 'selected' : 'default';
      }
      return 'default';
    };
    this.eId = function (elName) {
      return prefix + '_el_' + elName;
    };
    /**
     * callback: custom data parser
     * @param elName
     * @param state
     * @param data
     * @param type
     * @param subNodeCnt if > 0, it's a sub node
     * @returns {{}}
     */
    this.parseElementData = function (elName, state, data, type, subNodeCnt) {
      if (!data) data = {};
      // check if callback is registered
      if (typeof this.callback.parseElementData[elName] == 'function') {
        var c = this.callback.parseElementData[elName];
        data = c(state, data);
      }
      // prepare with attributes, allowed list (+ wildcar 'data-*', 'on*'):
      var aa = ['accesskey', 'name', 'class', 'dir', 'id', 'lang', 'style', 'tabindex', 'title', 'src', 'type',
        'placeholder', 'selected', 'checked', 'readonly', 'disabled', 'target', 'media', 'href', 'value'];
      var d = {}, a = [];

      data.name = elName;

      if (subNodeCnt > 0) {
        if (type != 'select') {
          if (!data.id) data.id = this.eId(elName + '_' + subNodeCnt);
        }
      } else {
        if (!data.id) data.id = this.eId(elName);
      }
      // generate on[change] by type
      var act = prefix + '.updateState(this)';
      if (!subNodeCnt) {
        switch (type) {
          case 'select':
            data.onchange = act;
            break;
          case 'input':
            data.onkeyup = act;
            if (!data.value) {
              data.value = state;
            }
            break;
          default:
            if (type) data.onclick = act;
            break;
        }
      }
      // select
      if (subNodeCnt === true && _s(state).indexOf(_s(data.value)) >= 0) {
        if (type == 'select' || type == 'radio') {
          data.selected = 'selected';
        }
        if (type == 'checkbox') {
          data.checked = 'checked';
        }
      }

      for (var i in data) {
        d[i] = data[i];
        if (aa.indexOf(i) >= 0 || i.indexOf('data-') >= 0 || i.indexOf('on') >= 0) {
          a.push(i + '="' + data[i] + '"');
        }
      }
      d.attr = a.join(' ');
      return d;
    };
    /**
     * get element by name
     * @param elName
     * @returns {Element}
     */
    this.node = function (elName) {
      return document.getElementById(this.eId(elName));
    };
    /*------ render ------*/
    /**
     * main template style
     * @type {string}
     */
    this.style = 'default';
    /**
     * html to node replace
     * @param src
     * @param node must have node
     * @returns {*}
     */
    this.h2n = function (src, node) {
      // need parent, or kill
      var p = node.parentElement;
      if (p) {
        var pn = p.cloneNode();
        pn.innerHTML = src;
        // replace now
        p.replaceChild(pn.firstChild, node);
      }
    };
    /**
     * render entire app
     */
    this.render = function () {
      this.willRender();
      console.log('=> Rendering Main Template For app: ' + this.name);
      if (!this.container) throw new Error('Invalid container specified');
      var s = this.style;
      var t = this.template.main[s];
      var d = this.cache;
      if (!t) throw new Error('Invalid master template for style: ' + s);
      var elementIsUpdated = false;
      for (var n in this.template.sub) {
        // partial if enabled
        if (this.cnf.partialRender && _s(this.state[n]) == _s(this.pState[n]) && typeof d[n] == 'string' && _s(this.data[n]) == _s(this.pData[n])) {
          console.log('Partial rendering - render from cache for ' + n); // no need to set anything
        } else {
          var src = this.renderElement(n);
          // here's the fun part - if obj is in there, do it!
          var node = this.node(n);
          if (node) {
            if (typeof src == 'string' && src.length > 0) {
              this.h2n(src, node);
            } else {
              console.log('Node has children, and will be replaced one by one');
            }
          } else {
            if (typeof src == 'string' && src.length > 0) {
              // this means it's fully rendered
              console.log('New Render Generated for ' + n);
              d[n] = src;
              elementIsUpdated = true;
            }
          }
        }
      }
      // make previous state the same as current now
      this.pState = _c(this.state);
      // also make previous data the same as current data in elements
      this.pData = _c(this.data);
      // verify changes
      if (!elementIsUpdated) {
        // nothing is really changed, DO NOT render again
        console.log('Data is unchanged, and no elements are changed, stop rendering');
        return;
      }
      console.log('Data is changed, rendering the whole thing');
      this.container.innerHTML = this.htmlTemplate(t, d);
      // finally, run did render
      this.didRender();
      console.log('=> Finish Rendering');
    };
    /**
     * render single element
     * @param elName
     * @returns {*}
     */
    this.renderElement = function (elName) {
      if (typeof this.template.sub[elName] != 'object') {
        console.log('[Warning] No element template found - return empty string');
        return '';
      }
      // figure out the type (from template._type)
      var data = this.data[elName] || {}, state = this.state[elName] || '';
      console.log('=> Rendering ' + elName + ' with state: ', _s(state));
      // if custom render function exists, use it.
      if (typeof this.callback.renderElement[elName] == 'function') {
        var c = this.callback.renderElement[elName];
        return c(state, data);
      }
      // does it have a wrapper? if not, render as a single element
      var t = this.template.sub[elName], type = t._type;
      var self = this;
      if (t._wrapper) {
        if (!data.wrapper) data.wrapper = {};
        // render as wrapper
        var wAttr = this.parseElementData(elName, state, data.wrapper, t._type), elData = data.element || [], m = 0, output = '';
        elData.map(function (item) {
          m++;
          var di = _c(item);
          var si = self.getElementStyle(elName, state, di);
          var ti = self.template.sub[elName][si];
          var datai = self.parseElementData(elName, state, di, t._type, m);
          if (!ti) ti = self.template.sub[elName]['default'];
          // wait - do we have this sub node yet?
          var snode = self.node(elName + '_' + m);
          var nodeSrc = self.htmlTemplate(ti, datai);
          // partial rendering
          if (snode && self.cnf.partialRender) {
            // verify if node needs to be re-rendered
            var n = m - 1, before = _s(self.pData[elName].element[n]), after = _s(self.data[elName].element[n]);
            if (before != after) {
              console.log('=> Render: node for element:' + elName + '_' + m + ' should be replaced', snode, nodeSrc);
              self.h2n(nodeSrc, snode);
              // then fix pData here too
              self.pData[elName].element[n] = _c(self.data[elName].element[n]);
            } else {
              // same!
              console.log('node for element ' + elName + ':' + m + ' is unchanged, do not render');
            }
          } else {
            console.log('re-render the reset');
            output += nodeSrc;
          }
        });
        if (typeof output == 'string' && output.length > 1) {
          console.log('>>> ' + elName + ' output length is ' + output.length);
          output = self.htmlTemplate(t._wrapper[0], wAttr) + output + t._wrapper[1];
        } else {
          return '';
        }
      } else {
        var si = this.getElementStyle(elName, state, data);
        var ti = this.template.sub[elName][si];
        var datai = this.parseElementData(elName, state, data, t._type);
        if (!ti) ti = this.template.sub[elName]['default'];
        output += this.htmlTemplate(ti, datai);
      }
      return output;
    };
    /*------ init ------*/
    /**
     * init app
     * @param container
     * @param autoRender
     */
    this.init = function (container, autoRender) {
      if (container) this.container = container;
      // load state from local storage if applicable
      this.load();
      if (autoRender === false) return;
      // next, render
      this.appStart();
      this.render();
      this.appFinish();
    };
    /*------ app callbacks (to be implemented) ------*/
    /**
     * app start, only run once
     */
    this.appStart = function () {
    };
    /**
     * app finish, only run once
     */
    this.appFinish = function () {
    };
    /**
     * app will render, run each time before rendering
     */
    this.willRender = function () {
    };
    /**
     * app finished rendering, run each time before rendering
     */
    this.didRender = function () {
    };
    /**
     * export as querystring
     */
    this.toQuerystring = function () {
      var qs = [];
      for (var n in this.state) {
        var v = this.state[n];
        if (v) {
          qs.push(n + '=' + v);
        }
      }
      return qs.join('&');
    };
  };
  /*------ export ------*/
  var z = {};
  /**
   * create / retrieve a single app
   * @param name
   * @param config | note: this is the system config
   * @returns {SimpleApp}
   */
  w.SimpleApp = function (name, config) {
    if (!z[name]) z[name] = new app(name, config);
    return z[name];
  };

  /**
   * Simple event listener
   * @type {{c: {}, listen: Function, emit: Function}}
   */
  w.SimpleEvent = {
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
  // nodejs compatible
  if (typeof exports != 'undefined') {
    exports.SimpleApp = w.SimpleApp;
    exports.SimpleEvent = w.SimpleEvent;
  }
})(this);
