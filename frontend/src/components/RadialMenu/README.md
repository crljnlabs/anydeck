# RadialMenu

A ring of icon buttons drawn around a point on screen. Used for the actions on
a device element, but it knows nothing about elements — it takes a position and
a list of entries.

```jsx
import { RadialMenu, ELEMENT_MENU_ITEMS } from './components/RadialMenu'

<RadialMenu
  anchor={{ x, y }}                    // viewport coordinates
  items={ELEMENT_MENU_ITEMS}
  onSelect={(id) => ...}
  onClose={() => ...}
/>
```

## Why it is a portal

Elements of a device sit close together — that is what a macropad is — so the
ring has to be able to paint over its neighbours. Rendered inside the element's
own box it would be trapped there: clipped by an `overflow`, or stacked
underneath a neighbour that happens to come later in the DOM.

So it renders into `document.body` through a portal, positioned `fixed` in
viewport coordinates on a layer at `z-index: 60`. Nothing in the element tree
can clip or outrank it.

The cost of that choice is that the ring no longer moves with the page, so the
caller has to close or re-anchor it on scroll and resize. `ElementCard`
re-anchors, `ElementBoard` closes.

## Near a window edge

A full circle around an element close to the edge would put half its entries
off screen. When the ring does not fit, the entries fold into a half circle
opening back toward the middle of the viewport — the direction that always has
room. Nothing else changes, so the caller never has to think about placement.

## Adding an entry

`element-menu.jsx` is a plain array; the ring lays out however many entries it
is given.

```jsx
{ id: 'duplicate', label: 'Duplicate', icon: <CopyIcon />, tone: 'danger' }
```

`onSelect` gets the `id` back and the caller decides what it does, so no
application logic lives in this component. `tone` is the only styling hook so
far — add more in `radial-menu.css`.

Icons are inline SVG in `menu-icons.jsx` rather than a dependency: the app has
to work offline in a packaged window, and three glyphs are not worth a package.
