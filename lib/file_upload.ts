import { put } from "@vercel/blob";
import path from "path";

// Generate unique filename
export function generateFileName(originalName: string): string {
  const ext = path.extname(originalName);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}_${random}${ext}`;
}

// Upload file to Vercel Blob
export async function saveFile(file: File, subDir: string): Promise<string> {
  const fileName = generateFileName(file.name);

  // Create blob path
  const blobPath = `${subDir}/${fileName}`;

  // Upload to Vercel Blob
  const blob = await put(blobPath, file, {
    access: "public",
  });

  // Return file URL
  return blob.url;
}