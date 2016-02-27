/**
 * examples
 */
(function () {
  // make it available
  document.getElementById('apps').innerHTML = '<div id="example_hdr"></div>' +
    '<div class="panel panel-' + window.defaultStyle + ' example1">' +
    '<div class="panel-heading">Example 1: my-app.js ' +
    '<button class="pull-right btn btn-success btn-sm" onclick="loadJs(\'apps/example/my-app.js\', \'my-app\')">load it!</button> ' +
    '</div>' +
    '<div class="panel-body"><div class="container" id="example1"></div></div>' +
    '</div>' +
    '<div class="panel panel-' + window.defaultStyle + ' example2">' +
    '<div class="panel-heading">Example 1: table.js: Dynamically update table cell content ' +
    '<button class="pull-right btn btn-success btn-sm" onclick="loadJs(\'apps/example/table.js\', \'table\')">load it!</button> ' +
    '</div>' +
    '<div class="panel-body"><div class="table-responsive" id="table"></div></div>' +
    '</div>';

})();
