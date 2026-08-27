# Ella Hair Salon – Framer code component

Soubor `EllaFramer.tsx` vlož ve Frameru do **Assets → Code → New Code File**
a přetáhni komponentu `EllaHairSalonPage` na stránku. Vše ostatní se nastavuje
v pravém panelu – v kódu už není potřeba nic přepisovat.

## Co se dá měnit

> Popisky v panelu Frameru jsou anglicky, návod je česky – názvy v `kódu`
> odpovídají přesně tomu, co uvidíš v pravém panelu.

### 🎨 Colors – téma na jedno kliknutí
Nahoře ve skupině `Colors` je `Theme` – přepnutí celého webu jedním kliknutím:

| Téma | Vzhled |
|---|---|
| **Custom colors** | tvoje vlastní barvy (výchozí – nic ti nepřepíše) |
| **Pink noir** | původní černo-růžová |
| **Midnight blue** | tmavě modrá |
| **Emerald** | tmavá se zelenou |
| **Gold luxe** | černo-zlatá |
| **Violet** | tmavě fialová |
| **Sunset coral** | tmavá s korálovou |
| **Graphite mono** | černobílá |
| **Daylight (light)** | světlá varianta webu |

Téma přebarví úplně všechno – pozadí, karty, texty, tlačítka, formulář, poletující
obrazce i kurzor (ty berou akcentní barvu automaticky). Když necháš `Custom colors`,
zůstávají všechny jednotlivé barvy k ručnímu nastavení jako dosud; po zvolení tématu
se pickery schovají, aby bylo jasné, že barvy řídí téma.

Kompletně všechny barvy webu: pozadí, druhé pozadí, karty, akcent, světlý akcent,
text, nadpisy, šedý text, rámečky, hlavička, mobilní menu, tlačítka (pozadí, hover,
text, outline), pole formuláře, patička, barva úspěchu a chyby.

Tlačítka mají zapnuté **„Buttons use accent“** – když změníš akcentní barvu, změní se
s ní i tlačítka, záře a rámečky. Vypni přepínač, pokud chceš tlačítkům dát vlastní barvu.

### 🎬 Videa
Video jde přidat všude, kde je obrázek – **video má vždy přednost před obrázkem**:

| Kde | Ovládání |
|---|---|
| Hero | `Hero → Video` + `Video poster` |
| Karty služeb | `Services → Cards → Video` (u každé karty zvlášť) |
| Galerie | `Gallery → Items → Video` (lze míchat obrázky a videa) |
| O nás | `About → Video` |
| Samostatná video sekce | `Sections → Video section` zapnout, pak `Video section → Video` |
| Video na pozadí celé stránky | `Background video → Enable` + `Opacity` a `Overlay` |

Chování všech videí (autoplay, smyčka, ztlumení, ovládací prvky) se nastaví jednou
v `Video behaviour`. Autoplay si vynutí ztlumení – jinak ho prohlížeče blokují.
Odkaz na video končící `.mp4` / `.webm` funguje i v poli pro obrázek.

### 🏷️ Logo
`Logo → Logo image` (nahraj PNG/SVG) nebo textové logo `Text` + `Text (accent)`.
Výšku loga nastavíš v `Appearance → Logo height`, cíl odkazu v `Logo → Link`.

### ✨ Floating shapes – poletující obrazce
`Floating shapes → Enable` je hlavní vypínač. Dál si vybereš tvary (nůžky, hřeben, vlna,
srdce, hvězda, jiskra, tečka, kroužek, bublina), počet, velikost, tloušťku čar,
rychlost, průhlednost, otáčení a jestli mají uhýbat myši včetně jejího dosahu.
Barva je ve výchozím stavu akcentní, dá se přepnout na vlastní.

### 🖱️ Cursor – kurzor
`Cursor → Mode`:
- **System** – žádný vlastní kurzor
- **Shape** – 9 tvarů (původní růžový, šipka, tečka, kroužek, nůžky, hřeben, srdce,
  jiskra, kapka) + barva, obrys, velikost a pozice špičky
- **Custom image** – nahraj si vlastní PNG/SVG kurzor

Volitelně jde nastavit **jiný kurzor nad odkazy a tlačítky**. Na dotykových
zařízeních se vlastní kurzor automaticky nepoužije.

### 📅 Booking – rezervace přes Cal.com
Nastavení je ve skupině **`Contact & booking`** – hned první pole `📅 Booking`
(tam, kde je i Formspree). `📅 Booking` určuje, co je dole v sekci Kontakt:

| Režim | Co se zobrazí |
|---|---|
| **Contact form** | jen kontaktní formulář (výchozí, posílá se přes Formspree) |
| **Cal.com calendar** | kalendář Cal.com přímo ve stránce místo formuláře |
| **Cal.com button** | tlačítko, které otevře rezervaci v popupu |
| **Form + Cal.com button** | formulář i rezervační tlačítko zároveň |

Nastavení: do `Cal.com link` vlož svůj odkaz ve tvaru `uzivatel/udalost`
(např. `ella/strihani`) – zvládne i celou adresu `https://cal.com/ella/strihani`.
Dokud odkaz nevyplníš, komponenta místo kalendáře ukáže nápovědu.

Kalendář se vkládá přes oficiální embed Cal.com s namespace (stejně, jak ho vydává
jejich generátor); pokud by tvoje instance běžela na starší verzi embedu, komponenta
si po chvíli sama zkusí i starší tvar API. Vložený kalendář je ve výchozím stavu přes
celou šířku (`Full width calendar`) – měsíční pohled potřebuje místo.

Kalendář přebírá barvy webu (`Match site colors`) – pozadí, karty, texty, rámečky
i akcent, takže sedne do stránky. `Calendar theme` na `Auto` znamená „podle webu“
(tmavý web → tmavý kalendář), ne podle nastavení systému návštěvníka. Výšku si
kalendář určuje sám podle obsahu, `Calendar min height` je jen minimum.

Dál si nastavíš `Layout` (měsíc / týden / sloupec), `Calendar theme`,
`Calendar height`, `Full width calendar`, `Hide event details` a text tlačítka
`Button text` s poznámkou `Button note`. Barva kalendáře přebírá akcentní barvu
webu (`Brand = accent`), jde ji ale přepnout na vlastní.

Když je zapnutý některý z Cal.com režimů s tlačítkem, `CTA opens booking`
zajistí, že i tlačítka **Book Now** v hlavičce a v hero sekci otevřou rezervaci.

Jakmile zvolíš některý z Cal.com režimů, pole formuláře (včetně `Formspree endpoint`)
se schovají – Formspree potřebuješ jen pro režimy s formulářem.

Pole `Origin (self-hosted only)` a `Embed script (self-hosted only)` **nech prázdná** –
vyplňují se jen tehdy, když máš Cal.com na vlastním serveru. Prázdná znamenají
standardní cal.com a skript `https://app.cal.com/embed/embed.js`.
Skript Cal.com se načítá jen tehdy, když je rezervace zapnutá a odkaz vyplněný –
ve výchozím stavu web nic externího nestahuje.

Kdyby se embed nenačetl (blokovaný skript, přísné CSP, plátno Frameru), zobrazí se
místo kalendáře tlačítko s odkazem na tvou stránku na Cal.com, takže se návštěvník
objedná vždycky. Stejně tak tlačítko v režimu *Cal.com button* má v `href` přímo
adresu události – když skript funguje, otevře se popup, když ne, otevře se Cal.com.

### 🧩 Další
- `Sections` – zapnutí/vypnutí služeb, galerie, video sekce, ceníku, O nás, kontaktu, patičky
- `Appearance` – fonty, velikosti písma, zaoblení, šířka obsahu, mezery, počet sloupců, výšky médií
- `Effects` – rozmazaná hlavička, záře pod hero, zvedání karet, záře ceníku, šipka dolů
- `Pricing` – tři skupiny s libovolným počtem položek (přidávají se tlačítkem +)
- `Contact` – všechny popisky, placeholdery a **Formspree endpoint** pro odesílání formuláře

## 📐 Responzivita a velikost ve Frameru

Komponenta je nastavená na **šířku Fill** a **výšku Fit content**
(`@framerSupportedLayoutWidth any`, `@framerSupportedLayoutHeight auto`):

- na šířku se roztáhne na celý rámec (dá se přepnout i na fixní šířku),
- na výšku se sama dopočítá podle obsahu – žádné ruční dotahování rámce,
  a když přidáš sekci nebo položku, rámec se zvětší sám.

Zlomy (breakpointy) reagují na **šířku samotné komponenty**, ne na šířku okna
prohlížeče. Díky tomu vypadá správně i v úzkém breakpoint rámci na širokém plátně:

| Šířka komponenty | Co se stane |
|---|---|
| do 992 px | hero na jeden sloupec, karty a galerie na 2 sloupce, ceník pod sebe |
| do 768 px | menu se schová do hamburgeru, nižší hero i video |
| do 480 px | vše na jeden sloupec, tlačítka na celou šířku, užší okraje |

Výška hero sekce je v `Vzhled → Výška hero (vh)` – používá výšku obrazovky,
takže na publikovaném webu je hero přes celý displej.

## Poznámky
- Formulář odesílá přes [Formspree](https://formspree.io) – bez vyplněného endpointu
  se zobrazí upozornění místo odeslání. Pokud používáš jen Cal.com, formulář
  můžeš nechat vypnutý (`Booking → Mode`).
- Kdyby byl na mobilu web dole useknutý: komponenta svoji výšku hlásí správně
  (ověřeno), ale Framer si u sekce pamatuje výšku změřenou na plátně. Vyber
  komponentu na telefonním breakpointu a nastav jí (a rámci kolem ní) **Fit content**,
  ne pevnou výšku. Výška hero sekce se počítá v `svh`, aby na telefonu s dynamickou
  lištou nevycházela vyšší než na plátně.
- Úplně první pole v panelu je **`Version`** – musí v něm být `v7 · Cal embed cleanup`.
  Když tam není (nebo pole chybí), Framer pořád používá starší kód: otevři code file,
  označ všechno (⌘A) a vlož celý nový obsah. Když má code file červenou chybu,
  Framer si drží poslední funkční verzi a panel se nezmění.
- Mobilní menu je v DOM jen když je otevřené. Dřív bylo odsunuté za pravý okraj
  (`right: -100%`) a na publikovaném webu kvůli tomu stránka po zúžení přetékala
  do strany – proto je zavřená zásuvka teď úplně odmontovaná.
- Styly jsou omezené jen na tuto komponentu (`.ella-root`), takže neovlivní zbytek
  Framer projektu. Výjimkou je vlastní kurzor, který má být záměrně na celé stránce.
