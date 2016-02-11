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

### Main/Sub elements
- One app can only have a single *main* element, for instance, a form, or a content panel
- One app can have as many sub elements as you want, and each of the sub element is rendered as a list, if there's a single element, it will be rendered as an array of 1 item only.
e.g. checkboxes, select options, etc.
- Each element may have 4 attributes:
-- state (as mentioned above)
-- style (NOT your css style, but the display style, think of it as way to pick the template)

## Advanced
Below are some advanced usage, not much, keep it simple, we shall.

### Partial rendering
When app is configured to have `enablePartialRendering:true`, default rendering will look at the elements and run a simple logic:
if state is updated on this element, the html will be re-rendered, otherwise, it will use the pre-rendered cache. 