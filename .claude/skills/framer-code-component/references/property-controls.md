# Property controls

The panel is the product. Someone who bought a template judges it by whether the
setting they want is where they expect it, named in words they understand, and
does what it says.

## Shape

Group related settings into `ControlType.Object` groups, one per panel section.
Emoji in the group title make the panel scannable (`🎨 Colors`,
`✨ Floating shapes`, `📅 Booking`) — Framer shows them verbatim.

```tsx
addPropertyControls(Page, {
    version: { type: ControlType.String, title: "Version", defaultValue: COMPONENT_VERSION },
    colors: { type: ControlType.Object, title: "🎨 Colors", controls: { … } },
    …
})
```

Order matters: the panel lists groups in declaration order, so put the things
people change first (version marker, colours, the main feature) at the top.

## `hidden` callbacks — the trap worth repeating

Framer calls `hidden` with the group's stored value. For a group an instance has
never had a value for, that is `undefined`, and a throw removes the whole group
from the panel with no error shown anywhere.

```tsx
// breaks the entire group on any instance that predates it
hidden: (p) => p.mode === "form"

// safe against undefined and null
hidden: (p = {}) => p?.mode === "form"
```

A test that calls every `hidden` with `undefined`, `null` and `{}` catches this
in a second and is worth having permanently.

## Put settings where people look

Discoverability beats taxonomy. Booking settings belong next to the contact
form, not in a separate top-level group, because that is where someone
configuring "the thing at the bottom of the page" goes. When a group grows past
~15 fields, use `hidden` to show only what the current mode needs — the fields
for the contact form disappear when booking runs through a calendar.

## Titles and defaults

Every control needs a `title`; without one the panel shows the prop name.
Every control needs a `defaultValue` that makes the component look finished on
insert — a template that renders empty boxes on drop feels broken.

Keep panel labels in one language, and if the audience is international, that
language is English even when the docs are not. A test that scans every control
title, `optionTitles` and string default for stray characters keeps this honest.

## Control types worth knowing

| Type | Use for | Notes |
|---|---|---|
| `String` | text, links, codes | `displayTextArea: true` for paragraphs; `placeholder` for format hints |
| `Color` | any colour | returns hex or `rgba()`; parse before deriving shades |
| `Image` | photos, logos, cursors | returns a URL string |
| `File` | video, audio | `allowedFileTypes: ["mp4", "webm", "mov"]` |
| `Number` | sizes, counts, opacity | always set `min`/`max`; `displayStepper` for small integers |
| `Boolean` | switches | pair with `hidden` on the fields it governs |
| `Enum` | modes, presets | `optionTitles` for human labels; `displaySegmentedControl` for 2–3 options |
| `Object` | a panel group | one per section |
| `Array` | repeatable rows | menu links, service cards, price rows |

Arrays are what turn a template into someone's own site: a price list with a +
button beats five fixed `price1`…`price5` fields, and the component just maps
over whatever it gets.

## Presets plus custom

A theme picker as the first control of the colour group, with `Custom colors`
as the default, gives one-click rebranding without taking manual control away:

- when a preset is active, resolve the palette from it and hide the individual
  pickers, so it is obvious what is driving the colours;
- when `Custom` is selected, show every picker.

Derive as much as possible from one accent colour — buttons, glows, borders,
decorative shapes, custom cursors. Someone who changes only the accent should
get a coherent site, not a half-repainted one.

## Backwards compatibility

Moving a setting to a better place breaks instances configured with the old one.
Read the old prop as a fallback:

```tsx
const mode = contact.bookingMode ?? legacy.mode ?? DEFAULTS.booking.mode
```

It costs a few lines and saves someone's configured site.
