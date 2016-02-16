document.getElementById('main').innerHTML = '<div id="apps"><div id="index"></div><div class="panel panel-primary">' +
  '<div class="panel-heading">Form Example</div><div id="app1" class="panel-body"></div>' +
  '</div> <div class="panel panel-success"><div class="panel-heading">Dynamic Table Example</div>' +
  '<div id="table" class="panel-body"></div></div></div>';

function loadJs(src) {
  var s = document.createElement('script');
  s.setAttribute("type", "text/javascript");
  s.setAttribute('defer', 'defer');
  s.setAttribute("src", 'example/' + src + '.js');
  document.head.appendChild(s);
}

loadJs('index');
loadJs('app1');
loadJs('table');