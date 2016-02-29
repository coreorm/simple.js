/**
 * virtual node
 * @param {string} src
 * @param {object} parentNode
 */
vNode = function (src, parentNode) {
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
   * insert to the left
   * @param {object} node new node to insert before
   * @param {object} [parent=null] parent node
   */
  this.left = function (node, parent) {
    var targ = node;
    if (node instanceof vNode) targ = node.node;
    if (parent) this.parent = parent;
    try {
      this.parent.insertBefore(this.node, targ);
    } catch (e) {
      console.log('ERROR: vNode.left()', e);
    }
  };
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
  /**
   * update node html
   * @param {string} html
   */
  this.updateHTML = function (html) {
    try {
      var n = this.parent.cloneNode(false);
      var oldNode = this.node;
      n.innerHTML = html;
      this.node = n.firstChild;
      this.parent.replaceChild(this.node, oldNode);
    } catch (e) {
      console.log('ERROR: vNode.updateHTML()', html, e);
    }
  };
  /**
   * append a single vNode
   * @param {vNode} vNode
   */
  this.appendVNode = function (vNode) {
    this.node.appendChild(vNode.node);
  };
  /**
   * append multiple vnodes
   * @param {array} vNodes
   */
  this.appendVNodes = function (vNodes) {
    var self = this;
    try {
      vNodes.map(function (el) {
        self.node.appendChild(el.node);
      });
    } catch (e) {
      console.log('ERROR: vNode.appendVNodes()', e);
    }
  };
  this.remove = function () {
    this.node.remove();
  };
};