export async function POST(req: Request) {
    const { orderId } = await req.json();
  
    // order from DB
    // XML, PDF
    // ---->>>> email (nodemailer / resend)
  
    return Response.json({ ok: true });
  }