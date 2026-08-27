import React, {
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * Skeleton for a Framer code component whose whole design is driven from the
 * properties panel. Replace the sections marked TODO; the surrounding plumbing
 * is the part that is easy to get subtly wrong.
 */

const COMPONENT_VERSION = "v1 · skeleton"
const STYLE_ID = "my-component-style"
const ROOT = "my-root"

/* ------------------------------------------------------------------ */
/* Colour helpers                                                      */
/* ------------------------------------------------------------------ */

function parseColor(input) {
    if (typeof input !== "string") return null
    const value = input.trim()

    const hex = value.match(/^#([0-9a-f]{3,8})$/i)
    if (hex) {
        let h = hex[1]
        if (h.length === 3 || h.length === 4) {
            h = h.split("").map((c) => c + c).join("")
        }
        if (h.length !== 6 && h.length !== 8) return null
        return {
            r: parseInt(h.slice(0, 2), 16),
            g: parseInt(h.slice(2, 4), 16),
            b: parseInt(h.slice(4, 6), 16),
            a: h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1,
        }
    }

    const rgb = value.match(
        /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.%]+))?\s*\)$/i
    )
    if (rgb) {
        const alpha = rgb[4] === undefined
            ? 1
            : rgb[4].endsWith("%") ? parseFloat(rgb[4]) / 100 : parseFloat(rgb[4])
        return { r: +rgb[1], g: +rgb[2], b: +rgb[3], a: alpha }
    }
    return null
}

/** Same colour at a different alpha; falls back for design tokens. */
function withAlpha(color, alpha) {
    const c = parseColor(color)
    if (!c) {
        return `color-mix(in srgb, ${color} ${Math.round(alpha * 100)}%, transparent)`
    }
    const a = Math.max(0, Math.min(1, c.a * alpha))
    return `rgba(${Math.round(c.r)}, ${Math.round(c.g)}, ${Math.round(c.b)}, ${+a.toFixed(3)})`
}

/* ------------------------------------------------------------------ */
/* Stylesheet                                                          */
/* ------------------------------------------------------------------ */

/** Prefixes every selector so the styles cannot leak into the project. */
function prefixSelector(selector, scope) {
    return selector
        .split(",")
        .map((part) => {
            const s = part.trim()
            if (!s || s.startsWith(scope)) return s
            return `${scope} ${s}`
        })
        .join(", ")
}

function scopeCSS(input, scope) {
    // Comments first: a comma inside one would split the selector list.
    const css = input.replace(/\/\*[\s\S]*?\*\//g, "")
    let out = ""
    let buffer = ""
    let depth = 0
    let inKeyframes = false
    let keyframeDepth = 0

    for (const ch of css) {
        if (ch === "{") {
            const selector = buffer.trim()
            buffer = ""
            if (selector.startsWith("@")) {
                if (/^@keyframes/i.test(selector)) {
                    inKeyframes = true
                    keyframeDepth = depth
                }
                out += selector + " {"
            } else {
                out += (inKeyframes ? selector : prefixSelector(selector, scope)) + " {"
            }
            depth++
        } else if (ch === "}") {
            depth--
            if (inKeyframes && depth === keyframeDepth) inKeyframes = false
            out += buffer + "}"
            buffer = ""
        } else {
            buffer += ch
        }
    }
    return out + buffer
}

const globalCSS = (c, t) => {
    // Deriving from the accent keeps one decision in one place.
    const buttonBg = c.buttonUsesAccent === false ? c.buttonBackground : c.accent
    return `
  .${ROOT}, .${ROOT} * { box-sizing: border-box; margin: 0; padding: 0; }
  .${ROOT} {
    --accent: ${c.accent};
    font-family: ${t.fontFamily};
    background: ${c.background};
    color: ${c.text};
    /* clip, not hidden: "hidden" makes overflow-y compute to auto, which
       clips the page and hides height changes from Framer's auto-height. */
    overflow-x: clip;
    overflow-y: visible;
    width: 100%;
    height: auto;
    position: relative;
  }
  .container { width: 100%; max-width: ${t.contentWidth}px; margin: 0 auto; padding: 0 24px; }
  .section { padding: ${t.sectionPadding}px 0; }
  .btn { display: inline-block; padding: 12px 26px; border-radius: 30px; font-weight: 600;
         background: ${buttonBg}; color: ${c.buttonText}; text-decoration: none;
         box-shadow: 0 0 20px ${withAlpha(buttonBg, 0.4)}; }

  /* Breakpoints follow the component's own width, not the window's. */
  .${ROOT}.w-sm .section { padding: ${Math.round(t.sectionPadding * 0.7)}px 0; }
  .${ROOT}.w-xs .container { padding: 0 16px; }
`
}

/* ------------------------------------------------------------------ */
/* Hooks                                                               */
/* ------------------------------------------------------------------ */

const useIsomorphicLayoutEffect =
    typeof document !== "undefined" ? useLayoutEffect : useEffect

/** Breakpoint classes from the component's own width. */
function useWidthClass(ref) {
    const [widthClass, setWidthClass] = useState("")

    useIsomorphicLayoutEffect(() => {
        const el = ref.current
        if (!el) return

        const apply = (width) => {
            if (!width) return
            const classes = []
            if (width <= 992) classes.push("w-md")
            if (width <= 768) classes.push("w-sm")
            if (width <= 480) classes.push("w-xs")
            const next = classes.join(" ")
            setWidthClass((prev) => (prev === next ? prev : next))
        }

        apply(el.offsetWidth)
        if (typeof ResizeObserver === "undefined") {
            const onResize = () => apply(el.offsetWidth)
            window.addEventListener("resize", onResize)
            return () => window.removeEventListener("resize", onResize)
        }
        const observer = new ResizeObserver((entries) =>
            apply(entries[0].contentRect.width)
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [ref])

    return widthClass
}

/** Image or video in one slot; video wins, and a video URL in the image field works too. */
function Media({ image, video, poster, alt, className, settings = {} }) {
    const src = video || (/\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(image || "") ? image : null)
    if (src) {
        return (
            <video
                className={className}
                src={src}
                poster={poster || undefined}
                autoPlay={settings.autoplay !== false}
                loop={settings.loop !== false}
                muted={settings.autoplay !== false ? true : settings.muted !== false}
                playsInline
                controls={!!settings.controls}
                aria-label={alt}
            />
        )
    }
    return image ? <img className={className} src={image} alt={alt || ""} /> : null
}

/* ------------------------------------------------------------------ */
/* Defaults                                                            */
/* ------------------------------------------------------------------ */

const DEFAULTS = {
    colors: {
        background: "#0a0a0a",
        text: "#ffffff",
        accent: "#ff3d81",
        buttonUsesAccent: true,
        buttonBackground: "#ff3d81",
        buttonText: "#ffffff",
    },
    style: {
        fontFamily: "'Inter', system-ui, sans-serif",
        contentWidth: 1200,
        sectionPadding: 100,
    },
}

const merge = (defaults, value) => ({ ...defaults, ...(value || {}) })

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

/**
 * Framer reads these annotations only when they sit directly above the
 * exported component.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 1200
 * @framerDisableUnlink
 */
export default function Page(props) {
    const rootRef = useRef(null)
    const widthClass = useWidthClass(rootRef)
    const colors = merge(DEFAULTS.colors, props.colors)
    const style = merge(DEFAULTS.style, props.style)

    const css = useMemo(
        () => scopeCSS(globalCSS(colors, style), `.${ROOT}`),
        [colors, style]
    )

    useIsomorphicLayoutEffect(() => {
        let el = document.getElementById(STYLE_ID)
        if (!el) {
            el = document.createElement("style")
            el.id = STYLE_ID
            document.head.appendChild(el)
        }
        el.textContent = css
    }, [css])

    return (
        <div
            className={`${ROOT} ${widthClass}`.trim()}
            ref={rootRef}
            style={props.style}
        >
            {/* TODO: sections */}
            <section className="section">
                <div className="container">
                    <h1>{props.heading}</h1>
                    <a className="btn" href={props.ctaHref}>
                        {props.ctaText}
                    </a>
                </div>
            </section>
        </div>
    )
}

/* ------------------------------------------------------------------ */
/* Property controls                                                   */
/* ------------------------------------------------------------------ */

addPropertyControls(Page, {
    /* Tells you at a glance whether Framer loaded this build. */
    version: {
        type: ControlType.String,
        title: "Version",
        defaultValue: COMPONENT_VERSION,
    },
    colors: {
        type: ControlType.Object,
        title: "🎨 Colors",
        controls: {
            background: { type: ControlType.Color, title: "Background", defaultValue: DEFAULTS.colors.background },
            text: { type: ControlType.Color, title: "Text", defaultValue: DEFAULTS.colors.text },
            accent: { type: ControlType.Color, title: "Accent", defaultValue: DEFAULTS.colors.accent },
            buttonUsesAccent: {
                type: ControlType.Boolean,
                title: "Button uses accent",
                defaultValue: DEFAULTS.colors.buttonUsesAccent,
            },
            buttonBackground: {
                type: ControlType.Color,
                title: "Button background",
                defaultValue: DEFAULTS.colors.buttonBackground,
                // Default the parameter AND use optional chaining: Framer passes
                // the group's stored value, which is undefined for a group an
                // existing instance never had. A throw here makes Framer drop
                // the entire group from the panel, with no error anywhere.
                hidden: (p = {}) => p?.buttonUsesAccent !== false,
            },
            buttonText: {
                type: ControlType.Color,
                title: "Button text",
                defaultValue: DEFAULTS.colors.buttonText,
            },
        },
    },
    style: {
        type: ControlType.Object,
        title: "🖋️ Appearance",
        controls: {
            fontFamily: { type: ControlType.String, title: "Font", defaultValue: DEFAULTS.style.fontFamily },
            contentWidth: { type: ControlType.Number, title: "Content width", min: 800, max: 1800, step: 10, defaultValue: DEFAULTS.style.contentWidth },
            sectionPadding: { type: ControlType.Number, title: "Section spacing", min: 20, max: 200, step: 5, defaultValue: DEFAULTS.style.sectionPadding },
        },
    },
    heading: { type: ControlType.String, title: "Heading", defaultValue: "Your headline" },
    ctaText: { type: ControlType.String, title: "CTA text", defaultValue: "Get in touch" },
    ctaHref: { type: ControlType.String, title: "CTA link", defaultValue: "#contact" },
})
