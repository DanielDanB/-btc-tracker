# Dokumentace

- **`Ella-hair-salon-navod.pdf`** – návod k webu (10 stran, česky): Framer komponenta,
  HTML verze, rychlé recepty a řešení potíží.
- `manual.html` – zdroj toho PDF.

## Jak PDF vygenerovat znovu

Po úpravě `manual.html` stačí stránku vytisknout do PDF (Chrome → Tisk → Uložit jako PDF,
A4, okraje 18 mm, zapnutá grafika na pozadí). Nebo přes Playwright:

```js
const page = await browser.newPage()
await page.goto("file:///cesta/k/docs/manual.html")
await page.emulateMedia({ media: "print" })
await page.pdf({ path: "docs/Ella-hair-salon-navod.pdf", format: "A4", printBackground: true,
  margin: { top: "18mm", bottom: "18mm", left: "18mm", right: "18mm" } })
```
