# Third-party embeds

Booking calendars, maps and form endpoints are what turn a template into a
working site. They are also the part most likely to fail silently, because the
failure lives inside someone else's script.

## Ground rules

- **Load nothing until it is configured.** No booking link, no script request.
  A template that phones home on every page load is a privacy problem for its
  buyer.
- **Always leave a working path.** If the script never arrives (ad blocker,
  strict CSP, the Framer canvas sandbox), show a plain link to the service so a
  visitor can still book or find you.
- **Say what you do not control.** Free-plan branding inside a widget, a form
  provider's rate limit — these are the service's, not the component's.

## Cal.com

The embed loader is a queue: calls made before the script loads are replayed
after. The official snippet defines `window.Cal`, appends the script, and
supports namespaces.

```tsx
Cal("init", namespace, { origin })
const api = window.Cal.ns?.[namespace] || Cal
api("inline", { elementOrSelector: `#${containerId}`, calLink, config })
api("ui", { theme, layout, cssVarsPerTheme: { light: vars, dark: vars } })
```

Four things that each cost a debugging round:

1. **`elementOrSelector` takes a string selector, not a DOM node.** Passing the
   element silently does nothing — no calendar, no error. Give the container a
   generated `id` and pass `"#" + id`.
2. **Call `inline` once per container.** The library ignores a repeat call for a
   container it already claimed, so an effect that clears the container and
   re-inits on every run leaves it empty forever. React double-invokes effects,
   so this bites immediately. Guard with a key of the settings that actually
   require a re-init, and never wipe the container in cleanup.
3. **Detect success by any child element, not by `iframe`.** The embed mounts a
   `<cal-inline>` custom element whose iframe lives in shadow DOM, so an
   iframe-only check reports failure over a working calendar.
4. **The embed injects its own `<style>` into the container.** A rule like
   `.embed > * { display: block }` overrides the user agent's
   `style { display: none }` and paints the CSS as text under the calendar.
   Exclude it: `.embed > *:not(style):not(script)`.

Language follows the visitor's browser unless pinned — pass `locale` in the
config (and on the fallback link) so the widget matches the site.

Colours: map the palette onto Cal's CSS variables via `cssVarsPerTheme`
(`cal-bg`, `cal-bg-subtle`, `cal-text`, `cal-border`, `cal-brand`…), and derive
the light/dark choice from the site's background rather than the visitor's OS.

Since the embed only works in Preview and on the published site, expect to test
there, and tell the user that up front.

## Google Maps

The keyless embed needs no account, which matters for a template:

```
https://www.google.com/maps?q=<address>&z=<zoom>&hl=<lang>&output=embed
```

Offer two sources: an address (falling back to the address already entered in
the contact settings) and a pasted embed link from *Share → Embed a map*.
Accept a whole `<iframe …>` snippet in that field and pull the `src` out of it —
that is what people actually copy.

Add `loading="lazy"`, a `title` for screen readers, and a directions link
(`https://www.google.com/maps/dir/?api=1&destination=…`) for address mode only,
since an embed link carries no address to navigate to. For colour matching, see
the blend-overlay technique in `styling.md`.

## Form endpoints

A hosted endpoint (Formspree and friends) keeps the component serverless. Post
JSON, handle the three states (idle, sending, result) and — importantly — say
something useful when the endpoint is missing rather than failing silently:
"Add your endpoint in the Contact settings" tells the person editing exactly
what to do.

## Loading scripts

Keep the provider's official loader verbatim rather than paraphrasing it; the
queue semantics are easy to get subtly wrong. Wrap it so it runs once, and give
callers a way to point at a self-hosted instance (an origin and a script URL),
clearly labelled as such so nobody fills them in by mistake — placeholders that
show the real production URLs read as "type this here" and get filled in.
