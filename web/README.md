# Ella Hair Salon – HTML verze

`index.html` je celý web v jednom souboru – žádný build, žádné závislosti.
Otevřeš ho dvojklikem, nahraješ na jakýkoli hosting (FTP, Netlify, Vercel,
GitHub Pages) a funguje.

Design i chování jsou stejné jako u Framer komponenty (`framer/EllaFramer.tsx`) –
generátor stylů, barevná témata i logika kalendáře jsou z ní převzaté.

## Co se kde nastavuje

Úplně nahoře ve `<script>` je blok `SITE` – to je obdoba pravého panelu ve Frameru:

```js
const SITE = {
    theme: "noir",        // noir | midnight | emerald | gold | violet | coral | mono | daylight | custom
    colors: {},           // vlastní barvy, když theme = "custom" (např. { accent: "#ff3d81" })
    style: {},            // fonty, zaoblení, mezery, výšky médií
    effects: {},          // headerBlur, heroGlow, hoverLift, pricingGlow, scrollIndicator
    shapes: {},           // poletující obrazce – { enabled: false } je vypne
    cursor: {},           // { mode: "Default" } vypne vlastní kurzor
    booking: { mode: "form", calLink: "" },
    form: { formspreeEndpoint: "" },
}
```

Všechny výchozí hodnoty jsou v objektu `DEFAULTS` níž ve stejném souboru –
stačí přepsat jen to, co chceš změnit.

### Rezervace
- `mode: "form"` – kontaktní formulář (odesílá se přes Formspree)
- `mode: "inline"` – kalendář Cal.com přímo ve stránce
- `mode: "popup"` – tlačítko, které otevře rezervaci v popupu
- `mode: "both"` – formulář i tlačítko

`booking.locale` nastaví jazyk kalendáře (`"en"`, `"cs"`, … nebo `"auto"`).

Do `calLink` patří `uzivatel/udalost` nebo rovnou celá adresa
`https://cal.com/uzivatel/udalost`. Skript Cal.com se načítá jen tehdy,
když je rezervace zapnutá a odkaz vyplněný.

### Mapa
`map.enabled: true` zapne Google mapu v kontaktu. `source: "address"` ji poskládá
z adresy (`address`, nebo prázdné = adresa z kontaktu) – bez API klíče;
`source: "embed"` použije odkaz z Google Maps → Sdílet → Vložit mapu.
Dál `placement` (`"contact"` / `"full"`), `height`, `showDirections` a barvy:
`style` (`"auto"` = podle akcentu webu, `"brand"`, `"brandDark"`, `"gray"`,
`"original"`) a `tint` (0–1, síla obarvení).

### Formulář
Formulář posílá data na `form.formspreeEndpoint`
(zdarma na [formspree.io](https://formspree.io), tvar `https://formspree.io/f/xxxxxxxx`).
Bez vyplněného endpointu se místo odeslání zobrazí upozornění.

## Obrázky

Texty se mění přímo v HTML. Obrázky se odkazují do složky `assets/`:

```
web/assets/hero-salon.jpg
web/assets/service-1.jpg … service-4.jpg
web/assets/gallery-1.jpg … gallery-8.jpg
web/assets/about-salon.jpg
```

Dokud tam soubory nejsou, zůstanou na jejich místě tmavá pole – nic se nerozbije.
Místo obrázku můžeš v HTML použít `<video>` se stejnými třídami.
