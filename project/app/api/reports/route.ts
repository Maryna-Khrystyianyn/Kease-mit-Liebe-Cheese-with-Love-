import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "../../utils/auth";
import { sendEmail } from "../../utils/email";

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromToken();
    const body = await req.json();
    const { targetId, type, reason } = body;

    if (!targetId || !type) {
      return NextResponse.json(
        { error: "TargetId und Typ sind erforderlich" },
        { status: 400 }
      );
    }

    const reporter = user ? user.nick_name : "Gast";
    const timestamp = new Date().toLocaleString("de-DE");

    const subject = `[UGC REPORT] Meldung für ${type} #${targetId}`;
    const html = `
      <h2>Neue Inhaltsmeldung erhalten</h2>
      <p><strong>Typ:</strong> ${type}</p>
      <p><strong>Inhalt ID:</strong> ${targetId}</p>
      <p><strong>Grund:</strong> ${reason || "Kein Grund angegeben"}</p>
      <p><strong>Gemeldet von:</strong> ${reporter}</p>
      <p><strong>Zeitpunkt:</strong> ${timestamp}</p>
      <hr />
      <p>Bitte prüfen Sie diesen Inhalt innerhalb von 24 Stunden.</p>
    `;

    await sendEmail({
      to: "svitlamarina@gmail.com",
      subject,
      html,
    });

    console.log("UGC REPORT EMAIL SENT:", { targetId, type, reporter });

    return NextResponse.json({
      message: "Vielen Dank für Ihre Meldung. Wir werden diese innerhalb von 24 Stunden prüfen.",
    });
  } catch (error) {
    console.error("REPORTING ERROR:", error);
    return NextResponse.json(
      { error: "Fehler beim Senden der Meldung" },
      { status: 500 }
    );
  }
}
