/**
 * example app
 */
(function () {
  var app = SimpleApp('app1');

  app.data = {
    // if type is wrapper
    bg: {
      element: [{
        label: 'color 1',
        value: 1
      }, {
        label: 'color 2',
        value: 2
      }, {
        label: 'color 3',
        value: 3
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
      _wrapper: ['background: <select {attr}><option>-pick color-</option>', '</select>'],
      default: '<option {attr}>{label}</option>'
    },
    welcomeStyle: {
      _type: 'radio',
      _wrapper: ['', ''],
      default: '<label id="{id}" style="margin-right:10px;"><input name="{name}" {selectState} value="{value}" ' +
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
    setColor(data.value);
  });
  // cross app interactions
  app.on(SimpleAppStateIsUpdated, 'welcomeText', function (data) {
    console.log('update welcome', data.value);
    var OtherApp = SimpleApp('static_index');
    OtherApp.data.welcome.content = data.value;
    OtherApp.render();
  });
  app.on(SimpleAppStateIsUpdated, 'welcomeStyle', function (data) {
    console.log('force render & update welcome style to ' + data.value);
    var OtherApp = SimpleApp('static_index');
    OtherApp.data.welcome._style = data.value;
    OtherApp.render();
  });
  app.on(SimpleAppDidRender, 'defaultBG', function (data) {
    console.log('>> call: should set color: ' + app.state.bg);
    setColor(app.state.bg);
  });

  function setColor(value) {
    switch (value) {
      case '1':
        color = '	#81c1e7';
        break;
      case '2':
        color = '#c4dfe1';
        break;
      default:
        color = '	#85a291';
        break;
    }
    document.body.style.backgroundColor = color;
  }

  // init app (and auto render)
  app.init(document.getElementById('app1'), true);

})();
