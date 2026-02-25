import { NextRequest, NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";

// Initializing storage inside the handler for better reliability in serverless environments
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const fileData = formData.get("file");

    let buffer: Buffer;
    let fileName = `avatar.png`;
    let contentType = "application/octet-stream";

    if (!fileData) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Handling file from FormData (both Web and Mobile send it as a Blob/File)
    if (fileData instanceof Blob) {
      if (fileData.size > 2 * 1024 * 1024) { // Increased to 2MB for mobile photos
        return NextResponse.json({ error: "File too large, max 2 MB" }, { status: 400 });
      }

      const arrayBuffer = await fileData.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      
      const originalName = fileData instanceof File ? fileData.name : "avatar.png";
      const sanitizedName = originalName.replace(/\s+/g, "_");
      fileName = `${Date.now()}_${sanitizedName}`;
      contentType = fileData.type || contentType;
    } else {
      console.error("Invalid file data type received:", typeof fileData);
      return NextResponse.json({ error: "Invalid file format" }, { status: 400 });
    }

    // Verify environment variables
    const projectId = process.env.GOOGLE_PROJECT_ID;
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const rawPrivateKey = process.env.GOOGLE_PRIVATE_KEY;
    const bucketName = process.env.GCS_BUCKET_AVATARS;

    if (!projectId || !clientEmail || !rawPrivateKey || !bucketName) {
      console.error("Missing GCS configuration variables");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // Sanitize private key: handle quotes and newlines
    const sanitizedPrivateKey = rawPrivateKey
      .replace(/^"|"$/g, '') // remove surrounding quotes
      .replace(/\\n/g, "\n"); // fix escaped newlines

    // Initialize storage for this request
    const storage = new Storage({
      projectId,
      credentials: {
        client_email: clientEmail,
        private_key: sanitizedPrivateKey,
      },
    });
    const bucket = storage.bucket(bucketName);

    const blob = bucket.file(fileName);
    console.log(`Uploading to GCS: ${fileName}, Type: ${contentType}, Size: ${buffer.length}`);

    // Use createWriteStream for better control on serverless environments
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

      blobStream.on("finish", () => {
        resolve(true);
      });

      blobStream.end(buffer);
    });

    const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
    return NextResponse.json({ url: publicUrl });

  } catch (err: unknown) {
    let message = "Unknown error";
    let stack = "";
    if (err instanceof Error) {
      message = err.message;
      stack = err.stack || "";
    }
    console.error("UPLOAD AVATAR ERROR:", message, stack);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
