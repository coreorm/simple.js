# {@link http://coreorm.github.io/simple.js|Component-based Simple JS App Lib} 

Simple.js is not a framework like Angular, it's a native JS library that's small (only 7K in size), and fast (render a complete 100x100 table under 1 second, and updating individual cells under 5 ms).

## What can you do with it?

Build web apps, but not just one app, it supports multiple apps co-existing with each other and interact with each other.

## The Concept

### Simple idea:
* App is created via api `SimpleApp(name, config)`, e.g.
```
var app = SimpleApp('my-app', {
    localStorageWrite: true,
    localStorageRead: true,
    partialRender: true,
    skipEmptyData: true
});
```
* App has one main component, and a number of elements underneath
* App.template keeps all templates for the app, it will have one `main` template, and numerous `sub` templates (elements)
* App.state keeps the state of each element
* App.data keeps all the data for each of the elements (NOTE: main template is just the layout, so there's no data necessary)
* state will be updated via user interaction, or codes
* whenever state is updated, a callback is fired and you may listen to the callback, e.g. 
```
// listen to input_name field changes
app.on(SimpleAppStateIsUpdated, 'input_name', function (data) {
    console.log('state is updated');
});
```
and this is where you may choose to excute your own codes, or re-render the view

## Build guides
- run `npm install` when you finish checking out the files
- run `npm run` to see the available options, or just:
- run `npm run watch` to watch the changes
- run `npm run server` to start the web server so you may access a local `localhost:8080/dist/simple.dev.js`

## Examples
See {@link http://coreorm.github.io/simple.js|Component-based Simple JS App Lib} for complete guides and examples

