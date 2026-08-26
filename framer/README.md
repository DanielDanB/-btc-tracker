# Ella Hair Salon – Framer code component

Soubor `EllaFramer.tsx` vlož ve Frameru do **Assets → Code → New Code File**
a přetáhni komponentu `EllaHairSalonPage` na stránku. Vše ostatní se nastavuje
v pravém panelu – v kódu už není potřeba nic přepisovat.

## Co se dá měnit

### 🎨 Barvy
Kompletně všechny barvy webu: pozadí, druhé pozadí, karty, akcent, světlý akcent,
text, nadpisy, šedý text, rámečky, hlavička, mobilní menu, tlačítka (pozadí, hover,
text, outline), pole formuláře, patička, barva úspěchu a chyby.

Tlačítka mají zapnuté **„Tlačítka = akcent“** – když změníš akcentní barvu, změní se
s ní i tlačítka, záře a rámečky. Vypni přepínač, pokud chceš tlačítkům dát vlastní barvu.

### 🎬 Videa
Video jde přidat všude, kde je obrázek – **video má vždy přednost před obrázkem**:

| Kde | Ovládání |
|---|---|
| Hero | `Hero → Video` + `Náhled videa` |
| Karty služeb | `Služby → Karty → Video` (u každé karty zvlášť) |
| Galerie | `Galerie → Položky → Video` (lze míchat obrázky a videa) |
| O nás | `O nás → Video` |
| Samostatná video sekce | `Sekce → Video sekce` zapnout, pak `Video sekce → Video` |
| Video na pozadí celé stránky | `Video pozadí → Zapnout` + průhlednost a barva překryvu |

Chování všech videí (autoplay, smyčka, ztlumení, ovládací prvky) se nastaví jednou
v `Videa – chování`. Autoplay si vynutí ztlumení – jinak ho prohlížeče blokují.
Odkaz na video končící `.mp4` / `.webm` funguje i v poli pro obrázek.

### 🏷️ Logo
`Logo → Obrázek loga` (nahraj PNG/SVG) nebo textové logo `Text` + `Text (akcent)`.
Výšku loga nastavíš ve `Vzhled → Výška loga`, cíl odkazu v `Logo → Odkaz`.

### ✨ Poletující obrazce
`Obrazce → Zapnout` je hlavní vypínač. Dál si vybereš tvary (nůžky, hřeben, vlna,
srdce, hvězda, jiskra, tečka, kroužek, bublina), počet, velikost, tloušťku čar,
rychlost, průhlednost, otáčení a jestli mají uhýbat myši včetně jejího dosahu.
Barva je ve výchozím stavu akcentní, dá se přepnout na vlastní.

### 🖱️ Kurzor
`Kurzor → Režim`:
- **Systémový** – žádný vlastní kurzor
- **Tvar** – 9 tvarů (původní růžový, šipka, tečka, kroužek, nůžky, hřeben, srdce,
  jiskra, kapka) + barva, obrys, velikost a pozice špičky
- **Vlastní obrázek** – nahraj si vlastní PNG/SVG kurzor

Volitelně jde nastavit **jiný kurzor nad odkazy a tlačítky**. Na dotykových
zařízeních se vlastní kurzor automaticky nepoužije.

### 🧩 Další
- `Sekce` – zapnutí/vypnutí služeb, galerie, video sekce, ceníku, O nás, kontaktu, patičky
- `Vzhled` – fonty, velikosti písma, zaoblení, šířka obsahu, mezery, počet sloupců, výšky médií
- `Efekty` – rozmazaná hlavička, záře pod hero, zvedání karet, záře ceníku, šipka dolů
- `Ceník` – tři skupiny s libovolným počtem položek (přidávají se tlačítkem +)
- `Kontakt` – všechny popisky, placeholdery a **Formspree endpoint** pro odesílání formuláře

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
  se zobrazí upozornění místo odeslání.
- Styly jsou omezené jen na tuto komponentu (`.ella-root`), takže neovlivní zbytek
  Framer projektu. Výjimkou je vlastní kurzor, který má být záměrně na celé stránce.
