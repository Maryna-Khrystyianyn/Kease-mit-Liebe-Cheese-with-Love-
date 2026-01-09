import { NextRequest, NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  projectId: process.env.GOOGLE_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});

const bucket = storage.bucket(process.env.GCS_BUCKET_PRODUCTS!);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Перевірка на файл
    const fileData = formData.get("file");
    if (!fileData || !(fileData instanceof Blob)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (fileData.size > 1024 * 1024) {
      // max 1 MB
      return NextResponse.json(
        { error: "File too large, max 1 MB" },
        { status: 400 }
      );
    }

    // Конвертація файлу в буфер
    const arrayBuffer = await fileData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Генерація імені файлу
    const timestamp = Date.now();
    const fileName = `${timestamp}_${
      fileData instanceof File
        ? fileData.name.replace(/\s+/g, "_")
        : "product.png"
    }`;

    const blob = bucket.file(fileName);

    // Завантаження файлу в bucket
    await blob.save(buffer, {
      resumable: false,
      contentType: fileData.type || "application/octet-stream",
    });

    // Генеруємо публічний URL (якщо bucket публічний, працюватиме)
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    // Повертаємо URL і ID (ID = fileName, можна використати для видалення)
    return NextResponse.json({ url: publicUrl, id: fileName });
  } catch (err: unknown) {
    let message = "Unknown error";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
