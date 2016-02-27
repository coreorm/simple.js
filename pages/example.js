/**
 * examples
 */
(function () {
  // make it available
  document.getElementById('apps').innerHTML = '<div id="example_hdr"></div>' +
    '<div class="panel panel-' + window.defaultStyle + ' example1">' +
    '<div class="panel-heading">Example 1: my-app.js ' + src('apps/example/my-app.js') +
    loadBtn('apps/example/my-app.js') +
    '</div>' +
    '<div class="panel-body"><div class="container" id="example1"></div></div>' +
    '</div>' +
    '<div class="panel panel-' + window.defaultStyle + ' example2">' +
    '<div class="panel-heading">Example 1: table.js: Dynamically update table cell content ' + src('apps/example/table.js') +
    loadBtn('apps/example/table.js') +
    '</div>' +
    '<div class="panel-body"><div class="table-responsive" id="table"></div></div>' +
    '</div>';

})();
