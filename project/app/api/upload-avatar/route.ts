import { NextRequest, NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";

// Ініціалізація Google Cloud Storage
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
    // Отримуємо formData
    const formData = await req.formData();

    // Отримуємо файл
    const fileData = formData.get("file");
    if (!fileData || !(fileData instanceof Blob)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Перевірка розміру (макс 500 KB)
    if (fileData.size > 500 * 1024) {
      return NextResponse.json({ error: "File too large, max 500 KB" }, { status: 400 });
    }

    // Генеруємо Buffer з Blob
    const arrayBuffer = await fileData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    //  Генеруємо унікальне ім'я файлу
    const timestamp = Date.now();
    // беремо ім’я файлу, якщо воно є
    const fileName = `${timestamp}_${fileData instanceof File ? fileData.name.replace(/\s+/g, "_") : "avatar.png"}`;

    const blob = bucket.file(fileName);

    // Завантажуємо у GCS
    await blob.save(buffer, {
      resumable: false,
      contentType: fileData.type || "application/octet-stream",
      //public: true, // робимо публічний URL
    });

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    // 7️⃣ Повертаємо URL
    return NextResponse.json({ url: publicUrl });
  } catch (err: unknown) {
    let message = "Unknown error";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
