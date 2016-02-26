/**
 * quick start
 */
(function () {
  // make it available
  document.getElementById('apps').innerHTML = '';
  // load related apps
  var app = SimpleApp('start', {});

  app.data = {
    hdr: {
      title: 'Quick Start'
    },
    paras: {
      element: [
        {
          _hdr: 'Before you get started',
          _cnt: '<p>It is recommended to use IIFE style block definitions ' +
          '(see <a href="https://en.wikipedia.org/wiki/Immediately-invoked_function_expression">here</a>) for your apps to avoid namespace' +
          ' conflicts, well you can also use anything you like, really.</p>'
        },
        {
          _hdr: '',
          _cnt: ''
        }
      ]
    }
  };

  app.template.main = {
    default: '{hdr}<div class="container"> {paras}</div>'
  };

  app.template.sub = {
    hdr: {
      default: '<div {attr}><h1 class="page-header">{title}</h1> </div>'
    },
    paras: {
      _wrapper: ['<div {attr}>', '</div>'],
      default: '<div class="col-sm-12" style="margin-bottom: 1rem" {attr}><h3>{_hdr}</h3>{_cnt}</div>'
    }
  };
// init app
  app.init(document.getElementById('apps'), false);
// force render
  app.render(true);

})();