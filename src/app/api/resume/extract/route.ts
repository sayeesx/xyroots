import { NextRequest, NextResponse } from 'next/server';
import { extractResume, type FileType } from '@/lib/resume/extract';

export const maxDuration = 30;

const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
];

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Accept file under either 'file' or 'resume' key for compatibility
    const file = (formData.get('file') || formData.get('resume')) as File | null;

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ success: false, error: 'No file uploaded.' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Only PDF and DOCX files are supported. Please upload a text-based resume.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: 'This file is too large. Please upload a resume smaller than 10 MB.' },
        { status: 400 }
      );
    }

    const fileType: FileType = file.type === 'application/pdf' ? 'pdf' : 'docx';
    const buffer = await file.arrayBuffer();

    let resumeData;
    try {
      resumeData = await extractResume(buffer, fileType);
    } catch (err: any) {
      const msg = err.message || 'We couldn\'t analyze the resume right now. Please try again.';
      return NextResponse.json({ success: false, error: msg }, { status: 422 });
    }

    return NextResponse.json({ success: true, data: resumeData });
  } catch (error: any) {
    console.error('Resume route error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
