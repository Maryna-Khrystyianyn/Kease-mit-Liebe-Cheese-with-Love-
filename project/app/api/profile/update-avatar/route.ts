import { NextRequest, NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";
import { prisma } from "@/lib/prisma";
import { requireUser } from "../../../utils/auth";

export async function POST(req: NextRequest) {
  try {
    // 1. Verify Authentication
    const userFromToken = await requireUser();
    
    // 2. Parse FormData
    const formData = await req.formData();
    const fileData = formData.get("file");

    if (!fileData || !(fileData instanceof Blob)) {
      return NextResponse.json({ error: "Keine gültige Datei hochgeladen" }, { status: 400 });
    }

    // 3. Verify Environment Variables
    const projectId = process.env.GOOGLE_PROJECT_ID;
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const rawPrivateKey = process.env.GOOGLE_PRIVATE_KEY;
    const bucketName = process.env.GCS_BUCKET_AVATARS;

    if (!projectId || !clientEmail || !rawPrivateKey || !bucketName) {
      console.error("Missing GCS configuration variables");
      return NextResponse.json({ error: "Server-Konfigurationsfehler" }, { status: 500 });
    }

    // Sanitize private key
    const sanitizedPrivateKey = rawPrivateKey
      .replace(/^"|"$/g, '') 
      .replace(/\\n/g, "\n");

    const storage = new Storage({
      projectId,
      credentials: {
        client_email: clientEmail,
        private_key: sanitizedPrivateKey,
      },
    });
    const bucket = storage.bucket(bucketName);

    // 4. Handle Old Avatar Deletion
    const currentUser = await prisma.users.findUnique({
      where: { nick_name: userFromToken.nick_name },
      select: { avatar: true }
    });

    if (currentUser?.avatar && currentUser.avatar.includes(`storage.googleapis.com/${bucketName}/`)) {
      try {
        const oldFileName = currentUser.avatar.split("/").pop();
        if (oldFileName) {
          console.log(`Deleting old avatar: ${oldFileName}`);
          await bucket.file(oldFileName).delete({ ignoreNotFound: true });
        }
      } catch (deleteError) {
        console.error("Error deleting old avatar:", deleteError);
        // We continue anyway, missing a delete isn't fatal for the upload
      }
    }

    // 5. Upload New Avatar
    const arrayBuffer = await fileData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const originalName = fileData instanceof File ? fileData.name : "avatar.png";
    const sanitizedName = originalName.replace(/\s+/g, "_");
    const fileName = `${Date.now()}_${sanitizedName}`;
    const contentType = fileData.type || "image/png";

    const blob = bucket.file(fileName);
    console.log(`Uploading new avatar to GCS: ${fileName}`);

    await new Promise((resolve, reject) => {
      const blobStream = blob.createWriteStream({
        resumable: false,
        contentType,
        metadata: {
          cacheControl: "public, max-age=31536000",
        },
      });

      blobStream.on("error", (err: Error) => {
        console.error("GCS Upload Stream Error:", err);
        reject(err);
      });

      blobStream.on("finish", () => resolve(true));
      blobStream.end(buffer);
    });

    const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;

    // 6. Update Database
    await prisma.users.update({
      where: { nick_name: userFromToken.nick_name },
      data: { avatar: publicUrl }
    });

    return NextResponse.json({ 
      message: "Avatar erfolgreich aktualisiert", 
      url: publicUrl 
    });

  } catch (err: unknown) {
    let message = "Unknown error";
    if (err instanceof Error) message = err.message;
    console.error("AVATAR UPDATE FAILED:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
