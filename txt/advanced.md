# Advanced Usage

### Before you go ahead

Make sure you check out the [quick start guide](#start) first, to get the basics.

### the todo App

The todo app, despite its simple structure, is actually an advanced example as it uses the 'multi-section' feature of Simple.JS, having said that, it's still only 119 lines of code and half of that is just the HTML (well it's called simple.js for a reason).

#### multi sections

As described in [quick start guide](#start), you may have 2 types of sub templates, one is the single element, and one is the wrapper type with multiple elements, such as `<ul><li>...`.

On top of that, we can have multiple sections inside the elements regardless whether it's a single type or wrapper type.

So we can actually strap multiple actions (user interactions on these sections of the template with minimal codes), for instance, here's the template structure of todo:

```
  app.template.main.default = '<div class="task-content">{list}</div><div class=" add-task-row">{itemEntry} {btnAdd}</div>';
  app.template.sub = {
    itemEntry: {
      _type: 'input',
      default: '<input {attr}>'
    },
    btnAdd: {
      _type: 'button',
      default: '<a {attr} class="btn btn-success btn-sm" href="javascript:void();">{_lbl}</a>'
    },
    list: {
      _wrapper: ['<div {attr}>', '</div>'],
      // the _sects key provides sections of elements within elements
      _sects: {
        trash: {
          _type: 'button',
          _action: 'trash'  // data-action for the set
        },
        done: {
          _type: 'checkbox',
          _action: 'done'
        }
      },
      default: '<div {attr} class="todo--item"><input class="todo--checkbox" type="checkbox" {attr-done}><label>{_lbl}</label> ' +
      '<button class="pull-right btn btn-danger btn-xs" {attr-trash}>trash</button></div>'
    }
  };
```
As you can see, the actual wrapper (list) has 3 parts: the `checkbox`, the text label, and the `trash` button, and we'll need to add interactions to these 2 sections - using the default `_type:` in template won't work as this item is not a single type, so we need to split it into sections: 

* name the section placeholder (or variable if you prefer) with section name, e.g. {attr-done} for the `done` checkbox, and {attr-trash} for the `trash` button.
* add `_sects` value to the element template definition, and specify what these sub section types are. So this is where you can have the system adding proper interaction to the elements.

Note the 2 keys in there:
* `_type` is the same as before, shows the type of the element
* `_action` is the action name you want to strap to the element interaction and later on you can receive it from the `updateState()` callback, e.g. in the todo app, it's simply:
```
  app.on(SimpleAppStateIsUpdated, 'list', function (obj) {
    switch (obj.dataset.action) {
      case 'done':
        ...
        break;
      case 'trash':
        ...
        break;
    }
  });
```

And that, is that. Very simple.

### what if I want to just call `updateState(obj)` directly in my template?

Say you want to do a very simple app, with just one button, and you don't wanna bother setting up all these, well, you can simple do:

```
// let's say your app is called 'todo'
// in your HTML:
<button onclick="SimpleApp('todo').updateState(this)" data-value="bar" data-name="foo" data-action="clickButton">click me</button>
```
Now all you need to do is simply listen to state is updated (note that `data-name` will set the state name to 'foo', so just listen to 'foo'). e.g.
```
  app.on(SimpleAppStateIsUpdated, 'foo', function (obj) {
      if (obj.dataset.action == 'clickButton') {
        // do the thingy...
      }
    });
```