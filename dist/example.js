/**
 * example app
 */
(function () {
  'user strict';
  var app1 = SimpleAppManager.create('app1');

  app1.elements.data = {
    main: {h1: 'Example app'},
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
      }]
    }
  };

  app1.elements.template.main = {
    default: '<div class="container"><h1>:h1</h1><p>:title</p> <p> :name</p> <p>:greeting</p>:go</div>'
  };

  var txtInput = '<label for="">:name<br> <input name=":name" onkeyup=":__call(this)" placeholder=":placeholder" value=":value" /></label>';

  app1.elements.template.sub = {
    go: {
      default: '<button name=":name" onclick=":__call(this)">:caption</button>'
    },
    title: {
      default: '<div><label><input type="radio" name=":name" onclick=":__call(this)" value=":value" /> :label</label></div>',
      selected: '<div><label><input type="radio" name=":name" value=":value" checked="checked" /> :label</label></div>'
    },
    greeting: {
      default: txtInput
    },
    name: {
      default: txtInput
    }
  };

  // init app (and auto render)
  app1.init(document.getElementById('app1'), true);

})();
