# Styling from props

The stylesheet is a template function of the settings. Change a colour in the
panel, the function re-runs, the `<style>` element's text is replaced.

```tsx
const css = useMemo(
    () => scopeCSS(globalCSS(colors, style, effects), ".my-root") + cursorCSS(cursor, colors.accent),
    [colors, style, effects, cursor]
)
useIsomorphicLayoutEffect(() => {
    let el = document.getElementById(STYLE_ID)
    if (!el) { el = document.createElement("style"); el.id = STYLE_ID; document.head.appendChild(el) }
    el.textContent = css
}, [css])
```

Use a layout effect in the browser so styles land before paint, falling back to
`useEffect` during server rendering.

## Scoping

The `<style>` element is global, so every selector must be prefixed with the
component's root class or it will restyle the rest of the Framer project.

Two details decide whether the scoper works:

- **Strip `/* … */` comments before parsing.** A comma inside a comment splits
  the selector list, and an invalid part invalidates the whole rule — the
  symptom is one rule mysteriously not applying.
- **Leave `@keyframes` bodies alone.** `0% { … }` is not a selector.

Device-level media queries (`prefers-reduced-motion`, `hover`/`pointer`) stay
as they are; only layout breakpoints move to width classes
(see `layout-sizing.md`).

## Colours

Framer hands back `#rrggbb`, `rgba(…)`, or occasionally a CSS variable for a
colour token. Parse into RGB once, then derive:

```tsx
withAlpha(accent, 0.4)   // → rgba(255, 61, 129, 0.4)
```

Fall back to `color-mix(in srgb, ${color} 40%, transparent)` when parsing fails,
so a design token still renders.

Derive glows, borders and hover states from the accent instead of exposing a
picker for each — fewer controls, and they always agree with each other.

## Specificity, quietly

A rule like `.nav-desktop a` (0,2,1) outranks `.btn-primary` (0,2,0), so a
button inside the nav takes the nav's link colour. Invisible while both are
white on dark; obvious the moment someone picks a light theme. Scope
descendant-element rules to what they actually mean — `.nav-desktop ul a` for
menu links — so components keep their own styling wherever they are placed.

## Themes

Store presets as complete palettes and resolve before rendering:

```tsx
const colors = resolveColors(merge(DEFAULTS.colors, props.colors))
```

Each preset must define every colour the stylesheet reads; a test that compares
preset keys against the default palette catches a forgotten one.

Check contrast per preset rather than trusting the eye: white on a light accent
often lands near 2:1. Measuring text-on-background and label-on-button in a
browser (see `verification.md`) turns "looks fine" into a number.

## Styling what you cannot reach

Cross-origin iframes (maps, calendars) cannot be restyled from the page. To make
one match the palette, neutralise it with a filter and lay the accent over it in
`color` blend mode — the frame keeps its own light and shade but takes your hue:

```css
.map { isolation: isolate; }
.map iframe { filter: grayscale(1) contrast(0.94); }
.map::after { content: ""; position: absolute; inset: 0;
  background: var(--accent); mix-blend-mode: color; pointer-events: none; }
```

`pointer-events: none` keeps the frame interactive underneath. A filter-only
approach (`sepia` + `hue-rotate`) tints mid-tones but leaves highlights nearly
colourless, so light content stays stubbornly beige — the blend overlay is the
one that holds up across light and dark.
