/**
 * example app
 */
(function () {
  var app = SimpleApp('app1', {
    localStorageRead: true
  });

  app.data = {
    hdr: {
      _text: 'App2: Cross App Interaction',
      _link: src('apps/app1.js')
    },
    bg: {
      wrapper:{
        name: 'bg'
      },
      element: [{
        _label: 'default',
        value: '#FFF'
      }, {
        _label: 'color 1',
        value: '#A59477'
      }, {
        _label: 'color 2',
        value: '#f896d8'
      }, {
        _label: 'color 3',
        value: '#CEBE98'
      }, {
        _label: 'color 4',
        value: '#CCC'
      }, {
        _label: 'color 5',
        value: '#DAEAC7'
      }]
    },
    welcomeStyle: {
      element: [{
        radioBtn: {
          _label: 'styled &nbsp;',
          value: 'default'
        }
      }, {
        radioBtn: {
          _label: 'plain text ',
          value: 'plain'
        }
      }]
    },
    welcomeText: {
      placeholder: 'update welcome message in the top section',
      style: 'width:90%;margin:4px 0;',
      class: 'form-control'
    },
    submit: {
      type: 'button',
      class: 'btn btn-' + window.btnStyle,
      caption: 'serialize state'
    }
  };

  // initial state:
  app.state.welcomeStyle = 'default';

  // main template: the variables should be the sub elements only, main template does not carry data
  app.template.main = {
    default: '<div class="clearfix"></div>' +
    '<div class="panel panel-' + window.defaultStyle + '">{hdr}' +
    '<div class="panel-body">' +
    '<div class="container"><form>' +
    '{bg} {welcomeStyle} {welcomeText} {submit}' +
    '</form></div></div>'
  };

// sub template - note the 2 different types
  app.template.sub = {
    hdr: {
      default: '<div class="panel-heading" {attr}><label>{_text}</label>{_link}</div>'
    },
    bg: {
      _type: 'select',
      // special input such as SELECT can have a wrapper, or think <tr></tr>, etc.
      _wrapper: ['<label>Set page background: <select {attr}>', '</select></label>'],
      default: '<option {attr}>{_label}</option>'
    },
    welcomeStyle: {
      _wrapper: ['<span>Change render style: ', '</span>'],
      _sects: {
        radioBtn: {
          _type: 'radio'
        }
      },
      default: '<label {attr}><input {attr-radioBtn} type="radio"> {_label} </label>'
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

  // before app renders, decide which style it is.
  app.on(SimpleAppWillRender, 'verifystyle', function () {
    // welcome style default
    app.data.welcomeStyle.element.map(function (item) {
      if (item.radioBtn.value == app.state.welcomeStyle) {
        item.radioBtn.checked='checked';
      } else {
        delete item.radioBtn.checked;
      }
    });
    // bg default
    app.data.bg.element.map(function (item) {
      if (item.value == app.state.bg) {
        item.selected = 'selected';
        console.log(item, app.state.bg);
      }
    })
  });

  // capture sumbit in state update
  app.on(SimpleAppStateIsUpdated, 'submit', function () {
    modal('current state', app.toQuerystring());
  });
  // update bg color with gender for fun
  app.on(SimpleAppStateIsUpdated, 'bg', function (data) {
    document.body.style.backgroundColor = app.state.bg;
  });
  // cross app interactions
  app.on(SimpleAppStateIsUpdated, 'welcomeText', function (data) {
    var OtherApp = SimpleApp('static_index');
    OtherApp.d('welcome')._content = data.value;
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
  app.init(document.getElementById('app1'), false);
  app.render(true);

})();
