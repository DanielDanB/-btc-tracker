import React, {
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * Ella Hair Salon – plně nastavitelná Framer code component.
 *
 * Vše se ovládá v pravém panelu Frameru:
 *  • Barvy        – každá barva webu (pozadí, akcent, texty, rámečky, tlačítka…)
 *  • Videa        – hero, about, karty služeb, galerie, video sekce i video na pozadí
 *  • Logo         – obrázek nebo text + velikost
 *  • Poletující obrazce – zapnout/vypnout, tvary, počet, rychlost, barva
 *  • Kurzor       – vypnout, vybrat tvar, barvu a velikost, nebo vlastní obrázek
 *  • Sekce        – jednotlivé sekce lze skrýt
 */

/* ------------------------------------------------------------------ */
/* Barevné utility – umožňují odvodit průhledné odstíny z libovolné    */
/* barvy zvolené ve Frameru (hex, rgb(a), hsl(a) i CSS proměnná).      */
/* ------------------------------------------------------------------ */

function parseColor(input) {
    if (typeof input !== "string") return null
    const value = input.trim()

    const hex = value.match(/^#([0-9a-f]{3,8})$/i)
    if (hex) {
        let h = hex[1]
        if (h.length === 3 || h.length === 4) {
            h = h
                .split("")
                .map((ch) => ch + ch)
                .join("")
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
        let a = 1
        if (rgb[4] !== undefined) {
            a = rgb[4].endsWith("%")
                ? parseFloat(rgb[4]) / 100
                : parseFloat(rgb[4])
        }
        return {
            r: parseFloat(rgb[1]),
            g: parseFloat(rgb[2]),
            b: parseFloat(rgb[3]),
            a,
        }
    }

    const hsl = value.match(
        /^hsla?\(\s*([\d.]+)(?:deg)?[\s,]+([\d.]+)%[\s,]+([\d.]+)%(?:[\s,/]+([\d.%]+))?\s*\)$/i
    )
    if (hsl) {
        const h = parseFloat(hsl[1]) / 360
        const s = parseFloat(hsl[2]) / 100
        const l = parseFloat(hsl[3]) / 100
        let a = 1
        if (hsl[4] !== undefined) {
            a = hsl[4].endsWith("%")
                ? parseFloat(hsl[4]) / 100
                : parseFloat(hsl[4])
        }
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1
            if (t > 1) t -= 1
            if (t < 1 / 6) return p + (q - p) * 6 * t
            if (t < 1 / 2) return q
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
            return p
        }
        let r = l
        let g = l
        let b = l
        if (s !== 0) {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s
            const p = 2 * l - q
            r = hue2rgb(p, q, h + 1 / 3)
            g = hue2rgb(p, q, h)
            b = hue2rgb(p, q, h - 1 / 3)
        }
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255),
            a,
        }
    }

    return null
}

/** Vrátí barvu s upravenou průhledností. Funguje pro každou barvu z Frameru. */
function withAlpha(color, alpha) {
    const parsed = parseColor(color)
    if (!parsed) {
        // Framer color token / neznámý formát – necháme to na prohlížeči.
        return `color-mix(in srgb, ${color} ${Math.round(alpha * 100)}%, transparent)`
    }
    const a = Math.max(0, Math.min(1, parsed.a * alpha))
    return `rgba(${Math.round(parsed.r)}, ${Math.round(parsed.g)}, ${Math.round(
        parsed.b
    )}, ${Number(a.toFixed(3))})`
}

/** Plná (neprůhledná) verze barvy – pro canvas a data URI kurzoru. */
function toSolid(color, fallback) {
    const parsed = parseColor(color)
    if (!parsed) return fallback
    return `rgb(${Math.round(parsed.r)}, ${Math.round(parsed.g)}, ${Math.round(
        parsed.b
    )})`
}

function toHex(color, fallback) {
    const parsed = parseColor(color)
    if (!parsed) return fallback
    const hex = (n) =>
        Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0")
    return `#${hex(parsed.r)}${hex(parsed.g)}${hex(parsed.b)}`
}

/* ------------------------------------------------------------------ */
/* Kurzor                                                              */
/* ------------------------------------------------------------------ */

const CURSOR_SHAPES = {
    Original: (fill, stroke, w) =>
        `<path d="M4 2L4 20L9 15.5L12 22L15 20.5L12 14L20 14Z" fill="${fill}" stroke="${stroke}" stroke-width="${w}"/>`,
    Arrow: (fill, stroke, w) =>
        `<path d="M5 2L5 19L9.5 15L12 21L15 19.5L12.5 13.8L19 13.5Z" fill="${fill}" stroke="${stroke}" stroke-width="${w}" stroke-linejoin="round"/>`,
    Dot: (fill, stroke, w) =>
        `<circle cx="12" cy="12" r="6" fill="${fill}" stroke="${stroke}" stroke-width="${w}"/>`,
    Ring: (fill, stroke, w) =>
        `<circle cx="12" cy="12" r="8" fill="none" stroke="${fill}" stroke-width="${
            w * 2
        }"/><circle cx="12" cy="12" r="1.8" fill="${fill}"/>`,
    Scissors: (fill, stroke, w) =>
        `<g fill="none" stroke="${fill}" stroke-width="${
            w * 1.6
        }" stroke-linecap="round"><path d="M6 4L16 17"/><path d="M18 4L8 17"/><circle cx="6.5" cy="19" r="2.4"/><circle cx="17.5" cy="19" r="2.4"/></g><circle cx="12" cy="11" r="1.1" fill="${stroke}"/>`,
    Comb: (fill, stroke, w) =>
        `<g fill="none" stroke="${fill}" stroke-width="${
            w * 1.6
        }" stroke-linecap="round"><path d="M3 7H21"/><path d="M5 7V17"/><path d="M9 7V17"/><path d="M13 7V17"/><path d="M17 7V17"/></g>`,
    Heart: (fill, stroke, w) =>
        `<path d="M12 21C12 21 3 14.7 3 8.9C3 5.9 5.3 4 7.8 4C9.7 4 11.2 5.1 12 6.6C12.8 5.1 14.3 4 16.2 4C18.7 4 21 5.9 21 8.9C21 14.7 12 21 12 21Z" fill="${fill}" stroke="${stroke}" stroke-width="${w}"/>`,
    Sparkle: (fill, stroke, w) =>
        `<path d="M12 2L14 9.5L21.5 12L14 14.5L12 22L10 14.5L2.5 12L10 9.5Z" fill="${fill}" stroke="${stroke}" stroke-width="${w}" stroke-linejoin="round"/>`,
    Drop: (fill, stroke, w) =>
        `<path d="M12 2C12 2 5 10.4 5 14.6C5 18.5 8.1 21.5 12 21.5C15.9 21.5 19 18.5 19 14.6C19 10.4 12 2 12 2Z" fill="${fill}" stroke="${stroke}" stroke-width="${w}"/>`,
}

function buildCursorURL(shape, fill, stroke, strokeWidth, size) {
    const draw = CURSOR_SHAPES[shape] || CURSOR_SHAPES.Original
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24">${draw(
        toHex(fill, "#ff3d81"),
        toHex(stroke, "#ffffff"),
        strokeWidth
    )}</svg>`
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

function cursorCSS(cursor, accent) {
    if (!cursor || cursor.mode === "Default") return ""

    const fill = cursor.useAccentColor === false ? cursor.fill : accent
    const hoverFill =
        cursor.useAccentColor === false ? cursor.hoverFill : accent

    const size = Math.max(8, Math.min(96, cursor.size || 24))
    const hotspotX = Math.round(((cursor.hotspotX ?? 4) / 24) * size)
    const hotspotY = Math.round(((cursor.hotspotY ?? 2) / 24) * size)

    let main = ""
    if (cursor.mode === "Image" && cursor.image) {
        main = `url("${cursor.image}")`
    } else if (cursor.mode === "Shape") {
        main = buildCursorURL(
            cursor.shape,
            fill,
            cursor.stroke,
            cursor.strokeWidth ?? 1,
            size
        )
    }
    if (!main) return ""

    let pointer = `${main} ${hotspotX} ${hotspotY}, auto`
    if (cursor.separateHover && cursor.mode === "Shape") {
        pointer = `${buildCursorURL(
            cursor.hoverShape || "Dot",
            hoverFill || fill,
            cursor.stroke,
            cursor.strokeWidth ?? 1,
            size
        )} ${Math.round(size / 2)} ${Math.round(size / 2)}, pointer`
    }

    return `
  @media (hover: hover) and (pointer: fine) {
    * { cursor: ${main} ${hotspotX} ${hotspotY}, auto !important; }
    a, button, .btn, input[type="submit"] { cursor: ${pointer} !important; }
  }`
}

/* ------------------------------------------------------------------ */
/* Globální CSS                                                        */
/* ------------------------------------------------------------------ */

/** Prefixuje všechny selektory, aby styly neovlivnily zbytek Framer projektu. */
function prefixSelector(selector, scope) {
    return selector
        .split(",")
        .map((part) => {
            const s = part.trim()
            if (!s || s.startsWith(scope)) return s
            return `${scope} ${s}`
        })
        .filter(Boolean)
        .join(", ")
}

function scopeCSS(input, scope) {
    // Komentáře pryč – jinak by se jejich text stal součástí selektoru.
    const css = input.replace(/\/\*[\s\S]*?\*\//g, "")
    let out = ""
    let buffer = ""
    let depth = 0
    let inKeyframes = false
    let keyframesDepth = 0

    for (let i = 0; i < css.length; i++) {
        const ch = css[i]
        if (ch === "{") {
            const selector = buffer.trim()
            buffer = ""
            if (selector.startsWith("@")) {
                if (/^@(-\w+-)?keyframes/i.test(selector)) {
                    inKeyframes = true
                    keyframesDepth = depth
                }
                out += `${selector} {`
            } else if (inKeyframes) {
                out += `${selector} {`
            } else {
                out += `${prefixSelector(selector, scope)} {`
            }
            depth++
        } else if (ch === "}") {
            out += `${buffer}}`
            buffer = ""
            depth = Math.max(0, depth - 1)
            if (inKeyframes && depth <= keyframesDepth) inKeyframes = false
        } else {
            buffer += ch
        }
    }
    return out + buffer
}

const globalCSS = (c, t, fx) => {
    const accent = c.accent
    const accentSoft = c.accentSoft
    const radius = t.radius
    // Tlačítka standardně kopírují akcentní barvu; lze je přebít vlastní barvou.
    const btnBg = c.buttonUseAccent === false ? c.buttonBackground : accent
    const btnHover =
        c.buttonUseAccent === false ? c.buttonBackgroundHover : accentSoft
    return `
  .ella-root, .ella-root * { box-sizing: border-box; margin: 0; padding: 0; }
  .ella-root {
    --black: ${c.background};
    --black-soft: ${c.backgroundSoft};
    --card: ${c.cardBackground};
    --pink: ${accent};
    --pink-soft: ${accentSoft};
    --white: ${c.text};
    --gray: ${c.textMuted};
    --border: ${c.border};
    --heading: ${c.headingColor};
    --transition: ${t.transition}s ease;
    --radius: ${radius}px;
    font-family: ${t.fontFamily};
    background: var(--black);
    color: var(--white);
    line-height: ${t.lineHeight};
    font-size: ${t.baseSize}px;
    overflow-x: hidden;
    width: 100%;
    height: auto;
    position: relative;
  }
  .ella-root h1, .ella-root h2, .ella-root h3 { font-family: ${t.headingFontFamily}; color: var(--heading); }
  .ella-root a { color: inherit; }
  .container { width: 100%; max-width: ${t.contentWidth}px; margin: 0 auto; padding: 0 24px; }
  .bg-canvas { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; pointer-events: none; }
  .bg-video-layer { position: absolute; inset: 0; z-index: 0; overflow: hidden; }
  .bg-video-layer video { width: 100%; height: 100%; object-fit: cover; display: block; }
  .bg-video-overlay { position: absolute; inset: 0; }
  main, .header, .footer { position: relative; z-index: 2; }
  .header { position: sticky; top: 0; z-index: 100; background: ${c.headerBackground}; ${
      fx.headerBlur ? "backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);" : ""
  } border-bottom: 1px solid var(--border); transition: background var(--transition); }
  .header-inner { display: flex; align-items: center; justify-content: space-between; height: ${t.headerHeight}px; }
  .logo { font-size: 22px; font-weight: 700; color: var(--white); text-decoration: none; letter-spacing: 0.5px; }
  .logo span { color: var(--pink); }
  .logo-link { display: flex; align-items: center; }
  .logo-image { height: ${t.logoHeight}px; width: auto; object-fit: contain; display: block; }
  .nav-desktop { display: flex; align-items: center; gap: 40px; }
  .nav-desktop ul { display: flex; gap: 32px; list-style: none; }
  .nav-desktop a { color: var(--white); text-decoration: none; font-size: 15px; font-weight: 500; position: relative; transition: color var(--transition); }
  .nav-desktop ul a::after { content: ""; position: absolute; left: 0; bottom: -6px; width: 0; height: 2px; background: var(--pink); transition: width var(--transition); }
  .nav-desktop ul a:hover { color: var(--pink-soft); }
  .nav-desktop ul a:hover::after { width: 100%; }
  .btn { display: inline-block; padding: 12px 26px; border-radius: ${t.buttonRadius}px; font-size: 14px; font-weight: 600; text-decoration: none; cursor: pointer; border: none; transition: all var(--transition); font-family: inherit; }
  .btn-primary { background: ${btnBg}; color: ${c.buttonText}; box-shadow: 0 0 20px ${withAlpha(btnBg, 0.4)}; }
  .btn-primary:hover { background: ${btnHover}; box-shadow: 0 0 30px ${withAlpha(btnBg, 0.7)}; transform: translateY(-2px); }
  .btn-primary:disabled { opacity: 0.6; cursor: wait; }
  .btn-outline { background: transparent; color: ${c.buttonOutlineText}; border: 1px solid ${c.buttonOutlineBorder}; }
  .btn-outline:hover { border-color: var(--pink); color: var(--pink-soft); }
  .hamburger { display: none; flex-direction: column; justify-content: center; gap: 5px; width: 32px; height: 32px; background: none; border: none; cursor: pointer; z-index: 110; }
  .hamburger span { display: block; width: 100%; height: 2px; background: var(--white); border-radius: 2px; transition: all var(--transition); }
  .hamburger.active span:nth-child(1) { transform: translateY(7px) rotate(45deg); background: var(--pink); }
  .hamburger.active span:nth-child(2) { opacity: 0; }
  .hamburger.active span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); background: var(--pink); }
  .nav-backdrop { position: fixed; inset: 0; z-index: 104; background: rgba(0,0,0,0.5); opacity: 0; transition: opacity 0.4s ease; border: 0; padding: 0; }
  .nav-backdrop.active { opacity: 1; }
  .nav-mobile { position: fixed; top: 0; right: 0; width: min(80vw, 340px); max-width: 100%; height: 100vh; background: ${c.mobileMenuBackground}; border-left: 1px solid ${withAlpha(accent, 0.2)}; z-index: 105; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 36px; transform: translateX(100%); transition: transform 0.4s ease; box-shadow: -10px 0 40px rgba(0,0,0,0.6); }
  .nav-mobile.active { transform: translateX(0); }
  .nav-mobile ul { list-style: none; text-align: center; display: flex; flex-direction: column; gap: 28px; }
  .nav-mobile a { color: var(--white); text-decoration: none; font-size: 20px; font-weight: 600; }
  .nav-mobile a:hover { color: var(--pink); }
  .hero { min-height: ${t.heroMinHeight}vh; display: flex; align-items: center; position: relative; }
  .hero-inner { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 60px; align-items: center; padding: 60px 24px; }
  .eyebrow { color: var(--pink-soft); font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; font-size: 13px; margin-bottom: 16px; display: block; }
  .hero-text h1 { font-size: clamp(2.4rem, 5vw, ${t.heroTitleSize}rem); font-weight: 800; line-height: 1.15; margin-bottom: 24px; }
  .hero-text .accent { color: var(--pink); }
  .hero-desc { color: var(--gray); font-size: 17px; max-width: 480px; margin-bottom: 36px; }
  .hero-actions { display: flex; gap: 16px; flex-wrap: wrap; }
  .hero-image { position: relative; border-radius: var(--radius); overflow: hidden; }
  .hero-image img, .hero-image video { width: 100%; height: ${t.heroMediaHeight}px; object-fit: cover; border-radius: var(--radius); display: block; border: 1px solid ${withAlpha(accent, 0.25)}; background: var(--black-soft); }
  .hero-image-glow { position: absolute; bottom: -40px; left: 50%; transform: translateX(-50%); width: 80%; height: 60px; background: radial-gradient(ellipse at center, ${withAlpha(accent, 0.5)}, transparent 70%); filter: blur(20px); z-index: -1; }
  .scroll-indicator { position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); width: 26px; height: 42px; border: 2px solid ${withAlpha(c.text, 0.3)}; border-radius: 20px; }
  .scroll-indicator i { position: absolute; top: 6px; left: 50%; transform: translateX(-50%); width: 4px; height: 8px; background: var(--pink); border-radius: 2px; animation: ellaScrollDot 1.8s infinite; }
  @keyframes ellaScrollDot { 0% { top: 6px; opacity: 1; } 100% { top: 24px; opacity: 0; } }
  .ella-root section:not(.hero) { padding: ${t.sectionPadding}px 0; }
  .section-eyebrow { color: var(--pink-soft); font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; font-size: 13px; margin-bottom: 12px; display: block; }
  .ella-root section h2 { font-size: clamp(1.8rem, 4vw, ${t.headingSize}rem); font-weight: 800; margin-bottom: 40px; }
  .cards-grid { display: grid; grid-template-columns: repeat(${t.servicesColumns}, 1fr); gap: 24px; }
  .card { background: var(--card); border: 1px solid var(--border); border-radius: ${t.cardRadius}px; padding: 32px 24px; transition: transform var(--transition), border-color var(--transition), box-shadow var(--transition); overflow: hidden; }
  ${
      fx.hoverLift
          ? `.card:hover { transform: translateY(-8px); border-color: var(--pink); box-shadow: 0 10px 30px ${withAlpha(accent, 0.15)}; }`
          : `.card:hover { border-color: var(--pink); }`
  }
  .card h3 { font-size: 19px; margin-bottom: 10px; font-weight: 700; }
  .card p { color: var(--gray); font-size: 14.5px; }
  .card-image-card { padding: 0 0 24px 0; }
  .card-image-card .card-image { width: 100%; height: ${t.cardMediaHeight}px; object-fit: cover; display: block; margin-bottom: 20px; border-bottom: 1px solid ${withAlpha(accent, 0.25)}; background: var(--black-soft); }
  .card-image-card h3, .card-image-card p { padding: 0 24px; }
  .card-image-card p { font-size: 15px; color: var(--white); line-height: 1.65; }
  .gallery-grid { display: grid; grid-template-columns: repeat(${t.galleryColumns}, 1fr); gap: 16px; }
  .gallery-grid img, .gallery-grid video { width: 100%; height: ${t.galleryMediaHeight}px; object-fit: cover; border-radius: ${t.cardRadius}px; border: 1px solid var(--border); transition: transform var(--transition), border-color var(--transition); display: block; background: var(--black-soft); }
  .gallery-grid img:hover, .gallery-grid video:hover { transform: scale(1.03); border-color: var(--pink); }
  .video-section-inner { display: grid; grid-template-columns: 1fr; gap: 28px; }
  .video-frame { position: relative; width: 100%; border-radius: var(--radius); overflow: hidden; border: 1px solid ${withAlpha(accent, 0.25)}; background: var(--black-soft); }
  .video-frame video { width: 100%; height: ${t.showcaseVideoHeight}px; object-fit: cover; display: block; }
  .video-empty { display: flex; align-items: center; justify-content: center; height: ${t.showcaseVideoHeight}px; color: var(--gray); font-size: 15px; text-align: center; padding: 24px; }
  .pricing { position: relative; z-index: 2; }
  .pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .price-card { position: relative; z-index: 3; background: linear-gradient(180deg, ${c.cardBackground}, ${c.backgroundSoft}); border-radius: ${t.cardRadius}px; padding: 30px 24px; --glow: 0; border: 1px solid ${withAlpha(accent, 0.05)}; transition: border-color 0.15s linear, box-shadow 0.15s linear, opacity 0.15s linear, transform var(--transition); }
  ${
      fx.pricingGlow
          ? `.price-card, .pricing-note { border-color: ${withAlpha(accent, 0.05)}; }
  .price-card, .pricing-note { --glow: 0; }
  .price-card { border: 1px solid rgba(0,0,0,0); border-color: color-mix(in srgb, ${accent} calc((5 + var(--glow) * 95) * 1%), transparent); box-shadow: 0 0 calc(var(--glow) * 60px) calc(var(--glow) * 10px) ${withAlpha(accent, 0.75)}, inset 0 0 calc(var(--glow) * 30px) ${withAlpha(accent, 0.12)}; opacity: calc(0.55 + var(--glow) * 0.45); }`
          : `.price-card { border-color: ${withAlpha(accent, 0.25)}; }`
  }
  .price-card:hover { transform: translateY(-8px); }
  .price-card-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 24px; }
  .price-card-head h3 { font-size: 20px; font-weight: 700; }
  .price-card-head span { font-size: 12px; color: var(--pink-soft); border: 1px solid ${withAlpha(accent, 0.28)}; border-radius: 999px; padding: 6px 10px; white-space: nowrap; }
  .price-list { list-style: none; display: flex; flex-direction: column; gap: 16px; }
  .price-list li { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding-bottom: 14px; border-bottom: 1px solid var(--border); }
  .price-list li span { color: var(--white); font-size: 15px; }
  .price-list li strong { color: var(--pink-soft); font-size: 15px; font-weight: 700; white-space: nowrap; }
  .pricing-note { position: relative; z-index: 3; margin: 32px auto 0; color: var(--white); max-width: 620px; text-align: center; padding: 16px 28px; border-radius: 12px; background: ${withAlpha(accent, 0.06)}; font-size: 14.5px; border: 1px solid ${withAlpha(accent, 0.25)}; ${
      fx.pricingGlow
          ? `--glow: 0; border-color: color-mix(in srgb, ${accent} calc((5 + var(--glow) * 95) * 1%), transparent); box-shadow: 0 0 calc(var(--glow) * 60px) calc(var(--glow) * 10px) ${withAlpha(accent, 0.75)}, inset 0 0 calc(var(--glow) * 30px) ${withAlpha(accent, 0.12)}; opacity: calc(0.55 + var(--glow) * 0.45); transition: border-color 0.15s linear, box-shadow 0.15s linear, opacity 0.15s linear;`
          : ""
  } }
  .about-inner { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 60px; align-items: center; }
  .about-image-scene { width: 100%; height: ${t.aboutMediaHeight}px; border-radius: var(--radius); overflow: hidden; position: relative; border: 1px solid ${withAlpha(accent, 0.2)}; background: var(--black-soft); }
  .about-photo { width: 100%; height: 100%; object-fit: cover; display: block; }
  .about-text p { color: var(--gray); margin-bottom: 24px; }
  .about-list { list-style: none; display: flex; flex-direction: column; gap: 14px; }
  .about-list li { padding-left: 28px; position: relative; font-size: 15px; }
  .about-list li::before { content: "${t.bulletIcon}"; position: absolute; left: 0; color: var(--pink); font-weight: 700; }
  .contact-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; }
  .contact-text p { color: var(--gray); margin-bottom: 24px; }
  .contact-info p { margin-bottom: 10px; font-size: 15px; }
  .contact-info strong { color: var(--pink-soft); }
  .contact-form { display: flex; flex-direction: column; gap: 16px; }
  .contact-form input, .contact-form textarea { background: ${c.inputBackground}; border: 1px solid ${c.inputBorder}; border-radius: 10px; padding: 14px 18px; color: ${c.inputText}; font-size: 15px; font-family: inherit; resize: none; transition: border-color var(--transition); }
  .contact-form input::placeholder, .contact-form textarea::placeholder { color: var(--gray); }
  .contact-form input:focus, .contact-form textarea:focus { outline: none; border-color: var(--pink); box-shadow: 0 0 0 3px ${withAlpha(accent, 0.15)}; }
  .contact-form button { align-self: flex-start; margin-top: 6px; }
  .booking-side { display: flex; flex-direction: column; gap: 16px; }
  .booking-actions { display: flex; gap: 12px; flex-wrap: wrap; }
  .booking-note { color: var(--gray); font-size: 14px; }
  .cal-embed { width: 100%; min-height: 320px; border-radius: ${t.cardRadius}px; overflow: hidden; border: 1px solid ${withAlpha(accent, 0.2)}; background: var(--card); }
  .cal-embed > * { width: 100%; }
  .cal-placeholder { display: flex; align-items: center; justify-content: center; text-align: center; padding: 32px 24px; color: var(--gray); font-size: 15px; min-height: 320px; }
  .ella-root .contact-inner.booking-full { grid-template-columns: 1fr; }
  .form-feedback { margin-top: 12px; font-size: 14px; }
  .form-feedback.success { color: ${c.successColor}; }
  .form-feedback.error { color: ${c.errorColor}; }
  .footer { padding: 30px 0; border-top: 1px solid var(--border); text-align: center; background: ${c.footerBackground}; }
  .footer p { color: var(--gray); font-size: 14px; }
  /* Zlomy reagují na šířku samotné komponenty (třídy w-md/w-sm/w-xs),
     takže sedí i v úzkém breakpoint rámci na širokém plátně Frameru. */
  .ella-root.w-md .hero-inner { grid-template-columns: 1fr; text-align: center; }
  .ella-root.w-md .hero-text { order: 1; }
  .ella-root.w-md .hero-image { order: 2; }
  .ella-root.w-md .hero-desc { margin-left: auto; margin-right: auto; }
  .ella-root.w-md .hero-actions { justify-content: center; }
  .ella-root.w-md .cards-grid { grid-template-columns: repeat(${Math.min(
      2,
      t.servicesColumns
  )}, 1fr); }
  .ella-root.w-md .gallery-grid { grid-template-columns: repeat(${Math.min(
      2,
      t.galleryColumns
  )}, 1fr); }
  .ella-root.w-md .about-inner, .ella-root.w-md .contact-inner { grid-template-columns: 1fr; }
  .ella-root.w-md .pricing-grid { grid-template-columns: 1fr; }
  .ella-root.w-md .about-image-scene { height: 320px; }
  .ella-root.w-sm .nav-desktop { display: none; }
  .ella-root.w-sm .hamburger { display: flex; }
  .ella-root.w-sm .hero-image img, .ella-root.w-sm .hero-image video { height: 360px; }
  .ella-root.w-sm section:not(.hero) { padding: ${Math.round(
      t.sectionPadding * 0.7
  )}px 0; }
  .ella-root.w-sm .video-frame video, .ella-root.w-sm .video-empty { height: ${Math.round(
      t.showcaseVideoHeight * 0.6
  )}px; }
  .ella-root.w-xs .cards-grid { grid-template-columns: 1fr; }
  .ella-root.w-xs .gallery-grid { grid-template-columns: 1fr; }
  .ella-root.w-xs .hero-actions { flex-direction: column; width: 100%; }
  .ella-root.w-xs .hero-actions .btn { width: 100%; text-align: center; }
  .ella-root.w-xs .contact-form button { width: 100%; text-align: center; }
  .ella-root.w-xs .hero-inner { padding: 40px 16px; }
  .ella-root.w-xs .container { padding: 0 16px; }
  @media (prefers-reduced-motion: reduce) {
    .ella-root *, .ella-root *::before, .ella-root *::after { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }
  }
`
}

/* ------------------------------------------------------------------ */
/* Cal.com – rezervační kalendář                                       */
/* ------------------------------------------------------------------ */

const CAL_DEFAULT_EMBED_JS = "https://app.cal.com/embed/embed.js"

const CAL_LINK_HINT =
    "Add your Cal.com link in Booking → Cal.com link (for example ella/haircut)."

/** Oficiální Cal.com embed loader – doplní window.Cal a načte embed.js. */
function ensureCalLoader(embedJsUrl) {
    if (typeof window === "undefined" || typeof document === "undefined") {
        return null
    }
    if (window.Cal) return window.Cal

    const src = embedJsUrl || CAL_DEFAULT_EMBED_JS
    const push = (target, args) => target.q.push(args)

    const cal = function () {
        const api = window.Cal
        const args = arguments
        if (!api.loaded) {
            api.ns = {}
            api.q = api.q || []
            const script = document.createElement("script")
            script.src = src
            script.async = true
            document.head.appendChild(script)
            api.loaded = true
        }
        if (args[0] === "init") {
            const namespaced = function () {
                push(namespaced, arguments)
            }
            const namespace = args[1]
            namespaced.q = namespaced.q || []
            if (typeof namespace === "string") {
                api.ns[namespace] = api.ns[namespace] || namespaced
                push(api.ns[namespace], args)
                push(api, ["initNamespace", namespace])
            } else {
                push(api, args)
            }
            return
        }
        push(api, args)
    }
    cal.q = []
    window.Cal = cal
    return window.Cal
}

function calConfig(booking) {
    const config = { layout: booking.layout || "month_view" }
    if (booking.theme && booking.theme !== "auto") config.theme = booking.theme
    return config
}

/**
 * Připraví Cal.com embed: načte skript, nastaví branding a případně
 * vloží kalendář přímo do stránky. Vrací ref pro inline kontejner
 * a atributy pro tlačítka, která mají otevřít rezervaci v popupu.
 */
function useCalBooking(booking, accent) {
    const inlineRef = useRef(null)
    const link = (booking.calLink || "").trim().replace(/^https?:\/\/(app\.)?cal\.com\//i, "")
    const active = booking.mode !== "form" && !!link
    const showsInline = active && booking.mode === "inline"
    const showsButton = active && (booking.mode === "popup" || booking.mode === "both")
    const brand = toHex(
        booking.useAccentColor === false ? booking.brandColor : accent,
        "#ff3d81"
    )

    useEffect(() => {
        if (!active) return
        const Cal = ensureCalLoader(booking.embedJsUrl)
        if (!Cal) return
        Cal("init", { origin: booking.origin || "https://cal.com" })
        Cal("ui", {
            hideEventTypeDetails: !!booking.hideEventTypeDetails,
            layout: booking.layout || "month_view",
            cssVarsPerTheme: {
                light: { "cal-brand": brand },
                dark: { "cal-brand": brand },
            },
        })
    }, [
        active,
        booking.origin,
        booking.embedJsUrl,
        booking.layout,
        booking.hideEventTypeDetails,
        brand,
    ])

    useEffect(() => {
        if (!showsInline) return
        const el = inlineRef.current
        if (!el) return
        const Cal = ensureCalLoader(booking.embedJsUrl)
        if (!Cal) return
        el.innerHTML = ""
        Cal("inline", {
            elementOrSelector: el,
            calLink: link,
            config: calConfig(booking),
        })
        return () => {
            el.innerHTML = ""
        }
    }, [showsInline, link, booking.layout, booking.theme, booking.embedJsUrl])

    const buttonAttrs = showsButton
        ? {
              "data-cal-link": link,
              "data-cal-config": JSON.stringify(calConfig(booking)),
          }
        : {}

    return { active, showsInline, showsButton, inlineRef, buttonAttrs, link }
}

/* ------------------------------------------------------------------ */
/* Media – obrázek NEBO video (video má přednost)                      */
/* ------------------------------------------------------------------ */

function isVideoSrc(src) {
    return (
        typeof src === "string" &&
        /\.(mp4|webm|ogv|ogg|mov|m4v)(\?|#|$)/i.test(src)
    )
}

function Media({ image, video, poster, alt, className, settings, style }) {
    const src = video || (isVideoSrc(image) ? image : null)
    const s = settings || {}
    if (src) {
        return (
            <video
                className={className}
                src={src}
                poster={poster || (isVideoSrc(image) ? undefined : image)}
                autoPlay={s.autoplay !== false}
                loop={s.loop !== false}
                muted={s.autoplay !== false ? true : s.muted !== false}
                playsInline
                controls={!!s.controls}
                preload={s.autoplay !== false ? "auto" : "metadata"}
                aria-label={alt}
                style={style}
            />
        )
    }
    if (!image) return null
    return (
        <img className={className} src={image} alt={alt || ""} style={style} />
    )
}

/* ------------------------------------------------------------------ */
/* Poletující obrazce (canvas)                                         */
/* ------------------------------------------------------------------ */

const SHAPE_DRAWERS = {
    scissors(c, size, color, alpha, w) {
        c.strokeStyle = withAlpha(color, alpha)
        c.fillStyle = withAlpha(color, alpha)
        c.lineWidth = size * 0.075 * w
        c.lineCap = "round"
        c.lineJoin = "round"
        c.beginPath()
        c.moveTo(size * 0.85, -size * 0.62)
        c.quadraticCurveTo(size * 0.15, -size * 0.18, 0, 0)
        c.stroke()
        c.beginPath()
        c.moveTo(size * 0.85, size * 0.62)
        c.quadraticCurveTo(size * 0.15, size * 0.18, 0, 0)
        c.stroke()
        c.beginPath()
        c.moveTo(0, 0)
        c.lineTo(-size * 0.62, -size * 0.55)
        c.stroke()
        c.beginPath()
        c.moveTo(0, 0)
        c.lineTo(-size * 0.62, size * 0.55)
        c.stroke()
        c.beginPath()
        c.arc(-size * 0.75, -size * 0.62, size * 0.2, 0, Math.PI * 2)
        c.stroke()
        c.beginPath()
        c.arc(-size * 0.75, size * 0.62, size * 0.2, 0, Math.PI * 2)
        c.stroke()
        c.beginPath()
        c.arc(0, 0, size * 0.075, 0, Math.PI * 2)
        c.fill()
    },
    comb(c, size, color, alpha, w) {
        c.strokeStyle = withAlpha(color, alpha)
        c.lineWidth = size * 0.07 * w
        c.lineCap = "round"
        c.beginPath()
        c.moveTo(-size * 0.7, -size * 0.5)
        c.lineTo(size * 0.7, -size * 0.5)
        c.stroke()
        const teeth = 6
        for (let i = 0; i < teeth; i++) {
            const tx = -size * 0.65 + (i * (size * 1.3)) / (teeth - 1)
            c.beginPath()
            c.moveTo(tx, -size * 0.5)
            c.lineTo(tx, size * 0.5)
            c.stroke()
        }
    },
    wave(c, size, color, alpha, w) {
        c.strokeStyle = withAlpha(color, alpha)
        c.lineWidth = size * 0.1 * w
        c.lineCap = "round"
        c.beginPath()
        c.moveTo(-size * 0.8, 0)
        c.bezierCurveTo(
            -size * 0.4,
            -size * 0.7,
            size * 0.0,
            size * 0.7,
            size * 0.4,
            0
        )
        c.bezierCurveTo(
            size * 0.6,
            -size * 0.35,
            size * 0.7,
            size * 0.1,
            size * 0.8,
            0
        )
        c.stroke()
    },
    heart(c, size, color, alpha, w) {
        c.strokeStyle = withAlpha(color, alpha)
        c.lineWidth = size * 0.09 * w
        c.beginPath()
        const s = size * 0.75
        c.moveTo(0, s * 0.75)
        c.bezierCurveTo(-s * 1.5, -s * 0.2, -s * 0.5, -s * 1.2, 0, -s * 0.4)
        c.bezierCurveTo(s * 0.5, -s * 1.2, s * 1.5, -s * 0.2, 0, s * 0.75)
        c.stroke()
    },
    star(c, size, color, alpha, w) {
        c.strokeStyle = withAlpha(color, alpha)
        c.lineWidth = size * 0.08 * w
        c.lineJoin = "round"
        c.beginPath()
        const spikes = 5
        const outer = size * 0.8
        const inner = size * 0.34
        for (let i = 0; i < spikes * 2; i++) {
            const r = i % 2 === 0 ? outer : inner
            const a = (Math.PI / spikes) * i - Math.PI / 2
            const x = Math.cos(a) * r
            const y = Math.sin(a) * r
            if (i === 0) c.moveTo(x, y)
            else c.lineTo(x, y)
        }
        c.closePath()
        c.stroke()
    },
    sparkle(c, size, color, alpha, w) {
        c.strokeStyle = withAlpha(color, alpha)
        c.lineWidth = size * 0.09 * w
        c.lineCap = "round"
        for (let i = 0; i < 4; i++) {
            const a = (Math.PI / 2) * i
            c.beginPath()
            c.moveTo(0, 0)
            c.lineTo(Math.cos(a) * size * 0.8, Math.sin(a) * size * 0.8)
            c.stroke()
        }
    },
    dot(c, size, color, alpha) {
        c.fillStyle = withAlpha(color, alpha)
        c.beginPath()
        c.arc(0, 0, size * 0.28, 0, Math.PI * 2)
        c.fill()
    },
    ring(c, size, color, alpha, w) {
        c.strokeStyle = withAlpha(color, alpha)
        c.lineWidth = size * 0.09 * w
        c.beginPath()
        c.arc(0, 0, size * 0.6, 0, Math.PI * 2)
        c.stroke()
    },
    bubble(c, size, color, alpha, w) {
        c.strokeStyle = withAlpha(color, alpha)
        c.fillStyle = withAlpha(color, alpha * 0.15)
        c.lineWidth = size * 0.07 * w
        c.beginPath()
        c.arc(0, 0, size * 0.65, 0, Math.PI * 2)
        c.fill()
        c.stroke()
        c.beginPath()
        c.arc(-size * 0.25, -size * 0.28, size * 0.12, 0, Math.PI * 2)
        c.stroke()
    },
}

function BackgroundShapes({ options, accent }) {
    const canvasRef = useRef(null)
    const color = options.useAccentColor ? accent : options.color

    const activeTypes = useMemo(() => {
        const list = []
        if (options.scissors) list.push("scissors")
        if (options.comb) list.push("comb")
        if (options.wave) list.push("wave")
        if (options.heart) list.push("heart")
        if (options.star) list.push("star")
        if (options.sparkle) list.push("sparkle")
        if (options.dot) list.push("dot")
        if (options.ring) list.push("ring")
        if (options.bubble) list.push("bubble")
        return list.length ? list : ["scissors", "comb", "wave"]
    }, [options])

    const typesKey = activeTypes.join(",")

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let width = 0
        let height = 0

        const isSmallScreen =
            typeof window !== "undefined" &&
            window.matchMedia("(max-width: 768px)").matches
        const isCoarsePointer =
            typeof window !== "undefined" &&
            window.matchMedia("(pointer: coarse)").matches
        const isLowPowerDevice = isSmallScreen || isCoarsePointer

        const baseCount = Math.max(0, Math.round(options.count))
        const MAX_ICONS = isLowPowerDevice
            ? Math.round(baseCount * 0.55)
            : baseCount
        const iconSize = Math.max(6, options.size)
        const speed = Math.max(0, options.speed)
        const minAlpha = Math.max(0, Math.min(1, options.opacity * 0.25))
        const maxAlpha = Math.max(minAlpha, Math.min(1, options.opacity))

        const mouse = { x: null, y: null, radius: options.mouseRadius }

        function resizeCanvas() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2)
            width = canvas.offsetWidth
            height = canvas.offsetHeight
            canvas.width = Math.max(1, width * dpr)
            canvas.height = Math.max(1, height * dpr)
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        }

        function createSprite(type, alpha) {
            const pad = iconSize * 0.4
            const sSize = Math.ceil((iconSize + pad) * 2)
            const off = document.createElement("canvas")
            off.width = sSize
            off.height = sSize
            const octx = off.getContext("2d")
            octx.translate(sSize / 2, sSize / 2)
            const draw = SHAPE_DRAWERS[type] || SHAPE_DRAWERS.dot
            draw(octx, iconSize, color, alpha, options.strokeWidth || 1)
            return off
        }

        const ALPHA_STEPS = 6
        const spriteCache = {}
        activeTypes.forEach((type) => {
            spriteCache[type] = []
            for (let i = 0; i < ALPHA_STEPS; i++) {
                const alpha =
                    minAlpha +
                    (i / (ALPHA_STEPS - 1)) * Math.max(0, maxAlpha - minAlpha)
                spriteCache[type].push(createSprite(type, alpha))
            }
        })

        class FloatingIcon {
            constructor() {
                this.x = Math.random() * width
                this.y = Math.random() * height
                this.vx = (Math.random() - 0.5) * speed
                this.vy = (Math.random() - 0.5) * speed
                this.scale = Math.random() * 0.5 + 0.8
                this.type =
                    activeTypes[(Math.random() * activeTypes.length) | 0]
                this.rotation = Math.random() * Math.PI * 2
                this.rotationSpeed =
                    (Math.random() - 0.5) * 0.005 * (options.rotation ? 1 : 0)
                this.alphaStep = (Math.random() * ALPHA_STEPS) | 0
            }
            update() {
                this.x += this.vx
                this.y += this.vy
                this.rotation += this.rotationSpeed
                const margin = iconSize * 2
                if (this.x < -margin) this.x = width + margin
                if (this.x > width + margin) this.x = -margin
                if (this.y < -margin) this.y = height + margin
                if (this.y > height + margin) this.y = -margin
                if (mouse.x !== null && options.interactive) {
                    const dx = this.x - mouse.x
                    const dy = this.y - mouse.y
                    const distSq = dx * dx + dy * dy
                    const r = mouse.radius
                    if (distSq < r * r && distSq > 0.01) {
                        const dist = Math.sqrt(distSq)
                        const force = (r - dist) / r
                        this.x += (dx / dist) * force * 1.1
                        this.y += (dy / dist) * force * 1.1
                    }
                }
            }
            draw() {
                const cache = spriteCache[this.type]
                if (!cache) return
                const sprite = cache[this.alphaStep]
                const half = sprite.width / 2
                ctx.save()
                ctx.translate(this.x, this.y)
                ctx.rotate(this.rotation)
                ctx.scale(this.scale, this.scale)
                ctx.drawImage(sprite, -half, -half)
                ctx.restore()
            }
        }

        let icons = []
        let raf

        function initIcons() {
            icons = []
            for (let i = 0; i < MAX_ICONS; i++) icons.push(new FloatingIcon())
        }

        function animate() {
            ctx.clearRect(0, 0, width, height)
            for (let i = 0; i < icons.length; i++) {
                icons[i].update()
                icons[i].draw()
            }
            raf = requestAnimationFrame(animate)
        }

        function handleMove(e) {
            const r = canvas.getBoundingClientRect()
            mouse.x = e.clientX - r.left
            mouse.y = e.clientY - r.top
        }

        /**
         * Plátno se přizpůsobuje i tehdy, když se stránka teprve doměřuje
         * (styly se vkládají až po prvním renderu) nebo když naroste obsah.
         */
        function handleResize() {
            const prevW = width
            const prevH = height
            resizeCanvas()
            if (prevW > 1 && prevH > 1 && icons.length) {
                const sx = width / prevW
                const sy = height / prevH
                for (let i = 0; i < icons.length; i++) {
                    icons[i].x *= sx
                    icons[i].y *= sy
                }
            } else {
                initIcons()
            }
        }

        resizeCanvas()
        initIcons()
        animate()

        let observer = null
        if (typeof ResizeObserver !== "undefined") {
            observer = new ResizeObserver(() => {
                if (
                    Math.abs(canvas.offsetWidth - width) > 1 ||
                    Math.abs(canvas.offsetHeight - height) > 1
                ) {
                    handleResize()
                }
            })
            observer.observe(canvas)
        }

        function handleVisibility() {
            if (document.hidden) {
                cancelAnimationFrame(raf)
            } else {
                cancelAnimationFrame(raf)
                animate()
            }
        }

        if (!isCoarsePointer && options.interactive) {
            window.addEventListener("mousemove", handleMove, { passive: true })
        }
        window.addEventListener("resize", handleResize)
        document.addEventListener("visibilitychange", handleVisibility)

        return () => {
            cancelAnimationFrame(raf)
            if (observer) observer.disconnect()
            window.removeEventListener("mousemove", handleMove)
            window.removeEventListener("resize", handleResize)
            document.removeEventListener("visibilitychange", handleVisibility)
        }
    }, [
        typesKey,
        color,
        options.count,
        options.size,
        options.speed,
        options.opacity,
        options.rotation,
        options.interactive,
        options.mouseRadius,
        options.strokeWidth,
    ])

    return <canvas ref={canvasRef} className="bg-canvas" aria-hidden="true" />
}

/* ------------------------------------------------------------------ */
/* Sekce                                                               */
/* ------------------------------------------------------------------ */

const DEFAULT_NAV_LINKS = [
    { label: "Home", href: "#hero" },
    { label: "Services", href: "#services" },
    { label: "Gallery", href: "#gallery" },
    { label: "Pricing", href: "#pricing" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
]

function Header({ logo, ctaText, ctaHref, navLinks, showCta, bookingAttrs }) {
    const [menuOpen, setMenuOpen] = useState(false)
    // Zavřená zásuvka se vůbec nevykresluje – jinak by zvětšovala šířku
    // publikované stránky (fixed prvky neořízne overflow ancestora).
    const [menuMounted, setMenuMounted] = useState(false)
    const [menuSlidIn, setMenuSlidIn] = useState(false)

    useEffect(() => {
        if (menuOpen) {
            setMenuMounted(true)
            let inner = 0
            const outer = requestAnimationFrame(() => {
                inner = requestAnimationFrame(() => setMenuSlidIn(true))
            })
            return () => {
                cancelAnimationFrame(outer)
                cancelAnimationFrame(inner)
            }
        }
        setMenuSlidIn(false)
        const timer = setTimeout(() => setMenuMounted(false), 420)
        return () => clearTimeout(timer)
    }, [menuOpen])

    useEffect(() => {
        if (!menuOpen) return
        function onKey(e) {
            if (e.key === "Escape") setMenuOpen(false)
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [menuOpen])
    const safeNavLinks =
        Array.isArray(navLinks) &&
        navLinks.length > 0 &&
        navLinks.every((l) => l && l.label && l.href)
            ? navLinks
            : DEFAULT_NAV_LINKS
    return (
        <header className="header">
            <div className="container header-inner">
                <a href={logo.href || "#hero"} className="logo logo-link">
                    {logo.image ? (
                        <img
                            className="logo-image"
                            src={logo.image}
                            alt={`${logo.text || ""}${logo.accent || "Logo"}`}
                        />
                    ) : (
                        <>
                            {logo.text}
                            <span>{logo.accent}</span>
                        </>
                    )}
                </a>
                <nav className="nav-desktop">
                    <ul>
                        {safeNavLinks.map((l, i) => (
                            <li key={`${l.href}-${i}`}>
                                <a href={l.href}>{l.label}</a>
                            </li>
                        ))}
                    </ul>
                    {showCta && (
                        <a
                            href={ctaHref || "#contact"}
                            className="btn btn-primary"
                            {...bookingAttrs}
                        >
                            {ctaText}
                        </a>
                    )}
                </nav>
                <button
                    className={`hamburger ${menuOpen ? "active" : ""}`}
                    aria-label="Open menu"
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <span />
                    <span />
                    <span />
                </button>
            </div>
            {menuMounted && (
                <>
                    <button
                        type="button"
                        aria-label="Close menu"
                        className={`nav-backdrop ${menuSlidIn ? "active" : ""}`}
                        onClick={() => setMenuOpen(false)}
                    />
                    <nav className={`nav-mobile ${menuSlidIn ? "active" : ""}`}>
                        <ul>
                            {safeNavLinks.map((l, i) => (
                                <li key={`m-${l.href}-${i}`}>
                                    <a
                                        href={l.href}
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        {l.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                        {showCta && (
                            <a
                                href={ctaHref || "#contact"}
                                className="btn btn-primary"
                                onClick={() => setMenuOpen(false)}
                                {...bookingAttrs}
                            >
                                {ctaText}
                            </a>
                        )}
                    </nav>
                </>
            )}
        </header>
    )
}

function Hero({ data, videoSettings, showGlow, showScrollIndicator, bookingAttrs }) {
    return (
        <section className="hero" id="hero">
            <div className="container hero-inner">
                <div className="hero-text">
                    {data.eyebrow && (
                        <span className="eyebrow">{data.eyebrow}</span>
                    )}
                    <h1>
                        {data.titleBefore}{" "}
                        <span className="accent">{data.titleAccent}</span>.
                        <br />
                        {data.titleAfter}
                    </h1>
                    <p className="hero-desc">{data.description}</p>
                    <div className="hero-actions">
                        {data.ctaPrimary && (
                            <a
                                href={data.ctaPrimaryHref || "#contact"}
                                className="btn btn-primary"
                                {...bookingAttrs}
                            >
                                {data.ctaPrimary}
                            </a>
                        )}
                        {data.ctaSecondary && (
                            <a
                                href={data.ctaSecondaryHref || "#services"}
                                className="btn btn-outline"
                            >
                                {data.ctaSecondary}
                            </a>
                        )}
                    </div>
                </div>
                <div className="hero-image">
                    <Media
                        image={data.image}
                        video={data.video}
                        poster={data.videoPoster}
                        alt={data.imageAlt}
                        settings={videoSettings}
                    />
                    {showGlow && <div className="hero-image-glow" />}
                </div>
            </div>
            {showScrollIndicator && (
                <div className="scroll-indicator">
                    <i />
                </div>
            )}
        </section>
    )
}

function Services({ eyebrow, heading, items, videoSettings }) {
    const list = Array.isArray(items) ? items : []
    return (
        <section id="services">
            <div className="container">
                {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
                <h2>{heading}</h2>
                <div className="cards-grid">
                    {list.map((s, i) => (
                        <div key={i} className="card card-image-card">
                            <Media
                                className="card-image"
                                image={s.image}
                                video={s.video}
                                poster={s.videoPoster}
                                alt={s.title}
                                settings={videoSettings}
                            />
                            <h3>{s.title}</h3>
                            <p>{s.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

function Gallery({ eyebrow, heading, images, videoSettings }) {
    const list = Array.isArray(images) ? images : []
    return (
        <section id="gallery">
            <div className="container">
                {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
                <h2>{heading}</h2>
                <div className="gallery-grid">
                    {list.map((img, i) => (
                        <Media
                            key={i}
                            image={img.src}
                            video={img.video}
                            poster={img.videoPoster}
                            alt={img.alt}
                            settings={videoSettings}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

function VideoShowcase({ data, videoSettings }) {
    const settings = {
        ...videoSettings,
        autoplay: data.autoplay,
        loop: data.loop,
        controls: data.controls,
        muted: true,
    }
    return (
        <section id="video">
            <div className="container video-section-inner">
                <div>
                    {data.eyebrow && (
                        <p className="section-eyebrow">{data.eyebrow}</p>
                    )}
                    <h2>{data.heading}</h2>
                    {data.description && (
                        <p style={{ color: "var(--gray)", maxWidth: 640 }}>
                            {data.description}
                        </p>
                    )}
                </div>
                <div className="video-frame">
                    {data.video ? (
                        <Media
                            video={data.video}
                            poster={data.poster}
                            alt={data.heading}
                            settings={settings}
                        />
                    ) : (
                        <div className="video-empty">
                            Add a video in the right panel → Video section → Video
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

const DEFAULT_PRICING_ITEMS = {
    women: [
        { name: "Women's haircut", price: "from $35" },
        { name: "Cut + blow-dry", price: "from $45" },
        { name: "Hair coloring", price: "from $65" },
        { name: "Balayage / highlights", price: "from $85" },
        { name: "Regenerative care", price: "from $25" },
    ],
    men: [
        { name: "Men's haircut", price: "from $22" },
        { name: "Clipper cut", price: "from $16" },
        { name: "Beard trim", price: "from $13" },
        { name: "Cut + beard", price: "from $30" },
        { name: "Wash + styling", price: "from $9" },
    ],
    special: [
        { name: "Wedding hairstyle", price: "from $110" },
        { name: "Wedding hairstyle trial", price: "from $55" },
        { name: "Keratin treatment", price: "from $79" },
        { name: "Formal hairstyle", price: "from $49" },
        { name: "Children's haircut", price: "from $18" },
    ],
}

function Pricing({ data }) {
    const groups = [
        {
            badge: data.womenBadge,
            title: data.womenTitle,
            items: data.womenItems,
            fallback: DEFAULT_PRICING_ITEMS.women,
        },
        {
            badge: data.menBadge,
            title: data.menTitle,
            items: data.menItems,
            fallback: DEFAULT_PRICING_ITEMS.men,
        },
        {
            badge: data.specialBadge,
            title: data.specialTitle,
            items: data.specialItems,
            fallback: DEFAULT_PRICING_ITEMS.special,
        },
    ]
    return (
        <section className="pricing" id="pricing">
            <div className="container">
                {data.eyebrow && (
                    <p className="section-eyebrow">{data.eyebrow}</p>
                )}
                <h2>{data.heading}</h2>
                <div className="pricing-grid">
                    {groups.map((g, i) => {
                        const items =
                            Array.isArray(g.items) && g.items.length
                                ? g.items
                                : g.fallback
                        return (
                            <div key={i} className="price-card">
                                <div className="price-card-head">
                                    <h3>{g.title}</h3>
                                    {g.badge && <span>{g.badge}</span>}
                                </div>
                                <ul className="price-list">
                                    {items.map((it, j) => (
                                        <li key={j}>
                                            <span>{it.name}</span>
                                            <strong>{it.price}</strong>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )
                    })}
                </div>
                {data.note && <p className="pricing-note">{data.note}</p>}
            </div>
        </section>
    )
}

function About({ data, videoSettings }) {
    const points = Array.isArray(data.points) ? data.points : []
    return (
        <section id="about">
            <div className="container about-inner">
                <div className="about-image-scene">
                    <Media
                        className="about-photo"
                        image={data.image}
                        video={data.video}
                        poster={data.videoPoster}
                        alt={data.imageAlt}
                        settings={videoSettings}
                    />
                </div>
                <div className="about-text">
                    {data.eyebrow && (
                        <p className="section-eyebrow">{data.eyebrow}</p>
                    )}
                    <h2>{data.heading}</h2>
                    <p>{data.description}</p>
                    <ul className="about-list">
                        {points.map((p, i) => (
                            <li key={i}>{p.text}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    )
}

function Contact({ data, booking, cal }) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    })
    const [status, setStatus] = useState("idle")
    const [feedback, setFeedback] = useState("")

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (!data.formspreeEndpoint || !data.formspreeEndpoint.trim()) {
            setStatus("error")
            setFeedback(
                "Please add your Formspree endpoint in the Contact section settings."
            )
            return
        }
        setStatus("loading")
        setFeedback("")
        try {
            const response = await fetch(data.formspreeEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    message: form.message,
                    _subject: data.emailSubject || "New booking request",
                }),
            })
            if (response.ok) {
                setStatus("success")
                setFeedback(
                    data.successMessage || "Thank you. Your request has been sent."
                )
                setForm({ name: "", email: "", phone: "", message: "" })
            } else {
                setStatus("error")
                setFeedback(
                    data.errorMessage ||
                        "Sorry, something went wrong. Please try again."
                )
            }
        } catch (error) {
            setStatus("error")
            setFeedback(
                data.errorMessage ||
                    "Sorry, something went wrong. Please try again."
            )
        }
    }

    // Rozložení řídí zvolený režim, ne to, jestli je vyplněný odkaz –
    // chybějící odkaz se pozná podle nápovědy místo kalendáře.
    const mode = booking.mode || "form"
    const showForm = mode === "form" || mode === "both"
    const showCalendar = mode === "inline"
    const showBookingButton = mode === "popup" || mode === "both"
    const linkMissing = mode !== "form" && !cal.link
    const fullWidth = showCalendar && booking.fullWidth

    return (
        <section id="contact">
            <div
                className={`container contact-inner ${
                    fullWidth ? "booking-full" : ""
                }`.trim()}
            >
                <div className="contact-text">
                    {data.eyebrow && (
                        <p className="section-eyebrow">{data.eyebrow}</p>
                    )}
                    <h2>{data.heading}</h2>
                    <p>{data.description}</p>
                    <div className="contact-info">
                        <p>
                            <strong>{data.addressLabel}</strong> {data.address}
                        </p>
                        <p>
                            <strong>{data.phoneLabel}</strong> {data.phone}
                        </p>
                        <p>
                            <strong>{data.hoursLabel}</strong> {data.hours}
                        </p>
                    </div>
                </div>
                <div className="booking-side">
                    {showBookingButton &&
                        (linkMissing ? (
                            <p className="booking-note">{CAL_LINK_HINT}</p>
                        ) : (
                            <div className="booking-actions">
                                <a
                                    href="#contact"
                                    className="btn btn-primary"
                                    {...cal.buttonAttrs}
                                >
                                    {booking.buttonText ||
                                        "Check availability"}
                                </a>
                            </div>
                        ))}
                    {showCalendar &&
                        (linkMissing ? (
                            <div className="cal-embed cal-placeholder">
                                {CAL_LINK_HINT}
                            </div>
                        ) : (
                            <div
                                className="cal-embed"
                                ref={cal.inlineRef}
                                style={{ minHeight: booking.height }}
                            />
                        ))}
                    {booking.note && showBookingButton && !linkMissing && (
                        <p className="booking-note">{booking.note}</p>
                    )}
                    {showForm && (
                <form className="contact-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder={data.namePlaceholder}
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder={data.emailPlaceholder}
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="tel"
                        name="phone"
                        placeholder={data.phonePlaceholder}
                        value={form.phone}
                        onChange={handleChange}
                    />
                    <textarea
                        name="message"
                        placeholder={data.messagePlaceholder}
                        rows={5}
                        value={form.message}
                        onChange={handleChange}
                        required
                    />
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={status === "loading"}
                    >
                        {status === "loading"
                            ? data.sendingText || "Sending..."
                            : data.submitText}
                    </button>
                    {feedback && (
                        <p
                            className={`form-feedback ${
                                status === "success" ? "success" : "error"
                            }`}
                        >
                            {feedback}
                        </p>
                    )}
                </form>
                    )}
                </div>
            </div>
        </section>
    )
}

function Footer({ text, showYear }) {
    return (
        <footer className="footer">
            <div className="container">
                <p>
                    {showYear ? `© ${new Date().getFullYear()} ` : ""}
                    {text}
                </p>
            </div>
        </footer>
    )
}

/* ------------------------------------------------------------------ */
/* Výchozí hodnoty + hlavní komponenta                                 */
/* ------------------------------------------------------------------ */

const DEFAULTS = {
    colors: {
        background: "#0a0a0a",
        backgroundSoft: "#121212",
        cardBackground: "#141414",
        accent: "#ff3d81",
        accentSoft: "#ff6fa3",
        text: "#ffffff",
        headingColor: "#ffffff",
        textMuted: "#b3b3b3",
        border: "rgba(255,255,255,0.08)",
        headerBackground: "rgba(10,10,10,0.85)",
        mobileMenuBackground: "#121212",
        buttonUseAccent: true,
        buttonBackground: "#ff3d81",
        buttonBackgroundHover: "#ff6fa3",
        buttonText: "#ffffff",
        buttonOutlineText: "#ffffff",
        buttonOutlineBorder: "rgba(255,255,255,0.3)",
        inputBackground: "#121212",
        inputBorder: "rgba(255,255,255,0.15)",
        inputText: "#ffffff",
        footerBackground: "rgba(0,0,0,0)",
        successColor: "#7dffb3",
        errorColor: "#ff9bbd",
    },
    style: {
        fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        headingFontFamily: "inherit",
        baseSize: 16,
        lineHeight: 1.6,
        headingSize: 2.6,
        heroTitleSize: 3.6,
        radius: 20,
        cardRadius: 16,
        buttonRadius: 30,
        contentWidth: 1200,
        sectionPadding: 100,
        headerHeight: 76,
        logoHeight: 40,
        heroMinHeight: 100,
        heroMediaHeight: 520,
        cardMediaHeight: 200,
        galleryMediaHeight: 260,
        aboutMediaHeight: 440,
        showcaseVideoHeight: 520,
        servicesColumns: 4,
        galleryColumns: 4,
        transition: 0.3,
        bulletIcon: "✓",
    },
    effects: {
        headerBlur: false,
        heroGlow: true,
        hoverLift: true,
        pricingGlow: true,
        scrollIndicator: true,
    },
    shapes: {
        enabled: true,
        scissors: true,
        comb: true,
        wave: true,
        heart: false,
        star: false,
        sparkle: false,
        dot: false,
        ring: false,
        bubble: false,
        useAccentColor: true,
        color: "#ff3d81",
        count: 26,
        size: 24,
        strokeWidth: 1,
        speed: 0.22,
        opacity: 0.7,
        rotation: true,
        interactive: true,
        mouseRadius: 120,
    },
    cursor: {
        mode: "Shape",
        shape: "Original",
        useAccentColor: true,
        fill: "#ff3d81",
        stroke: "#ffffff",
        strokeWidth: 1,
        size: 24,
        hotspotX: 4,
        hotspotY: 2,
        image: "",
        separateHover: false,
        hoverShape: "Dot",
        hoverFill: "#ff6fa3",
    },
    backgroundVideo: {
        enabled: false,
        video: "",
        poster: "",
        opacity: 0.35,
        overlay: "rgba(10,10,10,0.7)",
    },
    videoSettings: {
        autoplay: true,
        loop: true,
        muted: true,
        controls: false,
    },
    booking: {
        mode: "form",
        calLink: "",
        origin: "https://cal.com",
        embedJsUrl: "",
        layout: "month_view",
        theme: "auto",
        useAccentColor: true,
        brandColor: "#ff3d81",
        hideEventTypeDetails: false,
        height: 640,
        fullWidth: false,
        buttonText: "Check availability",
        note: "",
        ctaOpensBooking: true,
    },
    logo: {
        image: "",
        text: "Hair Salon ",
        accent: "Ella V.",
        href: "#hero",
    },
}

/** useLayoutEffect v prohlížeči, useEffect při serverovém renderu. */
const useIsomorphicLayoutEffect =
    typeof document !== "undefined" ? useLayoutEffect : useEffect

/**
 * Sleduje šířku samotné komponenty a vrací třídy zlomů. Framer může komponentu
 * vykreslit v libovolně širokém rámci, takže se nedá spoléhat na šířku okna.
 */
function useWidthClass(ref) {
    const [widthClass, setWidthClass] = useState("")

    useIsomorphicLayoutEffect(() => {
        const el = ref.current
        if (!el) return

        function apply(width) {
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

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const box = entry.contentBoxSize
                    ? Array.isArray(entry.contentBoxSize)
                        ? entry.contentBoxSize[0]
                        : entry.contentBoxSize
                    : null
                apply(box ? box.inlineSize : entry.contentRect.width)
            }
        })
        observer.observe(el)
        return () => observer.disconnect()
    }, [ref])

    return widthClass
}

function merge(defaults, value) {
    return { ...defaults, ...(value || {}) }
}

/**
 * Šířka: Fill (jde přepnout i na fixní), výška: Fit content – komponenta se
 * ve Frameru vždy roztáhne na šířku rámce a vysoká je přesně podle obsahu.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 1200
 * @framerDisableUnlink
 */
export default function EllaHairSalonPage(props) {
    const rootRef = useRef(null)
    const widthClass = useWidthClass(rootRef)
    const colors = merge(DEFAULTS.colors, props.colors)
    const style = merge(DEFAULTS.style, props.style)
    const effects = merge(DEFAULTS.effects, props.effects)
    const shapes = merge(DEFAULTS.shapes, props.shapes)
    const cursor = merge(DEFAULTS.cursor, props.cursor)
    const backgroundVideo = merge(
        DEFAULTS.backgroundVideo,
        props.backgroundVideo
    )
    const videoSettings = merge(DEFAULTS.videoSettings, props.videoSettings)
    const logo = merge(DEFAULTS.logo, props.logo)
    const booking = merge(DEFAULTS.booking, props.booking)
    const cal = useCalBooking(booking, colors.accent)
    // Tlačítka „Book Now“ otevřou rezervaci, pokud je zapnutá.
    const ctaBookingAttrs =
        cal.showsButton && booking.ctaOpensBooking !== false
            ? cal.buttonAttrs
            : {}
    const sections = merge(
        {
            services: true,
            gallery: true,
            video: false,
            pricing: true,
            about: true,
            contact: true,
            footer: true,
            headerCta: true,
        },
        props.sections
    )

    const css = useMemo(
        () =>
            scopeCSS(globalCSS(colors, style, effects), ".ella-root") +
            cursorCSS(cursor, colors.accent),
        [colors, style, effects, cursor]
    )

    useIsomorphicLayoutEffect(() => {
        const styleId = "ella-salon-global-style"
        let el = document.getElementById(styleId)
        if (!el) {
            el = document.createElement("style")
            el.id = styleId
            document.head.appendChild(el)
        }
        el.textContent = css
    }, [css])

    useEffect(() => {
        if (!effects.pricingGlow) return
        function updateGlow() {
            const cards = document.querySelectorAll(
                ".price-card, .pricing-note"
            )
            const viewportH = window.innerHeight
            const center = viewportH / 2
            cards.forEach((card) => {
                const rect = card.getBoundingClientRect()
                const cardCenter = rect.top + rect.height / 2
                const distance = Math.abs(center - cardCenter)
                const maxDistance = viewportH * 0.55
                let intensity = 1 - distance / maxDistance
                intensity = Math.max(0, Math.min(1, intensity))
                intensity = Math.pow(intensity, 2.2)
                card.style.setProperty("--glow", intensity.toFixed(3))
            })
        }
        function onScroll() {
            requestAnimationFrame(updateGlow)
        }
        window.addEventListener("scroll", onScroll, { passive: true })
        window.addEventListener("resize", updateGlow)
        updateGlow()
        return () => {
            window.removeEventListener("scroll", onScroll)
            window.removeEventListener("resize", updateGlow)
        }
    }, [effects.pricingGlow])

    return (
        <div
            className={`ella-root ${widthClass}`.trim()}
            ref={rootRef}
            style={props.style}
        >
            {backgroundVideo.enabled && backgroundVideo.video && (
                <div className="bg-video-layer" aria-hidden="true">
                    <video
                        src={backgroundVideo.video}
                        poster={backgroundVideo.poster || undefined}
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{ opacity: backgroundVideo.opacity }}
                    />
                    <div
                        className="bg-video-overlay"
                        style={{ background: backgroundVideo.overlay }}
                    />
                </div>
            )}
            {shapes.enabled && (
                <BackgroundShapes options={shapes} accent={colors.accent} />
            )}
            <Header
                logo={logo}
                ctaText={props.ctaText ?? "Book Now"}
                ctaHref={props.ctaHref}
                navLinks={props.navLinks}
                showCta={sections.headerCta}
                bookingAttrs={ctaBookingAttrs}
            />
            <main>
                <Hero
                    data={props.hero || {}}
                    videoSettings={videoSettings}
                    showGlow={effects.heroGlow}
                    showScrollIndicator={effects.scrollIndicator}
                    bookingAttrs={ctaBookingAttrs}
                />
                {sections.services && (
                    <Services
                        eyebrow={props.servicesSection?.eyebrow}
                        heading={props.servicesSection?.heading}
                        items={props.servicesSection?.items}
                        videoSettings={videoSettings}
                    />
                )}
                {sections.gallery && (
                    <Gallery
                        eyebrow={props.gallerySection?.eyebrow}
                        heading={props.gallerySection?.heading}
                        images={props.gallerySection?.images}
                        videoSettings={videoSettings}
                    />
                )}
                {sections.video && (
                    <VideoShowcase
                        data={props.videoSection || {}}
                        videoSettings={videoSettings}
                    />
                )}
                {sections.pricing && <Pricing data={props.pricingSection || {}} />}
                {sections.about && (
                    <About
                        data={props.aboutSection || {}}
                        videoSettings={videoSettings}
                    />
                )}
                {sections.contact && (
                    <Contact
                        data={props.contact || {}}
                        booking={booking}
                        cal={cal}
                    />
                )}
            </main>
            {sections.footer && (
                <Footer
                    text={
                        props.footerText ??
                        "Ella V. Hair Salon. All rights reserved."
                    }
                    showYear={props.footerShowYear !== false}
                />
            )}
        </div>
    )
}

/* ------------------------------------------------------------------ */
/* Property controls – vše nastavitelné v panelu Frameru               */
/* ------------------------------------------------------------------ */

const VIDEO_FILE_TYPES = ["mp4", "webm", "ogv", "mov", "m4v"]

const videoControl = (title = "Video") => ({
    type: ControlType.File,
    title,
    allowedFileTypes: VIDEO_FILE_TYPES,
})

addPropertyControls(EllaHairSalonPage, {
    /* ---------------- BARVY ---------------- */
    colors: {
        type: ControlType.Object,
        title: "🎨 Colors",
        controls: {
            background: {
                type: ControlType.Color,
                title: "Background",
                defaultValue: DEFAULTS.colors.background,
            },
            backgroundSoft: {
                type: ControlType.Color,
                title: "Background 2",
                defaultValue: DEFAULTS.colors.backgroundSoft,
            },
            cardBackground: {
                type: ControlType.Color,
                title: "Cards",
                defaultValue: DEFAULTS.colors.cardBackground,
            },
            accent: {
                type: ControlType.Color,
                title: "Accent",
                defaultValue: DEFAULTS.colors.accent,
            },
            accentSoft: {
                type: ControlType.Color,
                title: "Accent light",
                defaultValue: DEFAULTS.colors.accentSoft,
            },
            text: {
                type: ControlType.Color,
                title: "Text",
                defaultValue: DEFAULTS.colors.text,
            },
            headingColor: {
                type: ControlType.Color,
                title: "Headings",
                defaultValue: DEFAULTS.colors.headingColor,
            },
            textMuted: {
                type: ControlType.Color,
                title: "Muted text",
                defaultValue: DEFAULTS.colors.textMuted,
            },
            border: {
                type: ControlType.Color,
                title: "Borders",
                defaultValue: DEFAULTS.colors.border,
            },
            headerBackground: {
                type: ControlType.Color,
                title: "Header",
                defaultValue: DEFAULTS.colors.headerBackground,
            },
            mobileMenuBackground: {
                type: ControlType.Color,
                title: "Mobile menu",
                defaultValue: DEFAULTS.colors.mobileMenuBackground,
            },
            buttonUseAccent: {
                type: ControlType.Boolean,
                title: "Buttons use accent",
                defaultValue: DEFAULTS.colors.buttonUseAccent,
            },
            buttonBackground: {
                type: ControlType.Color,
                title: "Button",
                defaultValue: DEFAULTS.colors.buttonBackground,
                hidden: (p) => p.buttonUseAccent !== false,
            },
            buttonBackgroundHover: {
                type: ControlType.Color,
                title: "Button hover",
                defaultValue: DEFAULTS.colors.buttonBackgroundHover,
                hidden: (p) => p.buttonUseAccent !== false,
            },
            buttonText: {
                type: ControlType.Color,
                title: "Button text",
                defaultValue: DEFAULTS.colors.buttonText,
            },
            buttonOutlineText: {
                type: ControlType.Color,
                title: "Outline text",
                defaultValue: DEFAULTS.colors.buttonOutlineText,
            },
            buttonOutlineBorder: {
                type: ControlType.Color,
                title: "Outline border",
                defaultValue: DEFAULTS.colors.buttonOutlineBorder,
            },
            inputBackground: {
                type: ControlType.Color,
                title: "Input background",
                defaultValue: DEFAULTS.colors.inputBackground,
            },
            inputBorder: {
                type: ControlType.Color,
                title: "Input border",
                defaultValue: DEFAULTS.colors.inputBorder,
            },
            inputText: {
                type: ControlType.Color,
                title: "Input text",
                defaultValue: DEFAULTS.colors.inputText,
            },
            footerBackground: {
                type: ControlType.Color,
                title: "Footer",
                defaultValue: DEFAULTS.colors.footerBackground,
            },
            successColor: {
                type: ControlType.Color,
                title: "Success",
                defaultValue: DEFAULTS.colors.successColor,
            },
            errorColor: {
                type: ControlType.Color,
                title: "Error",
                defaultValue: DEFAULTS.colors.errorColor,
            },
        },
    },

    /* ---------------- POLETUJÍCÍ OBRAZCE ---------------- */
    shapes: {
        type: ControlType.Object,
        title: "✨ Floating shapes",
        controls: {
            enabled: {
                type: ControlType.Boolean,
                title: "Enable",
                defaultValue: DEFAULTS.shapes.enabled,
            },
            scissors: {
                type: ControlType.Boolean,
                title: "Scissors",
                defaultValue: true,
                hidden: (p) => !p.enabled,
            },
            comb: {
                type: ControlType.Boolean,
                title: "Comb",
                defaultValue: true,
                hidden: (p) => !p.enabled,
            },
            wave: {
                type: ControlType.Boolean,
                title: "Wave",
                defaultValue: true,
                hidden: (p) => !p.enabled,
            },
            heart: {
                type: ControlType.Boolean,
                title: "Heart",
                defaultValue: false,
                hidden: (p) => !p.enabled,
            },
            star: {
                type: ControlType.Boolean,
                title: "Star",
                defaultValue: false,
                hidden: (p) => !p.enabled,
            },
            sparkle: {
                type: ControlType.Boolean,
                title: "Sparkle",
                defaultValue: false,
                hidden: (p) => !p.enabled,
            },
            dot: {
                type: ControlType.Boolean,
                title: "Dot",
                defaultValue: false,
                hidden: (p) => !p.enabled,
            },
            ring: {
                type: ControlType.Boolean,
                title: "Ring",
                defaultValue: false,
                hidden: (p) => !p.enabled,
            },
            bubble: {
                type: ControlType.Boolean,
                title: "Bubble",
                defaultValue: false,
                hidden: (p) => !p.enabled,
            },
            useAccentColor: {
                type: ControlType.Boolean,
                title: "Use accent color",
                defaultValue: true,
                hidden: (p) => !p.enabled,
            },
            color: {
                type: ControlType.Color,
                title: "Custom color",
                defaultValue: DEFAULTS.shapes.color,
                hidden: (p) => !p.enabled || p.useAccentColor,
            },
            count: {
                type: ControlType.Number,
                title: "Count",
                min: 0,
                max: 90,
                step: 1,
                defaultValue: DEFAULTS.shapes.count,
                hidden: (p) => !p.enabled,
            },
            size: {
                type: ControlType.Number,
                title: "Size",
                min: 8,
                max: 90,
                step: 1,
                defaultValue: DEFAULTS.shapes.size,
                hidden: (p) => !p.enabled,
            },
            strokeWidth: {
                type: ControlType.Number,
                title: "Stroke width",
                min: 0.3,
                max: 4,
                step: 0.1,
                defaultValue: DEFAULTS.shapes.strokeWidth,
                hidden: (p) => !p.enabled,
            },
            speed: {
                type: ControlType.Number,
                title: "Speed",
                min: 0,
                max: 3,
                step: 0.02,
                defaultValue: DEFAULTS.shapes.speed,
                hidden: (p) => !p.enabled,
            },
            opacity: {
                type: ControlType.Number,
                title: "Opacity",
                min: 0.05,
                max: 1,
                step: 0.05,
                defaultValue: DEFAULTS.shapes.opacity,
                hidden: (p) => !p.enabled,
            },
            rotation: {
                type: ControlType.Boolean,
                title: "Rotation",
                defaultValue: true,
                hidden: (p) => !p.enabled,
            },
            interactive: {
                type: ControlType.Boolean,
                title: "React to mouse",
                defaultValue: true,
                hidden: (p) => !p.enabled,
            },
            mouseRadius: {
                type: ControlType.Number,
                title: "Mouse radius",
                min: 20,
                max: 400,
                step: 10,
                defaultValue: DEFAULTS.shapes.mouseRadius,
                hidden: (p) => !p.enabled || !p.interactive,
            },
        },
    },

    /* ---------------- KURZOR ---------------- */
    cursor: {
        type: ControlType.Object,
        title: "🖱️ Cursor",
        controls: {
            mode: {
                type: ControlType.Enum,
                title: "Mode",
                options: ["Default", "Shape", "Image"],
                optionTitles: ["System", "Shape", "Custom image"],
                displaySegmentedControl: true,
                defaultValue: DEFAULTS.cursor.mode,
            },
            shape: {
                type: ControlType.Enum,
                title: "Shape",
                options: [
                    "Original",
                    "Arrow",
                    "Dot",
                    "Ring",
                    "Scissors",
                    "Comb",
                    "Heart",
                    "Sparkle",
                    "Drop",
                ],
                optionTitles: [
                    "Original",
                    "Arrow",
                    "Dot",
                    "Ring",
                    "Scissors",
                    "Comb",
                    "Heart",
                    "Sparkle",
                    "Drop",
                ],
                defaultValue: DEFAULTS.cursor.shape,
                hidden: (p) => p.mode !== "Shape",
            },
            useAccentColor: {
                type: ControlType.Boolean,
                title: "Use accent color",
                defaultValue: DEFAULTS.cursor.useAccentColor,
                hidden: (p) => p.mode !== "Shape",
            },
            fill: {
                type: ControlType.Color,
                title: "Color",
                defaultValue: DEFAULTS.cursor.fill,
                hidden: (p) => p.mode !== "Shape" || p.useAccentColor !== false,
            },
            stroke: {
                type: ControlType.Color,
                title: "Outline",
                defaultValue: DEFAULTS.cursor.stroke,
                hidden: (p) => p.mode !== "Shape",
            },
            strokeWidth: {
                type: ControlType.Number,
                title: "Outline width",
                min: 0,
                max: 4,
                step: 0.1,
                defaultValue: DEFAULTS.cursor.strokeWidth,
                hidden: (p) => p.mode !== "Shape",
            },
            size: {
                type: ControlType.Number,
                title: "Size",
                min: 12,
                max: 64,
                step: 1,
                defaultValue: DEFAULTS.cursor.size,
                hidden: (p) => p.mode === "Default",
            },
            hotspotX: {
                type: ControlType.Number,
                title: "Hotspot X",
                min: 0,
                max: 24,
                step: 1,
                defaultValue: DEFAULTS.cursor.hotspotX,
                hidden: (p) => p.mode === "Default",
            },
            hotspotY: {
                type: ControlType.Number,
                title: "Hotspot Y",
                min: 0,
                max: 24,
                step: 1,
                defaultValue: DEFAULTS.cursor.hotspotY,
                hidden: (p) => p.mode === "Default",
            },
            image: {
                type: ControlType.Image,
                title: "Cursor image",
                hidden: (p) => p.mode !== "Image",
            },
            separateHover: {
                type: ControlType.Boolean,
                title: "Different on links",
                defaultValue: DEFAULTS.cursor.separateHover,
                hidden: (p) => p.mode !== "Shape",
            },
            hoverShape: {
                type: ControlType.Enum,
                title: "Hover shape",
                options: [
                    "Dot",
                    "Ring",
                    "Sparkle",
                    "Heart",
                    "Scissors",
                    "Arrow",
                ],
                optionTitles: [
                    "Dot",
                    "Ring",
                    "Sparkle",
                    "Heart",
                    "Scissors",
                    "Arrow",
                ],
                defaultValue: DEFAULTS.cursor.hoverShape,
                hidden: (p) => p.mode !== "Shape" || !p.separateHover,
            },
            hoverFill: {
                type: ControlType.Color,
                title: "Hover color",
                defaultValue: DEFAULTS.cursor.hoverFill,
                hidden: (p) =>
                    p.mode !== "Shape" ||
                    !p.separateHover ||
                    p.useAccentColor !== false,
            },
        },
    },

    /* ---------------- BOOKING (Cal.com) ---------------- */
    booking: {
        type: ControlType.Object,
        title: "📅 Booking",
        controls: {
            mode: {
                type: ControlType.Enum,
                title: "Mode",
                options: ["form", "inline", "popup", "both"],
                optionTitles: [
                    "Contact form",
                    "Cal.com calendar",
                    "Cal.com button",
                    "Form + Cal.com button",
                ],
                defaultValue: DEFAULTS.booking.mode,
            },
            calLink: {
                type: ControlType.String,
                title: "Cal.com link",
                defaultValue: DEFAULTS.booking.calLink,
                placeholder: "username/haircut",
                hidden: (p) => p.mode === "form",
            },
            buttonText: {
                type: ControlType.String,
                title: "Button text",
                defaultValue: DEFAULTS.booking.buttonText,
                hidden: (p) => p.mode !== "popup" && p.mode !== "both",
            },
            note: {
                type: ControlType.String,
                title: "Button note",
                displayTextArea: true,
                defaultValue: DEFAULTS.booking.note,
                hidden: (p) => p.mode !== "popup" && p.mode !== "both",
            },
            ctaOpensBooking: {
                type: ControlType.Boolean,
                title: "CTA opens booking",
                defaultValue: DEFAULTS.booking.ctaOpensBooking,
                hidden: (p) => p.mode !== "popup" && p.mode !== "both",
            },
            layout: {
                type: ControlType.Enum,
                title: "Layout",
                options: ["month_view", "week_view", "column_view"],
                optionTitles: ["Month", "Week", "Column"],
                defaultValue: DEFAULTS.booking.layout,
                hidden: (p) => p.mode === "form",
            },
            theme: {
                type: ControlType.Enum,
                title: "Calendar theme",
                options: ["auto", "dark", "light"],
                optionTitles: ["Auto", "Dark", "Light"],
                displaySegmentedControl: true,
                defaultValue: DEFAULTS.booking.theme,
                hidden: (p) => p.mode === "form",
            },
            useAccentColor: {
                type: ControlType.Boolean,
                title: "Brand = accent",
                defaultValue: DEFAULTS.booking.useAccentColor,
                hidden: (p) => p.mode === "form",
            },
            brandColor: {
                type: ControlType.Color,
                title: "Brand color",
                defaultValue: DEFAULTS.booking.brandColor,
                hidden: (p) => p.mode === "form" || p.useAccentColor !== false,
            },
            height: {
                type: ControlType.Number,
                title: "Calendar height",
                min: 320,
                max: 1200,
                step: 20,
                defaultValue: DEFAULTS.booking.height,
                hidden: (p) => p.mode !== "inline",
            },
            fullWidth: {
                type: ControlType.Boolean,
                title: "Full width calendar",
                defaultValue: DEFAULTS.booking.fullWidth,
                hidden: (p) => p.mode !== "inline",
            },
            hideEventTypeDetails: {
                type: ControlType.Boolean,
                title: "Hide event details",
                defaultValue: DEFAULTS.booking.hideEventTypeDetails,
                hidden: (p) => p.mode === "form",
            },
            origin: {
                type: ControlType.String,
                title: "Cal.com origin",
                defaultValue: DEFAULTS.booking.origin,
                placeholder: "https://cal.com",
                hidden: (p) => p.mode === "form",
            },
            embedJsUrl: {
                type: ControlType.String,
                title: "Embed script URL",
                defaultValue: DEFAULTS.booking.embedJsUrl,
                placeholder: "https://app.cal.com/embed/embed.js",
                hidden: (p) => p.mode === "form",
            },
        },
    },

    /* ---------------- LOGO ---------------- */
    logo: {
        type: ControlType.Object,
        title: "🏷️ Logo",
        controls: {
            image: { type: ControlType.Image, title: "Logo image" },
            text: {
                type: ControlType.String,
                title: "Text",
                defaultValue: DEFAULTS.logo.text,
            },
            accent: {
                type: ControlType.String,
                title: "Text (accent)",
                defaultValue: DEFAULTS.logo.accent,
            },
            href: {
                type: ControlType.String,
                title: "Link",
                defaultValue: DEFAULTS.logo.href,
            },
        },
    },

    /* ---------------- SEKCE ZAP/VYP ---------------- */
    sections: {
        type: ControlType.Object,
        title: "🧩 Sections",
        controls: {
            headerCta: {
                type: ControlType.Boolean,
                title: "Button in menu",
                defaultValue: true,
            },
            services: {
                type: ControlType.Boolean,
                title: "Services",
                defaultValue: true,
            },
            gallery: {
                type: ControlType.Boolean,
                title: "Gallery",
                defaultValue: true,
            },
            video: {
                type: ControlType.Boolean,
                title: "Video section",
                defaultValue: false,
            },
            pricing: {
                type: ControlType.Boolean,
                title: "Pricing",
                defaultValue: true,
            },
            about: {
                type: ControlType.Boolean,
                title: "About",
                defaultValue: true,
            },
            contact: {
                type: ControlType.Boolean,
                title: "Contact",
                defaultValue: true,
            },
            footer: {
                type: ControlType.Boolean,
                title: "Footer",
                defaultValue: true,
            },
        },
    },

    /* ---------------- VIDEO NA POZADÍ ---------------- */
    backgroundVideo: {
        type: ControlType.Object,
        title: "🎬 Background video",
        controls: {
            enabled: {
                type: ControlType.Boolean,
                title: "Enable",
                defaultValue: false,
            },
            video: {
                ...videoControl("Video soubor"),
                hidden: (p) => !p.enabled,
            },
            poster: {
                type: ControlType.Image,
                title: "Poster",
                hidden: (p) => !p.enabled,
            },
            opacity: {
                type: ControlType.Number,
                title: "Opacity",
                min: 0,
                max: 1,
                step: 0.05,
                defaultValue: DEFAULTS.backgroundVideo.opacity,
                hidden: (p) => !p.enabled,
            },
            overlay: {
                type: ControlType.Color,
                title: "Overlay",
                defaultValue: DEFAULTS.backgroundVideo.overlay,
                hidden: (p) => !p.enabled,
            },
        },
    },

    /* ---------------- CHOVÁNÍ VIDEÍ ---------------- */
    videoSettings: {
        type: ControlType.Object,
        title: "▶️ Video behaviour",
        controls: {
            autoplay: {
                type: ControlType.Boolean,
                title: "Autoplay",
                defaultValue: true,
            },
            loop: {
                type: ControlType.Boolean,
                title: "Loop",
                defaultValue: true,
            },
            muted: {
                type: ControlType.Boolean,
                title: "Muted",
                defaultValue: true,
            },
            controls: {
                type: ControlType.Boolean,
                title: "Controls",
                defaultValue: false,
            },
        },
    },

    /* ---------------- VZHLED / TYPOGRAFIE ---------------- */
    style: {
        type: ControlType.Object,
        title: "🖋️ Appearance",
        controls: {
            fontFamily: {
                type: ControlType.String,
                title: "Font",
                defaultValue: DEFAULTS.style.fontFamily,
            },
            headingFontFamily: {
                type: ControlType.String,
                title: "Heading font",
                defaultValue: DEFAULTS.style.headingFontFamily,
            },
            baseSize: {
                type: ControlType.Number,
                title: "Text size",
                min: 12,
                max: 22,
                step: 1,
                defaultValue: DEFAULTS.style.baseSize,
            },
            lineHeight: {
                type: ControlType.Number,
                title: "Line height",
                min: 1.2,
                max: 2.2,
                step: 0.05,
                defaultValue: DEFAULTS.style.lineHeight,
            },
            heroTitleSize: {
                type: ControlType.Number,
                title: "Hero title (rem)",
                min: 2,
                max: 6,
                step: 0.1,
                defaultValue: DEFAULTS.style.heroTitleSize,
            },
            headingSize: {
                type: ControlType.Number,
                title: "Headings (rem)",
                min: 1.4,
                max: 5,
                step: 0.1,
                defaultValue: DEFAULTS.style.headingSize,
            },
            radius: {
                type: ControlType.Number,
                title: "Media radius",
                min: 0,
                max: 48,
                step: 1,
                defaultValue: DEFAULTS.style.radius,
            },
            cardRadius: {
                type: ControlType.Number,
                title: "Card radius",
                min: 0,
                max: 48,
                step: 1,
                defaultValue: DEFAULTS.style.cardRadius,
            },
            buttonRadius: {
                type: ControlType.Number,
                title: "Button radius",
                min: 0,
                max: 40,
                step: 1,
                defaultValue: DEFAULTS.style.buttonRadius,
            },
            contentWidth: {
                type: ControlType.Number,
                title: "Content width",
                min: 800,
                max: 1800,
                step: 10,
                defaultValue: DEFAULTS.style.contentWidth,
            },
            sectionPadding: {
                type: ControlType.Number,
                title: "Section spacing",
                min: 20,
                max: 200,
                step: 5,
                defaultValue: DEFAULTS.style.sectionPadding,
            },
            headerHeight: {
                type: ControlType.Number,
                title: "Header height",
                min: 56,
                max: 140,
                step: 2,
                defaultValue: DEFAULTS.style.headerHeight,
            },
            logoHeight: {
                type: ControlType.Number,
                title: "Logo height",
                min: 16,
                max: 120,
                step: 1,
                defaultValue: DEFAULTS.style.logoHeight,
            },
            heroMinHeight: {
                type: ControlType.Number,
                title: "Hero height (vh)",
                min: 50,
                max: 100,
                step: 1,
                defaultValue: DEFAULTS.style.heroMinHeight,
            },
            heroMediaHeight: {
                type: ControlType.Number,
                title: "Hero media (px)",
                min: 200,
                max: 900,
                step: 10,
                defaultValue: DEFAULTS.style.heroMediaHeight,
            },
            cardMediaHeight: {
                type: ControlType.Number,
                title: "Card media (px)",
                min: 100,
                max: 500,
                step: 10,
                defaultValue: DEFAULTS.style.cardMediaHeight,
            },
            galleryMediaHeight: {
                type: ControlType.Number,
                title: "Gallery media (px)",
                min: 120,
                max: 600,
                step: 10,
                defaultValue: DEFAULTS.style.galleryMediaHeight,
            },
            aboutMediaHeight: {
                type: ControlType.Number,
                title: "About media (px)",
                min: 200,
                max: 800,
                step: 10,
                defaultValue: DEFAULTS.style.aboutMediaHeight,
            },
            showcaseVideoHeight: {
                type: ControlType.Number,
                title: "Video section (px)",
                min: 200,
                max: 900,
                step: 10,
                defaultValue: DEFAULTS.style.showcaseVideoHeight,
            },
            servicesColumns: {
                type: ControlType.Number,
                title: "Service columns",
                min: 1,
                max: 6,
                step: 1,
                displayStepper: true,
                defaultValue: DEFAULTS.style.servicesColumns,
            },
            galleryColumns: {
                type: ControlType.Number,
                title: "Gallery columns",
                min: 1,
                max: 6,
                step: 1,
                displayStepper: true,
                defaultValue: DEFAULTS.style.galleryColumns,
            },
            transition: {
                type: ControlType.Number,
                title: "Animation speed",
                min: 0,
                max: 1.2,
                step: 0.05,
                defaultValue: DEFAULTS.style.transition,
            },
            bulletIcon: {
                type: ControlType.String,
                title: "Bullet icon",
                defaultValue: DEFAULTS.style.bulletIcon,
            },
        },
    },

    /* ---------------- EFEKTY ---------------- */
    effects: {
        type: ControlType.Object,
        title: "💫 Effects",
        controls: {
            headerBlur: {
                type: ControlType.Boolean,
                title: "Blurred header",
                defaultValue: DEFAULTS.effects.headerBlur,
            },
            heroGlow: {
                type: ControlType.Boolean,
                title: "Hero glow",
                defaultValue: DEFAULTS.effects.heroGlow,
            },
            hoverLift: {
                type: ControlType.Boolean,
                title: "Card hover lift",
                defaultValue: DEFAULTS.effects.hoverLift,
            },
            pricingGlow: {
                type: ControlType.Boolean,
                title: "Pricing glow",
                defaultValue: DEFAULTS.effects.pricingGlow,
            },
            scrollIndicator: {
                type: ControlType.Boolean,
                title: "Scroll indicator",
                defaultValue: DEFAULTS.effects.scrollIndicator,
            },
        },
    },

    /* ---------------- MENU ---------------- */
    ctaText: {
        type: ControlType.String,
        title: "CTA text",
        defaultValue: "Book Now",
    },
    ctaHref: {
        type: ControlType.String,
        title: "CTA link",
        defaultValue: "#contact",
    },
    navLinks: {
        type: ControlType.Array,
        title: "Menu",
        control: {
            type: ControlType.Object,
            controls: {
                label: { type: ControlType.String, title: "Label" },
                href: { type: ControlType.String, title: "Link" },
            },
        },
        defaultValue: DEFAULT_NAV_LINKS,
    },

    /* ---------------- HERO ---------------- */
    hero: {
        type: ControlType.Object,
        title: "Hero",
        controls: {
            eyebrow: {
                type: ControlType.String,
                defaultValue: "Premium hair salon in Prague",
            },
            titleBefore: {
                type: ControlType.String,
                defaultValue: "A style that",
            },
            titleAccent: {
                type: ControlType.String,
                defaultValue: "stands out",
            },
            titleAfter: {
                type: ControlType.String,
                defaultValue: "Care that shows.",
            },
            description: {
                type: ControlType.String,
                displayTextArea: true,
                defaultValue:
                    "Modern haircuts, coloring and hair care by experienced stylists. We create a look that suits you perfectly – from classic to the latest trends.",
            },
            ctaPrimary: {
                type: ControlType.String,
                title: "CTA 1",
                defaultValue: "Book Now",
            },
            ctaPrimaryHref: {
                type: ControlType.String,
                title: "CTA 1 link",
                defaultValue: "#contact",
            },
            ctaSecondary: {
                type: ControlType.String,
                title: "CTA 2",
                defaultValue: "Our services",
            },
            ctaSecondaryHref: {
                type: ControlType.String,
                title: "CTA 2 link",
                defaultValue: "#services",
            },
            image: { type: ControlType.Image, title: "Image" },
            video: videoControl("Video (takes priority)"),
            videoPoster: { type: ControlType.Image, title: "Video poster" },
            imageAlt: {
                type: ControlType.String,
                title: "Alt text",
                defaultValue:
                    "Interior of a modern hair salon with pink mirrors",
            },
        },
    },

    /* ---------------- SLUŽBY ---------------- */
    servicesSection: {
        type: ControlType.Object,
        title: "Services",
        controls: {
            eyebrow: {
                type: ControlType.String,
                defaultValue: "What we offer",
            },
            heading: {
                type: ControlType.String,
                defaultValue: "Our services",
            },
            items: {
                type: ControlType.Array,
                title: "Cards",
                control: {
                    type: ControlType.Object,
                    controls: {
                        title: { type: ControlType.String, title: "Label" },
                        desc: {
                            type: ControlType.String,
                            title: "Description",
                            displayTextArea: true,
                        },
                        image: { type: ControlType.Image, title: "Image" },
                        video: videoControl("Video"),
                        videoPoster: {
                            type: ControlType.Image,
                            title: "Video poster",
                        },
                    },
                },
                defaultValue: [
                    {
                        title: "Haircuts",
                        desc: "Women's, men's and children's haircuts following the latest trends and classics.",
                    },
                    {
                        title: "Coloring",
                        desc: "Balayage, ombré, highlights and full color – always with hair health in mind.",
                    },
                    {
                        title: "Hair care",
                        desc: "Regenerative treatments and keratin therapy for healthy, shiny hair.",
                    },
                    {
                        title: "Wedding hairstyles",
                        desc: "Professional styling for your most beautiful day, including a hairstyle trial.",
                    },
                ],
            },
        },
    },

    /* ---------------- GALERIE ---------------- */
    gallerySection: {
        type: ControlType.Object,
        title: "Gallery",
        controls: {
            eyebrow: { type: ControlType.String, defaultValue: "Inspiration" },
            heading: {
                type: ControlType.String,
                defaultValue: "Gallery of work",
            },
            images: {
                type: ControlType.Array,
                title: "Items",
                control: {
                    type: ControlType.Object,
                    controls: {
                        src: { type: ControlType.Image, title: "Image" },
                        video: videoControl("Video"),
                        videoPoster: {
                            type: ControlType.Image,
                            title: "Video poster",
                        },
                        alt: { type: ControlType.String, title: "Alt text" },
                    },
                },
                defaultValue: [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
                    alt: `Work sample – styling ${n}`,
                })),
            },
        },
    },

    /* ---------------- VIDEO SEKCE ---------------- */
    videoSection: {
        type: ControlType.Object,
        title: "Video section",
        controls: {
            eyebrow: { type: ControlType.String, defaultValue: "Watch" },
            heading: {
                type: ControlType.String,
                defaultValue: "Take a look inside our salon",
            },
            description: {
                type: ControlType.String,
                displayTextArea: true,
                defaultValue:
                    "A short video tour of the studio, our team and the atmosphere we create for every client.",
            },
            video: videoControl("Video"),
            poster: { type: ControlType.Image, title: "Poster" },
            autoplay: {
                type: ControlType.Boolean,
                title: "Autoplay",
                defaultValue: true,
            },
            loop: {
                type: ControlType.Boolean,
                title: "Loop",
                defaultValue: true,
            },
            controls: {
                type: ControlType.Boolean,
                title: "Controls",
                defaultValue: true,
            },
        },
    },

    /* ---------------- CENÍK ---------------- */
    pricingSection: {
        type: ControlType.Object,
        title: "Pricing",
        controls: {
            eyebrow: { type: ControlType.String, defaultValue: "Pricing" },
            heading: {
                type: ControlType.String,
                defaultValue: "Service price list",
            },
            note: {
                type: ControlType.String,
                displayTextArea: true,
                defaultValue:
                    "The exact price depends on hair length and thickness. We'll gladly confirm the final price during a consultation.",
            },
            womenBadge: {
                type: ControlType.String,
                title: "Women – badge",
                defaultValue: "Most popular",
            },
            womenTitle: {
                type: ControlType.String,
                title: "Women – title",
                defaultValue: "Women's services",
            },
            womenItems: {
                type: ControlType.Array,
                title: "Women – items",
                control: {
                    type: ControlType.Object,
                    controls: {
                        name: { type: ControlType.String, title: "Service" },
                        price: { type: ControlType.String, title: "Price" },
                    },
                },
                defaultValue: DEFAULT_PRICING_ITEMS.women,
            },
            menBadge: {
                type: ControlType.String,
                title: "Men – badge",
                defaultValue: "Quick appointments",
            },
            menTitle: {
                type: ControlType.String,
                title: "Men – title",
                defaultValue: "Men's services",
            },
            menItems: {
                type: ControlType.Array,
                title: "Men – items",
                control: {
                    type: ControlType.Object,
                    controls: {
                        name: { type: ControlType.String, title: "Service" },
                        price: { type: ControlType.String, title: "Price" },
                    },
                },
                defaultValue: DEFAULT_PRICING_ITEMS.men,
            },
            specialBadge: {
                type: ControlType.String,
                title: "Special – badge",
                defaultValue: "By appointment",
            },
            specialTitle: {
                type: ControlType.String,
                title: "Special – title",
                defaultValue: "Special services",
            },
            specialItems: {
                type: ControlType.Array,
                title: "Special – items",
                control: {
                    type: ControlType.Object,
                    controls: {
                        name: { type: ControlType.String, title: "Service" },
                        price: { type: ControlType.String, title: "Price" },
                    },
                },
                defaultValue: DEFAULT_PRICING_ITEMS.special,
            },
        },
    },

    /* ---------------- O NÁS ---------------- */
    aboutSection: {
        type: ControlType.Object,
        title: "About",
        controls: {
            eyebrow: { type: ControlType.String, defaultValue: "About" },
            heading: {
                type: ControlType.String,
                defaultValue: "Your hair salon in the heart of Prague",
            },
            description: {
                type: ControlType.String,
                displayTextArea: true,
                defaultValue:
                    "For more than 10 years we've been creating hairstyles that make our clients feel great. Our team of certified stylists follows the latest trends and uses only premium products.",
            },
            points: {
                type: ControlType.Array,
                title: "Bullet points",
                control: {
                    type: ControlType.Object,
                    controls: {
                        text: { type: ControlType.String, title: "Text" },
                    },
                },
                defaultValue: [
                    { text: "Individual consultation before every treatment" },
                    { text: "Premium professional products" },
                    { text: "Calm and pleasant atmosphere" },
                    { text: "Flexible online booking" },
                ],
            },
            image: { type: ControlType.Image, title: "Image" },
            video: videoControl("Video (takes priority)"),
            videoPoster: { type: ControlType.Image, title: "Video poster" },
            imageAlt: {
                type: ControlType.String,
                title: "Alt text",
                defaultValue: "Hair salon interior",
            },
        },
    },

    /* ---------------- KONTAKT ---------------- */
    contact: {
        type: ControlType.Object,
        title: "Contact",
        controls: {
            eyebrow: { type: ControlType.String, defaultValue: "Contact" },
            heading: {
                type: ControlType.String,
                defaultValue: "Book your appointment today",
            },
            description: {
                type: ControlType.String,
                displayTextArea: true,
                defaultValue:
                    "We're happy to help you find a new style. Call, write or fill out the form and we'll get back to you.",
            },
            addressLabel: {
                type: ControlType.String,
                title: "Address label",
                defaultValue: "Address:",
            },
            address: {
                type: ControlType.String,
                defaultValue: "Wenceslas Square 12, Prague 1",
            },
            phoneLabel: {
                type: ControlType.String,
                title: "Phone label",
                defaultValue: "Phone:",
            },
            phone: {
                type: ControlType.String,
                defaultValue: "+420 777 123 456",
            },
            hoursLabel: {
                type: ControlType.String,
                title: "Hours label",
                defaultValue: "Open:",
            },
            hours: {
                type: ControlType.String,
                defaultValue: "Mon–Sat 9:00–19:00",
            },
            namePlaceholder: {
                type: ControlType.String,
                title: "Name placeholder",
                defaultValue: "Your name",
            },
            emailPlaceholder: {
                type: ControlType.String,
                title: "Email placeholder",
                defaultValue: "Your email",
            },
            phonePlaceholder: {
                type: ControlType.String,
                title: "Phone placeholder",
                defaultValue: "Phone",
            },
            messagePlaceholder: {
                type: ControlType.String,
                title: "Message placeholder",
                defaultValue: "Your message",
            },
            submitText: {
                type: ControlType.String,
                title: "Button text",
                defaultValue: "Send message",
            },
            sendingText: {
                type: ControlType.String,
                title: "Sending text",
                defaultValue: "Sending...",
            },
            formspreeEndpoint: {
                type: ControlType.String,
                title: "Formspree endpoint",
                defaultValue: "",
                placeholder: "https://formspree.io/f/xxxxabcd",
            },
            emailSubject: {
                type: ControlType.String,
                title: "Email subject",
                defaultValue: "New booking request",
            },
            successMessage: {
                type: ControlType.String,
                title: "Success message",
                defaultValue: "Thank you. Your request has been sent.",
            },
            errorMessage: {
                type: ControlType.String,
                title: "Error message",
                defaultValue:
                    "Sorry, something went wrong. Please try again.",
            },
        },
    },

    /* ---------------- PATIČKA ---------------- */
    footerText: {
        type: ControlType.String,
        title: "Footer",
        defaultValue: "Ella V. Hair Salon. All rights reserved.",
    },
    footerShowYear: {
        type: ControlType.Boolean,
        title: "Show year",
        defaultValue: true,
    },
})
