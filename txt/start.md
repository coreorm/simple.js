# Getting Started

### Before you get started

Head to [github project page](https://github.com/coreorm/simple.js/tree/master/dist), download the simple js file and include it in your page.
* simple.dev.js will log the entire progress on the console, so use it for development;
* simple.min.js is the minified version with all console logs turned off.

To improve the page load performance, I'd suggest directly include the JS inline in your HTML template header, and save one extra connection.

### Coding styles

It is recommended to use IIFE style block definitions (see [here](https://en.wikipedia.org/wiki/Immediately-invoked_function_expression)) for your apps to avoid namespace conflicts, well you can also use anything you like, really.

For example, to create a new app, wrap it in IIFE callback so it's all private:
```
(function() {
    // ... (put your code here)
})();
```
This way, you can keep using a simple `app` variable name all through to the end, without worrying about colliding with other apps.

### Three Simple Steps for your app to run
1. create new app
1. setup templates
1. provide data
Simple as that!

### 1. Create a new app
To create a new app, simply call the `SimpleApp` function:
```
(function() {
    var app = SimpleApp('my-app');
    // ^app variable    ^app name
})();
```

### Configuring the app
Apps are made of views and user interactions, so before configuring the app, make sure you have your app view HTML structure laid out properly, then you can turn it into the templates.

E.g. We want to do a little app with one text input, and one dropdown, and a button, at the end of it, we want to make sure when user clicks the button, we can get all values of the input serialized into a querystring.

#### HTML structure:
```
<form>
    <label>
        title: 
        <select name="title">
            <option>Mr.</option>
            <option>...</option>
        </select> 
    </label>
    
    <label>
        name: 
        <input name="name" value=""> 
    </label>
    
    <button>submit</button>
</form>
```
Now, we can see, it contains 3 elements:
1. `title`
2. `name`
3. `button`

### 2. Setup templates

And we are gonna use these names to configure our app, so to start, let's put out the main templates and sub templates.

Templates are grouped into `main` and `sub` segments, and there's ever only one main template, but unlimited number of sub templates.

Each element can have multiple styles which points to multiple templates, but the default one must be present, in our example, we will use only `default` style.

#### 2.1 main template
```
app.template.main = {
    default: '<form>' +
    '<label>title: {title}</label>' +
    '<label>name: {name}</label>' +
    '{button}' +
    '</form>'
};
```
As you can see, we simply replace the HTML elements with **template variable** (`{name-of-element}`), now, please note the guidelines on place holders for main template:
1. placeholders are wrapped in curly brackets: `{}`
1. if you want to show curly brackets in text, use `{>}` instead, e.g. to show `{text}` verbatim, write it as `{>text}`.
1. only alphabetical/underscore/dash characters are allowed in the placeholders.

Now it's time for the sub templates, in this case, we have title, name and button.

#### 2.2 sub template
A sub template, similar to main template, may contain multiple styles for the same element. In this example, we will simplify the definition by using only `default`:

There are two types of sub elements, the first one, is the single elements, and its template is just as simple as the main template:

*Don't worry about template variables such as {attr} for now, it will be explained in the next big section*

Sub templates may contain elements that allows user interaction, and a type must be provided if you would like the system to generate actions for them, they are:

* `input` - any input box such as text/password/etc. even textareas 
* `select` - select dropdowns
* `radio` - radio buttons
* `checkbox` - multiple checkboxes
* `button` - as name implies - buttons

And they are assigned by key: `_type`.

##### 2.2.1 Single Element

Name and button fields are typical single elements:
```
app.template.sub = {};
  app.template.sub.name = {
    _type: 'input',
    default: '<input {attr}>'
  };
  app.template.sub.button = {
    _type: 'button',
    default: '<button {attr}>{_caption}</button>'
  };
```

_Note:_ templates must conform to this rule: it needs to be one single tag (reason for this is we can then use targeted node operation to enable partial render for better performance), e.g.
`<a></a>` or `<div></div>`, but what's inside can be nested as many levels as you want.

The second type, is the wrapper elements, they consist of two parts: a wrapper (the top tag), and children elements that will be repeatedly rendered.

##### 2.2.1 Wrapper element

The select field (title), is a wrapper element, with wrapper `<select>` and children `<option>`. Please note that simple.js, being simple in nature, only supports 2 levels, first level is wrapper, and second level is the children, if you have more complex structure, then consider breaking that into multiple apps.

The title template:
```
app.template.sub.title = {
    _type: 'select',
    _wrapper: ['<select {attr}>', '</select>'],
    default: '<option {attr}>{_label}</option>'
  };
```

As you can see, for `wrapper` type elements, we have a `_wrapper` template which consists of wrapper open tag, and wrapper close tag, reason being that we still want to render the whole thing as a single tag; then with child templates, we may give it different styles, e.g. in our case, we use a default style for the options.

### 3. Provide Data

### template variables

Now let's go back and have a look at template variables: these things are wrapped in curly brackets **{}** and they will be replaced by system generated or user provided data objects, let's see the details:

#### System generated variables:

* {id} the id of the element, it will be unique across the entire page
* {value} the value attribute, if applicable
* {action} the callback for updating the app state object (`app.state`)
* _{attr}_ this one is the aggregation of all attributes including the 3 things above, and any attributes you provide later in the data. 

#### Custom variables:

you may override all of the system variables above, but I strongly recommend only override the `{value}` variable, as all others are used for accelerated rendering, for instance, `{id}`, when system generate it, will be in a unique pattern that corresponds to the element name, and will be used by system to pickup the node so targeted node operation is possible; and {action} is used for setting the state up to the current app. If you do want to override these 2, please make sure you know what you are doing :)

I would strongly suggest using underscore as the prefix to your own custom variables, anything that doesn't have an underscore will be treated as valid attributes and will end up in the `{attr}` value, and this may break the HTML if you are not careful. If you look back to the sections above, you may notice how caption/label variables are prefixed with underscore _ as they are not valid html element attribute.

#### the data structure

Now let's look at the data structure, first of all the easier ones: single elements

#### 3.1 single elements

Now you can see they are really just key/value pairs for the template variables. And updating these will result in updating the template rendering.
  
```
  app.data.name = {
    placeholder: 'enter you name',
    title: 'name'
  };
  app.data.button = {
    type: 'button',
    _caption: 'submit'
  };
```

#### 3.2 wrapper element.

Wrapper element data structure contains 2 parts:
1. wrapper - wrapper data
2. element - an array of element data as the child element will be repeatedly rendered.

```
app.data.title = {
    wrapper: {},
    element: [
     {
       value: 'mister',
       _label: 'Mr.'
     },
     {
       value: 'miss',
       _label: 'Ms.'
     },
     {
       value: 'missus',
       _label: 'Mrs.'
     },
     {
       value: 'master',
       _label: 'Mr. (Master)'
     },
     {
       value: 'doctor',
       _label: 'Dr.'
     },
     {
       value: 'saint',
       _label: 'St.'
     }
    ]
};
```

Imagine you load data via ajax from an API, then all you need to do is call the render function, simple as that.

### Finish (almost)

And that's it! Just simply run `app.init(container-element, shouldAutoRender = true | false)` to put it on page! If you don't want to render right away, pass `false` for `shouldAutoRender`, and run `app.render(forceRender = true | false)` to render later. 
```
// this one will auto render to the body element
app.init(document.body, true);  
```
or
```
// this one will init the app to the div with id ('app_container')
app.init(document.getElementById('app_container'), false);
// then run render to render it
app.render();
```

With the latter one, it goes without saying that you'll need to have your `app_container` div somewhere, e.g.
```
<html>
    ...
    <body>
        ...
        <div id="app_container"></div>
    </body>
</html>
```

#### Finish (really)
Ok, that wasn't quite an app, as clicking the button doesn't do anything. Worry not, simple.js provides callbacks whenever the state is updated, and all we need to do is strap a function to that and make it work.

```
// strap a callback on the button whe it's clicked - we can figure out what the element name is, and use it to trigger our desired action.
// in this example, let's say whenever user clicks the button, we serialize the inputs into a querystring, and show it in the alert.
app.on(SimpleAppStateIsUpdated, 'button', function () {
    alert('current state: ' + app.toQuerystring());
});
```

And that's it! Now go to the [examples](#example) page for more examples, or the api [guide page](/simple.js/docs) for the complete documentation.

### Advanced

Wow you are still here! Good on ya! Now here's how you can ensure the initial state of dropdown/checkbox/whatever can be preset, in this example, we have our `title` value saved in the app state, and if we want to make sure it's preselected with the right value, it's a simple callback away:

```
  app.on(SimpleAppWillRender, 'default', function () {
    app.data.title.element.map(function (item) {
      if (item.value === app.state.title) {
        item.selected = 'selected';
      }
    });
  });
```
As you can see, it's simply iterating through the title elements and check if one of them is the same as what's saved in the state, then add a new attribute: `checked="checked"` to it.

Now, for more advanced stuff, make sure you checkout [Advanced Usage](#advanced) for more details.