import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";

export async function generatePdf(order: any): Promise<Buffer> {
  return new Promise((resolve) => {
    const regularFont = path.join(
      process.cwd(),
      "public/fonts/open-sans.regular.ttf"
    );
    const boldFont = path.join(
      process.cwd(),
      "public/fonts/open-sans.bold.ttf"
    );

    const doc = new PDFDocument({
      autoFirstPage: true,
      font: regularFont,
      margin: 70,
      size: "A4",
    });

    const buffers: Buffer[] = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    // =========================
    // Header: Logo + Company Info
    // =========================
    const logoPath = path.join(process.cwd(), "public/logo-text.png");
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 45, { width: 100 });
    }

    doc
      .font(boldFont)
      .fontSize(10)
      .text(`Käse mit Liebe`, 350, 50, { align: "left" });
    doc.font(regularFont).text(
      `keasemitliebe@gmail.com
+49 160 123456
02625 Bautzen
Behringstr. 1
Maryna Khrywtyianyn`,
      350,
      65,
      { align: "left" }
    );

    doc.moveDown(4);

    // =========================
    // Customer Info + Date
    // =========================
    const top = 180;
    doc.font(boldFont).fontSize(11).text("Rechnung an:", 50, top);

    doc
      .font(regularFont)
      .fontSize(10)
      .text(order.name)
      .text(order.email)
      .text(order.phone ?? "")
      .text(order.street)
      .text(`${order.zip} ${order.city}`)
      .text(order.country);

    doc
      .font(boldFont)
      .text(`Rechnungsdatum: ${order.date.toLocaleDateString()}`, 350, top)
      .text(`Bestellnummer: ${order.id}`);

    doc.moveDown(4);

    // =========================
    // Table Header
    // =========================
    const tableTop = 330;
    doc
      .font(boldFont)
      .fontSize(11)
      .text("Artikel", 50, tableTop)
      .text("Menge", 280, tableTop)
      .text("Preis (€)", 340, tableTop)
      .text("Summe (€)", 430, tableTop);

    doc
      .moveTo(50, tableTop + 15)
      .lineTo(550, tableTop + 15)
      .stroke();

    // =========================
    // Table Rows з wrap назви
    // =========================
    const nameColWidth = 220; 
    const quantityX = 290;
    const priceX = 350;
    const totalX = 430;

    let y = tableTop + 25;
    let itemsTotal = 0;

    order.order_items.forEach((item: any) => {
      const unitPrice = Number(item.unit_price ?? 0);
      const total = unitPrice * item.quantity;
      itemsTotal += total;
      const productName = item.products.name;

      
      const rowHeight = doc.heightOfString(productName, {
        width: nameColWidth,
        align: "left",
      });

      
      doc.font(regularFont).fontSize(10).text(productName, 50, y, {
        width: nameColWidth,
        align: "left",
      });

      
      const centerY = y + rowHeight / 2 - 5;
      doc.text(item.quantity, quantityX, centerY);
      doc.text(unitPrice.toFixed(2), priceX, centerY);
      doc.text(total.toFixed(2), totalX, centerY);

      y += rowHeight + 5; // відступ між рядками
    });

    // =========================
    // Totals
    // =========================
    const delivery = Number(order.delivery_price ?? 0);
    const grandTotal = itemsTotal + delivery;

    y += 20;
    doc.moveTo(300, y).lineTo(550, y).stroke();

    y += 10;
    doc
      .font(regularFont)
      .fontSize(10)
      .text("Zwischensumme:", 350, y)
      .text(itemsTotal.toFixed(2) + " €", 450, y);
    y += 15;
    doc.text("Lieferkosten:", 350, y).text(delivery.toFixed(2) + " €", 450, y);
    y += 15;
    doc
      .font(boldFont)
      .fontSize(11)
      .text("Gesamtbetrag:", 350, y)
      .text(grandTotal.toFixed(2) + " €", 450, y);

// =========================
// Fake IBAN для оплати
// =========================

      y += 30;
doc.font(boldFont).fontSize(10)
   .text("Bankverbindung (IBAN) für die Überweisung:", 50, y);

y += 15;
doc.font(regularFont).fontSize(10)
   .text("DE89 3704 0044 0532 0130 00", 50, y); 

   y += 15;
doc.font(regularFont).fontSize(10)
   .text("Bitte benachrichtigen Sie uns nach der Zahlung per E-Mail.", 50, y); 
    doc.end();
  });
}
