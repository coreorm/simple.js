# Component-based Simple JS App Framework

Simple.js tries to solve only one thing: Dynamic View. And it requires no library at all (but you can use any library with it).

## What can you do with it?

Build web apps, but not just one app, it supports multiple apps co-existing with each other and interact with each other.

## The Concept

### Simple idea:
- One app holds its own state.
- Each item in the state (should) belong to one element, well simple.js doesn't stop you from sharing states but better not.
- User interactions (or programs) can update the state
- When state is updated, `stateIsUpdated()` callback will be fired and custom codes can go in there, to trigger render/retrieve data/etc.

## Advanced
Below are some advanced usage, not much, keep it simple, we shall.

### Partial rendering
When app is configured to have `partialRender:true`, default rendering will look at the elements and run a simple logic:
if state is updated on this element, the html will be re-rendered, otherwise, it will use the pre-rendered cache. 

## Start Guide

See index.html for a working app example (and code is in page source)

There are two ways to include the library:
- use script tag to include the file;
- put the script in HTML directly - the entire script is 4k, and by putting it in the HTML you save one extra connection - just download simple.min.js and put the content between `script` tags.
 
# Create Apps

### create new app
API: `SimpleApp(name, config)`

Example:
```
(function () {
  var app = SimpleApp('MyAwesomeApp', {
    localStorageWrite: true,
    localStorageRead: true,
    partialRender: true
  });
})(); 
```


### Main/Sub elements
- One app can only have a single *main* element, for instance, a form, or a content panel
- One app can have as many sub elements as you want, and each of the sub element is rendered as a list, if there's a single element, it will be rendered as an array of 1 item only.
e.g. checkboxes, select options, etc.
- Each element may have 4 attributes:
-- state (as mentioned above)
-- style (NOT your css style, but the display style, think of it as way to pick the template)
-- data - JSON data that provides the src for rendering
-- template, the actual HTML template to render

### render logic
- initial render will be done in one step.
- when DOM structure is finished, subsequent renders will be done separately to take advantage of targeted DOM operations
- If partial render is enabled, and `{id}` fields are properly set, 

### Template Guide:
- Template Setup:
```
// main template: the variables should be the sub elements only, main template does not carry data
app.template.main = {
    default: '<div class="container"><form>' +
             '{title} {name} {submit}'   
             '</form></div>'
};

// sub template - note the 2 different types
app.template.sub = {
    title : {
        _wrapper: ['<select name="{name}" onchange="{__s}(this)">', '</select>'],
        default: '<option value="{value}">{label}</option>',
        selected: '<option selected="selected" value="{value}">{label}</option>'
    },
    name : {
        default: '<input type="text">'
    }
}
```
- use `{variable name}` syntax for variables
- reserved placeholder: `{__s}` for current app's updateState method, e.g. `<input {attr}">`
- make sure the template is wrapped in one unique tag, as this will be used as a *single node* for faster DOM operations later. e.g. `<div>foo</div>` instead of `<div>foo</div><span>bar</span>`
 NOTE to increase the performance, you must provide an id for each sub element, to do this:
  -- DO NOT put `id="id"` fields in the template and system will generate an id for the current element, don't worry, if you need to target an element, you may still be able to use API: `SimpleApp('app-name').el('element-name')` to retrieve it.

### reference
- See `example/index.js` for example of static app;
- and `example/app1.js` for a basic dynamic form example