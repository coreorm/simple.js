/**
 * example app
 */
(function () {
  'user strict';
  var app = SimpleApp('MyAwesomeApp');

  app.data = {
    // if type is wrapper
    title: {
      element: [{
        label: 'Mr.',
        value: 1
      }, {
        label: 'Mrs.',
        value: 2
      }, {
        label: 'Ms.',
        value: 3
      }]
    },
    name: {
      placeholder: 'enter your name'
    },
    submit: {
      type: 'button',
      caption: 'Click to go'
    }
  };

  // main template: the variables should be the sub elements only, main template does not carry data
  app.template.main = {
    default: '<div class="container"><form>' +
    '{title} {name} {submit}' +
    '</form></div>'
  };

// sub template - note the 2 different types
  app.template.sub = {
    title: {
      _type: 'select',
      // special input such as SELECT can have a wrapper, or think <tr></tr>, etc.
      _wrapper: ['<select {attr}>', '</select>'],
      default: '<option {attr}>{label}</option>'
    },
    name: {
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
  app.callback.stateIsUpdated['submit'] = function () {
    alert('current state: ' + app.toQuerystring());
  };
  // update bg color with gender for fun
  app.callback.stateIsUpdated['title'] = function (data) {
    setColor(data.value);
  };
  app.appFinish = function () {
    setColor(this.state.title);
  };

  function setColor(value) {
    switch (value) {
      case '1':
        color = 'pink';
        break;
      case '2':
        color = 'teal';
        break;
      default:
        color = '';
        break;
    }
    document.body.style.backgroundColor = color;
  }

  // init app (and auto render)
  app.init(document.getElementById('app1'), true);

})();
