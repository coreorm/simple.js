/**
 * table test with many, many fields
 */
(function () {
  var app = SimpleApp('table');
  var tr = ['<tr {attr}>', '</tr>'];
  var td = '<td {attr}>{label}</td>';
  app.template = {
    main: {
      default: '<p class="table-responsive container"><table class="table table-striped">{hdr}{row1}{row2}{row3}{row4}</table></p>'
    },
    sub: {
      hdr: {
        _wrapper: tr,
        default: '<th {attr}>{label}</th>'
      },
      row1: {
        _wrapper: tr,
        default: td
      },
      row2: {
        _wrapper: tr,
        default: td
      },
      row3: {
        _wrapper: tr,
        default: td
      },
      row4: {
        _wrapper: tr,
        default: td
      }
    }
  };
  // code some data out!!
  var cols = 20;
  app.data = {
    hdr: {element: []},
    row1: {element: []},
    row2: {element: []},
    row3: {element: []},
    row4: {element: []},
    row5: {element: []}
  };
  for (var i = 0; i <= cols; i++) {
    app.data.hdr.element.push({
      class: '',
      label: 'hdr ' + i
    });
    for (var m = 1; m <= 4; m++) {
      app.data['row' + m].element.push({
        label: m + '-' + i
      });
    }
  }

  app.init(document.getElementById('table'), true);

})();