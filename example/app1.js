/**
 * example app
 */
(function () {
  var app = SimpleApp('app1', {
    localStorageRead: false
  });

  app.data = {
    // if type is wrapper
    bg: {
      element: [{
        label: 'default',
        value: '#FFF'
      },{
        label: 'color 1',
        value: '#A59477'
      }, {
        label: 'color 2',
        value: '#f896d8'
      }, {
        label: 'color 3',
        value: '#CEBE98'
      }, {
        label: 'color 4',
        value: '#CCC'
      }, {
        label: 'color 5',
        value: '#DAEAC7'
      }]
    },
    welcomeStyle: {
      element: [{
        label: 'default',
        value: 'default'
      }, {
        label: 'plain text',
        value: 'plain'
      }]
    },
    welcomeText: {
      placeholder: 'update welcome message in the top section',
      style: 'width:300px;'
    },
    submit: {
      type: 'button',
      class: 'btn btn-primary',
      caption: 'serialize state'
    }
  };

  // initial state:
  app.state.welcomeStyle = 'default';

  // main template: the variables should be the sub elements only, main template does not carry data
  app.template.main = {
    default: '<div class="container"><form>' +
    '{bg} {welcomeStyle} {welcomeText} {submit}' +
    '</form></div><div class="clearfix"></div>'
  };

// sub template - note the 2 different types
  app.template.sub = {
    bg: {
      _type: 'select',
      // special input such as SELECT can have a wrapper, or think <tr></tr>, etc.
      _wrapper: ['background: <select {attr}>', '</select>'],
      default: '<option {attr}>{label}</option>'
    },
    welcomeStyle: {
      _type: 'radio',
      _wrapper: ['<span>render style: ', '</span>'],
      default: '<label id="{id}" class="m-r-3"><input name="{name}" {selectState} value="{value}" ' +
      'type="radio" onclick="{action}"> {label} </label>'
    },
    welcomeText: {
      // all text input are type: input
      _type: 'input',
      default: '<input type="text" {attr} />'
    },
    submit: {
      _type: 'button',
      default: '<button {attr}>{caption}</button>'
    }
  };

  // capture sumbit in state update
  app.on(SimpleAppStateIsUpdated, 'submit', function () {
    alert('current state: ' + app.toQuerystring());
  });
  // update bg color with gender for fun
  app.on(SimpleAppStateIsUpdated, 'bg', function (data) {
    document.body.style.backgroundColor = app.state.bg;
  });
  // cross app interactions
  app.on(SimpleAppStateIsUpdated, 'welcomeText', function (data) {
    var OtherApp = SimpleApp('static_index');
    OtherApp.d('welcome').content = data.value;
    OtherApp.render();
  });
  app.on(SimpleAppStateIsUpdated, 'welcomeStyle', function (data) {
    var OtherApp = SimpleApp('static_index');
    OtherApp.d('welcome')._style = data.value;
    OtherApp.render();
  });
  app.on(SimpleAppDidRender, 'defaultBG', function (data) {
    document.body.style.backgroundColor = app.state.bg;
  });

  // init app (and auto render)
  app.init(document.getElementById('app1'), true);

})();
