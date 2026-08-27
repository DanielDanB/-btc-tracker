# Verifying a Framer component

Framer-specific bugs — clipping, overflow, a group missing from the panel, an
embed that never mounts — do not show up in code review. They show up under
measurement. The harness below is quick to set up and pays for itself the first
time it catches one.

## Harness

Work in a scratch directory outside the user's project:

```bash
npm i --silent esbuild react react-dom playwright
mkdir -p node_modules/framer
cat > node_modules/framer/index.js <<'JS'
export function addPropertyControls(c, controls) { c.propertyControls = controls }
export const ControlType = new Proxy({}, { get: (_, k) => String(k) })
JS
echo '{ "name": "framer", "version": "0.0.0", "type": "module", "main": "index.js" }' > node_modules/framer/package.json
```

The stub makes the component importable outside Framer and — usefully — exposes
the property controls for inspection.

Copy the component and append an export line so tests can reach the internal
helpers:

```bash
cp Component.tsx test-component.tsx
printf '\nexport { globalCSS, scopeCSS, DEFAULTS, resolveColors }\n' >> test-component.tsx
```

Chromium is usually already present in these environments; launch Playwright
with an explicit `executablePath` rather than downloading one.

## What to check

**Compiles.** `esbuild Component.tsx --format=esm --outfile=/dev/null` catches
syntax errors instantly and is worth running after every edit.

**Renders.** `renderToStaticMarkup` with no props at all, then with each
significant mode. This is where "renders empty because a prop was undefined"
surfaces.

**Panel integrity.** Walk `Component.propertyControls` and assert:

- every control has a `title`;
- every `hidden` survives `undefined`, `null` and `{}`;
- enum `options` and `optionTitles` have equal length;
- no stray language in titles, `optionTitles` or string defaults;
- each theme preset defines every colour the palette needs.

**Layout, in a browser.** Load the component in a page at several widths and
measure rather than eyeball:

```js
const overflow = root.scrollWidth - root.clientWidth        // must be 0
const overflowY = getComputedStyle(root).overflowY          // must be "visible"
const fits = Math.abs(rect.height - contentBottom) <= 1     // height = content
```

Reproduce Framer's published page by wrapping the component in a transformed
element (`transform: translateZ(0)`) — that is what turns an off-canvas fixed
element into real page overflow.

**Contrast.** Compute the ratio from the rendered colours; text on background
and label on button are the ones that matter. Anything under 4.5 on body text
deserves a second look.

**Colour matching.** When something should follow the accent, sample the
rendered pixels from a screenshot and compare hues. Ignore pixels with very low
saturation — a near-white pixel has an unstable hue and will lie to you.

## Stubbing third-party scripts

Intercepting the request lets you test the integration path without the network,
and lets you deliberately model the awkward parts of the real library:

```js
await page.route("**/embed*.js", route => route.fulfill({
    contentType: "application/javascript",
    body: STUB,   // replays the queue, renders a shadow-DOM element, ignores duplicate calls
}))
```

Write the stub to behave like the real thing where it matters: replay the
queued calls, mount a custom element with a shadow root, ignore a repeat
initialisation, inject a `<style>` tag. Each of those mirrors a real bug this
skill warns about, so the stub keeps them fixed.

Also test the blocked case — `route.abort()` — and confirm the fallback link
appears.

A caveat worth stating to the user: a stub proves your calls are right, not that
the live service agrees. When the real endpoint is unreachable from the
environment, say so rather than implying a full end-to-end test.

## Keep the checks

Collect the assertions in one script that runs in a second or two. Every bug
found by hand becomes one more line, and the next refactor cannot quietly
reintroduce it.
