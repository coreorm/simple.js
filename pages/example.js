/**
 * examples
 */
(function () {
  function _css(n) {
    return 'panel panel-' + window.defaultStyle + ' ' + n;
  }

  function _src(n, m) {
    return n + src(m) + loadBtn(m)
  }

  // actually make an app out of it~
  var app = SimpleApp('examples');
  app.template.main = {
    default: '<h1 class="page-heading">{hdr}</h1> {examples}'
  };
  app.template.sub = {
    hdr: {
      default: '<h1 {attr}>{_lbl}</h1>'
    },
    examples: {
      _wrapper: ['<div {attr}>', '</div>'],
      default: '<div {attr}><div class="panel-heading">{_hdr}</div>' +
      '<div class="panel-body">{_desc}' +
      '<div class="{_extra}" id="{exampleId}"></div>' +
      '</div></div>'
    }
  };
  app.data.hdr = {
    _lbl: 'Simple.js Examples',
    style: 'margin-bottom:50px;'
  };
  app.data.examples = {};
  app.data.examples.element = [
    {
      class: _css('example1'),
      _hdr: _src('Example One: my-app.js', 'apps/example/my-app.js'),
      _desc: '<p>This very example is the app we just created from <a href="#start">getting started</a></p> ' +
      '<p><em>Note: local storage is enabled for this app (by default), so the content will retain</em></p>',
      exampleId: 'example1'
    },
    {
      class: _css('example2'),
      _hdr: _src('Example Two: table.js', 'apps/example/table.js'),
      _desc: '<p>Dynamically generated table with lightning fast targetted cell update</p>',
      exampleId: 'table'
    }
  ];

  app.init(document.getElementById('apps'), false);
  app.render(true);

})();
