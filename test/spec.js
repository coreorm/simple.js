// Simple Tests
describe("Localstorage Test", function () {

  var app = SimpleApp('test#1', {
    localStorageWrite: false
  });

  before(function () {
  });

  it("State operation: localStorageWrite: false", function () {
    var k = 'foo', v = 'bar';
    app.updateState(k, v);
    // clear state
    app.state = {};
    // load and make sure v is not in
    app.load();
    expect(app.state[k]).to.be.undefined;
  });

  it("State operation: localStorageWrite: true", function () {
    app.cnf.localStorageWrite = true;
    var k = 'foo', v = 'bar';
    app.updateState(k, v);
    // clear state
    app.state = {};
    // load and make sure v is not in
    app.load();
    expect(app.state[k]).to.not.be.null;
  });

  it("State operation: localStorageRead: false", function () {
    app.cnf.localStorageWrite = true;
    app.cnf.localStorageRead = false;
    var k = 'foo', v = 'bar';
    app.updateState(k, v);
    // clear state
    app.state = {};
    // load and make sure v is not in
    app.load();
    expect(app.state[k]).to.be.undefined;
  });

  it("State operation: localStorageRead: true", function () {
    app.cnf.localStorageWrite = true;
    app.cnf.localStorageRead = true;
    var k = 'foo', v = 'bar';
    app.updateState(k, v);
    // clear state
    app.state = {};
    // load and make sure v is not in
    app.load();
    expect(app.state[k]).to.equal(v);
  });

});

describe('Uniqueness of apps', function () {
  it('App should be unique', function () {
    var app1 = SimpleApp('app1', {
      localStorageWrite: false
    });
    var app2 = SimpleApp('app2', {
      localStorageWrite: true
    });
    expect(app1.cnf.localStorageWrite).to.not.equal(app2.cnf.localStorageWrite);
    expect(app1.name).to.not.equal(app2.name);
  });

});

/* test for app: render (no data update, initial) */
describe('Render', function () {
  it('Wrapper Elements & Normal Elements ', function () {
    var app = SimpleApp('render-test');
    app.template.main.default = '<div>{foo}{bar}</div>';
    app.template.sub = {
      foo: {
        default: '<div {attr}>{_txt}</div>'
      },
      bar: {
        _wrapper: ['<ul {attr}>', '</ul>'],
        default: '<li {attr}>{_lbl}</li>'
      }
    };

    app.data.foo = {
      _txt: 'this is foo'
    };

    app.data.bar = {
      wrapper: {},
      element: [
        {
          class: 'list',
          _lbl: 'item 1'
        },
        {
          class: 'list',
          _lbl: 'item 2'
        },
        {
          class: 'list',
          _lbl: 'item 3'
        }
      ]
    };

    app.init(document.getElementById('main_app'), true);
    expect(document.getElementsByClassName('list').length).to.equal(3);
    // test additional rendering without breaking existing.
    document.getElementsByClassName('list')[0].innerHTML = 'updated';
    app.data.bar.element.push({
      class:'list',
      _lbl: 'item 4'
    });
    app.render();
    console.log(document.getElementById('main_app').innerHTML);
    expect(document.getElementsByClassName('list').length).to.equal(4);
    expect(document.getElementsByClassName('list')[0].innerHTML).to.equal('updated');
  });

});