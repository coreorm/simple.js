(function () {
  var app = SimpleApp('nodata', {
    skipEmptyData: true
  });
  app.template.main = {
    default: '<div><h1>Skip rendering when no data</h1> {content} {content_with_data}</div>'
  };
  app.template.sub = {
    content: {
      default: '<div {attr}>I need data: {content}</div>'
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