/**
 * example app
 */
(function () {
  'user strict';
  var app = SimpleApp('app1');

  app.data = {
    main: {hdr: 'Example app'},
    sub: {
      greeting: [{
        placeholder: 'enter greetings'
      }],
      title: [{
        label: 'Mr.',
        value: 1
      }, {
        label: 'Mrs.',
        value: 2
      }, {
        label: 'Ms.',
        value: 3
      }],
      name: [{
        placeholder: 'enter your name'
      }],
      go: [{
        caption: 'Click to go'
      }],
      age: [
        {
          label: '0-19',
          value: 1
        }, {
          label: '20-39',
          value: 2
        }, {
          label: '40-59',
          value: 3
        }, {
          label: '60+',
          value: 4
        }
      ]
    }
  };

  app.template.main = {
    default: '<div class="container"><form><h2>{hdr}</h2><fieldset class="form-group">{title}</fieldset> ' +
    '<fieldset class="form-group"> {name}</fieldset>' +
    '<fieldset class="form-group">Age <select name="age" onchange="{__s}(this)">{age}</select></fieldset>' +
    '<fieldset class="form-group">{greeting}</fieldset>' +
    '<fieldset class="form-group">{go}</fieldset>' +
    '</form></div>'
  };

  var txtInput = '<label for="">{name}<br> <input name="{name}" onkeyup="{__s}(this)" placeholder="{placeholder}" value="{value}" /></label>';

  app.template.sub = {
    go: {
      default: '<button type="button" class="button btn-primary" name="{name}" onclick="{__s}(this)">{caption}</button>'
    },
    title: {
      default: '<label><input type="radio" name="{name}" onclick="{__s}(this)" value="{value}" /> {label}</label> ',
      selected: '<label><input type="radio" name="{name}" onclick="{__s}(this)" value="{value}" checked="checked" /> {label}</label> '
    },
    greeting: {
      default: txtInput
    },
    name: {
      default: txtInput
    },
    age: {
      default: '<option value="{value}">{label}</option>',
      selected: '<option value="{value}" selected="selected">{label}</option>'
    }
  };

  // capture sumbit in state update
  app.callback.stateIsUpdated['go'] = function () {
    alert('current state: ' + app.toQuerystring());
  };
  // update bg color with gender for fun
  app.callback.stateIsUpdated['title'] = function (data) {
    var color;
    switch(data.value) {
      case '1':
        color = 'pink';
        break;
      case '2':
        color = 'teal';
        break;
      default:
        color = '#ccc';
        break;
    }
    document.body.style.backgroundColor = color;

  };
  

  // init app (and auto render)
  app.init(document.getElementById('app1'), true);

})();
