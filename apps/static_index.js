/**
 * index page
 * top
 */
(function () {
  var app = SimpleApp('static_index');

  app.data = {
    hdr: {
      title: 'Welcome to Simple.JS',
      link: '<a title="source" href="apps/static_index.js" target="_blank" class="btn btn-success btn-xs pull-right">' +
      '<strong>&lt; src /&gt;</strong></a>',
      content: 'Simple Web App Engine with no external dependencies'
    },
    welcome: {
      class: 'panel panel-' + window.defaultStyle,
      title: 'Cross App Interactions',
      content: 'You can use the form (which is actually a different app) below to change the text of this line.'
    },
    row: {
      element: [
        {
          title: 'Small and Nimble',
          content: 'The entire library is a 5k js file (before gzip), and you could even include it' +
          ' directly in the html to save another HTTP connection'
        },
        {
          title: 'Native yet Extensible',
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

  app.template.main = {
    default: '<div class="jumbotron">{hdr}</div>{welcome}<div class="clearfix m-b-3">{row}</div>'
  };

  app.template.sub = {
    hdr: {
      default: '<div {attr}><h1 class="page-header">{title}</h1> {content} {link} </div>'
    },
    welcome: {
      default: '<div {attr}><div class="panel-heading"><strong>{title}</strong></div><div class="panel-body">{content}</div></div>',
      plain: '<article id="{id}"><h3>{title}</h3><p>{content}</p></article>'
    },
    row: {
      _wrapper: ['<div {attr}>', '</div>'],
      default: '<div class="col-sm-4" {attr}><h3>{title}</h3><p>{content}</p></div>'
    }
  };
// init app
  app.init(document.getElementById('index'), false);
// force render
  app.render(true);
})();