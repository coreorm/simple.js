(function (window) {
/*jslint browser: true*/
/*jslint node: true */
'use strict';
var w = window, con = window.console;

/**
 * current mini seconds
 * @returns {number}
 */
var ms = function () {
  return Date.now();
};
/**
 * is object empty?
 * @param obj
 * @returns {boolean}
 */
var oie = function (obj) {
  return Object.keys(obj).length === 0;
};

/**
 * virtual node
 * @param src
 * @param parentNode
 */
var vNode = function (src, parentNode) {
  this.src = src;
  parentNode = parentNode || document.createElement('div');
  this.parent = parentNode;
  try {
    var n = this.parent.cloneNode(false);
    n.innerHTML = this.src;
    this.node = n.firstChild;
  } catch (e) {
    con.log('ERROR:', e);
    return;
  }
  // apis
  this.left = function (node, parent) {
    var targ = node;
    if (node instanceof vNode) targ = node.node;
    if (parent) this.parent = parent;
    try {
      this.parent.insertBefore(this.node, targ);
    } catch (e) {
      con.log('ERROR: vNode.left()', e);
    }
  };
  this.right = function (parent) {
    try {
      if (parent) this.parent = parent;
      this.parent.appendChild(this.node);
    } catch (e) {
      con.log('ERROR: vNode.right()', e);
    }
  };
  this.replace = function (node) {
    var targ = node;
    if (node instanceof vNode) targ = node.node;
    try {
      this.parent = node.parentNode;
      this.parent.replaceChild(this.node, targ);
    } catch (e) {
      con.log('ERROR: vNode.replace()', e, node);
    }
  };
  this.updateHTML = function (html) {
    try {
      var n = this.parent.cloneNode(false);
      var oldNode = this.node;
      n.innerHTML = html;
      this.node = n.firstChild;
      this.parent.replaceChild(this.node, oldNode);
    } catch (e) {
      con.log('ERROR: vNode.updateHTML()', html, e);
    }
  };
  this.appendVNode = function (vNode) {
    this.node.appendChild(vNode.node);
  };
  this.appendVNodes = function (vNodes) {
    var self = this;
    try {
      vNodes.map(function (el) {
        self.node.appendChild(el.node);
      });
    } catch (e) {
      con.log('ERROR: vNode.appendVNodes()', e);
    }
  };
  this.remove = function () {
    this.node.remove();
  };
};

/**
 * document.getElementById
 * @param id
 * @returns {*}
 */
function d2e(id) {
  return document.getElementById(id);
}

/**
 * Events available
 */
w.SimpleAppStart = 'sta';
w.SimpleAppFinish = 'fin';
w.SimpleAppWillRender = 'wrd';
w.SimpleAppDidRender = 'drd';
w.SimpleAppRenderElement = 'rde';
w.SimpleAppParseElementData = 'ped';
w.SimpleAppStateIsUpdated = 'siu';

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
  return JSON.parse(_s(obj));
};
/**
 * app base class
 * @param name
 * @param cnf
 */
var app;
app = function (name, cnf) {
  this.aName = name;
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
    partialRender: true,
    skipEmptyData: true // if true, skip the template when data is empty
  };
  // override with external cnf
  if (typeof cnf == 'object') {
    for (var k in cnf) {
      this.cnf[k] = cnf[k];
    }
  }

  /**
   * callback registry
   * @type {{els: {}}}
   */
  this.cr = {
    sta: {},
    fin: {},
    wrd: {},
    drd: {},
    rde: {},
    ped: {},
    siu: {}
  };

  /**
   * get call by name and type
   * @param type
   * @param name
   * @returns {*}
   */
  this.gc = function (type, name) {
    if (name) {
      if (typeof this.cr[type][name] == 'function') {
        return this.cr[type][name];
      }
    } else {
      return this.cr[type];
    }
  };

  /**
   * event triggers
   * @param type
   * @param name
   * @param callback
   */
  this.on = function (type, name, callback) {
    if (typeof this.cr[type] == 'object') {
      if (typeof callback == 'function') {
        this.cr[type][name] = callback;
      }
    }
  };
  /**
   * fire events
   * @param type
   * @private
   */
  this._f = function (type) {
    var calls = this.gc(type);
    if (typeof calls == 'object') {
      for (var k in calls) {
        var call = calls[k];
        if (typeof call == 'function') {
          con.log('>> calls - ' + k, calls);
          call();
        }
      }
    }
  };
  /**
   * update state of an element
   * @param elementOrName, if value presents and this param is string, this will be a direct update
   * @param valueOrNull optional, if the first param is element with value, it will use that
   */
  this.updateState = function (elementOrName, valueOrNull) {
    var name, value, el;
    if (typeof elementOrName == 'string') {
      con.log('=> update state by name/value', elementOrName, valueOrNull);
      name = elementOrName;
      value = valueOrNull;
      this.state[elementOrName] = valueOrNull;
    } else if (typeof elementOrName == 'object' && typeof elementOrName.nodeName == 'string') {
      con.log('=> update state by element', elementOrName);
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
    // notify callback
    this.stateIsUpdated({
      name: name,
      value: value,
      element: el,
      state: this.state
    });
  };
  /**
   * add cr to fire this for your own elements
   * or even directly over-write this function
   * @param data
   */
  this.stateIsUpdated = function (data) {
    // callback by name
    var c = this.gc('siu', data.name);
    if (typeof c == 'function') return c(data);
    return data;
  };
  /**
   * template engine
   * @param template
   * @param data
   * @param doNotSkip if true, do not skip the undefined tags
   * @returns {*}
   */
  this.htpl = function (template, data, doNotSkip) {
    doNotSkip = (doNotSkip === true);
    try {
      var output = template;
      for (var n in data) {
        if (n.length > 0) {
          var search = new RegExp('{' + n + '}', 'g'), rep = data[n];
          output = output.replace(search, rep);
        }
      }
      // clean final output
      if (doNotSkip !== true) output = output.replace(/{[^<>}]+}/ig, '').replace(/{>([^}]+)}/ig, '{$1}');
      return output;
    } catch (e) {
      con.log('[Error] html template failure', e);
      return '';
    }
  };
  /**
   * store state in local storage
   */
  this.store = function () {
    if (this.cnf.localStorageWrite && typeof w.localStorage == 'object') {
      w.localStorage.setItem(this.localStorageKey, _s(this.state));
    }
  };
  /**
   * retrieve state from local storage
   */
  this.load = function () {
    if (this.cnf.localStorageRead && typeof w.localStorage == 'object') {
      var d = w.localStorage.getItem(this.localStorageKey);
      if (!d) return;
      try {
        this.state = JSON.parse(d);
      } catch (e) {
        con.log('[ERROR] Unable to parse state ' + d, e);
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
   * callback: get element style
   * @param elName
   * @param state
   * @param data
   */
  this.els = function (elName, state, data) {
    // is there style in template setting already?
    if (data._style) {
      con.log('>>> Style for ' + elName + ': ' + data._style);
      return data._style;
    }
    // otherwise, default
    if (state) {
      var s = _s(state);
      var v = _s(data.value);
      return (s.indexOf(v) >= 0) ? 'selected' : 'default';
    }
    return 'default';
  };
  /**
   * generate element id
   * @param elName
   * @returns {string}
   */
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
    var c = this.gc('ped', elName);
    if (typeof c == 'function') return c(state, data);
    // prepare with attributes, allowed list (+ wildcar 'data-*', 'on*'):
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
    d.selectState = '';
    // select
    if (subNodeCnt > 0 && _s(state).indexOf(_s(data.value)) >= 0) {
      con.log('check select: ' + state + ' <> ' + data.value);
      if (type == 'select') {
        data.selected = 'selected';
        d.selectState = 'selected="selected"';
      }
      if (type == 'checkbox' || type == 'radio') {
        data.checked = 'checked';
        d.selectState = 'checked="checked"';
      }
    }

    for (var i in data) {
      d[i] = data[i];
      // rule: all custom variables must start with _, others will be treated as attributes
      if (i.indexOf('_') < 0) {
        a.push(i + '="' + data[i] + '"');
      }
    }
    d.attr = a.join(' ');
    d.action = act;
    if (elName == 'welcomeStyle') con.log('>>> parseElementData', d);
    return d;
  };
  /**
   * get element by name
   * @param elName
   * @returns {Element}
   */
  this.node = function (elName) {
    return d2e(this.eId(elName));
  };
  /*------ render ------*/
  /**
   * main template style
   * @type {string}
   */
  this.style = 'default';
  /**
   * render entire app
   * @param full if true, force a complete render
   *
   * RUN LOGIC:
   * 1. data changed for el?
   *  1.1 is it a wrapper type?
   *    YES: go to 1.2
   *    NO:
   *      1.1.0 is the vNode non-existent?
   *        YES: new vNode()
   *        NO: is the template style changed?
   *          YES: new vNode
   *          NO: go to next
   *      1.1.1 is the data empty?
   *        YES: vNode.remove()
   *        NO: vNode.updateHTML()
   *  1.2 yes it's a wrapper
   *    1.2.0 is vNode non-existent?
   *      YES: new vNode plus children
   *      NO: go to next
   *    1.2.1 loop thru children:
   *      with each child:
   *      new data count > old data count?
   *      YES:
   *        vNode exists?
   *          YES: vNode.updateHTML() - no need to remove anything (so order doesn't really matter)
   *          NO: new vNode, vNode.right(parent);
   *     NO:
   *        count vNode and remove ones that are not in vNode.remove()
   */
  this.render = function (full) {
    var stime = ms();
    con.log('=> Start Rendering ' + this.aName);
    this._f('wrd');
    if (!this.container) throw new Error('Invalid container specified');
    // findout main template details
    var t = this.template.main[this.style];
    var d = {};
    if (!t) throw new Error('Invalid master template for style: ' + this.style);
    // logic: force render clears prevData, and that, is that.
    if (full === true) this.pData = {};
    // verify data presence
    if (oie(this.data) || _s(this.pData) == _s(this.data)) {
      // nothing to render - data is empty, or data is unchanged
      con.log('No data found, nothing will be rendered');
      return;
    }
    // set control: force render
    var forceRender = oie(this.pData);
    // start loop and render (and pass forceRender if necessary)
    for (var n in this.template.sub) {
      con.log('=> Render sub: ' + n);
      var tmp = this.renderElement(n, forceRender);
      if (tmp) d[n] = tmp;
    }
    if (forceRender || !oie(d)) {
      this.container.innerHTML = this.htpl(t, d);
    }
    // at the end, run callback and set state/data
    // make previous state the same as current now
    this.pState = _c(this.state);
    // also make previous data the same as current data in elements
    this.pData = _c(this.data);
    // callback
    this._f('drd');
    con.log('=> Finish Rendering in ' + (ms() - stime) + ' ms');
  };
  /**
   * render single element
   * @param elName
   * @param forceRender if true, for render without using node
   * @returns {*}
   */
  this.renderElement = function (elName, forceRender) {
    forceRender = (forceRender === true);
    // figure out the type (from template._type)
    var data = this.data[elName] || {}, state = this.state[elName] || '', output = '';

    if (typeof this.template.sub[elName] != 'object' || (oie(data) && this.cnf.skipEmptyData === true)) {
      con.log('[Warning] No element template found or empty data for ' + elName);
      // decide whether to remove it from parent...
      if (this.cnf.partialRender && !forceRender) {
        var existingNode = this.node(elName);
        if (existingNode) {
          con.log('No data found, remove node');
          existingNode.parentNode.removeChild(existingNode);
          return false;
        }
      }

      return '';
    }
    // if custom render function exists, use it.
    var c = this.gc('rde', elName);
    if (typeof c == 'function') return c(state, data);
    // is data changed? if not, do not render (when partial)
    if (_s(this.data[elName]) == _s(this.pData[elName])) {
      return false;
    }

    // does it have a wrapper? if not, render as a single element
    var t = this.template.sub[elName], type = t._type;
    var self = this;
    if (t._wrapper) {
      // logic: same or less -> vNode.updateHTML || vNode.remove(), more? vNode.right();
      if (!data.wrapper) data.wrapper = {};
      // render as wrapper
      var wAttr = this.parseElementData(elName, state, data.wrapper, t._type), elData = data.element || [], m = 0;
      // check prevData to ensure rendering take advantage of vNode or innerHTML
      var tmpData = this.pData[elName];
      var prevElementData = [];
      if (!tmpData) {
        // render all
        forceRender = true;
      } else {
        prevElementData = _c(tmpData.element);
      }
      // loop and remove
      var nodeParent = false;
      elData.map(function (item) {
        // start rendering
        m++;
        var di = _c(item);
        var si = self.els(elName, state, di);
        var ti = self.template.sub[elName][si];
        var datai = self.parseElementData(elName, state, di, t._type, m);
        if (!ti) ti = self.template.sub[elName]['default'];
        // is it select type?
        if (t._type == 'select') {
          // just render and go
          output += self.htpl(ti, datai);
          return;
        }

        // retreive node
        // 1st. if not partial, or force render, keep adding to it
        if (self.cnf.partialRender && !forceRender) {
          // logic - data less or more?
          var n = m - 1, before = self.pData[elName].element[n], after = self.data[elName].element[n], src = null;
          if (_s(before) == _s(after)) {
            // nothing is changed, do not render
            return;
          }
          var node = self.node(elName + '_' + m);
          if (!nodeParent) nodeParent = node.parentNode;
          // partial render here
          src = self.htpl(ti, datai);
          var vn;
          if (nodeParent) {
            if (node) {
              if (src) {
                vn = new vNode(src, nodeParent);
                vn.replace(node);
              }
            } else {
              // add some more to it
              if (nodeParent) {
                vn = new vNode(src, nodeParent);
                vn.right();
              } else {
                con.log('[ERROR] unable to find node parent, can not append');
              }
            }
          }

        } else {
          // render as a whole (select, or force render, or initial render)
          output += self.htpl(ti, datai);
        }
      });
      // removal when 1. nodeParent, 2. elPData exists
      if (nodeParent && prevElementData.length > elData.length) {
        prevElementData.map(function (el, item) {
            if (item >= m) {
              var node = self.node(elName + '_' + item);
              // remove childnode
              con.log('Remove child: ' + item);
              if (node) nodeParent.removeChild(node);
            }
          }
        );
      }

      if (typeof output == 'string' && output.length > 1) {
        output = self.htpl(t._wrapper[0], wAttr) + output + t._wrapper[1];
      } else {
        // stop here as it's replaced
        con.log('=> Render Element [' + elName + ']: using DOM.');
        return false;
      }
    } else {
      // single tag element - it should never be empty really - but lets work on it
      con.log('>>> render [' + elName + '] as a whole');
      var si = this.els(elName, state, data);
      var ti = this.template.sub[elName][si];
      var datai = this.parseElementData(elName, state, data, t._type);
      if (!ti) ti = this.template.sub[elName]['default'];
      output = this.htpl(ti, datai);
    }
    // logic: if node exists, replace html, otherwise, return it
    // verify if we have sibling enabled - so we can append it
    if (this.template.sub[elName]._sibling) {
      // append sibling
      var sibling = this.node(this.template.sub[elName]._sibling);
      if (sibling) {
        var newNode = new vNode(output, sibling.parentNode);
        newNode.right();
        return false;
      }
    }
    // 2nd - it must be partial and if node doesn't exists, return itself, otherwise, update by replacing node
    if (!forceRender && this.cnf.partialRender === true && output) {
      var node = this.node(elName), nn = null;
      // replace
      if (node) {
        nn = new vNode(output);
        nn.replace(node);
        return false;
      }
    }
    // finally, default
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
    this._f('sta');
    this.render();
    this._f('fin');
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
  // apis for fast access over data
  /**
   * locate the current data object
   * @param elName
   * @param nodePosition
   */
  this.d = function (elName, nodePosition) {
    if (!nodePosition) {
      return this.data[elName];
    }
    if (typeof this.data[elName].element == 'object' &&
      this.data[elName].element[nodePosition]) {
      return this.data[elName].element[nodePosition];
    }
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
// nodejs compatible
if (typeof exports != 'undefined') {
  exports.SimpleApp = w.SimpleApp;
  exports.SimpleEvent = w.SimpleEvent;
}
})
(this);