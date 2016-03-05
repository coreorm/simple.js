/**
 * todo app
 * use advanced features
 */
(function () {
  var app = SimpleApp('todo-list');
  app.template.main.default = '<section class="panel tasks-widget panel-primary">' +
    '<header class="panel-heading">Todo list</header>  ' +
    '<div class="panel-body">' +
    '<div class="task-content">{list}</div>' +
    '<div class=" add-task-row">{btnAdd}{itemEntry}</div></div>' +
    '</section>';

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
      default: '<li {attr}><div class="task-checkbox"><input type="checkbox" class="list-child" {attr-done}></div>' +
      '<div class="task-title"><span class="task-title-sp">{_lbl}</span>' +
      '<div class="pull-right">' +
      '<button class ="btn btn-danger btn-xs" {attr-trash}>trash</button>' +
      '</div></div>' +
      '</li>'
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

  app.init(document.getElementById('apps'), false);
  app.render(true);

  // callback: add item
  app.on(SimpleAppStateIsUpdated, 'btnAdd', function (obj) {
    console.log('add ' + app.state.itemEntry);
    if (app.state.itemEntry.length > 0) {
      // add to data, then render
      app.data.list.element.push({
        _lbl: app.state.itemEntry
      });
      app.render();
    }
  });

  app.on(SimpleAppStateIsUpdated, 'list', function (obj) {
    console.log(obj);
  });

})();