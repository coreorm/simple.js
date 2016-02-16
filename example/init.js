document.getElementById('main').innerHTML = '<div id="apps" class="container" style="visibility: hidden;">' +
  '<div id="index"></div><div class="panel panel-info"><div class="panel-heading">Form Example ' +
  '<a title="source" href="example/app1.js" target="_blank" class="pull-right">&lt; /&gt;</a>' +
  '</div><div id="app1" class="panel-body"></div>' +
  '</div> <div class="panel panel-primary"><div class="panel-heading">Dynamic Table Example' +
  '<a title="source" href="example/table.js" target="_blank"class="pull-right" style="color: #fff">&lt; /&gt;</a></div>' +
  '<div id="table" class="panel-body"></div></div></div>';

function loadJs(src) {
  var s = document.createElement('script');
  s.setAttribute("type", "text/javascript");
  s.setAttribute('defer', 'defer');
  s.setAttribute("src", 'example/' + src + '.js');
  document.head.appendChild(s);
}
function loadCss(src) {
  var s = document.createElement('link');
  s.setAttribute("rel", "stylesheet");
  s.setAttribute("href", 'example/theme/' + src + '.css');
  document.head.appendChild(s);
}

loadJs('index');
loadJs('app1');
loadJs('table');
loadCss('metro');