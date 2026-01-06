import { NextRequest, NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  projectId: process.env.GOOGLE_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});

const bucket = storage.bucket(process.env.GCS_BUCKET!);

export async function POST(req: NextRequest) {
  try {
    
    const formData = await req.formData();

    const fileData = formData.get("file");
    if (!fileData || !(fileData instanceof Blob)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    
    if (fileData.size > 500 * 1024) {
      return NextResponse.json({ error: "File too large, max 500 KB" }, { status: 400 });
    }

    
    const arrayBuffer = await fileData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);


    const timestamp = Date.now();
  
    const fileName = `${timestamp}_${fileData instanceof File ? fileData.name.replace(/\s+/g, "_") : "avatar.png"}`;

    const blob = bucket.file(fileName);

    await blob.save(buffer, {
      resumable: false,
      contentType: fileData.type || "application/octet-stream",
      
    });

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

   
    return NextResponse.json({ url: publicUrl });
  } catch (err: unknown) {
    let message = "Unknown error";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
