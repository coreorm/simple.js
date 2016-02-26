/**
 * Home page
 * show the index app
 * index page
 * static app example
 */
(function () {
  // make it available
  document.getElementById('apps').innerHTML = '';
  // load related apps
  var app = SimpleApp('design-doc');

  app.data = {
    hdr: {
      title: 'Design Docs'
    },
    designs: {
      element: [
        {
          src: 'theme/design/1.png'
        },
        {
          src: 'theme/design/2.png'
        }
      ]
    }
  };

  app.template.main = {
    default: '{hdr} {designs}'
  };

  app.template.sub = {
    hdr: {
      default: '<div {attr}><h1 class="page-header">{title}</h1> </div>'
    },
    designs: {
      _wrapper: ['<div {attr}>', '</div>'],
      default: '<div class="col-sm-12" style="margin-bottom: 1rem" {attr}><img class="img-responsive img-rounded" src="{src}" /></div>'
    }
  };
// init app
  app.init(document.getElementById('apps'), false);
// force render
  app.render(true);

})();