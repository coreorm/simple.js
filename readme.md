# [Simple.JS](http://coreorm.github.io/simple.js)

## Data-driven, Independent & Natively Implemented JavaScript Library for Applications

* Not a framework: it's a library that is written in 100% native JS that supports all major browser versions, including IE9 and above.
* Data-driven: instead of comparing virtual DOM (unlike reactJS), simple.js compares the data and only renders the element that has the data changed.
* Small & nimble: before gzip, it's only 7K, and can be included in page source to save one extra network connection.
* Fast: Render a complete 100x100 table under 1 second (on my 9 year old imac), and updating individual cells under 5 ms.

## install

### manually install
download the latest release and manually include in your js directory, or

### use bower
`bower install simplejs`

## What can you do with it?

* Web apps: Apps are setup independently, yet still able to communicate with each other.
* Data-driven tables/charts
* Single-page sites
* and more...

## The Concept

### Simple idea:
* App is created via api `SimpleApp(name, config)`, e.g.
```
var app = SimpleApp('my-app', {
    localStorageWrite: true,
    localStorageRead: true,
    partialRender: true
});
```
* App has one main component, and a number of elements underneath
* App.template keeps all templates for the app, it will have one `main` template, and numerous `sub` templates (elements)
* App.state keeps the state of each element
* App.data keeps all the data for each of the elements (NOTE: main template is just the layout, so there's no data necessary)
* state will be updated via user interaction, or codes
* whenever state is updated, a callback is fired and you may listen to the callback, e.g. 
* api `render()` will render the template using current data, and if it's not the initial render, it will compare the current data with new data, and try to use partial render for optimal speed.
```
// listen to input_name field changes
app.on(SimpleAppStateIsUpdated, 'input_name', function (data) {
    console.log('state is updated');
});
```
and this is where you may choose to execute your own codes, or re-render the view

## Features

* fast performance by targeted node operations based on data diff, not DOM diff (data structure is fixed, while DOM can change anytime).
* support up to 2 levels of repetitive data rendering (and no deeper than that - as anything deeper the DOM operation will be expensive).
* simple templates with style support (one element may have multiple styles).
* data-driven, stateless application rendering.
* independent, not relying on any framework - thus can be used side by side with any other framework.
* applications are setup in private block-definitions (IIFE https://en.wikipedia.org/wiki/Immediately-invoked_function_expression) to avoid conflict, yet they still can interact each other by `SimpleApp("name-of-app")`.
* lazy/async load of apps is possible - since they are all independent.

## Build Guides
- run `npm install` when you finish checking out the files
- run `npm install replace -g` so replace will work on all platforms (sed has issues on different os x versions)
- run `npm run` to see the available options, or just:
- run `npm run watch` to watch the changes
- run `npm run server` to start the web server so you may access a local `localhost:8080/dist/simple.dev.js`

## client side test Guides
- get phantomJS (http://phantomjs.org/download.html)
- run `npm install -g mocha-phantomjs`
- run `npm install mocha -g;npm install chai -g` for unit/client-side test
- run `mocha-phantomjs test/app.html` to start the test
- run `npm install http-server -g` for http server


## Examples
See http://coreorm.github.io/simple.js for complete guides and examples


