# Getting Started

### Before you get started
It is recommended to use IIFE style block definitions (see [here](https://en.wikipedia.org/wiki/Immediately-invoked_function_expression)) for your apps to avoid namespace conflicts, well you can also use anything you like, really.

For example, to create a new app, wrap it in IIFE callback so it's all private:
```
(function() {
    // ... (put your code here)
})();
```
This way, you can keep using a simple `app` variable name all through to the end, without worrying about colliding with other apps.

### Create a new app
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

And we are gonna use these names to configure our app, so to start, let's put out the main templates and sub templates.

Templates are grouped into `main` and `sub` segments, and there's ever only one main template, but unlimited number of sub templates.

Each element can have multiple styles which points to multiple templates, but the default one must be present, in our example, we will use only `default` style.

#### main template
```
app.template.main = {
    default: '<form>' +
        '<label>' +
            'title: {title}' +
        '</label>' +
        '<label>' +
            'name: {name}' +
            '</label>' +
        '{button}' +
    '</form>'
};
```
As you can see, we simply replace the HTML elements with place holders (`{name-of-element}`), now, please note the guidelines on place holders for main template:
1. placeholders are wrapped in curly brackets: `{}`
1. if you want to show curly brackets in text, use `{>}` instead, e.g. to show `{text}` verbatim, write it as `{>text}`.
1. only alphabetical/underscore/dash characters are allowed in the placeholders.

Now it's time for the sub templates, in this case, we have title, name and button.

#### sub template
A sub template, similar to main template, may contain multiple styles for the same element. In this example, we will simplify the definition by using only `default`:

```
app.template.sub = {};
app.template.sub.name = {
    default: '<input {attr}>'
};
```