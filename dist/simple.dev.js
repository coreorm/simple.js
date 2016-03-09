;(function (window) {
/*jslint browser: true*/
/*jslint node: true */
'use strict';
var w = window;
/**
 * current mini seconds
 * @returns {number}
 */
function ms() {
  return Date.now();
}
/**
 * is object empty?
 * @param {object} obj
 * @returns {boolean}
 */
function oie(obj) {
  return Object.keys(obj).length === 0;
}

/**
 * virtual node
 * @param {string} src
 * @param {object} parentNode
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
    console.log('ERROR:', e);
    return;
  }
  /**
   * insert to the right
   * @param {object} [parent=null] parent node
   */
  this.right = function (parent) {
    try {
      if (parent) this.parent = parent;
      this.parent.appendChild(this.node);
    } catch (e) {
      console.log('ERROR: vNode.right()', e);
    }
  };
  /**
   * replace given node with self
   * @param {object} node
   */
  this.replace = function (node) {
    var targ = node;
    if (node instanceof vNode) targ = node.node;
    try {
      this.parent = node.parentNode;
      this.parent.replaceChild(this.node, targ);
    } catch (e) {
      console.log('ERROR: vNode.replace()', e, node);
    }
  };
};

/**
 * document.getElementById
 * @param {string} id
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
 * @param {object} obj
 * @private
 */
function _s(obj) {
  return JSON.stringify(obj);
}
/**
 * obj copier
 * @param {object} obj
 * @private
 */
function _c(obj) {
  return JSON.parse(_s(obj));
}
/**
 * app base class
 * @param {string} name
 * @param {object} [cnf={}]
 */
var app;
app = function (name, cnf) {
  // current version from build
  this.version = '1.1.5';
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
  /**
   * config default
   * no data, no render
   */
  this.cnf = {
    localStorageWrite: true,
    localStorageRead: true,
    partialRender: true
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
  this.callbacks = {
    sta: {},
    fin: {},
    wrd: {},
    drd: {},
    rde: {},
    siu: {}
  };

  /**
   * get call by name and type
   * @param {string} type
   * @param {string} [name=null]
   * @returns {*}
   */
  this.getCallback = function (type, name) {
    if (name) {
      if (typeof this.callbacks[type][name] == 'function') {
        return this.callbacks[type][name];
      }
    } else {
      return this.callbacks[type];
    }
  };

  /**
   * event triggers
   * @param {string} type
   * @param {string} name
   * @param {function} callback
   */
  this.on = function (type, name, callback) {
    if (typeof this.callbacks[type] == 'object') {
      if (typeof callback == 'function') {
        this.callbacks[type][name] = callback;
      }
    }
  };
  /**
   * fire events
   * @param {string} type
   * @private
   */
  this._f = function (type) {
    var calls = this.getCallback(type);
    if (typeof calls == 'object') {
      for (var k in calls) {
        var call = calls[k];
        if (typeof call == 'function') {
          console.log('>> calls - ' + k, calls);
          call();
        }
      }
    }
  };
  /**
   * update state of an element
   * @param {*} elementOrName, if value presents and this param is string, this will be a direct update
   * @param {*} [valueOrNull=Null] optional, if the first param is element with value, it will use that
   */
  this.updateState = function (elementOrName, valueOrNull) {
    var name, value, el;
    if (typeof elementOrName == 'string') {
      console.log('=> update state by name/value', elementOrName, valueOrNull);
      name = elementOrName;
      value = valueOrNull;
      this.state[elementOrName] = valueOrNull;
    } else if (typeof elementOrName == 'object' && typeof elementOrName.nodeName == 'string') {
      // must be object
      el = elementOrName;
      var nodeName = el.nodeName;
      var type = el.type;
      if (nodeName == 'SELECT') {
        type = 'select';
      }
      name = el.dataset.name ? el.dataset.name : el.name;
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
        case 'button':
        case 'form':
          // do not set state for button/form - just notify state is updated.
          break;
        default:
          this.state[name] = value;
          break;
      }
    }
    // save local if necessary
    this.store();
    // get current data (by index/name if possible)
    var data = this.data[name], dataset = {};
    if (el && typeof el.dataset === 'object') {
      dataset = el.dataset;
      // find data...
      if (typeof data === 'object' && typeof data.element === 'object' && dataset.index) {
        data = data.element[dataset.index];
      }
    }
    console.log('Update obj: ', el, ' data: ', data);
    // notify callback
    this.stateIsUpdated({
      name: name,
      value: value,
      element: el,
      // double check as el may not exist - we can just call updateState(k,v) from anywhere, really
      dataset: dataset,
      state: this.state,
      data: data
    });
  };
  /**
   * add cr to fire this for your own elements
   * or even directly over-write this function
   * @param {object} data
   */
  this.stateIsUpdated = function (data) {
    // callback by name
    var c = this.getCallback('siu', data.name);
    if (typeof c == 'function') return c(data);
    return data;
  };
  /**
   * template engine
   * @param {string} template
   * @param {object} data
   * @param {boolean} [doNotSkip=true] if true, do not skip the undefined tags
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
      console.log('[Error] html template failure', e);
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
        console.log('[ERROR] Unable to parse state ' + d, e);
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
   * @param {string} elName
   * @param {object} state
   * @param {object} data
   *
   * @returns {*}
   */
  this.els = function (elName, state, data) {
    // is there style in template setting already?
    if (data._style) {
      console.log('>>> Style for ' + elName + ': ' + data._style);
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
   * @param {string} elName
   * @returns {string}
   */
  this.eId = function (elName) {
    return prefix + '_el_' + elName;
  };
  /**
   * get current type of event
   * @param type
   * @returns {*}
   */
  this.getEvent = function (type) {
    if (!type || type === '') return;
    if (type === 'select') return 'onchange';
    if (type === 'form') return 'onsubmit';
    if (type === 'input') return 'onkeyup';
    return 'onclick';
  };
  /**
   * callback: custom data parser
   * new logic:
   * data will be 2 types:
   * 1. single (1 level). e.g. {foo: 'bar'} - this requires no `{attr-[name]}` type tags in template
   * 2. multi (2 levels). e.g. {element: {foo: 'bar'}, element2: {foo: 'bar2'}}, and this requires `{attr-[name]}` template
   * 3. system reserved data keys (use these keys to define preferred action):
   *  3.1 _e_: the event - use keyup, keydown, change, click, select, etc. default is click.
   *  3.2 _n_: the element name - used for look up, this will endup in data-name
   *  3.3. _i_: the index (for wrap element only), this will endup in data-index
   *  and the above 2 are used for system node lookup only (for state update)
   * 4. keys starts with '_' will be ignored in the template, but stateIsUpdated callback will pass it in.
   * 5. all other keys will be used in attr (so you still may pass class, id, title, style, etc).
   *
   * Example:
   * single type:
   * ```
   * app.template.sub.foo = '<input name="foo" {attr}>';
   * app.data.foo = {
   *  _e_: 'keyup' // custom action when no type is specified
   * }
   * ```
   * wrapper type:
   * ```
   * app.template.sub.foo = {
   *  _wrapper: ['<ul name="foo" {attr}>', '</ul>'],
   *  default: '<li {attr}><input type="checkbox" {attr-check}><label>{_lbl}</label></li>'
   * }
   * app.data.foo = {
   *  wrapper: {class: 'list'},
   *  element: [
   *  {
   *    class: 'list-normal',
   *    _lbl: 'first item',
   *    check: {
   *      _e_: 'click',
   *      class: 'checkbox-normal'
   *    }
   *  },
   *  {
   *    class: 'list-normal',
   *    _lbl: 'Second item',
   *    check: {
   *      _e_: 'click',
   *      class: 'checkbox-special'
   *    }
   *  }
   *  ]
   * }
   * ```
   * So system will pickup the stuff automatically from template and data, and it will
   * 1. first, generate unique id for the first item (so {attr} must still be there)
   * 2. find the sub section and generate the {attr-section} for the subs
   *
   * The event: event will be figured out by given _type, otherwise _e_ will always override it
   *
   * @param {string} elName
   * @param {object} state
   * @param {object} data
   * @param {string} type (this is when there's only 1 sub type in there - if more, it will then use sub sections _e_)
   * @param {int} [subNodeCnt=0] if > 0, it's a sub node
   * @returns {{}}
   */
  this.parseElementData = function (elName, state, data, type, subNodeCnt) {
    // name to default - this is for inputs with names
    if (!data.name) data.name = elName;
    var attrs = [], parsedData = {};
    if (!data) data = {};
    if (subNodeCnt > 0) {
      attrs.push('data-index="' + (subNodeCnt - 1) + '"');
      if (type != 'select') {
        if (!data.id) data.id = this.eId(elName + '_' + subNodeCnt);
      }
    } else {
      if (!data.id) data.id = this.eId(elName);
    }
    // only one single id, ever
    parsedData.id = data.id;
    // generate on[change] by type
    var event = this.getEvent(type);
    if (type == 'input' && !data.value) {
      data.value = state;
      // build attr for these things
      attrs.push('data-name="' + elName + '"');
      attrs.push('name="' + elName + '"');
      attrs.push('data-state="' + state + '"');
    }
    // override
    if (data._e_) {
      event = 'on' + data._e_;
    }
    var act = prefix + '.updateState(this)';
    // event is not for options. thus
    if (type == 'select' & subNodeCnt > 0) {
      event = null;
    }
    if (event) {
      parsedData.act = act;
      attrs.push(event + '="' + act + '"');
    }
    // now, all other data should be outside for replacing if _, and those without, is in attrs
    for (var i in data) {
      var v = data[i];
      if (typeof v !== 'object') {
        // rule: all custom variables must start with _, others will be treated as attributes
        if (i.indexOf('_') < 0) {
          attrs.push(i + '="' + v + '"');
        }
        // just directly put in the data attrs
        parsedData[i] = v;
      }
    }
    // we'll find the template definition and create attributes for sections, if any.
    var template = this.template.sub[elName];
    if (typeof template._sects === 'object') {
      // create mini attrs
      for (var sectName in template._sects) {
        var tmp = [];
        // let's get the sects out from data
        var secKey = 'attr-' + sectName;
        var secData = (typeof data[sectName] === 'object') ? data[sectName] : {};
        // merge with template data
        var setting = template._sects[sectName];
        if (typeof setting === 'object') {
          for (var si in setting) {
            secData[si] = setting[si];
          }
          // type select
          if (setting._type) {
            var eS = this.getEvent(setting._type);
            if (eS) {
              tmp.push(eS + '="' + act + '"');
            }
          }
          // data action
          if (setting._action) {
            tmp.push('data-action="' + setting._action + '"');
          }
        }
        // setting has _e_?
        if (secData._e_) {
          tmp.push('on' + secData._e_ + '="' + act + '"');
        }
        for (var vi in secData) {
          if (vi.indexOf('_') < 0) {
            tmp.push(vi + '="' + secData[vi] + '"');
          } else {
            // underscore _foo goes to parent
            parsedData[vi] = secData[vi];
          }
        }
        // add index
        tmp.push('data-name="' + elName + '"');
        tmp.push('name="' + elName + '"');
        if (subNodeCnt > 0) {
          tmp.push('data-index="' + (subNodeCnt - 1) + '"');
        }
        // compose
        parsedData[secKey] = tmp.join(' ');
      }
    }
    // removed default attr for selected/checked
    console.log('=> Parsed Data:', parsedData);
    parsedData.attr = attrs.join(' ');
    // finally, return it
    return parsedData;
  };
  /**
   * get node by elementName
   * @param {string} elName
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
   * @param {boolean} [full=false] if true, force a complete render
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
    console.log('=> Start Rendering ' + this.aName);
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
      console.log('No data found, nothing will be rendered');
      return;
    }
    // set control: force render
    var forceRender = oie(this.pData);
    // start loop and render (and pass forceRender if necessary)
    for (var n in this.template.sub) {
      console.log('=> Render sub: ' + n);
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
    console.log('=> Finish Rendering in ' + (ms() - stime) + ' ms');
  };
  /**
   * render single element
   * @param {string} elName
   * @param {boolean} forceRender if true, for render without using node
   * @returns {*}
   */
  this.renderElement = function (elName, forceRender) {
    forceRender = (forceRender === true);
    // figure out the type (from template._type)
    var data = this.data[elName] || {}, state = this.state[elName] || '', output = '';

    if (typeof this.template.sub[elName] != 'object' || oie(data)) {
      console.log('[Warning] No element template found or empty data for ' + elName);
      // decide whether to remove it from parent...
      if (this.cnf.partialRender && !forceRender) {
        var existingNode = this.node(elName);
        if (existingNode) {
          console.log('No data found, remove node');
          existingNode.parentNode.removeChild(existingNode);
          return false;
        }
      }

      return '';
    }
    // if custom render function exists, use it.
    var c = this.getCallback('rde', elName);
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
      var prevElementData = [], isInitialRun = false;
      if (!tmpData) {
        // render all
        forceRender = true;
      } else {
        prevElementData = _c(tmpData.element);
        isInitialRun = (prevElementData.length === 0);
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
        if (self.cnf.partialRender && !forceRender && !isInitialRun) {
          // logic - data less or more?
          var n = m - 1, before = self.pData[elName].element[n], after = self.data[elName].element[n], src = null;
          // fix parent before comparing...
          var node = self.node(elName + '_' + m);
          if (!nodeParent && node) nodeParent = node.parentNode;
          if (_s(before) == _s(after)) {
            // nothing is changed, do not render
            return;
          }
          // partial render here
          src = self.htpl(ti, datai);
          var vn;
          if (nodeParent) {
            if (node) {
              if (src) {
                vn = new vNode(src, nodeParent);
                console.log('Replace: ' + src + ' with: ', node);
                vn.replace(node);
              }
            } else {
              // add some more to it
              if (nodeParent) {
                console.log('Append: ' + src + ' to: ' + nodeParent.id);
                vn = new vNode(src, nodeParent);
                vn.right();
              } else {
                console.log('[ERROR] unable to find node parent, can not append');
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
              var node = self.node(elName + '_' + (item + 1));
              // remove childnode
              console.log('Remove child: ' + item + ' from: ' + nodeParent.id);
              if (node) nodeParent.removeChild(node);
            }
          }
        );
      }
      // if m === 0 means there's no item, so just render the shell
      if ((typeof output == 'string' && output.length > 1) || m === 0) {
        output = self.htpl(t._wrapper[0], wAttr) + output + t._wrapper[1];
      } else {
        // stop here as it's replaced
        console.log('=> Render Element [' + elName + ']: using DOM.');
        return false;
      }
    } else {
      // single tag element - it should never be empty really - but lets work on it
      console.log('>>> render [' + elName + '] as a whole');
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
      // so initial run will fall here too
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
   * @param {string} container
   * @param {boolean} [autoRender=true]
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
   * export to query string
   * @returns {string}
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
  /**
   * apis for fast access over data
   * @param {string} elName
   * @param {int} [nodePosition=Null]
   * @returns {*}
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
 * THIS IS THE MAIN ENTRY POINT
 *
 * create / retrieve a single app
 *
 * e.g.
 * ```
 * var app = SimpleApp('my-app');
 * app.init(document.getElementById('app_container'), true);
 * ```
 * @param {string} name
 * @param {object} [config={}] | note: this is the system config
 * @returns {SimpleApp}
 */
var SimpleApp = function (name, config) {
  if (!z[name]) z[name] = new app(name, config);
  return z[name];
};
w.SimpleApp = SimpleApp;
// nodejs compatible
if (typeof exports != 'undefined') {
  exports.SimpleApp = SimpleApp;
}

})
(this);
