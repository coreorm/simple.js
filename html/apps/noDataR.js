(function () {
  var app = SimpleApp('nodatar', {
    skipEmptyData: false
  });
  app.template.main = {
    default: '<div><h1>Skip rendering when no data</h1> {content} {content_with_data}</div>'
  };
  app.template.sub = {
    content: {
      default: '<div {attr}>I need data: {content} <-<i> there should be content </i>(var: <strong>{>content}</strong>)</div>'
    },
    content_with_data: {
      default: '<div {attr}>I have data: {content}</div>'
    }
  };

  app.data = {
    content_with_data: {
      content: '(Data here)'
    }
  };
  console.log(window.skipData);
  app.init(document.getElementById('apps'), false);
  app.render(true);

})();