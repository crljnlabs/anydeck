# AnydeckIcon

The animated app icon: a keycap that seats onto its stem and then rotates
toward the viewer. Ported from the Claude Design source
`Anydeck Icon Animated.dc.html`.

```jsx
import AnydeckIcon from './components/AnydeckIcon'

<AnydeckIcon />
<AnydeckIcon size={96} surface="light" accent="mint" />
<AnydeckIcon interactive={false} accent="#c026d3" />
```

## How the animation works

One progress value `p ∈ [0, 1]`, driven by hover, focus or touch, played in two
acts that hand over at `p = 0.34`:

1. **Seat** — the keycap of the resting artwork descends onto the stem.
2. **Sweep** — the resting artwork is swapped for 13 pre-baked camera
   projections of the same object, stepped through in order. They are genuine
   angles rather than a cross-dissolve, which is why it reads as a rotation.

Both acts draw the handover frame identically, so the swap is invisible. The
loop writes SVG attributes directly instead of going through React state — at
60fps reconciliation would be the only slow part of it. Under
`prefers-reduced-motion` the key seats and the sweep is skipped.

## Props

| Prop          | Default    | Notes                                                                                         |
| ------------- | ---------- | --------------------------------------------------------------------------------------------- |
| `size`        | `360px`    | Number (px) or any CSS length. Sets `--adk-size`.                                              |
| `surface`     | `'auto'`   | `'auto' \| 'light' \| 'dark'` — carried by `color-scheme`, so `auto` follows the OS.           |
| `accent`      | `'orange'` | A named set (`orange`, `blue`, `gold`, `mint`) **or any CSS colour**, see below.                |
| `interactive` | `true`     | `false` renders an inert `<div role="img">` with no pointer affordances.                        |
| `label`       | `'AnyDeck'`| Accessible name.                                                                                |
| `onClick`     | —          | Forwarded to the `<button>`.                                                                    |

## Style sets

The artwork carries no colours of its own — every shape wears a class that reads
a `--adk-*` token from `anydeck-icon.css`. A style set is therefore just a block
of custom properties, which is what makes these settings-ready: write the tokens
on any ancestor and every icon underneath follows.

The two axes are independent. `surface` sets `color-scheme`, and every colour
token is a `light-dark()` pair, so the light and dark values live side by side in
one declaration instead of in two duplicated blocks.

For `accent`, only `--adk-accent` is required: the light, side and dark keycap
faces fall back to `color-mix()` shades of it. Passing a raw colour
(`accent="#c026d3"`) is enough to reskin the key coherently, so a brand colour
coming from settings or the backend needs no stylesheet entry. The four named
sets exist only because their shades are hand-picked rather than mixed.

To add a set, add a block to `anydeck-icon.css` and its name to
`style-sets.js`:

```css
.adk[data-accent='crimson'] {
  --adk-accent: #e11d48;
  --adk-accent-light: #ff6b85;
  --adk-accent-side: #b01238;
  --adk-accent-dark: #8b0d2c;
}
```

## Files

| File                 | What it is                                                                  |
| -------------------- | --------------------------------------------------------------------------- |
| `AnydeckIcon.jsx`    | The component: the two-act progress loop and the interaction surface.        |
| `AnydeckIconArt.jsx` | **Generated.** The resting pose and the 13 projections. Do not hand-edit.    |
| `anydeck-icon.css`   | Tokens, style sets, and the class → token wiring.                            |
| `style-sets.js`      | The set names, so a settings screen can enumerate them.                      |

`AnydeckIconArt.jsx` is a mechanical transform of the design source: colours
replaced by classes, SVG ids namespaced by a `uid` prop so several icons with
different palettes can share a page, and each frame's keycap faces pre-grouped
into `[data-cap-face]` — the source did that grouping at runtime, doing it at
build time reproduces the same paint order with no DOM surgery on mount.

## Known gap

The legend is set in Archivo Black, which is not bundled — it falls back to
Arial Black. Self-hosting the font (the app is offline-capable, so a CDN link is
not an option) would make the `A` match the design exactly.
