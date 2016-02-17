/**
 * example app
 * index page
 * static app example
 */
(function () {
  var app = SimpleApp('nav');

  app.data = {
    hdr: {label: 'simple.js'},
    links: {
      element: [
        {
          href: '/',
          label: 'home',
          title: 'Simple.Js'
        },
        {
          href: '/#getting-started',
          label: 'Getting Started',
          title: 'getting started'
        },
        {
          href: '/#api-guide',
          label: 'API Guide',
          title: 'API Guide'
        },
        {
          href: 'https://github.com/coreorm/simple.js',
          label: 'github',
          title: 'github'
        }
      ]
    }
  };

  app.template.main = {
    default: '<div class="container container-fluid">{hdr}{links}</div>'
  };

  app.template.sub = {
    hdr: {
      default: '<div {attr} class="navbar-header"><button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#menu">' +
      '<span class="sr-only">Toggle navigation</span>' +
      '<span class="icon-bar"></span>' +
      '<span class="icon-bar"></span>' +
      '<span class="icon-bar"></span>' +
      '</button><label class="navbar-brand"> {label} </label>' +
      '</div>'
    },
    links: {
      _wrapper: ['<div class="collapse navbar-collapse" id="menu"> <ul class="nav navbar-nav" {attr}>', '</ul></div>'],
      default: '<li><a {attr}>{label}</a></li>'
    }
  };

  // init app (and auto render only for this one)
  app.init(document.getElementById('nav'), true);

})();