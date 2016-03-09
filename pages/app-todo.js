/**
 * standalone app
 * loader
 */
(function () {
  // make it available
  document.getElementById('apps').innerHTML = '<h1>To-do List <small>standalone edition</small></h1>' +
    '<p>The simple to-do list app. Scroll down to the source section and see for yourself how simple the entire app is.</p><p>For more examples, ' +
    'see <a href="#example">examples</a> page. </p>' +
    '<div class="panel panel-primary"><div class="panel-body" id="todo"></div></div>' +
    '<h3>Source:</h3><div><pre><code id="src"></code></pre></div>';
  // load related apps
  loadJs('apps/example/todo.js');
  // load code
  jQuery.get('apps/example/todo.js').done(function (src) {
    document.getElementById('src').innerHTML = src.replace(/</g, '&lt;');
    jQuery('pre code').each(function (i, block) {
      hljs.highlightBlock(block);
    });
  });

})();
