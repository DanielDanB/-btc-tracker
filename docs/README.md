# Documentation

- **`Ella-Hair-Salon-Template-Guide.pdf`** – the buyer-facing guide (18 pages, English):
  getting started with the Framer Remix, a full reference of all 193 panel settings,
  the content of every section, booking with Cal.com (including how to set the service
  up on cal.com itself), the contact form, responsiveness, troubleshooting and an
  appendix on the standalone HTML build.
- `guide.html` – source of that PDF.

## Regenerating the PDF

Edit `guide.html`, then print it to PDF (Chrome → Print → Save as PDF, A4, 18 mm
margins, background graphics on), or with Playwright:

```js
const page = await browser.newPage()
await page.goto("file:///path/to/docs/guide.html")
await page.emulateMedia({ media: "print" })
await page.pdf({ path: "docs/Ella-Hair-Salon-Template-Guide.pdf", format: "A4",
  printBackground: true, margin: { top: "18mm", bottom: "18mm", left: "18mm", right: "18mm" } })
```

Keep the version on the cover in sync with `COMPONENT_VERSION` in
`framer/EllaFramer.tsx`.
