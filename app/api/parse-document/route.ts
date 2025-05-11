import { NextRequest, NextResponse } from 'next/server';
import { parseAllDocxTablesToJson } from '@/utils/parse-docx-table';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';

// Directory to temporarily store uploaded files
const UPLOAD_DIR = path.join(os.tmpdir(), 'docx-uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Check if the file is a Word document
    if (!file.name.endsWith('.docx')) {
      return NextResponse.json(
        { error: 'Only .docx files are supported' },
        { status: 400 }
      );
    }
    
    // Create a temporary file path
    const tempFilePath = path.join(UPLOAD_DIR, `${uuidv4()}-${file.name}`);
    
    // Write the file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(tempFilePath, buffer);
    
    try {
      // Parse all tables from the document
      const tables = await parseAllDocxTablesToJson(tempFilePath);
      
      // Clean up the temporary file
      fs.unlinkSync(tempFilePath);
      
      return NextResponse.json({ tables });
    } catch (error) {
      // Clean up on error
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
      
      console.error('Error parsing document:', error);
      return NextResponse.json(
        { error: 'Failed to parse document' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 