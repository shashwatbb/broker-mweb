import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "listings");

const listings = [
  {
    file: "oberoi-sky-villas.pdf",
    title: "The Oberoi Sky Villas",
    body: [
      "Property brief — May 2026",
      "Prepared for: Premier Properties / Maya Agarwal",
      "",
      "Overview",
      "Premium 3 BHK tower residences with panoramic city and lake views,",
      "private lift lobby options, and full-height glazing in the CBD corridor.",
      "",
      "Specifications",
      "· Super built-up: 2,850 sq ft (indicative)",
      "· Bedrooms: 3  ·  Bathrooms: 4  ·  Balconies: 2",
      "· Facing: North-east  ·  Floor: Mid-to-high (on request)",
      "",
      "Amenities",
      "Sky lounge, temperature-controlled pool, concierge, EV-ready parking,",
      "and dedicated visitor management with WhatsApp-based guest passes.",
      "",
      "Next steps",
      "Schedule a private walkthrough; soft copy of floor plan available on request.",
    ],
  },
  {
    file: "prestige-lakeside-habitat.pdf",
    title: "Prestige Lakeside Habitat",
    body: [
      "Property brief — May 2026",
      "Prepared for: Premier Properties / Maya Agarwal",
      "",
      "Overview",
      "Gated community with lake-edge green belt, low-density blocks, and",
      "strong rental demand from IT corridor professionals.",
      "",
      "Specifications",
      "· Carpet area: ~1,180 sq ft (2 BHK, indicative)",
      "· Car park: 1 covered  ·  Clubhouse access: Yes",
      "",
      "Why buyers like it",
      "Walkable to metro shuttle nodes; strong school catchment; quiet inner block.",
      "",
      "Next steps",
      "Share virtual tour link; arrange evening visit for working couples.",
    ],
  },
  {
    file: "salarpuria-sattva-commercial.pdf",
    title: "Salarpuria Sattva — Commercial",
    body: [
      "Property brief — May 2026",
      "Prepared for: Premier Properties / Maya Agarwal",
      "",
      "Overview",
      "Grade-A office / shell with high floor-to-ceiling height, ideal for",
      "tech, wealth, and professional services occupiers near ORR micro-markets.",
      "",
      "Specifications",
      "· Leasable: ~2,400 sq ft (indicative)",
      "· Power: 100% backup optional  ·  Parking ratio: As per allocation",
      "",
      "Tenant notes",
      "Suitable for HQ-lite, delivery centres with visitor-heavy footfall.",
      "",
      "Next steps",
      "Confirm LOI timeline; share CAM & escalation matrix from landlord pack.",
    ],
  },
];

async function buildPdf(entry) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const margin = 50;
  let y = height - margin;

  page.drawText(entry.title, {
    x: margin,
    y,
    size: 18,
    font: fontBold,
    color: rgb(0.08, 0.07, 0.06),
  });
  y -= 28;

  const lineHeight = 13;
  for (const line of entry.body) {
    const isSection =
      line === "Overview" ||
      line === "Specifications" ||
      line === "Amenities" ||
      line === "Why buyers like it" ||
      line === "Tenant notes" ||
      line === "Next steps";
    const size = isSection ? 11 : 10;
    const f = isSection ? fontBold : font;
    page.drawText(line, {
      x: margin,
      y,
      size,
      font: f,
      color: rgb(0.15, 0.14, 0.12),
    });
    y -= lineHeight + (line === "" ? 6 : 2);
  }

  return pdfDoc.save();
}

async function main() {
  await fs.promises.mkdir(outDir, { recursive: true });
  for (const entry of listings) {
    const bytes = await buildPdf(entry);
    const outPath = path.join(outDir, entry.file);
    await fs.promises.writeFile(outPath, bytes);
    console.log("Wrote", outPath);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
