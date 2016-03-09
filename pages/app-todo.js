/**
 * standalone app
 * loader
 */
(function () {
  // make it available
  document.getElementById('apps').innerHTML = '<h1>To-do List <small>standalone edition</small> ' +
    src('apps/example/todo.js') + '</h1>' +
    '<p>Click the src button on the top right corner to view the source of this app. For more examples, ' +
    'see <a href="#example">examples</a> page. </p>' +
    '<div class="panel panel-primary"><div class="panel-body" id="todo"></div></div>';
  // load related apps
  loadJs('apps/example/todo.js');

})();
