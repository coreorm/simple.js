/**
 * table test with many, many fields
 */
(function () {
  var app = SimpleApp('table');
  var tr = ['<tr {attr}>', '</tr>'];
  var td = '<td {attr}>{label}</td>';
  app.template = {
    main: {
      default: '<div class="table-responsive">' +
      '<table class="table table-striped">{hdr}{rows}</table>' +
      '</div><form><label>row: {row}</label> <label>column: {col} </label> <label> value: {td}</label></form>'
    },
    sub: {
      hdr: {
        _wrapper: tr,
        default: '<th {attr}>{label}</th>'
      },
      // form
      row: {
        _type: 'select',
        _wrapper: ['<select {attr}><option>row</option>', '</select>'],
        default: '<option {attr}>{label}</option>'
      },
      col: {
        _type: 'select',
        _wrapper: ['<select {attr}><option>col</option>', '</select>'],
        default: '<option {attr}>{label}</option>'
      },
      td: {
        _type: 'input',
        default: '<input type="text" {attr}>'
      }
    }
  };
  // code some data out!!
  var cols = 10, rows = 10;
  app.data = {
    hdr: {element: []},
    // form
    row: {
      element: []
    },
    col: {
      element: []
    },
    td: {
      placeholder: 'enter new value'
    }
  };
  var rs = [];
  for (var m = 1; m <= rows; m++) {
    rs.push('{row' + m + '}');
    app.data.row.element.push({
      value: m,
      label: m
    });
    app.template.sub['row' + m] = {
      _wrapper: tr,
      default: td
    };
  }

  for (var i = 0; i <= cols; i++) {
    app.data.hdr.element.push({
      class: '',
      label: i
    });
    app.data.col.element.push({
      value: i,
      label: i
    });
    for (var m = 1; m <= rows; m++) {
      if (!app.data['row' + m]) app.data['row' + m] = {element: []};
      app.data['row' + m].element.push({
        label: m + '-' + i
      });
    }
  }
  // make rows the actual rows
  app.template.main.default = app.template.main.default.replace('{rows}', rs.join(''));
  // now, dynamically update text (or rather, entire td)
  app.on('stateIsUpdated', 'td', function (data) {
    // set value and render
    var r = 'row' + data.state.row;
    var c = data.state.col;
    try {
      if (typeof app.data[r].element[c] == 'object') {
        app.data[r].element[c].label = data.value;
        app.renderElement(r);  // only render partial here
      }
    } catch (e) {
      console.log('[ERROR] ' + e);
    }
  });

  app.init(document.getElementById('table'), true);

})();