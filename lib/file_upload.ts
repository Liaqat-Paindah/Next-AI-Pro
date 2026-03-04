import fs from 'fs';
import path from 'path';

// Base upload directory
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure upload directory exists
export function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

// Generate unique filename
export function generateFileName(originalName: string): string {
  const ext = path.extname(originalName);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}_${random}${ext}`;
}

// Save file to disk
export async function saveFile(file: File, subDir: string): Promise<string> {
  ensureUploadDir();
  
  // Create subdirectory
  const targetDir = path.join(UPLOAD_DIR, subDir);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  // Generate unique filename
  const fileName = generateFileName(file.name);
  const filePath = path.join(targetDir, fileName);
  
  // Convert File to Buffer and save
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  fs.writeFileSync(filePath, buffer);
  
  // Return relative path
  return `/uploads/${subDir}/${fileName}`;
}