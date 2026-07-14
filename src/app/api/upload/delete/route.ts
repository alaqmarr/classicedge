import { r2, R2_BUCKET } from "@/lib/r2";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    // Extract the key from the URL
    // e.g. https://pub-xyz.r2.dev/123-file.png -> 123-file.png
    const urlParts = url.split("/");
    const key = urlParts[urlParts.length - 1];

    if (!key) {
       return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
    });

    await r2.send(command);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}
