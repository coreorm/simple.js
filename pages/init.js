/**
 * export basic structure and put navbar on
 * @type {string}
 */
// load css
loadCss('theme/read.css');
// load nav and start
loadJs('apps/nav.js');
// bootstrap related
loadJs('js/bootstrap.min.js');

// listen to hash change at the same time
var hash = window.location.hash;
var hashWatch = function () {
  var newHash = window.location.hash;
  if (newHash != hash) {
    // hash changed!
    hash = newHash;
    hashIsChanged(hash);
  }
};
var hashIsChanged = function (hash) {
  // use current hash to do things
  var page;
  if (!hash) {
    page = 'home';
  } else {
    page = hash.replace('#', '');
  }
  loadJs('pages/' + page + '.js');
};
// run initially
hashIsChanged(window.location.hash);
// keep watching every 100ms after
setInterval(hashWatch, 100);