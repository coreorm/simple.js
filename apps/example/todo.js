(function () {
  // load new css
  loadCss('theme/todo.css');
  // start app
  var app = SimpleApp('todo-list');
  app.template.main.default = '<div class="task-content">{list}</div><div class=" add-task-row">{itemEntry} {btnAdd}</div>';
  app.template.sub = {
    itemEntry: {
      _type: 'input',
      default: '<input {attr}>'
    },
    btnAdd: {
      _type: 'button',
      default: '<a {attr} class="btn btn-success btn-sm" href="javascript:void();">{_lbl}</a>'
    },
    list: {
      _wrapper: ['<div {attr}>', '</div>'],
      // the _sects key provides sections of elements within elements
      _sects: {
        trash: {
          _type: 'button',
          _action: 'trash'  // data-action for the set
        },
        done: {
          _type: 'checkbox',
          _action: 'done'
        }
      },
      default: '<div {attr} class="todo--item"><input class="todo--checkbox" type="checkbox" {attr-done}><label>{_lbl}</label> ' +
      '<button class="pull-right btn btn-danger btn-xs" {attr-trash}>trash</button></div>'
    }
  };
  app.data = {
    btnAdd: {
      _lbl: 'Add'
    },
    itemEntry: {
      type: 'text'
    },
    list: {
      element: []
    }
  };
  /* the little storage thingy */
  var itemsKey = 'data-todo-items';
  // little thing to store in localstorage
  var addItem = function (lbl) {
      app.state[itemsKey].count++;
      app.state[itemsKey].cache[app.state[itemsKey].count] = {
        label: lbl,
        done: false
      };
    },
    updateItem = function (index, lbl, done) {
      if (lbl) app.state[itemsKey].cache[index].lable = lbl;
      if (typeof done !== 'undefined') app.state[itemsKey].cache[index].done = (done === true);
    },
    removeItem = function (index) {
      delete app.state[itemsKey].cache[index];
    };
  // use app will render to check the current state
  app.on(SimpleAppWillRender, 'loadState', function () {
    // we load the state here and do render
    console.log('=> App starts', app.state);
    if (typeof app.state[itemsKey] === 'object') {
      app.data.list.element = [];
      // it should be in format of [{label: 'blah blah', done: true|false}]
      for (var i in app.state[itemsKey].cache) {
        var item = app.state[itemsKey].cache[i];
        var tmp = {
          _lbl: item.label,
          _item_key: i
        };
        if (item.done === true) {
          tmp.done = {
            checked: 'checked'
          };
        }
        // insert
        app.data.list.element.push(tmp);
      }
    } else {
      app.state[itemsKey] = {
        count: 0,
        cache: {}
      };
    }
  });
  // init the app
  app.init(document.getElementById('todo'), false);
  app.render(true);
  // callback: add item
  app.on(SimpleAppStateIsUpdated, 'btnAdd', function (obj) {
    if (app.state.itemEntry && app.state.itemEntry.length > 0) {
      addItem(app.state.itemEntry);
      app.store();
      app.render();
    } else {
      alert('Please type something');
    }
  });
  // callback: done or trash
  app.on(SimpleAppStateIsUpdated, 'list', function (obj) {
    if (!obj.dataset.action || !obj.dataset.name || !obj.dataset.index) return;  // no action
    switch (obj.dataset.action) {
      case 'done':
        // update state
        updateItem(obj.data._item_key, null, obj.element.checked);
        app.store();
        break;
      case 'trash':
        // remove it
        removeItem(obj.data._item_key);
        app.store();
        app.render(false);
        break;
    }
  });
})();