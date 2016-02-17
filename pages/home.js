/**
 * Home page
 * show the index app
 * index page
 * static app example
 */
(function () {
  // make it available
  document.getElementById('apps').innerHTML = '<div id="index"></div><div id="app1"></div>';
  // load related apps
  loadJs('apps/static_index.js');
  loadJs('apps/app1.js');

})();
