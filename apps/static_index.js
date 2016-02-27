/**
 * index page
 * top
 */
(function () {
  var app = SimpleApp('static_index');

  app.data = {
    hdr: {
      title: 'Welcome to Simple.JS',
      _link: src('apps/static_index.js'),
      _content: 'A simple, data-driven web application library and templating system. Natively implemented and offer great compatibility.'
    },
    welcome: {
      class: 'panel panel-' + window.defaultStyle,
      title: 'Cross App Interactions',
      _content: 'You can use the form (which is actually a different app) below to change the text of this line.'
    },
    row: {
      element: [
        {
          title: 'Tiny in Size',
          _content: 'The entire library is a 7k js file (before gzip), and you might as well include it' +
          ' directly in the html to save another HTTP connection'
        },
        {
          title: 'Native Implementation',
          _content: 'There\'s absolutely no external JS lib required,' +
          ' only native JS is used in the library, this means you may use it with any other library/framework of your own choice; ' +
          'Of course, being native also means great performance.'
        },
        {
          title: 'Speed, Speed, Speed!',
          _content: 'First render is done via innerHTML to save DOM operations, ' +
          'then any further rendering will try to use targeted node updates/replacements/removal to ensure optimal speed.'
        }
      ]
    }
  };

  app.template.main = {
    default: '<div class="jumbotron">{hdr}</div>{welcome}<div class="clearfix m-b-3">{row}</div>'
  };

  app.template.sub = {
    hdr: {
      default: '<div {attr}><h1 class="page-header">{title}</h1> {_content} {_link} </div>'
    },
    welcome: {
      default: '<div {attr}><div class="panel-heading"><strong>{title}</strong></div><div class="panel-body">{_content}</div></div>',
      plain: '<article id="{id}"><h3>{title}</h3><p>{_content}</p></article>'
    },
    row: {
      _wrapper: ['<div {attr}>', '</div>'],
      default: '<div class="col-sm-4" {attr}><h3>{title}</h3><p>{_content}</p></div>'
    }
  };
// init app
  app.init(document.getElementById('index'), false);
// force render
  app.render(true);
})();