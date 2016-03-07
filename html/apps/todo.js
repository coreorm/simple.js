/**
 * todo app
 * use advanced features
 */
(function () {
  var app = SimpleApp('todo-list');
  app.template.main.default = '<section class="panel tasks-widget panel-primary"><header class="panel-heading">Todo list</header><div class="panel-body"><div class="task-content">{list}</div><div class=" add-task-row">{btnAdd}{itemEntry}</div></div></section>';
  app.template.sub = {
    itemEntry: {
      _type: 'input',
      default: '<input {attr} class="form-control" type="text">'
    },
    btnAdd: {
      _type: 'button',
      default: '<a {attr} class="btn btn-success btn-sm pull-left" href="#">{_lbl}</a>'
    },
    list: {
      _wrapper: ['<ul {attr}>', '</ul>'],
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
      default: '<li {attr}><div class="task-checkbox"><input type="checkbox" class="list-child" {attr-done}></div><div class="task-title"><span class="task-title-sp">{_lbl}</span><div class="pull-right"><button class ="btn btn-danger btn-xs" {attr-trash}>trash</button></div></div></li>'
    }
  };
  app.data = {
    btnAdd: {
      _lbl: 'Add'
    },
    itemEntry: {
      style: 'width:80%'
    },
    list: {
      wrapper: {
        class: 'task-list'
      },
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
    // ^ really that's just it, no need for anything more
  });
  app.init(document.getElementById('apps'), false);
  app.render(true);
  // callback: add item
  app.on(SimpleAppStateIsUpdated, 'btnAdd', function (obj) {
    if (app.state.itemEntry.length > 0) {
      addItem(app.state.itemEntry);
      app.store();
      app.render();
    } else {
      alert('Please enter the item entry');
    }
  });
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