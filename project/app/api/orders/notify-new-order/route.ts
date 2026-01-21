import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const { orderId, email, total, payment_method } = await req.json();

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Boolean(process.env.SMTP_SECURE),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"Käse mit Liebe" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `Neue Bestelung#${orderId}`,
    html: ` <p>Du hast eine neue Bestellung!</p> 
    <ul> 
        <li>Bestellnummer: ${orderId}</li> 
        <li>E-Mail des Käufers: ${email}</li> 
        <li>Summa: ${total} €</li> 
    </ul> 
    <p> 
        Alle aktiven Bestellungen ansehen: 
        <a href="https://kease-mit-liebe-cheese-with-love.vercel.app/admin/orders/active"> 
        Bestellungen öffnen </a> 
    </p> `,
  };

  await transporter.sendMail(mailOptions);

  return NextResponse.json({ success: true });
}
