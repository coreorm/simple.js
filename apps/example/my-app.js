(function () {
  // 1. create app
  var app = SimpleApp('my-app');

  // 2. setup templates
  // main template
  app.template.main = {
    default: '<form>' +
    '<label>title: {title}</label>' +
    '<label>name: {name}</label>' +
    '{button}' +
    '</form>'
  };
  // 2.1 single elements
  app.template.sub = {};
  app.template.sub.name = {
    _type: 'input',
    default: '<input {attr}>'
  };
  app.template.sub.button = {
    _type: 'button',
    default: '<button {attr}>{_caption}</button>'
  };
  // 2.2. wrapper element
  app.template.sub.title = {
    _type: 'select',
    _wrapper: ['<select {attr}>', '</select>'],
    default: '<option value="{value}">{_label}</option>'
  };

  // 3. provide data
  // 3.1 single elements
  app.data.name = {
    placeholder: 'enter you name',
    title: 'name'
  };
  app.data.button = {
    type: 'button',
    _caption: 'submit'
  };
  // 3.2 wrapper type
  app.data.title = {
    wrapper: {},
    element: [
      {
        value: 'mister',
        _label: 'Mr.'
      },
      {
        value: 'miss',
        _label: 'Ms.'
      },
      {
        value: 'missus',
        _label: 'Mrs.'
      },
      {
        value: 'master',
        _label: 'Mr.'
      },
      {
        value: 'doctor',
        _label: 'Dr.'
      },
      {
        value: 'saint',
        _label: 'St.'
      }
    ]
  };

  // render to div: example 1 and force render
  app.init(document.getElementById('example1'), false);
  app.render(true);

  // finally: callbacks
  app.on(SimpleAppStateIsUpdated, 'button', function () {
    alert('current state: ' + app.toQuerystring());
  });

})();