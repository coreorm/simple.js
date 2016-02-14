/**
 * example app
 * index page
 * static app example
 */
(function () {
  'user strict';
  var app = SimpleAppManager.create('static_index');

  app.elements.data = {
    main: {},
    sub: {
      hdr: [{
        title: 'Welcome to Simple.JS',
        content: 'Simple Web App Engine with no external dependencies'
      }],
      row: [
        {
          title: 'Small and Nimble',
          content: 'The entire JS lib, before gzip, is 4k, you may well include it' +
          ' directly in the html to save another HTTP connection'
        },
        {
          title: 'Native yet extensible',
          content: 'There\'s absolutely no external JS lib required,' +
          ' only native JS is used in the library, this means you may use it with any library of your own choice; '
        },
        {
          title: 'Optimal Performance',
          content: 'No DOM operation is being performed in the app render, and each element is cached, ' +
          'at the same time, it allows your own app.js to be loaded via defer or async to allow for parallel load.'
        }
      ]
    }
  };

  app.elements.template.main = {
    default: '<div class="container">{hdr}<div class="row">{row}</div></div>'
  };

  app.elements.template.sub = {
    hdr: {
      default: '<div class="jumbotron"><h1>{title}</h1><p>{content}</p></div>'
    },
    row: {
      default: '<div class="col-sm-4"><h3>{title}</h3><p>{content}</p></div>'
    }
  };

  // init app (and auto render)
  app.init(document.getElementById('index'), true);

})();
