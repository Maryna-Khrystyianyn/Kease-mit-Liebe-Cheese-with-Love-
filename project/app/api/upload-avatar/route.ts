import { NextRequest, NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";
import fetch from "node-fetch"; // для завантаження файлу з URI

const storage = new Storage({
  projectId: process.env.GOOGLE_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});

const bucket = storage.bucket(process.env.GCS_BUCKET_AVATARS!);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const fileData = formData.get("file");

    if (!fileData) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    let buffer: Buffer;
    let fileName = `avatar.png`;
    let contentType = "application/octet-stream";

    // Якщо файл з вебу (Blob / File)
    if (fileData instanceof Blob) {
      if (fileData.size > 500 * 1024) {
        return NextResponse.json({ error: "File too large, max 500 KB" }, { status: 400 });
      }

      const arrayBuffer = await fileData.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      fileName = `${Date.now()}_${fileData instanceof File ? fileData.name.replace(/\s+/g, "_") : "avatar.png"}`;
      contentType = fileData.type || contentType;

    } else if (typeof fileData === "string" && fileData.startsWith("file://")) {
      // Якщо файл з мобільного (URI з Expo)
      const response = await fetch(fileData); // завантажуємо локальний файл
      const arrayBuffer = await response.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);

      const parts = fileData.split(".");
      const ext = parts[parts.length - 1];
      fileName = `${Date.now()}.` + ext;
      contentType = `image/${ext}`;
    } else {
      return NextResponse.json({ error: "Invalid file" }, { status: 400 });
    }

    const blob = bucket.file(fileName);

    await blob.save(buffer, {
      resumable: false,
      contentType,
    });

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    return NextResponse.json({ url: publicUrl });

  } catch (err: unknown) {
    let message = "Unknown error";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
