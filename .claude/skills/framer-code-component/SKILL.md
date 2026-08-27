---
name: framer-code-component
description: Build and edit Framer code components where the whole design is configurable from Framer's properties panel - colors and theme presets, images and video, toggles for sections and effects, embedded booking calendars, maps and forms. Use this skill whenever the work involves Framer, a .tsx code component, addPropertyControls, property controls, a Framer Remix or template, making a page's settings editable without touching code, or embedding a third-party widget (Cal.com, Google Maps, Formspree) into a Framer page - and also when someone hands over a static HTML page or mockup and wants it turned into something they can style and reuse in Framer.
---

# Framer code components that are fully editable from the panel

A Framer code component earns its keep when the person using it never opens the
code. One component renders the whole page or section; every colour, text,
image, video and toggle is a property control. The design lives in code, the
decisions live in the panel.

This skill carries the patterns that make that work, and — more valuable — the
traps that quietly break it. Most of the bugs below cost real debugging time
before their cause was found, so they are worth reading before writing code
rather than after.

## Working shape

1. **Read the source design first.** If a static HTML mockup exists, port it
   rather than reinventing it: the CSS becomes a template function, the markup
   becomes JSX, and each hardcoded value becomes a control.
2. **Build the settings model before the markup.** A `DEFAULTS` object with one
   group per panel section, merged with incoming props, so the component renders
   correctly even with no props at all (Framer's canvas, tests, SSR).
3. **Generate the stylesheet from the settings** and scope it to the component's
   root class, then inject it once.
4. **Verify in a real browser.** Framer-specific bugs (overflow, sizing,
   embeds) are invisible in code review and obvious under measurement. See
   `references/verification.md`.
5. **Keep a version marker control** as the panel's first field
   (`v3 · booking`, and so on). When someone says "I don't see that setting",
   that field settles in one glance whether Framer actually loaded the new code
   — a code file with an error keeps serving the last working build.

Start from `assets/component-skeleton.tsx`: it already contains the colour
helpers, the scoped-CSS generator, the defaults/merge pattern, the width-based
breakpoint hook and a media component that accepts either an image or a video.

## The rules that matter most

**Every `hidden` callback must survive an unset group.** Framer passes the
group's stored value, which is `undefined` for a group an existing component
instance has never had. A callback like `(p) => p.mode === "form"` throws, and
Framer then drops the *entire group* from the panel — the setting simply is not
there, with no error anywhere. Write `(p = {}) => p?.mode === "form"`. This one
mistake can look exactly like "my code didn't upload".

**Never use `overflow-x: hidden` on the component root.** Per CSS, when one axis
is `hidden` and the other is `visible`, the visible one computes to `auto`. The
component becomes its own vertical scroll container: content is clipped at the
bottom *and* the height stops growing, so Framer's auto-height ResizeObserver
never sees the change. Use `overflow-x: clip`, which leaves `overflow-y`
visible.

**Give every control a `title`.** Without one the panel shows the raw prop name
(`eyebrow`, `titleAfter`), which looks unfinished in a product someone paid for.

**Scope the generated CSS.** Prefix every selector with the root class so the
styles cannot reach the rest of the Framer project. Strip CSS comments before
parsing selectors — a comma inside a comment splits the selector list and
silently kills the rule.

**Attach the layout annotations to the exported component**, not to a file-level
comment block; Framer does not read them there.

```tsx
/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 1200
 */
export default function Page(props) { … }
```

## Where to read further

Each reference is short and focused. Read the ones your task touches.

| Reference | Read it when |
|---|---|
| `references/property-controls.md` | Designing the panel: groups, control types, `hidden`, arrays, theme presets |
| `references/styling.md` | Generating CSS from props, colour helpers, theme presets, scoping |
| `references/layout-sizing.md` | Sizing in Framer, breakpoints, mobile menus, anything that clips or overflows |
| `references/embeds.md` | Cal.com, Google Maps, Formspree, or any third-party script or iframe |
| `references/verification.md` | Proving it works: render tests, browser measurement, stubbing third-party scripts |

## Responsiveness belongs to the component, not the window

Framer renders the component in frames of any width, so `@media (max-width: …)`
lies: on a wide canvas a phone breakpoint frame still gets the desktop layout.
Measure the component's own width with a `ResizeObserver` and put classes on the
root (`w-md`, `w-sm`, `w-xs`), then write the breakpoint rules against those
classes. The skeleton includes this hook.

## Text, images and video

Anywhere an image can go, accept a video too and let the video win — one extra
`ControlType.File` per slot buys a lot. Force `muted` when autoplay is on,
because browsers block sound. Detect a video by extension as well, so a `.mp4`
link pasted into an image field still works.

## When to also ship a static HTML build

If the site should live outside Framer too, generate the HTML from the
component rather than writing it twice: render the component with
`react-dom/server` for the markup, reuse the same colour/CSS/embed helpers in a
plain `<script>`, and expose one `SITE` config object at the top standing in for
the panel. Two hand-written copies drift apart within a week; a generated one
cannot. `scripts/extract_helpers.py` pulls the framework-free functions out of
the component for exactly this.

## Talking to the person using it

They are usually looking at Framer, not at code. When something does not appear,
ask what the version marker says before theorising. When a third-party widget
misbehaves, separate what the component controls from what the service controls
(a Cal.com plan's branding, a Formspree limit) and say plainly which is which —
the honest boundary saves a long chase.
