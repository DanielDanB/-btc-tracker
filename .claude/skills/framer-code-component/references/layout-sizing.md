# Layout, sizing and the things that clip

## Telling Framer how the component sizes

```tsx
/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 1200
 */
export default function Page(props) {
    return <div className="my-root" style={props.style}>…</div>
}
```

`any` width lets the frame decide (Fill or fixed); `auto` height makes the
component as tall as its content, so adding a card grows the frame instead of
clipping. Framer only reads these annotations when they sit directly above the
exported component. Spread `props.style` onto the root so Framer's own sizing
reaches it.

## Overflow: the bug that clips the bottom of the page

`overflow-x: hidden` on the root makes `overflow-y` compute to `auto`. The
component becomes a scroll container, which clips content *and* hides height
changes from the ResizeObserver behind Framer's auto-height. The page looks cut
off on a phone and nothing in the code says why.

```css
.my-root { overflow-x: clip; overflow-y: visible; }
```

If it still clips after that, the remaining height is Framer's: the frame
around the component is set to a fixed height and needs **Fit content** on that
breakpoint. Say so plainly rather than adding more CSS.

## Viewport units

`100vh` resolves to the *large* viewport on phones with a dynamic toolbar, so
the component ends up taller on a real device than in the canvas, and the
difference gets clipped. Use `svh` with a `vh` fallback:

```css
.hero { min-height: 100vh; min-height: 100svh; }
```

## Breakpoints follow the component, not the window

Framer renders the component at any width — a phone breakpoint frame on a wide
canvas is still a narrow component in a wide window, so media queries apply the
desktop layout and the content overflows its frame.

Measure the component and put classes on the root:

```tsx
const [widthClass, setWidthClass] = useState("")
useIsomorphicLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const apply = (w) => {
        const c = []
        if (w <= 992) c.push("w-md")
        if (w <= 768) c.push("w-sm")
        if (w <= 480) c.push("w-xs")
        setWidthClass(prev => (prev === c.join(" ") ? prev : c.join(" ")))
    }
    apply(el.offsetWidth)
    const ro = new ResizeObserver(entries => apply(entries[0].contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
}, [])
```

Then write the rules as `.my-root.w-md .hero-inner { … }` instead of media
queries. Verify by measuring `scrollWidth - clientWidth` at several widths: it
should be 0 everywhere.

## Fixed-position elements widen the published page

An off-canvas menu parked at `right: -100%` is not clipped by an ancestor's
overflow — fixed elements escape it. Inside Framer's transformed page wrapper it
becomes real scrollable overflow, and the published page ends up twice the
viewport width.

Mount the drawer only while it is open (or closing), position it at `right: 0`
and slide it with `transform`:

```tsx
{menuMounted && (
    <>
        <button className={`backdrop ${slidIn ? "active" : ""}`} onClick={close} />
        <nav className={`drawer ${slidIn ? "active" : ""}`}>…</nav>
    </>
)}
```

Mount first, then add the `active` class inside a double `requestAnimationFrame`
so the browser paints the closed state and the transition actually runs. Close
on link click, on the backdrop and on `Escape`.

## Canvas and other measured children

An absolutely positioned canvas sized with `width: 100%` must be resynced when
its layout size changes — the backing store does not follow CSS. A
`ResizeObserver` on the canvas is more reliable than `window.resize`, because in
Framer the component often resizes while the window does not. Watch for the
first paint too: a child's effect runs before the parent injects the stylesheet,
so the very first measurement can be the unstyled size.
