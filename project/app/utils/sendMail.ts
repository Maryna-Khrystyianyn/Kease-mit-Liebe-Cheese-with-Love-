import nodemailer from "nodemailer";

export async function sendMail(to: string, pdfBuffer: Buffer) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS , 
    },
  });

  await transporter.sendMail({
    from: '"Käse mit Liebe" <svitlamarina@gmail.com>',
    to,
    subject: "Ihre Rechnung",
    text: "Anbei finden Sie Ihre Rechnung als PDF.",
    attachments: [
      {
        filename: "Rechnung.pdf",
        content: pdfBuffer,
      },
    ],
  });
}
