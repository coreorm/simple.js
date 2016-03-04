# design doc

## Render Logic: rule of thumb

For optimal performance, no virtual DOM is used here, and we do NOT compare DOM trees, instead, we compare `data` attribute of the app (prevData vs data), and only trigger a re-render for elements with data changes. 

## Initial render / force render
Initial render / force render will result in the entire HTML being rendered for the container, and this will be done using purely innerHTML to avoid performance penalities.

Along the way, each of the sub elements will be rendered with a generated id for future node access.

NOTE: force render really just resets the `prevData` to null which will cause a complete re-render.

## Virtual nodes / partial render
Virtual nodes are wrappers over the real nodes, and they only work for sub elements (there's no way for main template to be made virtual, as we use text-based templating engine here, not DOM based, for speed).

If partial render is enabled, the {id} attribute must be provided and system will generate the id accordingly.

When rendering each element, system will pickup the element by given id, and try to load the element into the vNode wrapper, which will provide handy apis for operations on the vNode.



## partial render

There are two types of sub elements, they are:
 
### single sub element

An element that only has one parent tag, for example, a div, or a button, and there's no repetitive html tags.

#### Render logic

For these elements, render logic is very simple:

* data changed | state changed?
YES: re-render (so if data is empty, it renders as empty string).
NO: do not touch

### wrapper sub element

An element that has a wrapper parent tag, and multiple children elements (NOTE - for performance reasons, only 1 level of children is allowed).

E.g. a select element, or a list of checkboxes with the same name.

If you need to nest more than 1 level, consider doing it as multiple apps combined - or simple re-render the whole thing.

#### Render logic 

For these elements, render logic is slightly more complex:

* parent wrapper has no state or data, it will always be there as the parent node.
* children elements will follow this logic:
 * if data changes but number of elements are the same: for each existing element, it will use `vNode.updateHTML()` to update the individual elements, unless it's a select box - in that case, it will just render the whole thing as one.
 * if data changes, but less items than before: it will use `vNode.updateHTML()` until there's no more left, then use vNode.remove() to remove the empty ones
 * if data changes, but more items than before: it will use `vNode.updateHTML()` until existing ones are updated, then create `new vNode`, and use `vNode.right()` to attach to the parent
 
Since these DOM operations are happening on the small elements, it will not cause too much issue, and the beauty of this is, it will not affect the layout as it's not rendering the whole parent node.

*Lazy loading*

vNodes are never created until the data change is detected - this means in the initial rendering, there's no vNode created because we don't need all of them.

Then once they are required, a new one will be created, and from that point onwards, if next time the same vNode needs to be accessed, it will provide the previously located vNode for faster performance.

If prevData is empty, vNodes cache will be emptied and all vNodes will be re-located when required.


## data logic
after a successful rendering process, the `prevData` attribute will be replaced by the current data so to prevent possible double rendering.


## updated 2016-03-04

- anti MVC pattern: no need to make it such a big thingy
- example: http://todomvc.com/examples/emberjs/#/ but replace it with simple.js and show how small it is.

## TODO:
- type: form, onsubmit =...
- dynamic targeting for things like todo-list, use current elName + position