import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

interface ServiceItem {
    serviceTitle: string
    serviceText: string
    serviceIconKey: string
    serviceIconImage: any
}
interface MaterialItem {
    materialName: string
    materialText: string
}
interface ProcessStep {
    stepTitle: string
    stepText: string
}
interface PortfolioItem {
    portfolioImage: any
    portfolioImageCutout: boolean
    portfolioTitle: string
    portfolioDesc: string
    portfolioSpec1Label: string
    portfolioSpec1Value: string
    portfolioSpec2Label: string
    portfolioSpec2Value: string
    portfolioSpec3Label: string
    portfolioSpec3Value: string
}
interface TestimonialItem {
    quote: string
    name: string
    role: string
}
interface FaqItem {
    question: string
    answer: string
}
interface StatItem {
    statValue: string
    statLabel: string
}
interface HeroSlide {
    heroImage: any
    heroImageCutout: boolean
    heroSlideTitle: string
    heroSlideText: string
}

interface NavbarGroup {
    showNavbar: boolean
    logoText: string
    logoImage: any
    navLabel1: string
    navLink1: string
    navLabel2: string
    navLink2: string
    navLabel3: string
    navLink3: string
    navLabel4: string
    navLink4: string
    navLabel5: string
    navLink5: string
    ctaText: string
    ctaLink: string
}

interface GlobalStyleGroup {
    siteColor: string
    siteColorCustom: string
    bgColor: string
    textColor: string
    textMutedColor: string
    accentColor: string
    accentColor2: string
    bgTintColor: string
    hoverHaloColor: string
    cardShadowColor: string
    buttonTextColor: string
    buttonBorderColor: string
    dotColor: string
    headingFont: string
    bodyFont: string
    resetColors: boolean
}

interface HeroGroup {
    showHero: boolean
    heroHeading: string
    heroHeadingHighlight: string
    heroText: string
    heroCtaText: string
    heroCtaLink: string
    slides: HeroSlide[]
    heroGalleryWidth: number
    heroGalleryHeight: number
    heroGalleryAutoplay: boolean
    heroGalleryAutoplaySpeed: number
    heroCutoutTolerance: number
    heroVideo: any
    heroVideoLink: string
}

interface StatsGroup {
    showStats: boolean
    stats: StatItem[]
}

interface AboutGroup {
    showAbout: boolean
    aboutTag: string
    aboutHeading: string
    aboutText: string
    aboutImage: any
    aboutVideo: any
    aboutVideoLink: string
    spoolColor: string
}

interface ServicesGroup {
    showServices: boolean
    servicesTag: string
    servicesHeading: string
    services: ServiceItem[]
    recolorCustomIcons: boolean
    customIconFollowAccent: boolean
    customIconColor: string
}

interface ProcessGroup {
    showProcess: boolean
    processTag: string
    processHeading: string
    steps: ProcessStep[]
}

interface MaterialsGroup {
    showMaterials: boolean
    materialsTag: string
    materialsHeading: string
    materials: MaterialItem[]
}

interface PortfolioGroup {
    showPortfolio: boolean
    portfolioTag: string
    portfolioHeading: string
    portfolioCutoutTolerance: number
    portfolioVideo: any
    portfolioVideoLink: string
    items: PortfolioItem[]
    modalAccentColor: string
}

interface TestimonialsGroup {
    showTestimonials: boolean
    testimonialsTag: string
    testimonialsHeading: string
    testimonials: TestimonialItem[]
}

interface FaqGroup {
    showFaq: boolean
    faqTag: string
    faqHeading: string
    items: FaqItem[]
}

interface ContactGroup {
    showContact: boolean
    contactTag: string
    contactHeading: string
    contactText: string
    email: string
    phone: string
    address: string
    emailLabel: string
    phoneLabel: string
    addressLabel: string
    formMode: string
    formEndpoint: string
    formSubject: string
    formNamePlaceholder: string
    formEmailPlaceholder: string
    formMessagePlaceholder: string
    formButtonLabel: string
    formSuccessText: string
    formErrorText: string
    showMap: boolean
    mapAddress: string
    mapTintColor: string
    mapTintStrength: number
    mapGrayscale: boolean
}

interface FooterGroup {
    showFooter: boolean
    footerMotto: string
    instagramLink: string
    facebookLink: string
    linkedinLink: string
}

interface CookiesGroup {
    showCookieBar: boolean
    cookieTitle: string
    cookieText: string
    cookieAcceptLabel: string
    showCookieReject: boolean
    cookieRejectLabel: string
    cookiePolicyLabel: string
    cookiePolicyLink: string
    cookiePosition: string
    cookieStorageKey: string
    cookieAlwaysShow: boolean
}

interface Props {
    navbar: NavbarGroup
    globalStyle: GlobalStyleGroup
    hero: HeroGroup
    stats: StatsGroup
    about: AboutGroup
    services: ServicesGroup
    process: ProcessGroup
    materials: MaterialsGroup
    portfolio: PortfolioGroup
    testimonials: TestimonialsGroup
    faq: FaqGroup
    contact: ContactGroup
    footer: FooterGroup
    cookies: CookiesGroup
}

const DEFAULT_HEADING_FONT = "'Space Grotesk', sans-serif"
const DEFAULT_BODY_FONT = "Inter, sans-serif"
// Original mockup palette, used as the fallback for every color control
// and restored in full by the "Reset Colors" switch below.
const DEFAULT_BG_COLOR = "#F8F8FC"
const DEFAULT_TEXT_COLOR = "#1a1a2e"
const DEFAULT_TEXT_MUTED_COLOR = "#666666"
const DEFAULT_ACCENT_COLOR = "#6C3BFF"
const DEFAULT_ACCENT2_COLOR = "#CDB7FF"
const DEFAULT_BG_TINT_COLOR = "#8A5BFF"
const DEFAULT_HALO_COLOR = "rgba(138,91,255,0.35)"
const DEFAULT_CARD_SHADOW_COLOR = "#6C3BFF"
const DEFAULT_SPOOL_COLOR = "#6C3BFF"
const DEFAULT_BUTTON_TEXT_COLOR = "#6C3BFF"
const DEFAULT_BUTTON_BORDER_COLOR = "rgba(108,59,255,0.55)"
const DEFAULT_DOT_COLOR = "#6C3BFF"
const DEFAULT_MODAL_ACCENT_COLOR = "#6C3BFF"
const DEFAULT_MAP_TINT_COLOR = "#6C3BFF"

// ============================================================
// Cookie bar
// ============================================================
// The bar is off by default: it only shows up once "Show Cookie Bar" is
// switched on in the Framer panel. It has no colors of its own — everything
// is painted from the same --lbc-* variables as the rest of the page, so it
// follows the Site Color (or the individual color controls) automatically.
const DEFAULT_COOKIE_KEY = "lbc-cookie-consent"
const COOKIE_ACCEPTED = "accepted"
const COOKIE_REJECTED = "rejected"
const COOKIE_POS_BOTTOM = "bottom"
const COOKIE_POS_LEFT = "left"
const COOKIE_POS_RIGHT = "right"

// ============================================================
// One-click site color
// ============================================================
// Every surface on the page is painted from the --lbc-* variables set on
// the root element, so a single brand color is enough to repaint the whole
// site. buildPalette() rebuilds all of those values from one input color
// and keeps the relationships the original purple mockup used (a light
// accent for gradients, a brighter tint for the hero glow, translucent
// borders, ...). The individual color controls below are untouched and
// still win whenever "Site Color" is left on "Custom".

interface Palette {
    bg: string
    text: string
    textMuted: string
    accent: string
    accent2: string
    bgTint: string
    halo: string
    cardShadow: string
    buttonText: string
    buttonBorder: string
    dot: string
    modalAccent: string
    mapTint: string
    spool: string
}

const DEFAULT_PALETTE: Palette = {
    bg: DEFAULT_BG_COLOR,
    text: DEFAULT_TEXT_COLOR,
    textMuted: DEFAULT_TEXT_MUTED_COLOR,
    accent: DEFAULT_ACCENT_COLOR,
    accent2: DEFAULT_ACCENT2_COLOR,
    bgTint: DEFAULT_BG_TINT_COLOR,
    halo: DEFAULT_HALO_COLOR,
    cardShadow: DEFAULT_CARD_SHADOW_COLOR,
    buttonText: DEFAULT_BUTTON_TEXT_COLOR,
    buttonBorder: DEFAULT_BUTTON_BORDER_COLOR,
    dot: DEFAULT_DOT_COLOR,
    modalAccent: DEFAULT_MODAL_ACCENT_COLOR,
    mapTint: DEFAULT_MAP_TINT_COLOR,
    spool: DEFAULT_SPOOL_COLOR,
}

// "custom" is not in this list on purpose: it means "use the color controls".
const COLOR_PRESETS: { key: string; title: string; color: string }[] = [
    { key: "purple", title: "Purple (original)", color: DEFAULT_ACCENT_COLOR },
    { key: "indigo", title: "Indigo", color: "#4F46E5" },
    { key: "blue", title: "Blue", color: "#2563EB" },
    { key: "sky", title: "Sky", color: "#0891B2" },
    { key: "teal", title: "Teal", color: "#0D9488" },
    { key: "green", title: "Green", color: "#16A34A" },
    { key: "gold", title: "Gold", color: "#C2871A" },
    { key: "orange", title: "Orange", color: "#EA580C" },
    { key: "red", title: "Red", color: "#DC2626" },
    { key: "pink", title: "Pink", color: "#DB2777" },
    { key: "graphite", title: "Graphite", color: "#414155" },
]

const SITE_COLOR_CUSTOM = "custom"
const SITE_COLOR_PICK = "pick"

function presetColor(key: string): string {
    const hit = COLOR_PRESETS.filter((preset) => preset.key === key)[0]
    return hit ? hit.color : ""
}

function clampNum(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value))
}

function parseColor(value: string): { r: number; g: number; b: number } | null {
    if (!value) return null
    const raw = String(value).trim()

    const fn = raw.match(/^rgba?\(([^)]+)\)$/i)
    if (fn) {
        const parts = fn[1]
            .split(/[,\/\s]+/)
            .filter((part) => part.length > 0)
            .map((part) => parseFloat(part))
        if (parts.length >= 3 && parts.slice(0, 3).every((n) => !isNaN(n))) {
            return { r: parts[0], g: parts[1], b: parts[2] }
        }
        return null
    }

    let hex = raw.replace("#", "")
    if (hex.length === 3 || hex.length === 4) {
        hex = hex
            .slice(0, 3)
            .split("")
            .map((c) => c + c)
            .join("")
    }
    if (hex.length === 8) hex = hex.slice(0, 6)
    if (hex.length !== 6 || /[^0-9a-f]/i.test(hex)) return null
    return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
    }
}

function rgbToHsl(rgb: { r: number; g: number; b: number }) {
    const r = clampNum(rgb.r, 0, 255) / 255
    const g = clampNum(rgb.g, 0, 255) / 255
    const b = clampNum(rgb.b, 0, 255) / 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const l = (max + min) / 2
    if (max === min) return { h: 0, s: 0, l: l * 100 }
    const d = max - min
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    let h = 0
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0)
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    return { h: h * 60, s: s * 100, l: l * 100 }
}

function hslToRgb(h: number, s: number, l: number) {
    const hue = ((h % 360) + 360) % 360
    const sat = clampNum(s, 0, 100) / 100
    const lum = clampNum(l, 0, 100) / 100
    const c = (1 - Math.abs(2 * lum - 1)) * sat
    const x = c * (1 - Math.abs(((hue / 60) % 2) - 1))
    const m = lum - c / 2
    let rgb = [0, 0, 0]
    if (hue < 60) rgb = [c, x, 0]
    else if (hue < 120) rgb = [x, c, 0]
    else if (hue < 180) rgb = [0, c, x]
    else if (hue < 240) rgb = [0, x, c]
    else if (hue < 300) rgb = [x, 0, c]
    else rgb = [c, 0, x]
    return {
        r: Math.round((rgb[0] + m) * 255),
        g: Math.round((rgb[1] + m) * 255),
        b: Math.round((rgb[2] + m) * 255),
    }
}

function hslToHex(h: number, s: number, l: number): string {
    const rgb = hslToRgb(h, s, l)
    const hex = (n: number) =>
        clampNum(Math.round(n), 0, 255).toString(16).padStart(2, "0")
    return `#${hex(rgb.r)}${hex(rgb.g)}${hex(rgb.b)}`.toUpperCase()
}

function withAlpha(color: string, alpha: number): string {
    const rgb = parseColor(color)
    if (!rgb) return color
    return `rgba(${Math.round(rgb.r)},${Math.round(rgb.g)},${Math.round(rgb.b)},${alpha})`
}

// One color in, the whole site palette out.
function buildPalette(input: string): Palette {
    const base = (input || DEFAULT_ACCENT_COLOR).trim()

    // the original mockup palette is hand-tuned, so keep it exactly as it is
    if (base.toLowerCase() === DEFAULT_ACCENT_COLOR.toLowerCase()) {
        return DEFAULT_PALETTE
    }

    const rgb = parseColor(base)
    if (!rgb) return DEFAULT_PALETTE

    const hsl = rgbToHsl(rgb)
    const h = hsl.h
    const s = hsl.s
    // keep the brand color readable as text on the light background
    const l = clampNum(hsl.l, 30, 66)
    const accent = l === hsl.l ? base : hslToHex(h, s, l)
    const accent2 = hslToHex(h, s, 86)
    // the hero glow is always a lighter, brighter version of the brand color
    const tint = hslToHex(h, s, clampNum(Math.max(l + 7, 52), 40, 78))

    return {
        bg: hslToHex(h, clampNum(s, 0, 33), 98),
        text: hslToHex(h, clampNum(s, 0, 28), 14),
        textMuted: DEFAULT_TEXT_MUTED_COLOR,
        accent,
        accent2,
        bgTint: tint,
        halo: withAlpha(tint, 0.35),
        cardShadow: accent,
        buttonText: accent,
        buttonBorder: withAlpha(accent, 0.55),
        dot: accent,
        modalAccent: accent,
        mapTint: accent,
        spool: accent,
    }
}
const REVEAL_FALLBACK_MS = 900
const BURST_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315]

// --- Stack card layering, matches the HTML mockup's render() logic ---
const STACK_OFFSETS = [
    { y: 0, scale: 1, rotate: 0, opacity: 1, z: 10 },
    { y: 18, scale: 0.94, rotate: 2, opacity: 0.85, z: 9 },
    { y: 32, scale: 0.88, rotate: -2, opacity: 0.6, z: 8 },
]
const STACK_FALLBACK = { y: 45, scale: 0.82, rotate: 0, opacity: 0, z: 1 }

function getStackStyle(offset: number): React.CSSProperties {
    const cfg = STACK_OFFSETS[offset] || STACK_FALLBACK
    return {
        transform: `translateY(${cfg.y}px) scale(${cfg.scale}) rotate(${cfg.rotate}deg)`,
        zIndex: cfg.z,
        opacity: cfg.opacity,
    }
}

// The portfolio photos float on the page like the hero ones, so only the front
// photo is shown and nothing is stacked behind it.
function getFlatStackStyle(offset: number): React.CSSProperties {
    return {
        transform: "none",
        zIndex: offset === 0 ? 10 : 1,
        opacity: offset === 0 ? 1 : 0,
        pointerEvents: offset === 0 ? "auto" : "none",
    }
}

function resolveImageSrc(value: any): string {
    if (!value) return ""
    if (typeof value === "string") return value
    if (typeof value === "object") {
        if (typeof value.src === "string" && value.src) return value.src
        if (typeof value.url === "string" && value.url) return value.url
    }
    return ""
}

function t(value: string | undefined | null, fallback: string): string {
    if (typeof value === "string" && value.trim().length > 0) return value
    return fallback
}

// Treat an unset/undefined "show section" flag as visible (true),
// so older instances without the control keep rendering as before.
function visible(flag: boolean | undefined): boolean {
    return flag !== false
}

function SizeHint({ text }: { text: string }) {
    return (
        <div className="lbc-size-hint">
            <span>Ideal Resolution</span>
            <strong>{text}</strong>
        </div>
    )
}

function FireworkBurst() {
    return (
        <>
            {BURST_ANGLES.map((angle, idx) => (
                <span
                    key={idx}
                    className="lbc-fw-particle"
                    style={{
                        ["--angle" as any]: `${angle}deg`,
                        animationDelay: `${idx * 12}ms`,
                    }}
                />
            ))}
        </>
    )
}

function AboutSpool({
    reduceMotion,
    spoolColor,
}: {
    reduceMotion: boolean
    spoolColor: string
}) {
    // Single-color spool: every shape uses the same `base` hue, with
    // opacity as the only depth cue (no white/black tint mixing), so the
    // whole illustration reads as one flat, editable color.
    const base = spoolColor || DEFAULT_SPOOL_COLOR

    return (
        <div
            className="lbc-spool-wrap"
            style={{
                filter: `drop-shadow(0 4px 16px color-mix(in srgb, ${base} 40%, transparent))`,
            }}
        >
            <svg viewBox="-10 0 320 340" xmlns="http://www.w3.org/2000/svg">
                <rect
                    x="0"
                    y="130"
                    width="18"
                    height="70"
                    rx="3"
                    fill={base}
                    opacity="0.85"
                />
                <circle cx="9" cy="142" r="2.5" fill={base} opacity="0.55" />
                <circle cx="9" cy="188" r="2.5" fill={base} opacity="0.55" />

                <rect
                    x="16"
                    y="158"
                    width="134"
                    height="14"
                    rx="6"
                    fill={base}
                    opacity="0.9"
                />
                <rect
                    x="16"
                    y="158"
                    width="134"
                    height="5"
                    rx="2.5"
                    fill="#FFFFFF"
                    opacity="0.2"
                />

                <path
                    d="M18,196 L120,172"
                    stroke={base}
                    strokeWidth="8"
                    strokeLinecap="round"
                    opacity="0.85"
                />

                <circle cx="150" cy="165" r="16" fill={base} />
                <circle cx="150" cy="165" r="9" fill="#FFFFFF" opacity="0.85" />

                <circle cx="150" cy="165" r="76" fill={base} opacity="0.1" />

                <g
                    className={`lbc-spool-reel ${reduceMotion ? "is-paused" : ""}`}
                    style={{ transformOrigin: "150px 165px" }}
                >
                    <circle
                        cx="150"
                        cy="165"
                        r="70"
                        fill="none"
                        stroke={base}
                        strokeWidth="1.4"
                        opacity="0.35"
                    />
                    <circle
                        cx="150"
                        cy="165"
                        r="64"
                        fill="none"
                        stroke={base}
                        strokeWidth="1.2"
                        opacity="0.5"
                    />
                    <circle
                        cx="150"
                        cy="165"
                        r="58"
                        fill="none"
                        stroke={base}
                        strokeWidth="1.4"
                        opacity="0.35"
                    />
                    <circle
                        cx="150"
                        cy="165"
                        r="52"
                        fill="none"
                        stroke={base}
                        strokeWidth="1.2"
                        opacity="0.5"
                    />
                    <circle
                        cx="150"
                        cy="165"
                        r="46"
                        fill="none"
                        stroke={base}
                        strokeWidth="1.4"
                        opacity="0.35"
                    />
                    <circle
                        cx="150"
                        cy="165"
                        r="40"
                        fill="none"
                        stroke={base}
                        strokeWidth="1.2"
                        opacity="0.5"
                    />
                    <circle
                        cx="150"
                        cy="165"
                        r="34"
                        fill="none"
                        stroke={base}
                        strokeWidth="1.4"
                        opacity="0.35"
                    />
                    <circle
                        cx="150"
                        cy="165"
                        r="24"
                        fill="#FFFFFF"
                        opacity="0.9"
                        stroke={base}
                        strokeWidth="2.5"
                    />
                    <path
                        d="M150,151 L162,158 L162,172 L150,179 L138,172 L138,158 Z"
                        fill="none"
                        stroke={base}
                        strokeWidth="1.8"
                    />
                </g>

                <circle
                    cx="150"
                    cy="165"
                    r="76"
                    fill="none"
                    stroke={base}
                    strokeWidth="3.5"
                />

                <path
                    className="lbc-filament-strand"
                    d="M150,89 Q225,94.00 300,90"
                    fill="none"
                    stroke={base}
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.8"
                >
                    {!reduceMotion && (
                        <animate
                            attributeName="d"
                            dur="4s"
                            repeatCount="indefinite"
                            calcMode="spline"
                            keyTimes="0.0;0.1;0.2;0.3;0.4;0.5;0.6;0.7;0.8;0.9;1.0"
                            keySplines="0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1"
                            values="M150,89 Q225,94.00 300,90;M150,89 Q225,96.35 300,90;M150,89 Q225,97.80 300,90;M150,89 Q225,97.80 300,90;M150,89 Q225,96.35 300,90;M150,89 Q225,94.00 300,90;M150,89 Q225,91.65 300,90;M150,89 Q225,90.20 300,90;M150,89 Q225,90.20 300,90;M150,89 Q225,91.65 300,90;M150,89 Q225,94.00 300,90"
                        />
                    )}
                </path>
            </svg>
        </div>
    )
}

// Repaints an uploaded icon in a single colour. A CSS mask only works when the
// file already has a transparent background, so the shape is derived here
// instead: transparency is used when present, otherwise the background colour is
// read from the corners and every pixel is faded out by how close it is to it.
function recolorIconToDataUrl(
    img: HTMLImageElement,
    color: string
): string | null {
    const size = Math.max(
        1,
        Math.min(256, img.naturalWidth || 0, img.naturalHeight || 0)
    )
    const w = Math.max(
        1,
        Math.round(((img.naturalWidth || size) / (img.naturalHeight || size)) * size)
    )
    const canvas = document.createElement("canvas")
    canvas.width = w
    canvas.height = size
    const ctx = canvas.getContext("2d")
    if (!ctx) return null
    ctx.drawImage(img, 0, 0, w, size)

    let data: ImageData
    try {
        data = ctx.getImageData(0, 0, w, size)
    } catch {
        return null // cross-origin image, pixels are not readable
    }
    const px = data.data

    let hasAlpha = false
    for (let i = 3; i < px.length; i += 4) {
        if (px[i] < 250) {
            hasAlpha = true
            break
        }
    }

    if (!hasAlpha) {
        const corners = [
            0,
            (w - 1) * 4,
            (size - 1) * w * 4,
            ((size - 1) * w + (w - 1)) * 4,
        ]
        let br = 0
        let bg = 0
        let bb = 0
        for (const c of corners) {
            br += px[c]
            bg += px[c + 1]
            bb += px[c + 2]
        }
        br /= corners.length
        bg /= corners.length
        bb /= corners.length

        for (let i = 0; i < px.length; i += 4) {
            const d = Math.max(
                Math.abs(px[i] - br),
                Math.abs(px[i + 1] - bg),
                Math.abs(px[i + 2] - bb)
            )
            // fully opaque once a pixel differs from the background by ~14%
            px[i + 3] = Math.min(255, Math.round((d / 36) * 255))
        }
        ctx.putImageData(data, 0, 0)
    }

    ctx.globalCompositeOperation = "source-in"
    ctx.fillStyle = color || "#000"
    ctx.fillRect(0, 0, w, size)
    try {
        return canvas.toDataURL("image/png")
    } catch {
        return null
    }
}

function CustomServiceIcon({
    src,
    recolor,
    color,
}: {
    src: string
    recolor: boolean
    color: string
}) {
    const [recolored, setRecolored] = React.useState("")

    React.useEffect(() => {
        if (!recolor || !src) {
            setRecolored("")
            return
        }
        let cancelled = false
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
            if (cancelled) return
            const out = recolorIconToDataUrl(img, color)
            if (out) setRecolored(out)
        }
        img.onerror = () => {
            if (!cancelled) setRecolored("")
        }
        img.src = src
        return () => {
            cancelled = true
        }
    }, [src, recolor, color])

    // Falls back to the original artwork, never to an empty coloured square.
    return (
        <img
            className="lbc-service-icon-img"
            src={recolored || src}
            alt=""
            aria-hidden="true"
        />
    )
}

// The enquiry form. With no endpoint set it opens the visitor's mail app, which
// needs no account anywhere. Given a Formspree address it posts JSON there
// instead, so the enquiry arrives without the visitor doing anything.
// Cuts a photo out of its backdrop so it can float on the page the way the
// hero photos do. The background is whatever connects to the edges of the
// frame and stays close to the colour sampled there, so a plain studio sweep
// lifts away while light areas inside the object are kept.
function cutOutBackground(img: HTMLImageElement, tolerance: number): string | null {
    const cap = 1200
    const scale = Math.min(
        1,
        cap / Math.max(img.naturalWidth || 1, img.naturalHeight || 1)
    )
    const w = Math.max(1, Math.round((img.naturalWidth || 1) * scale))
    const h = Math.max(1, Math.round((img.naturalHeight || 1) * scale))

    const canvas = document.createElement("canvas")
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext("2d")
    if (!ctx) return null
    ctx.drawImage(img, 0, 0, w, h)

    let data: ImageData
    try {
        data = ctx.getImageData(0, 0, w, h)
    } catch {
        return null // cross-origin image, pixels are not readable
    }
    const px = data.data

    // average the border to learn what the backdrop looks like
    let br = 0
    let bg = 0
    let bb = 0
    let n = 0
    const sample = (x: number, y: number) => {
        const i = (y * w + x) * 4
        br += px[i]
        bg += px[i + 1]
        bb += px[i + 2]
        n++
    }
    for (let x = 0; x < w; x++) {
        sample(x, 0)
        sample(x, h - 1)
    }
    for (let y = 0; y < h; y++) {
        sample(0, y)
        sample(w - 1, y)
    }
    br /= n
    bg /= n
    bb /= n

    const near = (i: number) =>
        Math.max(
            Math.abs(px[i] - br),
            Math.abs(px[i + 1] - bg),
            Math.abs(px[i + 2] - bb)
        ) <= tolerance

    // flood fill inward from every edge pixel that still looks like backdrop
    const out = new Uint8Array(w * h)
    const queue = new Int32Array(w * h)
    let head = 0
    let tail = 0
    const push = (p: number) => {
        if (out[p]) return
        if (!near(p * 4)) return
        out[p] = 1
        queue[tail++] = p
    }
    for (let x = 0; x < w; x++) {
        push(x)
        push((h - 1) * w + x)
    }
    for (let y = 0; y < h; y++) {
        push(y * w)
        push(y * w + w - 1)
    }
    while (head < tail) {
        const p = queue[head++]
        const x = p % w
        const y = (p / w) | 0
        if (x > 0) push(p - 1)
        if (x < w - 1) push(p + 1)
        if (y > 0) push(p - w)
        if (y < h - 1) push(p + w)
    }

    // soften the cut so the edge does not look sawn off
    const alpha = new Float32Array(w * h)
    for (let p = 0; p < w * h; p++) alpha[p] = out[p] ? 0 : 255
    const blurred = new Float32Array(w * h)
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            let sum = 0
            let count = 0
            for (let dy = -1; dy <= 1; dy++) {
                const yy = y + dy
                if (yy < 0 || yy >= h) continue
                for (let dx = -1; dx <= 1; dx++) {
                    const xx = x + dx
                    if (xx < 0 || xx >= w) continue
                    sum += alpha[yy * w + xx]
                    count++
                }
            }
            blurred[y * w + x] = sum / count
        }
    }
    for (let p = 0; p < w * h; p++) px[p * 4 + 3] = Math.round(blurred[p])

    ctx.putImageData(data, 0, 0)
    try {
        return canvas.toDataURL("image/png")
    } catch {
        return null
    }
}

function useCutout(src: string, enabled: boolean, tolerance: number) {
    const [cut, setCut] = React.useState("")
    React.useEffect(() => {
        if (!enabled || !src) {
            setCut("")
            return
        }
        let cancelled = false
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
            if (cancelled) return
            const result = cutOutBackground(img, tolerance)
            if (result) setCut(result)
        }
        img.onerror = () => {
            if (!cancelled) setCut("")
        }
        img.src = src
        return () => {
            cancelled = true
        }
    }, [src, enabled, tolerance])
    // falls back to the original photo if the cut-out cannot be produced
    return cut || src
}

function HeroPhoto({
    src,
    cutout,
    tolerance,
    active,
    alt,
}: {
    src: string
    cutout: boolean
    tolerance: number
    active: boolean
    alt: string
}) {
    const shown = useCutout(src, cutout, tolerance)
    return (
        <img
            className={`lbc-hero-photo ${active ? "is-active" : ""}`}
            src={shown}
            alt={alt}
        />
    )
}

function PortfolioCard({
    src,
    cutout,
    tolerance,
    style,
    className,
    onClick,
    children,
}: {
    src: string
    cutout: boolean
    tolerance: number
    style: React.CSSProperties
    className: string
    onClick: () => void
    children?: React.ReactNode
}) {
    const shown = useCutout(src, cutout, tolerance)
    return (
        <div
            className={className}
            style={
                shown
                    ? { ...style, backgroundImage: `url(${shown})` }
                    : style
            }
            onClick={onClick}
        >
            {children}
        </div>
    )
}

// Video for the hero, about and portfolio slots. An uploaded file plays inline,
// muted and looping so it behaves like part of the layout; a YouTube or Vimeo
// link is embedded instead. Anything else is ignored rather than shown broken.
function embedUrl(link: string): string {
    const url = (link || "").trim()
    if (!url) return ""
    const yt = url.match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/
    )
    if (yt) return `https://www.youtube.com/embed/${yt[1]}`
    const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
    if (vm) return `https://player.vimeo.com/video/${vm[1]}`
    return ""
}

function SectionVideo({
    file,
    link,
    poster,
    label,
}: {
    file: string
    link: string
    poster: string
    label: string
}) {
    if (file) {
        return (
            <video
                className="lbc-video"
                src={file}
                poster={poster || undefined}
                autoPlay
                muted
                loop
                playsInline
                controls
            />
        )
    }
    const embed = embedUrl(link)
    if (!embed) return null
    return (
        <div className="lbc-video-embed">
            <iframe
                src={embed}
                title={label}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </div>
    )
}

function ContactForm({
    mode,
    endpoint,
    subject,
    email,
    namePlaceholder,
    emailPlaceholder,
    messagePlaceholder,
    buttonLabel,
    successText,
    errorText,
}: {
    mode: string
    endpoint: string
    subject: string
    email: string
    namePlaceholder: string
    emailPlaceholder: string
    messagePlaceholder: string
    buttonLabel: string
    successText: string
    errorText: string
}) {
    const [name, setName] = React.useState("")
    const [from, setFrom] = React.useState("")
    const [message, setMessage] = React.useState("")
    const [trap, setTrap] = React.useState("") // bots fill this, people never see it
    const [status, setStatus] = React.useState("idle")
    const [problem, setProblem] = React.useState("")

    const to = email || "hello@abclab.com"
    const line = subject || "New enquiry from the website"
    const sending = status === "sending"

    const send = async (e: React.FormEvent) => {
        e.preventDefault()
        if (sending) return

        if (!name.trim() || !from.trim() || !message.trim()) {
            setStatus("error")
            setProblem("Please fill in your name, email, and message.")
            return
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(from.trim())) {
            setStatus("error")
            setProblem("That email address doesn't look right.")
            return
        }
        if (trap) return // silently drop bot submissions

        const url = (endpoint || "").trim()
        if (mode !== "endpoint" || !url) {
            const body = `Name: ${name}\nEmail: ${from}\n\n${message}`
            window.location.href = `mailto:${to}?subject=${encodeURIComponent(
                line
            )}&body=${encodeURIComponent(body)}`
            return
        }

        setStatus("sending")
        setProblem("")
        try {
            const payload: Record<string, string> = {
                name: name.trim(),
                email: from.trim(),
                message: message.trim(),
                subject: line,
            }
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(payload),
            })
            // some services answer 200 with { success: false }
            let ok = res.ok
            try {
                const data = await res.json()
                if (data && data.success === false) ok = false
            } catch {}
            if (!ok) throw new Error("rejected")
            setStatus("sent")
            setName("")
            setFrom("")
            setMessage("")
        } catch {
            setStatus("error")
            setProblem(
                errorText ||
                    "That didn't send. Please try again, or email us directly."
            )
        }
    }

    if (status === "sent") {
        return (
            <div className="lbc-glass lbc-contact-form">
                <div className="lbc-form-sent" role="status">
                    <svg viewBox="0 0 24 24" width="34" height="34" fill="none">
                        <path
                            d="M4.5 12.5l5 5 10-11"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <p>{successText || "Thank you, your message is on its way."}</p>
                </div>
            </div>
        )
    }

    return (
        <form className="lbc-glass lbc-contact-form" onSubmit={send} noValidate>
            <div className="lbc-form-field">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={namePlaceholder || "Your Name"}
                    aria-label={namePlaceholder || "Your Name"}
                    autoComplete="name"
                />
            </div>
            <div className="lbc-form-field">
                <input
                    type="email"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    placeholder={emailPlaceholder || "Your Email"}
                    aria-label={emailPlaceholder || "Your Email"}
                    autoComplete="email"
                />
            </div>
            <div className="lbc-form-field">
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={
                        messagePlaceholder || "Tell us about your project"
                    }
                    aria-label={messagePlaceholder || "Your message"}
                    rows={4}
                />
            </div>
            <input
                className="lbc-form-trap"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={trap}
                onChange={(e) => setTrap(e.target.value)}
            />
            {status === "error" && problem ? (
                <p className="lbc-form-problem" role="alert">
                    {problem}
                </p>
            ) : null}
            <div className="lbc-submit-btn-wrap">
                <button type="submit" className="lbc-btn" disabled={sending}>
                    <span className="lbc-btn-fill" />
                    <span className="lbc-btn-label">
                        {sending
                            ? "Sending…"
                            : buttonLabel || "Send Message"}
                    </span>
                </button>
            </div>
        </form>
    )
}

function ServiceIcon({ iconKey }: { iconKey: string }) {
    if (iconKey === "printer") {
        return (
            <svg
                className="icon-outline"
                width="28"
                height="28"
                viewBox="0 0 24 24"
            >
                <path d="M4 4h16" strokeLinecap="round" />
                <path d="M4 4v14M20 4v14" strokeLinecap="round" />
                <rect
                    x="10"
                    y="6.5"
                    width="4"
                    height="2.5"
                    rx="0.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path d="M12 9v3" strokeLinecap="round" />
                <path
                    d="M8 15h8v3.5a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V15Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path d="M8 17h8" strokeLinecap="round" />
            </svg>
        )
    }
    if (iconKey === "design") {
        return (
            <svg
                className="icon-outline"
                width="28"
                height="28"
                viewBox="0 0 24 24"
            >
                <text
                    x="12"
                    y="6"
                    textAnchor="middle"
                    fontSize="6.5"
                    fontWeight="700"
                    fill="currentColor"
                    stroke="none"
                    fontFamily="Inter, sans-serif"
                >
                    3D
                </text>
                <path
                    d="M12 9l6 3.4v6.8L12 22.6l-6-3.4v-6.8L12 9Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    transform="scale(0.85) translate(2,-1)"
                />
                <path
                    d="M6 12.4l6 3.4 6-3.4M12 15.8v6.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    transform="scale(0.85) translate(2,-1)"
                />
            </svg>
        )
    }
    if (iconKey === "prototype") {
        return (
            <svg
                className="icon-outline"
                width="28"
                height="28"
                viewBox="0 0 24 24"
            >
                <path
                    d="M9 2h6M10 2v6.5L5.5 17a2 2 0 0 0 1.8 3h9.4a2 2 0 0 0 1.8-3L14 8.5V2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path d="M7.5 14h9" strokeLinecap="round" />
                <circle
                    cx="10.5"
                    cy="16.5"
                    r="0.6"
                    fill="currentColor"
                    stroke="none"
                />
                <circle
                    cx="14"
                    cy="17.5"
                    r="0.6"
                    fill="currentColor"
                    stroke="none"
                />
                <circle
                    cx="12"
                    cy="19"
                    r="0.6"
                    fill="currentColor"
                    stroke="none"
                />
            </svg>
        )
    }
    if (iconKey === "manufacturing") {
        return (
            <svg
                className="icon-outline"
                width="28"
                height="28"
                viewBox="0 0 24 24"
            >
                <rect
                    x="10"
                    y="6"
                    width="7"
                    height="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path d="M10 9h7" strokeLinecap="round" />
                <path
                    d="M2 16a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v0Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <circle cx="6" cy="20" r="1.3" strokeLinecap="round" />
                <circle cx="18" cy="20" r="1.3" strokeLinecap="round" />
                <path d="M6 18v-2M18 18v-2" strokeLinecap="round" />
            </svg>
        )
    }
    if (iconKey === "scan") {
        return (
            <svg
                className="icon-outline"
                width="28"
                height="28"
                viewBox="0 0 24 24"
            >
                <rect
                    x="3"
                    y="4"
                    width="7"
                    height="7"
                    rx="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path d="M6.5 7.5v0" strokeLinecap="round" />
                <path
                    d="M10.5 5l3-1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M10.5 9.5l3 1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <circle cx="15.5" cy="6.5" r="2.3" strokeLinecap="round" />
                <path d="M17.2 8.2l1.3 1.3" strokeLinecap="round" />
                <path
                    d="M4 15l4 6M12 15l0 6M20 15l-4 6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path d="M2 15h20" strokeLinecap="round" />
            </svg>
        )
    }
    if (iconKey === "wrench") {
        return (
            <svg
                className="icon-outline"
                width="28"
                height="28"
                viewBox="0 0 24 24"
            >
                <path
                    d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94L5.34 21.66a2 2 0 0 1-2.83-2.83L10.7 10.66a6 6 0 0 1 7.94-7.94Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        )
    }
    if (iconKey === "consulting") {
        return (
            <svg
                className="icon-outline"
                width="28"
                height="28"
                viewBox="0 0 24 24"
            >
                <path
                    d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        )
    }
    return (
        <svg
            className="icon-outline"
            width="28"
            height="28"
            viewBox="0 0 24 24"
        >
            <path d="M4 4h16" strokeLinecap="round" />
            <path d="M4 4v14M20 4v14" strokeLinecap="round" />
            <rect
                x="10"
                y="6.5"
                width="4"
                height="2.5"
                rx="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M12 9v3" strokeLinecap="round" />
            <path
                d="M8 15h8v3.5a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V15Z"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M8 17h8" strokeLinecap="round" />
        </svg>
    )
}

function SpecClockIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    )
}

function SpecWeightIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 2 3 7l9 5 9-5-9-5z" />
            <path d="M3 7v10l9 5 9-5V7" />
            <path d="M12 12v10" />
        </svg>
    )
}

function SpecMaterialIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
        </svg>
    )
}

function InstagramIcon() {
    return (
        <svg className="icon-outline" width="20" height="20" viewBox="0 0 24 24">
            <rect
                x="2"
                y="2"
                width="20"
                height="20"
                rx="5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="4" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="17.5" cy="6.5" r="0.9" fill="var(--lbc-accent)" stroke="none" />
        </svg>
    )
}

function LinkedInIcon() {
    return (
        <svg className="icon-outline" width="20" height="20" viewBox="0 0 24 24">
            <path
                d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <rect x="2" y="9" width="4" height="12" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="4" cy="4" r="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

function FacebookIcon() {
    return (
        <svg className="icon-outline" width="20" height="20" viewBox="0 0 24 24">
            <path
                d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

// ============================================================
// CSS (defined before the component so it is never referenced
// before initialization). Sizes ~121.5% of original,
// hover halo driven by --lbc-halo-color, resting card shadows driven by
// --lbc-card-shadow (glass cards, material/portfolio stack cards, modal
// nav arrows).
// ============================================================
const CSS_TEXT = `
.lbc-root { position: relative; box-sizing: border-box; width: 100%; }
.lbc-root * { box-sizing: border-box; }
.lbc-root a { text-decoration: none; color: inherit; }
.lbc-root img { display: block; max-width: 100%; }
.lbc-root h1, .lbc-root h2, .lbc-root h3 { font-family: var(--lbc-heading-font); font-weight: 500; margin: 0; }

.icon-outline { stroke: var(--lbc-accent); fill: none; stroke-width: 1.75; display: inline-block; vertical-align: middle; transition: filter .25s ease, opacity .25s ease; }

.lbc-reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1); }
.lbc-reveal.is-visible { opacity: 1; transform: translateY(0); }

.lbc-size-hint { position: absolute; inset: 0; z-index: 3; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.32rem; text-align: center; pointer-events: none; background: color-mix(in srgb, var(--lbc-accent) 8%, transparent); border: 1px dashed color-mix(in srgb, var(--lbc-accent) 35%, transparent); border-radius: inherit; }
.lbc-size-hint span { font-size: 0.73rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--lbc-accent); }
.lbc-size-hint strong { font-size: 1.03rem; font-weight: 600; color: var(--lbc-text); }

.lbc-glass {
  background: rgba(255,255,255,0.45);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255,255,255,0.35);
  border-radius: 26px;
  box-shadow: 0 3px 10px color-mix(in srgb, var(--lbc-card-shadow) 20%, transparent), 0 20px 44px color-mix(in srgb, var(--lbc-card-shadow) 18%, transparent), inset 0 1px 1px rgba(255,255,255,0.6);
  position: relative;
  transition: transform .3s ease, box-shadow .3s ease;
}
.lbc-glass:hover { transform: translateY(-5px) scale(1.02); box-shadow: 0 0 54px var(--lbc-halo-color), 0 20px 44px color-mix(in srgb, var(--lbc-card-shadow) 18%, transparent); }

.lbc-tag { font-size: 0.97rem; text-transform: uppercase; letter-spacing: 3px; color: var(--lbc-accent); margin-bottom: 14px; display: block; }
.lbc-text-gradient { background: linear-gradient(135deg, var(--lbc-accent), var(--lbc-accent2)); -webkit-background-clip: text; background-clip: text; color: transparent; }

.lbc-btn {
  padding: 14px 34px; font-size: 1.03rem; font-weight: 500; color: var(--lbc-btn-text-color);
  cursor: pointer; display: inline-block; border-radius: 999px;
  background: rgba(255,255,255,0.5); border: 1.5px solid var(--lbc-btn-border-color);
  transition: transform .25s ease, box-shadow .25s ease, background .25s ease;
}
.lbc-btn:hover { transform: translateY(-2px); background: rgba(255,255,255,0.75); box-shadow: 0 4px 14px var(--lbc-btn-border-color); }

.lbc-nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 50; display: flex; align-items: center; justify-content: space-between;
  padding: 20px 59px; background: rgba(255,255,255,0.65); backdrop-filter: blur(14px) saturate(180%);
  -webkit-backdrop-filter: blur(14px) saturate(180%); border-bottom: 1px solid rgba(255,255,255,0.45);
  box-shadow: 0 4px 24px color-mix(in srgb, var(--lbc-card-shadow) 14%, transparent); isolation: isolate;
}
@font-face{font-family:'Jost';font-style:normal;font-weight:400;font-display:swap;src:url(data:font/woff2;base64,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) format('woff2');}
.lbc-logo { display: flex; align-items: center; }
.lbc-logo, .lbc-flogo { font-family: 'Jost', sans-serif; font-weight: 400; font-size: 1.62rem;
  letter-spacing: .075em; color: var(--lbc-accent); line-height: 1; white-space: nowrap; }
.lbc-logo-img { height: 42px; width: auto; max-width: 220px; object-fit: contain; }
.lbc-nav-links { display: flex; gap: 39px; list-style: none; margin: 0; padding: 0; }
.lbc-nav-links a { color: var(--lbc-text-muted); font-size: 1.1rem; transition: color .2s; }
.lbc-nav-links a:hover { color: var(--lbc-accent); }

.lbc-hamburger { display: none; flex-direction: column; justify-content: center; gap: 5px; width: 39px; height: 39px; background: none; border: none; cursor: pointer; z-index: 60; }
.lbc-hamburger span { display: block; width: 100%; height: 2.9px; background: var(--lbc-accent); border-radius: 2px; transition: transform .3s ease, opacity .3s ease; }
.lbc-hamburger.is-open span:nth-child(1) { transform: translateY(9px) rotate(45deg); }
.lbc-hamburger.is-open span:nth-child(2) { opacity: 0; }
.lbc-hamburger.is-open span:nth-child(3) { transform: translateY(-9px) rotate(-45deg); }

.lbc-mobile-menu {
  position: fixed; inset: 0; z-index: 55; background: rgba(255,255,255,0.9); backdrop-filter: blur(30px) saturate(160%);
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 39px;
  opacity: 0; visibility: hidden; transform: translateY(-16px); transition: opacity .35s ease, transform .35s ease, visibility .35s ease;
}
.lbc-mobile-menu.is-open { opacity: 1; visibility: visible; transform: translateY(0); }
.lbc-mobile-menu ul { list-style: none; display: flex; flex-direction: column; align-items: center; gap: 34px; margin: 0; padding: 0; }
.lbc-mobile-menu ul a { font-size: 1.7rem; font-weight: 500; color: var(--lbc-text); }

.lbc-hero {
  min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; position: relative; overflow: hidden; padding: 170px 29px 97px;
  background:
    radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--lbc-bg-tint) 3%, transparent), transparent 45%),
    radial-gradient(circle at 80% 30%, color-mix(in srgb, var(--lbc-bg-tint) 2.5%, transparent), transparent 50%),
    radial-gradient(circle at 50% 90%, color-mix(in srgb, var(--lbc-bg-tint) 4%, transparent), transparent 55%);
}
.lbc-hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 73px; align-items: center; max-width: 1337px; width: 100%; margin: 0 auto; position: relative; z-index: 2; }
.lbc-hero-textbox { padding: 59px 53px; text-align: left; min-width: 0; }
.lbc-hero-textbox h1 { font-size: clamp(2.19rem, 6.3vw, 3.65rem); line-height: 1.15; }
.lbc-hero-textbox p { max-width: 729px; margin: 29px 0 0; font-weight: 300; color: var(--lbc-text-muted); font-size: 1.27rem; }
.lbc-cta { margin-top: 49px; display: flex; gap: 20px; flex-wrap: wrap; }

.lbc-hero-photos { position: relative; width: 100%; max-width: min(var(--lbc-hero-photo-w, 460px), 100%); aspect-ratio: 1 / 1; margin: 0 auto; }
.lbc-hero-photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; opacity: 0; transition: opacity 1.1s ease; }
.lbc-hero-photo.is-active { opacity: 1; }
.lbc-hero-photo-empty { position: absolute; inset: 0; border-radius: 24px; }
.lbc-hero-gallery-box { padding: 39px 24px; display: flex; flex-direction: column; align-items: center; gap: 10px; min-width: 0; width: 100%; }
.lbc-material-stack-wrapper { display: flex; align-items: center; justify-content: center; gap: 14px; max-width: 100%; width: 100%; margin: 0 auto; }
.lbc-material-stack { position: relative; width: min(364px, 60vw); height: min(364px, 60vw); flex-shrink: 1; perspective: 900px; }
.lbc-material-stack-card {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 29px;
  background: linear-gradient(135deg, var(--lbc-accent2), var(--lbc-accent));
  box-shadow: 0 16px 41px color-mix(in srgb, var(--lbc-card-shadow) 32%, transparent);
  transition: transform .5s cubic-bezier(0.16,1,0.3,1), opacity .5s ease, box-shadow .3s ease, z-index 0s;
  background-size: cover; background-position: center;
  transform-origin: center bottom;
}
.lbc-material-stack-card:hover { box-shadow: 0 0 54px var(--lbc-halo-color), 0 16px 41px color-mix(in srgb, var(--lbc-card-shadow) 32%, transparent); }
.lbc-material-card-inner { height: 100%; display: flex; flex-direction: column; justify-content: flex-end; padding: 34px; color: #fff; }
.lbc-material-card-inner h3 { font-size: 1.7rem; margin-bottom: 10px; }
.lbc-material-card-inner p { font-size: 1.1rem; font-weight: 300; opacity: 0.9; margin: 0; }
.lbc-material-stack-card.has-image { background-color: #fff; border: 1px solid var(--lbc-accent); box-shadow: 0 16px 41px color-mix(in srgb, var(--lbc-card-shadow) 22%, transparent); cursor: pointer; }
.lbc-material-stack-card.has-image:hover { box-shadow: 0 0 54px var(--lbc-halo-color); }
.lbc-material-stack-card.has-image .lbc-material-card-inner { display: none; }
/* portfolio photos float like the hero ones: no card, no border, no shadow */
.lbc-portfolio-card.has-image, .lbc-portfolio-card.has-image:hover {
  background-color: transparent; border: 0; box-shadow: none; border-radius: 0;
  background-size: contain; background-repeat: no-repeat; background-position: center;
}

.lbc-stack-nav { width: 49px; height: 49px; border-radius: 50%; background: rgba(255,255,255,0.6); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.6); color: var(--lbc-accent); font-size: 1.58rem; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: transform .2s ease, background .2s ease; }
.lbc-stack-nav:hover { transform: scale(1.08); background: rgba(255,255,255,0.85); }
.lbc-stack-dots { display: flex; justify-content: center; gap: 10px; margin-top: 24px; }
.lbc-stack-dot { width: 10px; height: 10px; border-radius: 50%; background: color-mix(in srgb, var(--lbc-dot-color) 25%, transparent); cursor: pointer; transition: background .25s ease, transform .25s ease; }
.lbc-stack-dot.active { background: var(--lbc-dot-color); transform: scale(1.3); }

.lbc-stats { padding: 73px 29px; }
.lbc-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; max-width: 1337px; margin: 0 auto; }
.lbc-stat-card { padding: 44px 24px; text-align: center; }
.lbc-stat-val { font-size: 2.67rem; font-weight: 500; font-family: var(--lbc-heading-font); color: var(--lbc-accent); }
.lbc-stat-lbl { font-size: 0.97rem; color: var(--lbc-text-muted); margin-top: 10px; }

.lbc-about-section { padding: 97px 29px; }
.lbc-about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 73px; align-items: center; max-width: 1337px; margin: 0 auto; }
.lbc-about-model { position: relative; height: 413px; display: flex; align-items: center; justify-content: center; overflow: visible; }
.lbc-about-img { width: 100%; height: 100%; object-fit: cover; border-radius: 29px; }
.lbc-about-text { color: var(--lbc-text-muted); font-weight: 300; line-height: 1.7; margin-top: 20px; max-width: 608px; font-size: 1.1rem; }

.lbc-spool-wrap { width: 100%; max-width: 364px; height: 100%; margin: 0 auto; }
.lbc-spool-wrap svg { width: 100%; height: 100%; overflow: visible; }
.lbc-spool-reel { animation: lbcSpoolSpin 7s linear infinite; }
.lbc-spool-reel.is-paused { animation: none; }
@keyframes lbcSpoolSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

.lbc-section-head { text-align: center; max-width: 729px; margin: 0 auto 73px; }
.lbc-section-head h2 { font-size: clamp(2.19rem, 6vw, 3.16rem); }

.lbc-services-section, .lbc-process-section, .lbc-materials-section, .lbc-portfolio-section, .lbc-testimonials-section, .lbc-faq-section, .lbc-contact-section { padding: 97px 29px; }
.lbc-services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 29px; max-width: 1337px; margin: 0 auto; }
.lbc-service-card { padding: 49px 39px; text-align: left; }
.lbc-service-icon { width: 68px; height: 68px; border-radius: 22px; border: 1px solid color-mix(in srgb, var(--lbc-accent) 25%, transparent); background: transparent; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; transition: transform .25s ease; }
.lbc-service-card:hover .lbc-service-icon { transform: scale(1.08); }
.lbc-service-icon-img { width: 32px; height: 32px; object-fit: contain; display: block; }
.lbc-service-card h3 { font-size: 1.46rem; margin-bottom: 13px; }
.lbc-service-card p { font-size: 1.1rem; color: var(--lbc-text-muted); font-weight: 300; line-height: 1.6; margin: 0; }

.lbc-timeline { max-width: 851px; margin: 0 auto; position: relative; padding-left: 73px; display: flex; flex-direction: column; gap: 44px; }
.lbc-timeline-line-bg { position: absolute; width: 5px; background: var(--lbc-accent2); opacity: 0.4; z-index: 0; border-radius: 4px; }
.lbc-timeline-line-progress { position: absolute; width: 5px; background: var(--lbc-accent); z-index: 0; border-radius: 4px; transition: height 0.15s linear; }
.lbc-timeline-step { position: relative; z-index: 2; }
.lbc-timeline-num {
  position: absolute; left: -73px; top: 50%; transform: translateY(-50%); width: 44px; height: 44px; border-radius: 50%;
  background: var(--lbc-accent); border: none; color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.03rem; font-weight: 600; z-index: 2; overflow: visible;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.lbc-timeline-num.active { transform: translateY(-50%) scale(1.12); box-shadow: 0 8px 22px color-mix(in srgb, var(--lbc-card-shadow) 45%, transparent); }
.lbc-timeline-card { padding: 22px 29px; opacity: 0.4; transform: scale(0.94) translateX(-6px); transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow .3s ease; }
.lbc-timeline-card.is-expanded { opacity: 1; transform: scale(1) translateX(0); }
.lbc-timeline-card h3 { font-size: 1.27rem; margin-bottom: 7px; }
.lbc-timeline-card p { font-size: 1.07rem; color: var(--lbc-text-muted); font-weight: 300; margin: 0; }

.lbc-fw-particle {
  position: absolute; top: 50%; left: 50%; width: 7px; height: 7px; border-radius: 50%;
  pointer-events: none; opacity: 0; transform: translate(-50%,-50%);
  background: var(--lbc-accent2); box-shadow: 0 0 6px var(--lbc-accent);
  animation: lbcFwBurst 0.8s ease-out forwards; z-index: 5;
}
@keyframes lbcFwBurst {
  0% { opacity: 1; transform: translate(-50%,-50%) rotate(var(--angle)) translateX(0) scale(1); }
  70% { opacity: 1; transform: translate(-50%,-50%) rotate(var(--angle)) translateX(27px) scale(0.4); }
  100% { opacity: 0; transform: translate(-50%,-50%) rotate(var(--angle)) translateX(29px) scale(0.2); }
}

.lbc-testimonial-wrap { display: flex; gap: 29px; max-width: 1094px; margin: 0 auto; flex-wrap: wrap; justify-content: center; }
.lbc-testimonial-card { flex: 1 1 389px; padding: 49px 39px; text-align: center; }
.lbc-stars { color: var(--lbc-accent); font-size: 1.22rem; margin-bottom: 17px; }
.lbc-testimonial-card p { font-style: italic; font-weight: 300; color: var(--lbc-text-muted); font-size: 1.1rem; }
.lbc-t-name { margin-top: 20px; font-weight: 500; font-size: 1.1rem; }
.lbc-t-role { font-size: 0.97rem; color: var(--lbc-text-muted); }

.lbc-faq-wrap { max-width: 790px; margin: 0 auto; display: flex; flex-direction: column; gap: 17px; }
.lbc-faq-item { overflow: hidden; }
.lbc-faq-q { padding: 27px 34px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; font-weight: 500; gap: 14px; font-size: 1.15rem; }
.lbc-faq-toggle { color: var(--lbc-accent); font-size: 1.46rem; flex-shrink: 0; }
.lbc-faq-a { padding: 0 34px; max-height: 0; overflow: hidden; opacity: 0; transition: max-height .4s ease, padding .4s ease, opacity .3s ease; font-size: 1.07rem; color: var(--lbc-text-muted); font-weight: 300; line-height: 1.6; }
.lbc-faq-item.open .lbc-faq-a { padding: 0 34px 27px; max-height: 292px; opacity: 1; }

.lbc-contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 29px; max-width: 1215px; margin: 0 auto; }
.lbc-contact-form { padding: 44px; display: flex; flex-direction: column; gap: 20px; min-width: 0; }
.lbc-form-trap { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
.lbc-form-problem { margin: 0; color: #C0392B; font-size: 1rem; line-height: 1.5; }
.lbc-contact-form button.lbc-btn { font-family: inherit; }
.lbc-contact-form button.lbc-btn:disabled { cursor: default; opacity: .7; transform: none; box-shadow: none; }
.lbc-form-sent { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; text-align: center; min-height: 220px; color: var(--lbc-accent); }
.lbc-form-sent p { margin: 0; color: var(--lbc-text-color, #1A1A25); font-size: 1.14rem; line-height: 1.55; max-width: 30ch; }
.lbc-form-field input, .lbc-form-field textarea {
  width: 100%; border: 1.5px solid color-mix(in srgb, var(--lbc-accent) 35%, transparent); background: rgba(255,255,255,.55); border-radius: 16px;
  padding: 17px 22px; font-family: var(--lbc-body-font); font-size: 1.1rem; outline: none; transition: border-color .2s ease, background .2s ease;
}
.lbc-form-field input:focus, .lbc-form-field textarea:focus { border-color: color-mix(in srgb, var(--lbc-accent) 70%, transparent); background: rgba(255,255,255,.7); }
.lbc-submit-btn-wrap { align-self: flex-start; }
.lbc-btn-fill { display: none; }
.lbc-contact-info { padding: 44px; display: flex; flex-direction: column; gap: 24px; justify-content: center; font-size: 1.12rem; min-width: 0; }
.lbc-contact-info a { color: var(--lbc-accent); }

.lbc-root a:focus-visible, .lbc-root button:focus-visible, .lbc-root input:focus-visible, .lbc-root textarea:focus-visible, .lbc-root [tabindex]:focus-visible {
  outline: 3px solid var(--lbc-accent); outline-offset: 3px; border-radius: 6px;
}
.lbc-skip { position: absolute; left: 12px; top: -60px; z-index: 99; padding: 12px 20px; border-radius: 0 0 12px 12px;
  background: var(--lbc-accent); color: #fff; font-size: 1rem; text-decoration: none; transition: top .18s ease; }
.lbc-skip:focus { top: 0; }
.lbc-video { display: block; width: 100%; height: 100%; object-fit: cover; border-radius: 24px; background: #000; }
.lbc-video-embed { position: relative; width: 100%; padding-top: 56.25%; border-radius: 24px; overflow: hidden; background: #000; }
.lbc-video-embed iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
.lbc-hero-video { width: 100%; max-width: min(var(--lbc-hero-photo-w, 460px), 100%); margin: 0 auto; }
.lbc-hero-video .lbc-video { aspect-ratio: 1 / 1; }
.lbc-portfolio-video { max-width: 1094px; margin: 34px auto 0; }
.lbc-map-note { max-width: 1215px; margin: 14px auto 0; display: flex; gap: 8px 18px; flex-wrap: wrap; align-items: baseline;
  justify-content: center; font-size: 1rem; color: var(--lbc-text-muted); }
.lbc-map-note a { color: var(--lbc-accent); text-decoration: none; border-bottom: 1px solid currentColor; }
.lbc-map-box { position: relative; max-width: 1215px; margin: 29px auto 0; height: 340px; overflow: hidden; }
.lbc-map-frame { position: absolute; inset: 0; }
.lbc-map-frame iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; display: block; }
.lbc-map-tint { position: absolute; inset: 0; pointer-events: none; mix-blend-mode: color; z-index: 2; }

.lbc-footer { padding: 73px 29px; text-align: center; }
.lbc-footer-card { max-width: 1094px; margin: 0 auto; padding: 61px; display: flex; flex-direction: column; align-items: center; gap: 17px; }

.lbc-fmotto { color: var(--lbc-text-muted); font-weight: 300; font-size: 1.1rem; }
.lbc-socials { display: flex; gap: 20px; align-items: center; }
.lbc-socials a { display: inline-flex; align-items: center; justify-content: center; transition: transform .25s ease; }
.lbc-socials a:hover { transform: scale(1.08); }
.lbc-socials a:hover .icon-outline { filter: drop-shadow(0 0 8px color-mix(in srgb, var(--lbc-accent) 55%, transparent)); opacity: .85; }

.lbc-product-modal {
  position: fixed; inset: 0; z-index: 210; background: rgba(26,26,46,0.45); backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  display: flex; align-items: center; justify-content: center; opacity: 0; visibility: hidden;
  transition: opacity .3s ease, visibility .3s ease; padding: 29px;
}
.lbc-product-modal.is-open { opacity: 1; visibility: visible; }
.lbc-product-modal-inner { position: relative; max-width: 996px; width: 100%; }
.lbc-product-card {
  background: rgba(255,255,255,0.92); backdrop-filter: blur(30px) saturate(180%); -webkit-backdrop-filter: blur(30px) saturate(180%);
  border-radius: 39px; border: 1px solid rgba(255,255,255,0.6); box-shadow: 0 24px 65px color-mix(in srgb, var(--lbc-modal-accent) 35%, transparent), inset 0 1px 1px rgba(255,255,255,0.7);
  max-width: 996px; width: 100%; max-height: 88vh; overflow: hidden; display: grid; grid-template-columns: 1fr 1fr;
  position: relative; transform: scale(0.85) translateY(24px); transition: transform .45s cubic-bezier(0.16,1,0.3,1);
}
.lbc-product-modal.is-open .lbc-product-card { transform: scale(1) translateY(0); }
.lbc-product-card-image { background-size: cover; background-position: center; background-repeat: no-repeat; background-color: #fff; min-height: 389px; }
.lbc-product-card-body { padding: 53px 49px; display: flex; flex-direction: column; justify-content: center; gap: 24px; overflow-y: auto; }
.lbc-product-card-body h3 { font-size: 2.07rem; font-weight: 500; line-height: 1.2; }
.lbc-product-desc { font-size: 1.15rem; color: var(--lbc-text-muted); font-weight: 300; line-height: 1.6; margin: 0; }
.lbc-product-specs { display: flex; flex-direction: column; gap: 17px; margin-top: 10px; }
.lbc-product-spec-row { display: flex; align-items: center; gap: 17px; padding: 17px 22px; background: color-mix(in srgb, var(--lbc-modal-accent) 6%, transparent); border: 1px solid color-mix(in srgb, var(--lbc-modal-accent) 18%, transparent); border-radius: 20px; }
.lbc-product-spec-icon { width: 46px; height: 46px; border-radius: 14px; background: color-mix(in srgb, var(--lbc-modal-accent) 12%, transparent); display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: var(--lbc-modal-accent); }
.lbc-product-spec-label { font-size: 0.87rem; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 3px; }
.lbc-product-spec-value { font-size: 1.22rem; font-weight: 600; color: var(--lbc-text); }
.lbc-product-card-close {
  position: absolute; top: 24px; right: 24px; width: 49px; height: 49px; border-radius: 50%;
  background: color-mix(in srgb, var(--lbc-modal-accent) 10%, transparent); border: 1px solid color-mix(in srgb, var(--lbc-modal-accent) 25%, transparent); color: var(--lbc-modal-accent);
  font-size: 1.58rem; cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: background .2s ease, transform .2s ease; z-index: 5;
}
.lbc-product-card-close:hover { background: color-mix(in srgb, var(--lbc-modal-accent) 20%, transparent); transform: scale(1.08); }
.lbc-product-modal-nav {
  position: absolute; top: 50%; transform: translateY(-50%); z-index: 220; width: 68px; height: 68px; font-size: 2.43rem;
  background: rgba(255,255,255,0.95); border: 2px solid var(--lbc-modal-accent); color: var(--lbc-modal-accent); border-radius: 50%;
  font-weight: 600; box-shadow: 0 8px 24px color-mix(in srgb, var(--lbc-modal-accent) 40%, transparent); cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: background .2s ease, transform .2s ease, box-shadow .2s ease;
}
.lbc-product-modal-nav:hover { background: var(--lbc-modal-accent); color: #fff; transform: translateY(-50%) scale(1.1); box-shadow: 0 10px 30px color-mix(in srgb, var(--lbc-modal-accent) 55%, transparent); }
.lbc-product-modal-nav.prev { left: -88px; }
.lbc-product-modal-nav.next { right: -88px; }

/* --- Cookie bar: colors come from the shared --lbc-* variables, so it
   repaints itself whenever the site color changes --- */
.lbc-cookie {
  position: fixed; z-index: 300; left: 24px; right: 24px; bottom: 24px;
  display: flex; justify-content: center; pointer-events: none;
}
.lbc-cookie.pos-left { justify-content: flex-start; }
.lbc-cookie.pos-right { justify-content: flex-end; }
.lbc-cookie-card {
  pointer-events: auto; width: 100%; max-width: 1094px; padding: 24px 30px;
  display: flex; align-items: center; justify-content: space-between; gap: 18px 30px; flex-wrap: wrap;
  text-align: left; animation: lbcCookieIn .45s cubic-bezier(0.16,1,0.3,1) both;
}
.lbc-cookie.pos-left .lbc-cookie-card, .lbc-cookie.pos-right .lbc-cookie-card {
  max-width: 430px; flex-direction: column; align-items: flex-start; gap: 18px;
}
/* stacked layouts: the text block must not claim the 320px basis vertically */
.lbc-cookie.pos-left .lbc-cookie-body, .lbc-cookie.pos-right .lbc-cookie-body { flex: 0 0 auto; width: 100%; }
/* the glass cards lift on hover; the cookie bar should sit still */
.lbc-cookie .lbc-cookie-card:hover {
  transform: none;
  box-shadow: 0 3px 10px color-mix(in srgb, var(--lbc-card-shadow) 20%, transparent), 0 20px 44px color-mix(in srgb, var(--lbc-card-shadow) 18%, transparent), inset 0 1px 1px rgba(255,255,255,0.6);
}
.lbc-cookie-body { flex: 1 1 320px; min-width: 0; }
.lbc-cookie-title { font-family: var(--lbc-heading-font); font-size: 1.15rem; font-weight: 500; color: var(--lbc-text); margin-bottom: 7px; }
.lbc-cookie-text { font-size: 1rem; font-weight: 300; line-height: 1.6; color: var(--lbc-text-muted); margin: 0; }
.lbc-cookie-link { display: inline-block; margin-top: 8px; font-size: 0.97rem; color: var(--lbc-accent); border-bottom: 1px solid currentColor; }
.lbc-cookie-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; flex-shrink: 0; }
.lbc-cookie-btn {
  font-family: var(--lbc-body-font); font-size: 0.98rem; font-weight: 500; line-height: 1;
  padding: 13px 28px; border-radius: 999px; cursor: pointer; white-space: nowrap;
  transition: transform .25s ease, box-shadow .25s ease, background .25s ease, color .25s ease;
}
.lbc-cookie-accept {
  background: var(--lbc-accent); border: 1.5px solid var(--lbc-accent); color: #fff;
  box-shadow: 0 6px 18px color-mix(in srgb, var(--lbc-card-shadow) 32%, transparent);
}
.lbc-cookie-accept:hover { transform: translateY(-2px); box-shadow: 0 0 26px var(--lbc-halo-color), 0 6px 18px color-mix(in srgb, var(--lbc-card-shadow) 32%, transparent); }
.lbc-cookie-reject {
  background: rgba(255,255,255,0.5); border: 1.5px solid var(--lbc-btn-border-color); color: var(--lbc-btn-text-color);
}
.lbc-cookie-reject:hover { transform: translateY(-2px); background: rgba(255,255,255,0.75); box-shadow: 0 4px 14px var(--lbc-btn-border-color); }
@keyframes lbcCookieIn { from { opacity: 0; transform: translateY(26px); } to { opacity: 1; transform: none; } }

@media (max-width: 900px) {
  /* the bar is sticky, so the hero has to start below it */
  .lbc-hero { padding-top: 96px; padding-bottom: 40px; min-height: auto; }
  .lbc-hero-grid { grid-template-columns: 1fr; gap: 44px; }
  .lbc-about-grid, .lbc-contact-grid { grid-template-columns: 1fr; }
  .lbc-stats-grid, .lbc-services-grid { grid-template-columns: repeat(2, 1fr); }
  .lbc-material-stack { width: min(340px, 55vw); height: min(340px, 55vw); }
  /* below the card on phones: inside it they landed on the title */
  .lbc-product-modal-inner { padding-bottom: 88px; }
  .lbc-product-modal-nav { top: auto; bottom: 8px; transform: none; }
  .lbc-product-modal-nav:hover { transform: scale(1.08); }
  .lbc-product-modal-nav.prev { left: 50%; right: auto; margin-left: -82px; }
  .lbc-product-modal-nav.next { left: 50%; right: auto; margin-left: 16px; }
}

@media (max-width: 768px) {
  .lbc-product-modal-nav { width: 59px; height: 59px; font-size: 2.07rem; }
  .lbc-product-modal-nav.prev { left: 50%; right: auto; margin-left: -75px; }
  .lbc-product-modal-nav.next { left: 50%; right: auto; margin-left: 16px; }
  .lbc-product-card { grid-template-columns: 1fr; max-height: 92vh; overflow-y: auto; }
  .lbc-product-card-image { min-height: 267px; }
  .lbc-product-card-body { padding: 39px 34px; }
}

@media (max-width: 700px) {
  .lbc-root { width: 100vw !important; max-width: 100vw !important; margin-left: calc(50% - 50vw) !important; }
  .lbc-nav { padding: 17px 24px; }
  .lbc-nav-links, .lbc-nav .lbc-btn-nav { display: none; }
  .lbc-hamburger { display: flex; }
  .lbc-stats-grid, .lbc-services-grid { grid-template-columns: 1fr; }
  .lbc-hero { padding: 96px 20px 40px; }
  .lbc-hero-textbox { padding: 39px 29px; }
  .lbc-hero-gallery-box { padding: 29px 14px; }
  .lbc-hero-photos { max-width: min(var(--lbc-hero-photo-w, 340px), 86vw); }
  .lbc-material-stack-wrapper { gap: 10px; }
  .lbc-material-stack { width: min(267px, 52vw); height: min(267px, 52vw); }
  .lbc-stack-nav { width: 41px; height: 41px; font-size: 1.34rem; }
  .lbc-timeline { padding-left: 59px; }
  .lbc-timeline-num { left: -59px; width: 39px; height: 39px; font-size: 0.95rem; }
  section, .lbc-stats, .lbc-about-section, .lbc-services-section, .lbc-process-section, .lbc-materials-section, .lbc-portfolio-section, .lbc-testimonials-section, .lbc-faq-section, .lbc-contact-section, .lbc-footer { padding-left: 24px; padding-right: 24px; }
  .lbc-map-box { height: 267px; }
  .lbc-cookie { left: 14px; right: 14px; bottom: 14px; }
  .lbc-cookie-card, .lbc-cookie.pos-left .lbc-cookie-card, .lbc-cookie.pos-right .lbc-cookie-card {
    max-width: none; padding: 22px 24px; flex-direction: column; align-items: stretch; gap: 18px;
  }
  .lbc-cookie-body { flex: 0 0 auto; width: 100%; }
  .lbc-cookie-actions { width: 100%; }
  .lbc-cookie-btn { flex: 1 1 140px; text-align: center; }
}

@media (max-width: 380px) {
  .lbc-material-stack { width: min(219px, 48vw); height: min(219px, 48vw); }
  .lbc-stack-nav { width: 37px; height: 37px; font-size: 1.22rem; }
  .lbc-material-stack-wrapper { gap: 7px; }
}

@media (prefers-reduced-motion: reduce) { .lbc-hero-photo { transition: none; } }
@media (prefers-reduced-motion: reduce) {
  .lbc-reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
  .lbc-timeline-card { opacity: 1 !important; transform: none !important; }
  .lbc-timeline-line-progress { transition: none !important; }
  .lbc-fw-particle { display: none !important; }
  .lbc-spool-reel { animation: none !important; }
  .lbc-cookie-card { animation: none !important; }
}

`

/**
 * Framer reads these from a block comment directly above the export. As line
 * comments they were ignored, which is why Fill was not offered.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 1440
 * @framerIntrinsicHeight 5200
 */
export default function AbcLabSite(props: Props) {
    const {
        navbar,
        globalStyle,
        hero,
        stats,
        about,
        services,
        process,
        materials,
        portfolio,
        testimonials,
        faq,
        contact,
        footer,
        cookies,
    } = props

    const {
        showNavbar,
        logoText,
        logoImage,
        navLabel1,
        navLink1,
        navLabel2,
        navLink2,
        navLabel3,
        navLink3,
        navLabel4,
        navLink4,
        navLabel5,
        navLink5,
        ctaText,
        ctaLink,
    } = navbar || ({} as NavbarGroup)

    const {
        siteColor,
        siteColorCustom,
        bgColor,
        textColor,
        textMutedColor,
        accentColor,
        accentColor2,
        bgTintColor,
        hoverHaloColor,
        cardShadowColor,
        buttonTextColor,
        buttonBorderColor,
        dotColor,
        headingFont,
        bodyFont,
        resetColors,
    } = globalStyle || ({} as GlobalStyleGroup)

    const {
        showHero,
        heroHeading,
        heroHeadingHighlight,
        heroText,
        heroCtaText,
        heroCtaLink,
        slides,
        heroGalleryWidth,
        heroGalleryHeight,
        heroGalleryAutoplay,
        heroGalleryAutoplaySpeed,
        heroCutoutTolerance,
        heroVideo,
        heroVideoLink,
    } = hero || ({} as HeroGroup)

    const { showStats, stats: statItems } = stats || ({} as StatsGroup)
    const {
        showAbout,
        aboutTag,
        aboutHeading,
        aboutText,
        aboutImage,
        aboutVideo,
        aboutVideoLink,
        spoolColor,
    } = about || ({} as AboutGroup)
    const {
        showServices,
        servicesTag,
        servicesHeading,
        services: serviceItems,
        recolorCustomIcons,
        customIconFollowAccent,
        customIconColor,
    } = services || ({} as ServicesGroup)
    const { showProcess, processTag, processHeading, steps } =
        process || ({} as ProcessGroup)
    const {
        showMaterials,
        materialsTag,
        materialsHeading,
        materials: materialItems,
    } = materials || ({} as MaterialsGroup)
    const {
        showPortfolio,
        portfolioTag,
        portfolioHeading,
        portfolioCutoutTolerance,
        portfolioVideo,
        portfolioVideoLink,
        items: portfolioItems,
        modalAccentColor,
    } = portfolio || ({} as PortfolioGroup)
    const {
        showTestimonials,
        testimonialsTag,
        testimonialsHeading,
        testimonials: testimonialItems,
    } = testimonials || ({} as TestimonialsGroup)
    const { showFaq, faqTag, faqHeading, items: faqItems } =
        faq || ({} as FaqGroup)
    const {
        showContact,
        contactTag,
        contactHeading,
        contactText,
        email,
        phone,
        address,
        emailLabel,
        phoneLabel,
        addressLabel,
        formMode,
        formEndpoint,
        formSubject,
        formNamePlaceholder,
        formEmailPlaceholder,
        formMessagePlaceholder,
        formButtonLabel,
        formSuccessText,
        formErrorText,
        showMap,
        mapAddress,
        mapTintColor,
        mapTintStrength,
        mapGrayscale,
    } = contact || ({} as ContactGroup)

    // size guides belong on the Framer canvas, never on the published page
    const onCanvas =
        typeof RenderTarget !== "undefined" &&
        RenderTarget.current &&
        RenderTarget.current() === RenderTarget.canvas
    const { showFooter, footerMotto, instagramLink, facebookLink, linkedinLink } =
        footer || ({} as FooterGroup)
    const {
        showCookieBar,
        cookieTitle,
        cookieText,
        cookieAcceptLabel,
        showCookieReject,
        cookieRejectLabel,
        cookiePolicyLabel,
        cookiePolicyLink,
        cookiePosition,
        cookieStorageKey,
        cookieAlwaysShow,
    } = cookies || ({} as CookiesGroup)

    const safeSlides = React.useMemo(
        () => (slides && slides.length > 0 ? slides : []),
        [slides]
    )
    const safeStats = React.useMemo(
        () => (statItems && statItems.length > 0 ? statItems : []),
        [statItems]
    )
    const safeServices = React.useMemo(
        () => (serviceItems && serviceItems.length > 0 ? serviceItems : []),
        [serviceItems]
    )
    const safeSteps = React.useMemo(
        () => (steps && steps.length > 0 ? steps : []),
        [steps]
    )
    const safeMaterials = React.useMemo(
        () => (materialItems && materialItems.length > 0 ? materialItems : []),
        [materialItems]
    )
    const safePortfolio = React.useMemo(
        () =>
            portfolioItems && portfolioItems.length > 0 ? portfolioItems : [],
        [portfolioItems]
    )
    const safeTestimonials = React.useMemo(
        () =>
            testimonialItems && testimonialItems.length > 0
                ? testimonialItems
                : [],
        [testimonialItems]
    )
    const safeFaq = React.useMemo(
        () => (faqItems && faqItems.length > 0 ? faqItems : []),
        [faqItems]
    )

    const navItems = React.useMemo(
        () => [
            { label: t(navLabel1, "About"), link: t(navLink1, "#about") },
            { label: t(navLabel2, "Services"), link: t(navLink2, "#services") },
            { label: t(navLabel3, "Process"), link: t(navLink3, "#process") },
            {
                label: t(navLabel4, "Materials"),
                link: t(navLink4, "#materials"),
            },
            {
                label: t(navLabel5, "Portfolio"),
                link: t(navLink5, "#portfolio"),
            },
        ],
        [
            navLabel1,
            navLink1,
            navLabel2,
            navLink2,
            navLabel3,
            navLink3,
            navLabel4,
            navLink4,
            navLabel5,
            navLink5,
        ]
    )

    const rootRef = React.useRef<HTMLDivElement>(null)
    const [menuOpen, setMenuOpen] = React.useState(false)
    const [activeSlide, setActiveSlide] = React.useState(0)
    const [activeMaterial, setActiveMaterial] = React.useState(0)
    const [activePortfolio, setActivePortfolio] = React.useState(0)
    const [openFaqIdx, setOpenFaqIdx] = React.useState(-1)
    const [productModal, setProductModal] = React.useState<{
        open: boolean
        index: number
    }>({ open: false, index: 0 })
    const [reduceMotion, setReduceMotion] = React.useState(false)
    const [heroAutoplayPaused, setHeroAutoplayPaused] = React.useState(false)

    // --- Cookie bar ---
    // The visitor's choice is remembered in localStorage, so the bar is shown
    // once and then stays away. Nothing is stored before they click.
    const cookieKey =
        typeof cookieStorageKey === "string" && cookieStorageKey.trim()
            ? cookieStorageKey.trim()
            : DEFAULT_COOKIE_KEY
    const [cookieConsent, setCookieConsent] = React.useState<string | null>(null)
    const [cookieChecked, setCookieChecked] = React.useState(false)

    React.useEffect(() => {
        if (showCookieBar !== true) return
        // on the Framer canvas the bar is always shown, so it can be styled
        // and read without having to clear the browser storage first
        if (onCanvas) {
            setCookieConsent(null)
            setCookieChecked(true)
            return
        }
        let stored: string | null = null
        try {
            stored = window.localStorage.getItem(cookieKey)
        } catch (err) {
            stored = null
        }
        setCookieConsent(
            stored === COOKIE_ACCEPTED || stored === COOKIE_REJECTED
                ? stored
                : null
        )
        setCookieChecked(true)
    }, [showCookieBar, onCanvas, cookieKey])

    const decideCookies = React.useCallback(
        (value: string) => {
            if (onCanvas) return
            setCookieConsent(value)
            try {
                window.localStorage.setItem(cookieKey, value)
            } catch (err) {
                // private mode / storage blocked: the choice just isn't remembered
            }
            try {
                // lets any analytics snippet on the page react to the choice
                window.dispatchEvent(
                    new CustomEvent("lbc-cookie-consent", {
                        detail: { consent: value },
                    })
                )
            } catch (err) {}
        },
        [onCanvas, cookieKey]
    )

    const cookiePos =
        cookiePosition === COOKIE_POS_LEFT || cookiePosition === COOKIE_POS_RIGHT
            ? cookiePosition
            : COOKIE_POS_BOTTOM
    // off unless the switch is turned on; then: always on the canvas, always
    // while "Always Show" is on for testing, otherwise until a choice is made
    const cookieBarVisible =
        showCookieBar === true &&
        (onCanvas ||
            cookieAlwaysShow === true ||
            (cookieChecked && cookieConsent === null))

    const toggleMenu = () => setMenuOpen((v) => !v)
    const closeMenu = () => setMenuOpen(false)

    const nextSlide = React.useCallback(() => {
        setActiveSlide((i) =>
            safeSlides.length > 0 ? (i + 1) % safeSlides.length : 0
        )
    }, [safeSlides.length])
    const prevSlide = React.useCallback(() => {
        setActiveSlide((i) =>
            safeSlides.length > 0
                ? (i - 1 + safeSlides.length) % safeSlides.length
                : 0
        )
    }, [safeSlides.length])

    // --- Hero gallery autoplay (pauses on hover/focus, disabled with reduced motion) ---
    React.useEffect(() => {
        if (reduceMotion) return
        if (heroGalleryAutoplay === false) return
        if (heroAutoplayPaused) return
        if (safeSlides.length <= 1) return
        const speedSec =
            typeof heroGalleryAutoplaySpeed === "number" &&
            heroGalleryAutoplaySpeed > 0
                ? heroGalleryAutoplaySpeed
                : 5
        const id = window.setInterval(() => {
            setActiveSlide((i) => (i + 1) % safeSlides.length)
        }, speedSec * 1000)
        return () => window.clearInterval(id)
    }, [
        reduceMotion,
        heroGalleryAutoplay,
        heroGalleryAutoplaySpeed,
        heroAutoplayPaused,
        safeSlides.length,
    ])

    const nextMaterial = React.useCallback(() => {
        setActiveMaterial((i) =>
            safeMaterials.length > 0 ? (i + 1) % safeMaterials.length : 0
        )
    }, [safeMaterials.length])
    const prevMaterial = React.useCallback(() => {
        setActiveMaterial((i) =>
            safeMaterials.length > 0
                ? (i - 1 + safeMaterials.length) % safeMaterials.length
                : 0
        )
    }, [safeMaterials.length])

    const nextPortfolio = React.useCallback(() => {
        setActivePortfolio((i) =>
            safePortfolio.length > 0 ? (i + 1) % safePortfolio.length : 0
        )
    }, [safePortfolio.length])
    const prevPortfolio = React.useCallback(() => {
        setActivePortfolio((i) =>
            safePortfolio.length > 0
                ? (i - 1 + safePortfolio.length) % safePortfolio.length
                : 0
        )
    }, [safePortfolio.length])

    const toggleFaq = (i: number) =>
        setOpenFaqIdx((prev) => (prev === i ? -1 : i))

    const openProductModal = (index: number) =>
        setProductModal({ open: true, index })
    const closeProductModal = () =>
        setProductModal((p) => ({ ...p, open: false }))
    const nextProduct = React.useCallback(() => {
        setProductModal((p) =>
            safePortfolio.length > 0
                ? { ...p, index: (p.index + 1) % safePortfolio.length }
                : p
        )
    }, [safePortfolio.length])
    const prevProduct = React.useCallback(() => {
        setProductModal((p) =>
            safePortfolio.length > 0
                ? {
                      ...p,
                      index:
                          (p.index - 1 + safePortfolio.length) %
                          safePortfolio.length,
                  }
                : p
        )
    }, [safePortfolio.length])

    React.useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (!productModal.open) return
            if (e.key === "Escape") closeProductModal()
            if (e.key === "ArrowRight") nextProduct()
            if (e.key === "ArrowLeft") prevProduct()
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [productModal.open, nextProduct, prevProduct])

    React.useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
        setReduceMotion(mq.matches)
    }, [])

    // --- Scroll reveal for Services cards ---
    const [visibleServices, setVisibleServices] = React.useState<boolean[]>([])
    const serviceCardRefs = React.useRef<(HTMLDivElement | null)[]>([])
    const servicesContentKey = React.useMemo(
        () =>
            safeServices
                .map((s) => `${s.serviceIconKey}|${s.serviceTitle}`)
                .join("::"),
        [safeServices]
    )

    React.useEffect(() => {
        setVisibleServices((prev) => {
            if (prev.length === safeServices.length) return prev
            return safeServices.map((_, i) => prev[i] || false)
        })

        if (reduceMotion || !("IntersectionObserver" in window)) {
            setVisibleServices(safeServices.map(() => true))
            return
        }

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const idx = serviceCardRefs.current.indexOf(
                        entry.target as HTMLDivElement
                    )
                    if (entry.isIntersecting && idx > -1) {
                        setVisibleServices((prev) => {
                            if (prev[idx]) return prev
                            const next = [...prev]
                            next[idx] = true
                            return next
                        })
                        io.unobserve(entry.target)
                    }
                })
            },
            { threshold: 0.15 }
        )
        serviceCardRefs.current.forEach((el) => el && io.observe(el))

        const fallback = window.setTimeout(() => {
            setVisibleServices((prev) => {
                if (prev.every(Boolean)) return prev
                return prev.map(() => true)
            })
        }, REVEAL_FALLBACK_MS)

        return () => {
            io.disconnect()
            window.clearTimeout(fallback)
        }
    }, [servicesContentKey, safeServices.length, reduceMotion])

    // --- Process timeline scroll-linked progress line ---
    const timelineRef = React.useRef<HTMLDivElement>(null)
    const numRefs = React.useRef<(HTMLDivElement | null)[]>([])
    const [lineProgress, setLineProgress] = React.useState(0)
    const [lineBounds, setLineBounds] = React.useState({
        top: 22,
        bottom: 22,
        x: 22,
    })
    const [burstedSteps, setBurstedSteps] = React.useState<Set<number>>(
        new Set()
    )

    const processContentKey = React.useMemo(
        () => safeSteps.map((s) => `${s.stepTitle}|${s.stepText}`).join("::"),
        [safeSteps]
    )

    React.useEffect(() => {
        const measure = () => {
            const el = timelineRef.current
            const nums = numRefs.current.filter(Boolean) as HTMLDivElement[]
            if (!el || nums.length === 0) return
            const containerRect = el.getBoundingClientRect()
            const firstRect = nums[0].getBoundingClientRect()
            const lastRect = nums[nums.length - 1].getBoundingClientRect()
            const top = firstRect.top + firstRect.height / 2 - containerRect.top
            const bottomCenter =
                lastRect.top + lastRect.height / 2 - containerRect.top
            const bottom = Math.max(0, containerRect.height - bottomCenter)
            const x = firstRect.left + firstRect.width / 2 - containerRect.left
            setLineBounds({ top, bottom, x })
        }
        measure()
        window.addEventListener("resize", measure)
        const t1 = window.setTimeout(measure, 200)
        return () => {
            window.removeEventListener("resize", measure)
            window.clearTimeout(t1)
        }
    }, [processContentKey, safeSteps.length])

    React.useEffect(() => {
        if (reduceMotion) {
            setLineProgress(1)
            return
        }
        let ticking = false
        const update = () => {
            const el = timelineRef.current
            if (!el) {
                ticking = false
                return
            }
            const rect = el.getBoundingClientRect()
            const vh = window.innerHeight
            // the line fills to the middle of the screen, so a step lights up
            // as its circle reaches the centre rather than the lower edge
            const middle = vh * 0.5
            const scrolled = middle - rect.top
            const progress =
                rect.height > 0
                    ? Math.max(0, Math.min(1, scrolled / rect.height))
                    : 0
            setLineProgress(progress)
            ticking = false
        }
        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(update)
                ticking = true
            }
        }
        window.addEventListener("scroll", onScroll, {
            passive: true,
            capture: true,
        })
        update()
        return () =>
            window.removeEventListener("scroll", onScroll, {
                capture: true,
            } as any)
    }, [reduceMotion, safeSteps.length])

    React.useEffect(() => {
        if (safeSteps.length === 0) return
        safeSteps.forEach((_, i) => {
            const threshold = (i + 0.5) / safeSteps.length
            if (lineProgress >= threshold) {
                setBurstedSteps((prev) =>
                    prev.has(i) ? prev : new Set(prev).add(i)
                )
            }
        })
    }, [lineProgress, safeSteps.length])

    // "Reset Colors" override: Framer code components can't rewrite their
    // own property-control values, so this switch instead makes every base
    // color fall back to the original purple palette at render time,
    // regardless of what the individual color controls below are set to.
    const useDefaultColors = resetColors === true

    // Which single color is currently driving the whole site, if any.
    // Priority: Reset Colors > Site Color preset / picker > nothing
    // (= the individual color controls stay in charge).
    const themeColor = React.useMemo(() => {
        if (useDefaultColors) return DEFAULT_ACCENT_COLOR
        if (siteColor === SITE_COLOR_PICK)
            return siteColorCustom || DEFAULT_ACCENT_COLOR
        if (!siteColor || siteColor === SITE_COLOR_CUSTOM) return ""
        return presetColor(siteColor)
    }, [useDefaultColors, siteColor, siteColorCustom])

    const palette = React.useMemo(
        () => (themeColor ? buildPalette(themeColor) : null),
        [themeColor]
    )

    // One color wins over the individual controls only while a theme color is
    // active; otherwise every control keeps working exactly as before.
    const themed = React.useCallback(
        (key: keyof Palette, custom: string | undefined, fallback: string) =>
            palette ? palette[key] : custom || fallback,
        [palette]
    )

    const resolvedAccent = themed("accent", accentColor, DEFAULT_ACCENT_COLOR)

    const rootStyle: React.CSSProperties & Record<string, any> = {
        position: "relative",
        width: "100%",
        height: "100%",
        background: "var(--lbc-bg)",
        color: "var(--lbc-text)",
        fontFamily: "var(--lbc-body-font)",
        "--lbc-bg": themed("bg", bgColor, DEFAULT_BG_COLOR),
        "--lbc-text": themed("text", textColor, DEFAULT_TEXT_COLOR),
        "--lbc-text-muted": themed(
            "textMuted",
            textMutedColor,
            DEFAULT_TEXT_MUTED_COLOR
        ),
        "--lbc-accent": resolvedAccent,
        "--lbc-accent2": themed("accent2", accentColor2, DEFAULT_ACCENT2_COLOR),
        "--lbc-bg-tint": themed("bgTint", bgTintColor, DEFAULT_BG_TINT_COLOR),
        "--lbc-halo-color": themed("halo", hoverHaloColor, DEFAULT_HALO_COLOR),
        "--lbc-card-shadow": themed(
            "cardShadow",
            cardShadowColor,
            DEFAULT_CARD_SHADOW_COLOR
        ),
        "--lbc-btn-text-color": themed(
            "buttonText",
            buttonTextColor,
            DEFAULT_BUTTON_TEXT_COLOR
        ),
        "--lbc-btn-border-color": themed(
            "buttonBorder",
            buttonBorderColor,
            DEFAULT_BUTTON_BORDER_COLOR
        ),
        "--lbc-dot-color": themed("dot", dotColor, DEFAULT_DOT_COLOR),
        "--lbc-modal-accent": themed(
            "modalAccent",
            modalAccentColor,
            DEFAULT_MODAL_ACCENT_COLOR
        ),
        "--lbc-heading-font": headingFont || DEFAULT_HEADING_FONT,
        "--lbc-body-font": bodyFont || DEFAULT_BODY_FONT,
    }

    const activeProduct =
        safePortfolio.length > 0 ? safePortfolio[productModal.index] : undefined
    const activeProductImg = useCutout(
        activeProduct ? resolveImageSrc(activeProduct.portfolioImage) : "",
        !!(activeProduct && activeProduct.portfolioImageCutout),
        typeof portfolioCutoutTolerance === "number"
            ? portfolioCutoutTolerance
            : 38
    )

    return (
        <div ref={rootRef} className="lbc-root" style={rootStyle}>
            <style>{CSS_TEXT}</style>

            <a className="lbc-skip" href="#lbc-main">
                Skip to content
            </a>


            {/* --------- NAVBAR --------- */}
            {visible(showNavbar) && (
                <>
                    <nav className="lbc-nav">
                        <div className="lbc-logo">
                            {resolveImageSrc(logoImage) ? (
                                <img
                                    src={resolveImageSrc(logoImage)}
                                    alt={logoText || "Logo"}
                                    className="lbc-logo-img"
                                />
                            ) : (
                                logoText || "ABC LAB"
                            )}
                        </div>
                        <ul className="lbc-nav-links">
                            {navItems.map((item, i) => (
                                <li key={i}>
                                    <a href={item.link}>{item.label}</a>
                                </li>
                            ))}
                        </ul>
                        <a
                            href={ctaLink || "#contact"}
                            className="lbc-btn lbc-btn-nav"
                        >
                            {ctaText || "Get a Quote"}
                        </a>
                        <button
                            type="button"
                            className={`lbc-hamburger ${menuOpen ? "is-open" : ""}`}
                            aria-label="Menu"
                            onClick={toggleMenu}
                        >
                            <span />
                            <span />
                            <span />
                        </button>
                    </nav>

                    <div
                        className={`lbc-mobile-menu ${menuOpen ? "is-open" : ""}`}
                    >
                        <ul>
                            {navItems.map((item, i) => (
                                <li key={i}>
                                    <a href={item.link} onClick={closeMenu}>
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <a
                            href={ctaLink || "#contact"}
                            className="lbc-btn"
                            onClick={closeMenu}
                        >
                            {ctaText || "Get a Quote"}
                        </a>
                    </div>
                </>
            )}

            {/* --------- HERO --------- */}
            <div id="lbc-main" />
            {visible(showHero) && (
                <section className="lbc-hero">
                    <div className="lbc-hero-grid">
                        <div className="lbc-glass lbc-hero-textbox">
                            <h1>
                                {heroHeading || "The future of manufacturing"}{" "}
                                <span className="lbc-text-gradient">
                                    {heroHeadingHighlight || "starts in 3D"}
                                </span>
                            </h1>
                            <p>
                                {heroText ||
                                    "ABC LAB designs, prototypes, and manufactures precise 3D models, functional parts, and custom products with a focus on quality, speed, and innovation."}
                            </p>
                            <div className="lbc-cta">
                                <a
                                    href={heroCtaLink || "#contact"}
                                    className="lbc-btn lbc-btn-glass"
                                >
                                    {heroCtaText || "Get a Free Quote"}
                                </a>
                            </div>
                        </div>
                        {resolveImageSrc(heroVideo) || embedUrl(heroVideoLink) ? (
                            <div className="lbc-hero-video">
                                <SectionVideo
                                    file={resolveImageSrc(heroVideo)}
                                    link={heroVideoLink}
                                    poster={
                                        safeSlides.length > 0
                                            ? resolveImageSrc(
                                                  safeSlides[0].heroImage
                                              )
                                            : ""
                                    }
                                    label="Hero video"
                                />
                            </div>
                        ) : (
                        <div
                            className="lbc-hero-photos"
                            style={{
                                ["--lbc-hero-photo-w" as any]: heroGalleryWidth
                                    ? `${heroGalleryWidth}px`
                                    : undefined,
                                aspectRatio:
                                    heroGalleryWidth && heroGalleryHeight
                                        ? `${heroGalleryWidth} / ${heroGalleryHeight}`
                                        : undefined,
                            }}
                            onMouseEnter={() => setHeroAutoplayPaused(true)}
                            onMouseLeave={() => setHeroAutoplayPaused(false)}
                        >
                            {safeSlides.length === 0 && onCanvas && (
                                <div className="lbc-hero-photo-empty">
                                    <SizeHint text="1000 × 1000 px" />
                                </div>
                            )}
                            {safeSlides.map((s, i) => {
                                const img = resolveImageSrc(s.heroImage)
                                if (!img) return null
                                return (
                                    <HeroPhoto
                                        key={i}
                                        src={img}
                                        cutout={!!s.heroImageCutout}
                                        tolerance={
                                            typeof heroCutoutTolerance ===
                                            "number"
                                                ? heroCutoutTolerance
                                                : 38
                                        }
                                        active={i === activeSlide}
                                        alt={s.heroSlideTitle || ""}
                                    />
                                )
                            })}
                        </div>
                        )}
                    </div>
                </section>
            )}

            {/* --------- STATS --------- */}
            {visible(showStats) && safeStats.length > 0 && (
                <section className="lbc-stats">
                    <div className="lbc-stats-grid">
                        {safeStats.map((s, i) => (
                            <div key={i} className="lbc-glass lbc-stat-card">
                                <div className="lbc-stat-val">
                                    {s.statValue}
                                </div>
                                <div className="lbc-stat-lbl">
                                    {s.statLabel}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* --------- ABOUT --------- */}
            {visible(showAbout) && (
                <section id="about" className="lbc-about-section">
                    <div className="lbc-about-grid">
                        <div className="lbc-about-model">
                            {resolveImageSrc(aboutVideo) ||
                            embedUrl(aboutVideoLink) ? (
                                <SectionVideo
                                    file={resolveImageSrc(aboutVideo)}
                                    link={aboutVideoLink}
                                    poster={resolveImageSrc(aboutImage)}
                                    label="About video"
                                />
                            ) : resolveImageSrc(aboutImage) ? (
                                <img
                                    src={resolveImageSrc(aboutImage)}
                                    alt="About"
                                    className="lbc-about-img"
                                />
                            ) : (
                                <>
                                    <AboutSpool
                                        reduceMotion={reduceMotion}
                                        spoolColor={themed(
                                            "spool",
                                            spoolColor,
                                            DEFAULT_SPOOL_COLOR
                                        )}
                                    />
                                    {onCanvas && (
                                        <SizeHint text="1200 × 780 px" />
                                    )}
                                </>
                            )}
                        </div>
                        <div>
                            <span className="lbc-tag">
                                {aboutTag || "About Us"}
                            </span>
                            <h2>
                                {aboutHeading || "Precision meets innovation"}
                            </h2>
                            <p className="lbc-about-text">
                                {aboutText ||
                                    "ABC LAB combines advanced 3D printing technology with engineering precision. From the first concept to the final part, we support every project with a focus on detail, speed, and reliability."}
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {/* --------- SERVICES --------- */}
            {visible(showServices) && safeServices.length > 0 && (
                <section id="services" className="lbc-services-section">
                    <div className="lbc-section-head">
                        <span className="lbc-tag">
                            {servicesTag || "What We Do"}
                        </span>
                        <h2>{servicesHeading || "Our Services"}</h2>
                    </div>
                    <div className="lbc-services-grid">
                        {safeServices.map((s, i) => (
                            <div
                                key={i}
                                ref={(el) => {
                                    serviceCardRefs.current[i] = el
                                }}
                                className={`lbc-glass lbc-service-card lbc-reveal ${visibleServices[i] ? "is-visible" : ""}`}
                                style={{
                                    transitionDelay: reduceMotion
                                        ? "0ms"
                                        : `${(i % 3) * 100}ms`,
                                }}
                            >
                                <div className="lbc-service-icon">
                                    {resolveImageSrc(s.serviceIconImage) ? (
                                        <CustomServiceIcon
                                            src={resolveImageSrc(
                                                s.serviceIconImage
                                            )}
                                            recolor={!!recolorCustomIcons}
                                            color={
                                                customIconFollowAccent ===
                                                false
                                                    ? customIconColor ||
                                                      resolvedAccent
                                                    : resolvedAccent
                                            }
                                        />
                                    ) : (
                                        <ServiceIcon
                                            iconKey={
                                                s.serviceIconKey || "printer"
                                            }
                                        />
                                    )}
                                </div>
                                <h3>{s.serviceTitle}</h3>
                                <p>{s.serviceText}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* --------- PROCESS --------- */}
            {visible(showProcess) && safeSteps.length > 0 && (
                <section id="process" className="lbc-process-section">
                    <div className="lbc-section-head">
                        <span className="lbc-tag">
                            {processTag || "How It Works"}
                        </span>
                        <h2>{processHeading || "Our Process"}</h2>
                    </div>
                    <div ref={timelineRef} className="lbc-timeline">
                        <div
                            className="lbc-timeline-line-bg"
                            style={{
                                left: lineBounds.x,
                                top: lineBounds.top,
                                bottom: lineBounds.bottom,
                                transform: "translateX(-50%)",
                            }}
                        />
                        <div
                            className="lbc-timeline-line-progress"
                            style={{
                                left: lineBounds.x,
                                top: lineBounds.top,
                                height: `calc((100% - ${lineBounds.top + lineBounds.bottom}px) * ${lineProgress})`,
                                transform: "translateX(-50%)",
                            }}
                        />
                        {safeSteps.map((s, i) => {
                            const threshold = (i + 0.5) / safeSteps.length
                            const active = lineProgress >= threshold
                            const bursted = burstedSteps.has(i)
                            return (
                                <div key={i} className="lbc-timeline-step">
                                    <div
                                        ref={(el) => {
                                            numRefs.current[i] = el
                                        }}
                                        className={`lbc-timeline-num ${active ? "active" : ""}`}
                                    >
                                        {i + 1}
                                        {!reduceMotion && bursted && (
                                            <FireworkBurst />
                                        )}
                                    </div>
                                    <div
                                        className={`lbc-glass lbc-timeline-card ${active ? "is-expanded" : ""}`}
                                    >
                                        <h3>{s.stepTitle}</h3>
                                        {s.stepText && <p>{s.stepText}</p>}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section>
            )}

            {/* --------- MATERIALS --------- */}
            {visible(showMaterials) && safeMaterials.length > 0 && (
                <section id="materials" className="lbc-materials-section">
                    <div className="lbc-section-head">
                        <span className="lbc-tag">
                            {materialsTag || "Materials"}
                        </span>
                        <h2>{materialsHeading || "What We Print With"}</h2>
                    </div>
                    <div
                        className="lbc-hero-gallery-box"
                        style={{
                            background: "none",
                            backdropFilter: "none",
                            border: "none",
                            boxShadow: "none",
                        }}
                    >
                        <div className="lbc-material-stack-wrapper">
                            <button
                                type="button"
                                className="lbc-stack-nav prev"
                                aria-label="Previous material"
                                onClick={prevMaterial}
                            >
                                &#8249;
                            </button>
                            <div className="lbc-material-stack">
                                {safeMaterials.map((m, i) => {
                                    const total = safeMaterials.length
                                    const offset =
                                        total > 0
                                            ? (i - activeMaterial + total) %
                                              total
                                            : 0
                                    return (
                                        <div
                                            key={i}
                                            className="lbc-material-stack-card"
                                            style={getStackStyle(offset)}
                                        >
                                            <div className="lbc-material-card-inner">
                                                <h3>{m.materialName}</h3>
                                                <p>{m.materialText}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <button
                                type="button"
                                className="lbc-stack-nav next"
                                aria-label="Next material"
                                onClick={nextMaterial}
                            >
                                &#8250;
                            </button>
                        </div>
                        {safeMaterials.length > 1 && (
                            <div className="lbc-stack-dots">
                                {safeMaterials.map((_, i) => (
                                    <span
                                        key={i}
                                        className={`lbc-stack-dot ${i === activeMaterial ? "active" : ""}`}
                                        onClick={() => setActiveMaterial(i)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* --------- PORTFOLIO --------- */}
            {visible(showPortfolio) && safePortfolio.length > 0 && (
                <section id="portfolio" className="lbc-portfolio-section">
                    <div className="lbc-section-head">
                        <span className="lbc-tag">
                            {portfolioTag || "Our Work"}
                        </span>
                        <h2>{portfolioHeading || "Portfolio"}</h2>
                    </div>
                    <div
                        className="lbc-hero-gallery-box"
                        style={{
                            background: "none",
                            backdropFilter: "none",
                            border: "none",
                            boxShadow: "none",
                        }}
                    >
                        <div className="lbc-material-stack-wrapper">
                            <button
                                type="button"
                                className="lbc-stack-nav prev"
                                aria-label="Previous project"
                                onClick={prevPortfolio}
                            >
                                &#8249;
                            </button>
                            <div className="lbc-material-stack">
                                {safePortfolio.map((p, i) => {
                                    const img = resolveImageSrc(
                                        p.portfolioImage
                                    )
                                    const total = safePortfolio.length
                                    const offset =
                                        total > 0
                                            ? (i - activePortfolio + total) %
                                              total
                                            : 0
                                    return (
                                        <PortfolioCard
                                            key={i}
                                            src={img}
                                            cutout={!!p.portfolioImageCutout}
                                            tolerance={
                                                typeof portfolioCutoutTolerance ===
                                                "number"
                                                    ? portfolioCutoutTolerance
                                                    : 38
                                            }
                                            className={`lbc-material-stack-card lbc-portfolio-card ${img ? "has-image" : ""}`}
                                            style={getFlatStackStyle(offset)}
                                            onClick={() => {
                                                if (img) openProductModal(i)
                                            }}
                                        >
                                            {!img && (
                                                <div className="lbc-material-card-inner">
                                                    <h3>
                                                        {t(
                                                            p.portfolioTitle,
                                                            `Project ${i + 1}`
                                                        )}
                                                    </h3>
                                                    <p>
                                                        {t(
                                                            p.portfolioDesc,
                                                            "Space for a project description."
                                                        )}
                                                    </p>
                                                </div>
                                            )}
                                            {!img && offset === 0 && onCanvas && (
                                                <SizeHint text="1200 × 1200 px" />
                                            )}
                                        </PortfolioCard>
                                    )
                                })}
                            </div>
                            <button
                                type="button"
                                className="lbc-stack-nav next"
                                aria-label="Next project"
                                onClick={nextPortfolio}
                            >
                                &#8250;
                            </button>
                        </div>
                        {safePortfolio.length > 1 && (
                            <div className="lbc-stack-dots">
                                {safePortfolio.map((_, i) => (
                                    <span
                                        key={i}
                                        className={`lbc-stack-dot ${i === activePortfolio ? "active" : ""}`}
                                        onClick={() => setActivePortfolio(i)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    {(resolveImageSrc(portfolioVideo) ||
                        embedUrl(portfolioVideoLink)) && (
                        <div className="lbc-portfolio-video">
                            <SectionVideo
                                file={resolveImageSrc(portfolioVideo)}
                                link={portfolioVideoLink}
                                poster=""
                                label="Portfolio video"
                            />
                        </div>
                    )}
                </section>
            )}

            {/* --------- TESTIMONIALS --------- */}
            {visible(showTestimonials) && safeTestimonials.length > 0 && (
                <section className="lbc-testimonials-section">
                    <div className="lbc-section-head">
                        <span className="lbc-tag">
                            {testimonialsTag || "Testimonials"}
                        </span>
                        <h2>{testimonialsHeading || "What Clients Say"}</h2>
                    </div>
                    <div className="lbc-testimonial-wrap">
                        {safeTestimonials.map((tst, i) => (
                            <div
                                key={i}
                                className="lbc-glass lbc-testimonial-card"
                            >
                                <div className="lbc-stars">★★★★★</div>
                                <p>&ldquo;{tst.quote}&rdquo;</p>
                                <div className="lbc-t-name">{tst.name}</div>
                                <div className="lbc-t-role">{tst.role}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* --------- FAQ --------- */}
            {visible(showFaq) && safeFaq.length > 0 && (
                <section className="lbc-faq-section">
                    <div className="lbc-section-head">
                        <span className="lbc-tag">{faqTag || "FAQ"}</span>
                        <h2>{faqHeading || "Frequently Asked Questions"}</h2>
                    </div>
                    <div className="lbc-faq-wrap">
                        {safeFaq.map((f, i) => (
                            <div
                                key={i}
                                className={`lbc-glass lbc-faq-item ${openFaqIdx === i ? "open" : ""}`}
                            >
                                <div
                                    className="lbc-faq-q"
                                    onClick={() => toggleFaq(i)}
                                >
                                    <span>{f.question}</span>
                                    <span className="lbc-faq-toggle">
                                        {openFaqIdx === i ? "−" : "+"}
                                    </span>
                                </div>
                                <div className="lbc-faq-a">{f.answer}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* --------- CONTACT --------- */}
            {visible(showContact) && (
                <section id="contact" className="lbc-contact-section">
                    <div className="lbc-section-head">
                        <span className="lbc-tag">
                            {contactTag || "Contact"}
                        </span>
                        <h2>
                            {contactHeading ||
                                "Let's Build Something Together"}
                        </h2>
                        <p>
                            {contactText ||
                                "Send us your idea and we will get back to you shortly."}
                        </p>
                    </div>
                    <div className="lbc-contact-grid">
                        <ContactForm
                            mode={formMode || "mailto"}
                            endpoint={formEndpoint}
                            subject={formSubject}
                            email={email}
                            namePlaceholder={formNamePlaceholder}
                            emailPlaceholder={formEmailPlaceholder}
                            messagePlaceholder={formMessagePlaceholder}
                            buttonLabel={formButtonLabel}
                            successText={formSuccessText}
                            errorText={formErrorText}
                        />
                        <div className="lbc-glass lbc-contact-info">
                            <div>
                                <strong>{emailLabel || "Email"}</strong>
                                <br />
                                <a
                                    href={`mailto:${email || "hello@abclab.com"}`}
                                >
                                    {email || "hello@abclab.com"}
                                </a>
                            </div>
                            <div>
                                <strong>{phoneLabel || "Phone"}</strong>
                                <br />
                                <a
                                    href={`tel:${(phone || "").replace(/\s+/g, "")}`}
                                >
                                    {phone || "+1 555 234 567"}
                                </a>
                            </div>
                            <div>
                                <strong>{addressLabel || "Address"}</strong>
                                <br />
                                {address || "123 Maker Street, Prague, CZ"}
                            </div>
                        </div>
                    </div>

                    {visible(showMap) && (
                        <div className="lbc-glass lbc-map-box">
                            <div className="lbc-map-fallback" aria-hidden="true">
                                <strong>
                                    {address || "123 Maker Street, Prague, CZ"}
                                </strong>
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                        mapAddress ||
                                            address ||
                                            "123 Maker Street, Prague, CZ"
                                    )}`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Open in Maps
                                </a>
                            </div>
                            <div
                                className="lbc-map-frame"
                                style={{
                                    filter:
                                        mapGrayscale !== false
                                            ? "grayscale(1) contrast(1.05) brightness(1.05)"
                                            : "none",
                                }}
                            >
                                <iframe
                                    title="Map"
                                    src={`https://www.google.com/maps?q=${encodeURIComponent(
                                        mapAddress ||
                                            address ||
                                            "123 Maker Street, Prague, CZ"
                                    )}&output=embed`}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                            <div
                                className="lbc-map-tint"
                                style={{
                                    background: themed(
                                        "mapTint",
                                        mapTintColor,
                                        DEFAULT_MAP_TINT_COLOR
                                    ),
                                    opacity:
                                        typeof mapTintStrength === "number"
                                            ? mapTintStrength
                                            : 0.45,
                                }}
                            />
                        </div>
                    )}
                    {visible(showMap) && (
                        <p className="lbc-map-note">
                            <span>
                                {address || "123 Maker Street, Prague, CZ"}
                            </span>
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                    mapAddress ||
                                        address ||
                                        "123 Maker Street, Prague, CZ"
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Open in Maps
                            </a>
                        </p>
                    )}
                </section>
            )}

            {/* --------- FOOTER --------- */}
            {visible(showFooter) && (
                <footer className="lbc-footer">
                    <div className="lbc-glass lbc-footer-card">
                        <div className="lbc-flogo">
                            {resolveImageSrc(logoImage) ? (
                                <img
                                    src={resolveImageSrc(logoImage)}
                                    alt={logoText || "Logo"}
                                    className="lbc-logo-img"
                                />
                            ) : (
                                logoText || "ABC LAB"
                            )}
                        </div>
                        <div className="lbc-fmotto">
                            {footerMotto || "Precision. Speed. Innovation."}
                        </div>
                        <div className="lbc-socials">
                            {instagramLink && (
                                <a
                                    href={instagramLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram"
                                >
                                    <InstagramIcon />
                                </a>
                            )}
                            {linkedinLink && (
                                <a
                                    href={linkedinLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="LinkedIn"
                                >
                                    <LinkedInIcon />
                                </a>
                            )}
                            {facebookLink && (
                                <a
                                    href={facebookLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Facebook"
                                >
                                    <FacebookIcon />
                                </a>
                            )}
                        </div>
                    </div>
                </footer>
            )}

            {/* --------- PRODUCT MODAL (Portfolio popup) --------- */}
            <div
                className={`lbc-product-modal ${productModal.open ? "is-open" : ""}`}
                onClick={(e) => {
                    if (e.target === e.currentTarget) closeProductModal()
                }}
            >
                <div className="lbc-product-modal-inner">
                    {safePortfolio.length > 1 && (
                        <button
                            type="button"
                            className="lbc-product-modal-nav prev"
                            aria-label="Previous product"
                            onClick={(e) => {
                                e.stopPropagation()
                                prevProduct()
                            }}
                        >
                            &#8249;
                        </button>
                    )}
                    <div className="lbc-product-card">
                        <button
                            className="lbc-product-card-close"
                            onClick={closeProductModal}
                            aria-label="Close"
                        >
                            &times;
                        </button>
                        <div
                            className="lbc-product-card-image"
                            style={
                                activeProductImg
                                    ? {
                                          backgroundImage: `url(${activeProductImg})`,
                                      }
                                    : undefined
                            }
                        />
                        <div className="lbc-product-card-body">
                            <h3>
                                {activeProduct
                                    ? activeProduct.portfolioTitle
                                    : ""}
                            </h3>
                            {activeProduct && activeProduct.portfolioDesc && (
                                <p className="lbc-product-desc">
                                    {activeProduct.portfolioDesc}
                                </p>
                            )}
                            <div className="lbc-product-specs">
                                {activeProduct &&
                                    activeProduct.portfolioSpec1Value && (
                                        <div className="lbc-product-spec-row">
                                            <div className="lbc-product-spec-icon">
                                                <SpecClockIcon />
                                            </div>
                                            <div>
                                                <div className="lbc-product-spec-label">
                                                    {activeProduct.portfolioSpec1Label ||
                                                        "Print Time"}
                                                </div>
                                                <div className="lbc-product-spec-value">
                                                    {
                                                        activeProduct.portfolioSpec1Value
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                {activeProduct &&
                                    activeProduct.portfolioSpec2Value && (
                                        <div className="lbc-product-spec-row">
                                            <div className="lbc-product-spec-icon">
                                                <SpecWeightIcon />
                                            </div>
                                            <div>
                                                <div className="lbc-product-spec-label">
                                                    {activeProduct.portfolioSpec2Label ||
                                                        "Weight"}
                                                </div>
                                                <div className="lbc-product-spec-value">
                                                    {
                                                        activeProduct.portfolioSpec2Value
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                {activeProduct &&
                                    activeProduct.portfolioSpec3Value && (
                                        <div className="lbc-product-spec-row">
                                            <div className="lbc-product-spec-icon">
                                                <SpecMaterialIcon />
                                            </div>
                                            <div>
                                                <div className="lbc-product-spec-label">
                                                    {activeProduct.portfolioSpec3Label ||
                                                        "Material"}
                                                </div>
                                                <div className="lbc-product-spec-value">
                                                    {
                                                        activeProduct.portfolioSpec3Value
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                    {safePortfolio.length > 1 && (
                        <button
                            type="button"
                            className="lbc-product-modal-nav next"
                            aria-label="Next product"
                            onClick={(e) => {
                                e.stopPropagation()
                                nextProduct()
                            }}
                        >
                            &#8250;
                        </button>
                    )}
                </div>
            </div>

            {/* --------- COOKIE BAR --------- */}
            {cookieBarVisible && (
                <div
                    className={`lbc-cookie pos-${cookiePos}`}
                    role="region"
                    aria-label={t(cookieTitle, "Cookies")}
                >
                    <div className="lbc-glass lbc-cookie-card">
                        <div className="lbc-cookie-body">
                            {cookieTitle && cookieTitle.trim() ? (
                                <div className="lbc-cookie-title">
                                    {cookieTitle}
                                </div>
                            ) : null}
                            <p className="lbc-cookie-text">
                                {t(
                                    cookieText,
                                    "We use cookies to keep the site running and to see how it is used. You can accept them all, or keep only the ones the site needs."
                                )}
                            </p>
                            {cookiePolicyLink &&
                            cookiePolicyLabel &&
                            cookiePolicyLabel.trim() ? (
                                <a
                                    className="lbc-cookie-link"
                                    href={cookiePolicyLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {cookiePolicyLabel}
                                </a>
                            ) : null}
                        </div>
                        <div className="lbc-cookie-actions">
                            {showCookieReject !== false && (
                                <button
                                    type="button"
                                    className="lbc-cookie-btn lbc-cookie-reject"
                                    onClick={() =>
                                        decideCookies(COOKIE_REJECTED)
                                    }
                                >
                                    {t(cookieRejectLabel, "Essential only")}
                                </button>
                            )}
                            <button
                                type="button"
                                className="lbc-cookie-btn lbc-cookie-accept"
                                onClick={() => decideCookies(COOKIE_ACCEPTED)}
                            >
                                {t(cookieAcceptLabel, "Accept all")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// The individual color controls stay in the panel, but they are ignored
// while a single site color is driving everything, so hide them then.
const hideWhenThemed = (props: GlobalStyleGroup) =>
    props.resetColors === true ||
    (!!props.siteColor && props.siteColor !== SITE_COLOR_CUSTOM)

// ============================================================
// Property Controls
// ============================================================
addPropertyControls(AbcLabSite, {
    navbar: {
        type: ControlType.Object,
        title: "① Navbar",
        controls: {
            showNavbar: {
                type: ControlType.Boolean,
                title: "Show Section",
                defaultValue: true,
            },
            logoText: {
                type: ControlType.String,
                title: "Logo Text",
                defaultValue: "ABC LAB",
            },
            logoImage: {
                type: ControlType.Image,
                title: "Logo Image (optional, replaces logo text)",
                description:
                    "Recommended: 600 × 120 px, PNG with a transparent background. It is shown up to 220 × 42 px, so this keeps it sharp on high-resolution screens.",
            },
            navLabel1: {
                type: ControlType.String,
                title: "Menu 1",
                defaultValue: "About",
            },
            navLink1: {
                type: ControlType.Link,
                title: "Link 1",
                defaultValue: "#about",
            },
            navLabel2: {
                type: ControlType.String,
                title: "Menu 2",
                defaultValue: "Services",
            },
            navLink2: {
                type: ControlType.Link,
                title: "Link 2",
                defaultValue: "#services",
            },
            navLabel3: {
                type: ControlType.String,
                title: "Menu 3",
                defaultValue: "Process",
            },
            navLink3: {
                type: ControlType.Link,
                title: "Link 3",
                defaultValue: "#process",
            },
            navLabel4: {
                type: ControlType.String,
                title: "Menu 4",
                defaultValue: "Materials",
            },
            navLink4: {
                type: ControlType.Link,
                title: "Link 4",
                defaultValue: "#materials",
            },
            navLabel5: {
                type: ControlType.String,
                title: "Menu 5",
                defaultValue: "Portfolio",
            },
            navLink5: {
                type: ControlType.Link,
                title: "Link 5",
                defaultValue: "#portfolio",
            },
            ctaText: {
                type: ControlType.String,
                title: "Button Text",
                defaultValue: "Get a Quote",
            },
            ctaLink: {
                type: ControlType.Link,
                title: "Button Link",
                defaultValue: "#contact",
            },
        },
    },

    globalStyle: {
        type: ControlType.Object,
        title: "② Global Style",
        controls: {
            siteColor: {
                type: ControlType.Enum,
                title: "◉ Site Color",
                defaultValue: SITE_COLOR_CUSTOM,
                options: [SITE_COLOR_CUSTOM, SITE_COLOR_PICK].concat(
                    COLOR_PRESETS.map((preset) => preset.key)
                ),
                optionTitles: ["Custom (controls below)", "Own color..."].concat(
                    COLOR_PRESETS.map((preset) => preset.title)
                ),
                description:
                    "One click repaints the whole site. Pick a preset (or \"Own color...\" for your own) and every accent, glow, button, shadow and dot is rebuilt from that single color. Leave it on \"Custom\" to keep using the individual color controls below — their values are never lost, just unused while a site color is active.",
            },
            siteColorCustom: {
                type: ControlType.Color,
                title: "└ Own Color",
                defaultValue: DEFAULT_ACCENT_COLOR,
                hidden: (props: GlobalStyleGroup) =>
                    props.siteColor !== SITE_COLOR_PICK,
                description: "The one color the whole site is built from.",
            },
            resetColors: {
                type: ControlType.Boolean,
                title: "↺ Reset Colors",
                defaultValue: false,
                enabledTitle: "Purple Defaults",
                disabledTitle: "Custom",
                description:
                    "Turn on to use the original purple palette everywhere on the site — it overrides Site Color as well. The color controls below are hidden while this is on (their saved values aren't lost, just not used) — turn it back off to edit your own colors again.",
            },
            bgColor: {
                type: ControlType.Color,
                title: "Background",
                defaultValue: DEFAULT_BG_COLOR,
                hidden: hideWhenThemed,
            },
            textColor: {
                type: ControlType.Color,
                title: "Text Color",
                defaultValue: DEFAULT_TEXT_COLOR,
                hidden: hideWhenThemed,
            },
            textMutedColor: {
                type: ControlType.Color,
                title: "Secondary Text",
                defaultValue: DEFAULT_TEXT_MUTED_COLOR,
                hidden: hideWhenThemed,
            },
            accentColor: {
                type: ControlType.Color,
                title: "Accent Color",
                defaultValue: DEFAULT_ACCENT_COLOR,
                hidden: hideWhenThemed,
            },
            accentColor2: {
                type: ControlType.Color,
                title: "Accent Color 2",
                defaultValue: DEFAULT_ACCENT2_COLOR,
                hidden: hideWhenThemed,
            },
            bgTintColor: {
                type: ControlType.Color,
                title: "Background Tint",
                defaultValue: DEFAULT_BG_TINT_COLOR,
                description:
                    "Soft purple glow behind the hero section, like in the original mockup.",
                hidden: hideWhenThemed,
            },
            hoverHaloColor: {
                type: ControlType.Color,
                title: "Hover Halo Color",
                defaultValue: DEFAULT_HALO_COLOR,
                hidden: hideWhenThemed,
            },
            cardShadowColor: {
                type: ControlType.Color,
                title: "Card Shadow Color",
                defaultValue: DEFAULT_CARD_SHADOW_COLOR,
                hidden: hideWhenThemed,
            },
            buttonTextColor: {
                type: ControlType.Color,
                title: "Button Color",
                defaultValue: DEFAULT_BUTTON_TEXT_COLOR,
                hidden: hideWhenThemed,
            },
            buttonBorderColor: {
                type: ControlType.Color,
                title: "Button Border Color",
                defaultValue: DEFAULT_BUTTON_BORDER_COLOR,
                hidden: hideWhenThemed,
            },
            dotColor: {
                type: ControlType.Color,
                title: "Carousel Dot Color",
                defaultValue: DEFAULT_DOT_COLOR,
                hidden: hideWhenThemed,
            },
            headingFont: {
                type: ControlType.String,
                title: "Heading Font",
                defaultValue: DEFAULT_HEADING_FONT,
            },
            bodyFont: {
                type: ControlType.String,
                title: "Body Font",
                defaultValue: DEFAULT_BODY_FONT,
            },
        },
    },

    hero: {
        type: ControlType.Object,
        title: "③ Hero",
        controls: {
            showHero: {
                type: ControlType.Boolean,
                title: "Show Section",
                defaultValue: true,
            },
            heroHeading: {
                type: ControlType.String,
                title: "Heading",
                defaultValue: "The future of manufacturing",
            },
            heroHeadingHighlight: {
                type: ControlType.String,
                title: "Heading Highlight",
                defaultValue: "starts in 3D",
            },
            heroText: {
                type: ControlType.String,
                title: "Text",
                defaultValue:
                    "ABC LAB designs, prototypes, and manufactures precise 3D models, functional parts, and custom products with a focus on quality, speed, and innovation.",
            },
            heroCtaText: {
                type: ControlType.String,
                title: "CTA Text",
                defaultValue: "Get a Free Quote",
            },
            heroCtaLink: {
                type: ControlType.Link,
                title: "CTA Link",
                defaultValue: "#contact",
            },
            slides: {
                type: ControlType.Array,
                title: "Gallery Slides",
                control: {
                    type: ControlType.Object,
                    controls: {
                        heroImage: {
                            type: ControlType.Image,
                            title: "Photo",
                            description:
                                "Recommended: 1000 × 1000 px. Already transparent? Just upload it. Otherwise turn on Remove Background below.",
                        },
                        heroImageCutout: {
                            type: ControlType.Boolean,
                            title: "Remove Background",
                            defaultValue: false,
                            description:
                                "Lifts a plain backdrop away so the photo floats on the page instead of sitting in a rectangle. Works with a studio shot on a seamless white, grey or single-colour background. A busy or outdoor background cannot be separated — that photo is left untouched.",
                        },
                        heroSlideTitle: {
                            type: ControlType.String,
                            title: "Title",
                        },
                        heroSlideText: {
                            type: ControlType.String,
                            title: "Text",
                        },
                    },
                },
                defaultValue: [
                    {
                        heroImage: "",
                        heroSlideTitle: "Project Photo 1",
                        heroSlideText:
                            "Space ready for a photo from the printer.",
                    },
                    {
                        heroImage: "",
                        heroSlideTitle: "Project Photo 2",
                        heroSlideText: "A finished part will be shown here.",
                    },
                    {
                        heroImage: "",
                        heroSlideTitle: "Project Photo 3",
                        heroSlideText: "Space for another project photo.",
                    },
                ],
            },
            heroGalleryWidth: {
                type: ControlType.Number,
                title: "Photo Width (px)",
                min: 100,
                max: 1600,
                step: 1,
                defaultValue: 460,
            },
            heroGalleryHeight: {
                type: ControlType.Number,
                title: "Photo Height (px)",
                min: 100,
                max: 1600,
                step: 1,
                defaultValue: 460,
            },
            heroGalleryAutoplay: {
                type: ControlType.Boolean,
                title: "Auto-Rotate Photos",
                defaultValue: true,
            },
            heroVideo: {
                type: ControlType.File,
                allowedFileTypes: ["mp4", "webm", "mov"],
                title: "Video File",
                description:
                    "Replaces the rotating photos in this section. Plays muted and on a loop. Keep it short and under about 10 MB — a long video makes the page slow to load.",
            },
            heroVideoLink: {
                type: ControlType.String,
                title: "Video Link",
                placeholder: "https://youtube.com/watch?v=…",
                defaultValue: "",
                description:
                    "Or paste a YouTube or Vimeo link instead of uploading a file. Used only when no file is set.",
            },
            heroCutoutTolerance: {
                type: ControlType.Number,
                title: "Cut-out Strength",
                min: 10,
                max: 90,
                step: 1,
                defaultValue: 38,
                description:
                    "Only affects photos with Remove Background on. Raise it if a halo of backdrop is left around the object, lower it if part of the object disappears.",
            },
            heroGalleryAutoplaySpeed: {
                type: ControlType.Number,
                title: "Auto-Rotate Speed (s)",
                min: 2,
                max: 15,
                step: 0.5,
                defaultValue: 5,
                hidden: (props: HeroGroup) =>
                    props.heroGalleryAutoplay === false,
            },
        },
    },

    stats: {
        type: ControlType.Object,
        title: "④ Stats",
        controls: {
            showStats: {
                type: ControlType.Boolean,
                title: "Show Section",
                defaultValue: true,
            },
            stats: {
                type: ControlType.Array,
                title: "Stat Cards",
                control: {
                    type: ControlType.Object,
                    controls: {
                        statValue: { type: ControlType.String, title: "Value" },
                        statLabel: { type: ControlType.String, title: "Label" },
                    },
                },
                defaultValue: [
                    { statValue: "500+", statLabel: "Printed Projects" },
                    { statValue: "99%", statLabel: "Customer Satisfaction" },
                    { statValue: "24h", statLabel: "Express Production" },
                    { statValue: "0.05mm", statLabel: "Print Accuracy" },
                ],
            },
        },
    },

    about: {
        type: ControlType.Object,
        title: "⑤ About",
        controls: {
            showAbout: {
                type: ControlType.Boolean,
                title: "Show Section",
                defaultValue: true,
            },
            aboutTag: {
                type: ControlType.String,
                title: "Tag",
                defaultValue: "About Us",
            },
            aboutHeading: {
                type: ControlType.String,
                title: "Heading",
                defaultValue:
                    "Precision manufacturing powered by technology and craftsmanship",
            },
            aboutText: {
                type: ControlType.String,
                title: "Text",
                defaultValue:
                    "ABC LAB combines advanced 3D printing technology with engineering precision. From the first concept to the final part, we support every project with a focus on detail, speed, and reliability.",
            },
            aboutImage: {
                type: ControlType.Image,
                title: "Image (optional, replaces spool animation)",
                description:
                    "Recommended: 1200 × 780 px, landscape. Leave empty to keep the animated spool.",
            },
            aboutVideo: {
                type: ControlType.File,
                allowedFileTypes: ["mp4", "webm", "mov"],
                title: "Video File",
                description:
                    "Replaces the image and the spool animation in this section. Plays muted and on a loop. Keep it short and under about 10 MB — a long video makes the page slow to load.",
            },
            aboutVideoLink: {
                type: ControlType.String,
                title: "Video Link",
                placeholder: "https://youtube.com/watch?v=…",
                defaultValue: "",
                description:
                    "Or paste a YouTube or Vimeo link instead of uploading a file. Used only when no file is set.",
            },
            spoolColor: {
                type: ControlType.Color,
                title: "Spool Color",
                defaultValue: DEFAULT_SPOOL_COLOR,
                description:
                    "Ignored while a single Site Color is active in Global Style — the spool follows that color instead.",
            },
        },
    },

    services: {
        type: ControlType.Object,
        title: "⑥ Services",
        controls: {
            showServices: {
                type: ControlType.Boolean,
                title: "Show Section",
                defaultValue: true,
            },
            servicesTag: {
                type: ControlType.String,
                title: "Tag",
                defaultValue: "Services",
            },
            servicesHeading: {
                type: ControlType.String,
                title: "Heading",
                defaultValue: "Everything you need, from idea to part",
            },
            services: {
                type: ControlType.Array,
                title: "Service Cards",
                control: {
                    type: ControlType.Object,
                    controls: {
                        serviceIconKey: {
                            type: ControlType.Enum,
                            title: "Built-in Icon",
                            options: [
                                "printer",
                                "design",
                                "prototype",
                                "manufacturing",
                                "scan",
                                "wrench",
                                "consulting",
                            ],
                            optionTitles: [
                                "3D Printer",
                                "CAD 3D Design",
                                "Prototype Tag",
                                "Manufacturing",
                                "3D Scanner",
                                "Wrench",
                                "Consulting",
                            ],
                            defaultValue: "printer",
                            description:
                                "Used unless a Custom Icon image is uploaded below.",
                        },
                        serviceIconImage: {
                            type: ControlType.Image,
                            title: "Custom Icon",
                            description:
                                "Recommended: 128 × 128 px, PNG or SVG with a transparent background. Use this to adapt the site for any business — a fork & knife for a restaurant, a car part for a mechanic. The icon keeps its own colors unless Recolor Icons is turned on below.",
                        },
                        serviceTitle: {
                            type: ControlType.String,
                            title: "Title",
                        },
                        serviceText: {
                            type: ControlType.String,
                            title: "Text",
                        },
                    },
                },
                defaultValue: [
                    {
                        serviceIconKey: "printer",
                        serviceTitle: "Professional 3D Printing",
                        serviceText:
                            "Highly precise printing using modern FDM, SLA, and SLS technologies.",
                    },
                    {
                        serviceIconKey: "design",
                        serviceTitle: "CAD Modeling",
                        serviceText:
                            "Design and optimization of 3D models from concept to production documentation.",
                    },
                    {
                        serviceIconKey: "prototype",
                        serviceTitle: "Functional Prototypes",
                        serviceText:
                            "Fast verification of shape, function, and mechanical properties.",
                    },
                    {
                        serviceIconKey: "manufacturing",
                        serviceTitle: "Custom Manufacturing",
                        serviceText:
                            "Production of custom parts in small and medium series.",
                    },
                    {
                        serviceIconKey: "scan",
                        serviceTitle: "Optical 3D Scanning",
                        serviceText:
                            "Precise digitization of parts and models using an industrial optical scanner.",
                    },
                    {
                        serviceIconKey: "wrench",
                        serviceTitle: "Spare Parts",
                        serviceText:
                            "Fast production of spare parts, even for products that are no longer manufactured.",
                    },
                    {
                        serviceIconKey: "consulting",
                        serviceTitle: "Consulting",
                        serviceText:
                            "Expert advice on choosing the right technology, material, and design.",
                    },
                ],
            },
            recolorCustomIcons: {
                type: ControlType.Boolean,
                title: "Recolor Icons",
                defaultValue: false,
                description:
                    "Off: custom icons keep their own colors. On: they are repainted in the color below. Works with transparent icons as well as icons on a plain solid background.",
            },
            customIconFollowAccent: {
                type: ControlType.Boolean,
                title: "Match Accent Color",
                defaultValue: true,
                hidden: (props: any) => !props.recolorCustomIcons,
                description:
                    "On: uploaded icons take the Accent Color and change with the rest of the site. Off: they keep the fixed colour you pick below.",
            },
            customIconColor: {
                type: ControlType.Color,
                title: "Custom Icon Color",
                hidden: (props: any) =>
                    !props.recolorCustomIcons ||
                    props.customIconFollowAccent !== false,
                description:
                    "The fixed colour for uploaded icons while Match Accent Color is off.",
            },
        },
    },

    process: {
        type: ControlType.Object,
        title: "⑦ Process",
        controls: {
            showProcess: {
                type: ControlType.Boolean,
                title: "Show Section",
                defaultValue: true,
            },
            processTag: {
                type: ControlType.String,
                title: "Tag",
                defaultValue: "Process",
            },
            processHeading: {
                type: ControlType.String,
                title: "Heading",
                defaultValue: "From idea to finished part",
            },
            steps: {
                type: ControlType.Array,
                title: "Steps",
                control: {
                    type: ControlType.Object,
                    controls: {
                        stepTitle: { type: ControlType.String, title: "Title" },
                        stepText: { type: ControlType.String, title: "Text" },
                    },
                },
                defaultValue: [
                    { stepTitle: "Contact", stepText: "" },
                    { stepTitle: "Design", stepText: "" },
                    { stepTitle: "Visualization", stepText: "" },
                    { stepTitle: "Production", stepText: "" },
                    { stepTitle: "Quality Control", stepText: "" },
                    { stepTitle: "Delivery", stepText: "" },
                ],
            },
        },
    },

    materials: {
        type: ControlType.Object,
        title: "⑧ Materials",
        controls: {
            showMaterials: {
                type: ControlType.Boolean,
                title: "Show Section",
                defaultValue: true,
            },
            materialsTag: {
                type: ControlType.String,
                title: "Tag",
                defaultValue: "Materials",
            },
            materialsHeading: {
                type: ControlType.String,
                title: "Heading",
                defaultValue: "Materials for every application",
            },
            materials: {
                type: ControlType.Array,
                title: "Materials",
                control: {
                    type: ControlType.Object,
                    controls: {
                        materialName: {
                            type: ControlType.String,
                            title: "Name",
                        },
                        materialText: {
                            type: ControlType.String,
                            title: "Description",
                        },
                    },
                },
                defaultValue: [
                    {
                        materialName: "PLA",
                        materialText:
                            "Easy to print, ideal for prototypes and aesthetic models.",
                    },
                    {
                        materialName: "PETG",
                        materialText:
                            "Durable and tough, suitable for functional parts.",
                    },
                    {
                        materialName: "ABS",
                        materialText:
                            "High heat resistance, used in technical applications.",
                    },
                    {
                        materialName: "ASA",
                        materialText:
                            "UV-stable alternative to ABS for outdoor use.",
                    },
                    {
                        materialName: "TPU",
                        materialText:
                            "Flexible, rubber-like material for elastic parts.",
                    },
                    {
                        materialName: "Carbon Fiber",
                        materialText:
                            "Extremely strong and lightweight, for demanding structures.",
                    },
                ],
            },
        },
    },

    portfolio: {
        type: ControlType.Object,
        title: "⑨ Portfolio",
        controls: {
            showPortfolio: {
                type: ControlType.Boolean,
                title: "Show Section",
                defaultValue: true,
            },
            portfolioTag: {
                type: ControlType.String,
                title: "Tag",
                defaultValue: "Portfolio",
            },
            portfolioHeading: {
                type: ControlType.String,
                title: "Heading",
                defaultValue: "Our Work",
            },
            portfolioVideo: {
                type: ControlType.File,
                allowedFileTypes: ["mp4", "webm", "mov"],
                title: "Video File",
                description:
                    "Shown underneath the project carousel. Plays muted and on a loop. Keep it short and under about 10 MB — a long video makes the page slow to load.",
            },
            portfolioVideoLink: {
                type: ControlType.String,
                title: "Video Link",
                placeholder: "https://youtube.com/watch?v=…",
                defaultValue: "",
                description:
                    "Or paste a YouTube or Vimeo link instead of uploading a file. Used only when no file is set.",
            },
            portfolioCutoutTolerance: {
                type: ControlType.Number,
                title: "Cut-out Strength",
                min: 10,
                max: 90,
                step: 1,
                defaultValue: 38,
                description:
                    "Only affects photos with Remove Background on. Raise it if a rim of backdrop is left, lower it if part of the product disappears.",
            },
            items: {
                type: ControlType.Array,
                title: "Portfolio Items",
                control: {
                    type: ControlType.Object,
                    controls: {
                        portfolioImage: {
                            type: ControlType.Image,
                            title: "Photo",
                            description:
                                "Recommended: 1200 × 1200 px. The same photo is used in the card and in the pop-up, so give it room.",
                        },
                        portfolioImageCutout: {
                            type: ControlType.Boolean,
                            title: "Remove Background",
                            defaultValue: false,
                            description:
                                "Lifts a plain studio backdrop away so the product sits cleanly on the card. Same as in the hero: a seamless white, grey or single-colour background works, a busy one is left alone.",
                        },
                        portfolioTitle: {
                            type: ControlType.String,
                            title: "Title",
                        },
                        portfolioDesc: {
                            type: ControlType.String,
                            title: "Description",
                            displayTextArea: true,
                        },
                        portfolioSpec1Label: {
                            type: ControlType.String,
                            title: "Spec 1 Label",
                            defaultValue: "Print Time",
                            description:
                                "e.g. Print Time, Delivery Time, Color.",
                        },
                        portfolioSpec1Value: {
                            type: ControlType.String,
                            title: "Spec 1 Value",
                            description:
                                "Shown next to the label above. Leave blank to hide this row.",
                        },
                        portfolioSpec2Label: {
                            type: ControlType.String,
                            title: "Spec 2 Label",
                            defaultValue: "Weight",
                            description: "e.g. Weight, Size, Capacity.",
                        },
                        portfolioSpec2Value: {
                            type: ControlType.String,
                            title: "Spec 2 Value",
                            description:
                                "Shown next to the label above. Leave blank to hide this row.",
                        },
                        portfolioSpec3Label: {
                            type: ControlType.String,
                            title: "Spec 3 Label",
                            defaultValue: "Material",
                            description: "e.g. Material, Category, Finish.",
                        },
                        portfolioSpec3Value: {
                            type: ControlType.String,
                            title: "Spec 3 Value",
                            description:
                                "Shown next to the label above. Leave blank to hide this row.",
                        },
                    },
                },
                defaultValue: [
                    {
                        portfolioImage: "",
                        portfolioTitle: "Mounting Brackets",
                        portfolioDesc:
                            "Series production of black mounting brackets for industrial use.",
                        portfolioSpec1Label: "Print Time",
                        portfolioSpec1Value: "6 h 20 min",
                        portfolioSpec2Label: "Weight",
                        portfolioSpec2Value: "180 g",
                        portfolioSpec3Label: "Material",
                        portfolioSpec3Value: "PETG",
                    },
                    {
                        portfolioImage: "",
                        portfolioTitle: "Custom L-Bracket",
                        portfolioDesc:
                            "Precision L-shaped bracket designed for tight tolerance assembly.",
                        portfolioSpec1Label: "Print Time",
                        portfolioSpec1Value: "3 h 45 min",
                        portfolioSpec2Label: "Weight",
                        portfolioSpec2Value: "95 g",
                        portfolioSpec3Label: "Material",
                        portfolioSpec3Value: "PLA",
                    },
                    {
                        portfolioImage: "",
                        portfolioTitle: "Precision Machine Parts",
                        portfolioDesc:
                            "Set of green parts with metal threaded inserts for high precision.",
                        portfolioSpec1Label: "Print Time",
                        portfolioSpec1Value: "5 h 10 min",
                        portfolioSpec2Label: "Weight",
                        portfolioSpec2Value: "140 g",
                        portfolioSpec3Label: "Material",
                        portfolioSpec3Value: "PETG",
                    },
                    {
                        portfolioImage: "",
                        portfolioTitle: "Blue Shaft Coupling",
                        portfolioDesc:
                            "Precisely printed shaft coupling available in two sizes.",
                        portfolioSpec1Label: "Print Time",
                        portfolioSpec1Value: "2 h 30 min",
                        portfolioSpec2Label: "Weight",
                        portfolioSpec2Value: "60 g",
                        portfolioSpec3Label: "Material",
                        portfolioSpec3Value: "PLA",
                    },
                    {
                        portfolioImage: "",
                        portfolioTitle: "Blue Part with Bushing",
                        portfolioDesc:
                            "Precision functional part with a metal threaded insert.",
                        portfolioSpec1Label: "Print Time",
                        portfolioSpec1Value: "4 h 05 min",
                        portfolioSpec2Label: "Weight",
                        portfolioSpec2Value: "110 g",
                        portfolioSpec3Label: "Material",
                        portfolioSpec3Value: "PETG",
                    },
                ],
            },
            modalAccentColor: {
                type: ControlType.Color,
                title: "Popup Accent Color",
                defaultValue: DEFAULT_MODAL_ACCENT_COLOR,
                description:
                    "Ignored while a single Site Color is active in Global Style — the popup follows that color instead.",
            },
        },
    },

    testimonials: {
        type: ControlType.Object,
        title: "⑩ Testimonials",
        controls: {
            showTestimonials: {
                type: ControlType.Boolean,
                title: "Show Section",
                defaultValue: true,
            },
            testimonialsTag: {
                type: ControlType.String,
                title: "Tag",
                defaultValue: "Testimonials",
            },
            testimonialsHeading: {
                type: ControlType.String,
                title: "Heading",
                defaultValue: "What Clients Say",
            },
            testimonials: {
                type: ControlType.Array,
                title: "Testimonials",
                control: {
                    type: ControlType.Object,
                    controls: {
                        quote: { type: ControlType.String, title: "Quote" },
                        name: { type: ControlType.String, title: "Name" },
                        role: { type: ControlType.String, title: "Role" },
                    },
                },
                defaultValue: [
                    {
                        quote: "ABC LAB delivered our prototype in record time with amazing precision.",
                        name: "Jane Doe",
                        role: "Product Manager",
                    },
                    {
                        quote: "Excellent communication and top quality parts every time.",
                        name: "John Smith",
                        role: "Founder, Startup Co.",
                    },
                ],
            },
        },
    },

    faq: {
        type: ControlType.Object,
        title: "⑪ FAQ",
        controls: {
            showFaq: {
                type: ControlType.Boolean,
                title: "Show Section",
                defaultValue: true,
            },
            faqTag: {
                type: ControlType.String,
                title: "Tag",
                defaultValue: "FAQ",
            },
            faqHeading: {
                type: ControlType.String,
                title: "Heading",
                defaultValue: "Frequently Asked Questions",
            },
            items: {
                type: ControlType.Array,
                title: "Questions",
                control: {
                    type: ControlType.Object,
                    controls: {
                        question: {
                            type: ControlType.String,
                            title: "Question",
                        },
                        answer: { type: ControlType.String, title: "Answer" },
                    },
                },
                defaultValue: [
                    {
                        question: "What file formats do you accept?",
                        answer: "We accept STL, STEP, OBJ, and most common 3D file formats.",
                    },
                    {
                        question: "How long does production take?",
                        answer: "Most prototypes are ready within 24-48 hours depending on complexity.",
                    },
                    {
                        question: "Do you offer design services?",
                        answer: "Yes, our engineers can design or optimize your model from scratch.",
                    },
                ],
            },
        },
    },

    contact: {
        type: ControlType.Object,
        title: "⑫ Contact",
        controls: {
            showContact: {
                type: ControlType.Boolean,
                title: "Show Section",
                defaultValue: true,
            },
            contactTag: {
                type: ControlType.String,
                title: "Tag",
                defaultValue: "Contact",
            },
            contactHeading: {
                type: ControlType.String,
                title: "Heading",
                defaultValue: "Let's Build Something Together",
            },
            contactText: {
                type: ControlType.String,
                title: "Text",
                defaultValue:
                    "Send us your idea and we will get back to you shortly.",
            },
            email: {
                type: ControlType.String,
                title: "Email",
                defaultValue: "hello@abclab.com",
            },
            phone: {
                type: ControlType.String,
                title: "Phone",
                defaultValue: "+1 555 234 567",
            },
            address: {
                type: ControlType.String,
                title: "Address",
                defaultValue: "123 Maker Street, Prague, CZ",
            },
            emailLabel: {
                type: ControlType.String,
                title: "Email Label",
                defaultValue: "Email",
                description:
                    "The three labels above the contact details. Rename them to work in your own language.",
            },
            phoneLabel: {
                type: ControlType.String,
                title: "Phone Label",
                defaultValue: "Phone",
            },
            addressLabel: {
                type: ControlType.String,
                title: "Address Label",
                defaultValue: "Address",
            },
            formMode: {
                type: ControlType.Enum,
                title: "Form Sends To",
                options: ["mailto", "endpoint"],
                optionTitles: ["Visitor's mail app", "Formspree"],
                defaultValue: "mailto",
                description:
                    "Mail app needs no setup, but the visitor has to press send in their own email program. Formspree delivers the enquiry to your inbox on its own — paste your form address below.",
            },
            formEndpoint: {
                type: ControlType.String,
                title: "Formspree URL",
                placeholder: "https://formspree.io/f/xxxxxxx",
                defaultValue: "",
                hidden: (props: any) => props.formMode !== "endpoint",
                description:
                    "Create a free form at formspree.io, open its Integration tab, and paste the whole address here. Leave this empty and the form falls back to the visitor's mail app.",
            },
            formSubject: {
                type: ControlType.String,
                title: "Email Subject",
                defaultValue: "New enquiry from the website",
            },
            formNamePlaceholder: {
                type: ControlType.String,
                title: "Name Field",
                defaultValue: "Your Name",
            },
            formEmailPlaceholder: {
                type: ControlType.String,
                title: "Email Field",
                defaultValue: "Your Email",
            },
            formMessagePlaceholder: {
                type: ControlType.String,
                title: "Message Field",
                defaultValue: "Tell us about your project",
            },
            formButtonLabel: {
                type: ControlType.String,
                title: "Button Label",
                defaultValue: "Send Message",
            },
            formSuccessText: {
                type: ControlType.String,
                title: "Success Text",
                displayTextArea: true,
                defaultValue: "Thank you, your message is on its way.",
                hidden: (props: any) => props.formMode !== "endpoint",
            },
            formErrorText: {
                type: ControlType.String,
                title: "Error Text",
                displayTextArea: true,
                defaultValue:
                    "That didn't send. Please try again, or email us directly.",
                hidden: (props: any) => props.formMode !== "endpoint",
            },
            showMap: {
                type: ControlType.Boolean,
                title: "Show Map",
                defaultValue: true,
            },
            mapAddress: {
                type: ControlType.String,
                title: "Map Address",
                defaultValue: "123 Maker Street, Prague, CZ",
                description:
                    "Enter a real address (not a Google Maps link) to place the pin.",
            },
            mapGrayscale: {
                type: ControlType.Boolean,
                title: "Recolor Base Map",
                defaultValue: true,
            },
            mapTintColor: {
                type: ControlType.Color,
                title: "Map Tint Color",
                defaultValue: DEFAULT_MAP_TINT_COLOR,
                description:
                    "Ignored while a single Site Color is active in Global Style — the map tint follows that color instead.",
            },
            mapTintStrength: {
                type: ControlType.Number,
                title: "Map Tint Strength",
                min: 0,
                max: 1,
                step: 0.05,
                defaultValue: 0.45,
            },
        },
    },

    footer: {
        type: ControlType.Object,
        title: "⑬ Footer",
        controls: {
            showFooter: {
                type: ControlType.Boolean,
                title: "Show Section",
                defaultValue: true,
            },
            footerMotto: {
                type: ControlType.String,
                title: "Motto",
                defaultValue: "Precision. Speed. Innovation.",
            },
            instagramLink: { type: ControlType.Link, title: "Instagram Link" },
            facebookLink: { type: ControlType.Link, title: "Facebook Link" },
            linkedinLink: { type: ControlType.Link, title: "LinkedIn Link" },
        },
    },

    cookies: {
        type: ControlType.Object,
        title: "⑭ Cookie Bar",
        controls: {
            showCookieBar: {
                type: ControlType.Boolean,
                title: "Show Cookie Bar",
                defaultValue: false,
                description:
                    "Off by default — turn it on to show the cookie bar. It has no colors of its own: it always follows the Site Color set in ② Global Style, so it repaints itself whenever the site color changes. The visitor's choice is stored in the browser (localStorage) and the bar stays hidden afterwards. On the Framer canvas it is always visible so you can edit it.",
            },
            cookieTitle: {
                type: ControlType.String,
                title: "Title",
                defaultValue: "Cookies",
                hidden: (props: CookiesGroup) => props.showCookieBar !== true,
                description: "Leave empty to show the text only.",
            },
            cookieText: {
                type: ControlType.String,
                title: "Text",
                displayTextArea: true,
                defaultValue:
                    "We use cookies to keep the site running and to see how it is used. You can accept them all, or keep only the ones the site needs.",
                hidden: (props: CookiesGroup) => props.showCookieBar !== true,
            },
            cookieAcceptLabel: {
                type: ControlType.String,
                title: "Accept Button",
                defaultValue: "Accept all",
                hidden: (props: CookiesGroup) => props.showCookieBar !== true,
            },
            showCookieReject: {
                type: ControlType.Boolean,
                title: "Reject Button",
                defaultValue: true,
                hidden: (props: CookiesGroup) => props.showCookieBar !== true,
            },
            cookieRejectLabel: {
                type: ControlType.String,
                title: "└ Reject Label",
                defaultValue: "Essential only",
                hidden: (props: CookiesGroup) =>
                    props.showCookieBar !== true ||
                    props.showCookieReject === false,
            },
            cookiePolicyLabel: {
                type: ControlType.String,
                title: "Link Text",
                defaultValue: "Cookie policy",
                hidden: (props: CookiesGroup) => props.showCookieBar !== true,
                description:
                    "Shown only when a link is set below. Leave the text empty to hide it.",
            },
            cookiePolicyLink: {
                type: ControlType.Link,
                title: "└ Link",
                hidden: (props: CookiesGroup) => props.showCookieBar !== true,
            },
            cookiePosition: {
                type: ControlType.Enum,
                title: "Position",
                defaultValue: COOKIE_POS_BOTTOM,
                options: [
                    COOKIE_POS_BOTTOM,
                    COOKIE_POS_LEFT,
                    COOKIE_POS_RIGHT,
                ],
                optionTitles: [
                    "Bottom bar",
                    "Bottom left card",
                    "Bottom right card",
                ],
                hidden: (props: CookiesGroup) => props.showCookieBar !== true,
            },
            cookieStorageKey: {
                type: ControlType.String,
                title: "Storage Key",
                defaultValue: DEFAULT_COOKIE_KEY,
                hidden: (props: CookiesGroup) => props.showCookieBar !== true,
                description:
                    "Name the choice is saved under in the browser. Change it to ask everyone again (for example after updating the text).",
            },
            cookieAlwaysShow: {
                type: ControlType.Boolean,
                title: "Always Show",
                defaultValue: false,
                hidden: (props: CookiesGroup) => props.showCookieBar !== true,
                description:
                    "For testing in Preview: keeps the bar on screen even after a choice was made. Turn it off before publishing.",
            },
        },
    },
})
